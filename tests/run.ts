import assert from "node:assert/strict";
import test from "node:test";

import {
  APPLICATION_LIMITS,
  MAX_APPLICATION_BYTES,
  sanitizeMultiline,
  sanitizeSingleLine,
  validateApplication,
} from "../src/lib/applicationPayload";
import { ApplyProxyError, submitApplication } from "../applyProxy";
import { clientIp, headerValue, isAllowedOrigin, isJsonContentType } from "../src/lib/applyGuard";
import { createRateLimiter } from "../src/lib/rateLimit";
import { getYouTubeId, youTubeEmbedUrl, youTubeThumbnailUrl } from "../src/lib/youtube";
import { limitResultCopy } from "../src/lib/text";
import { calculateDistanceMeters, evaluateArenaPosition, formatMeters } from "../src/lib/voteLocation";
import { calculateTotalViews, parseViews } from "../src/lib/battleUtils";
import { calculateRankings, getRankStars } from "../src/lib/ranking";
import { normalizeUsername, validateUsername } from "../src/lib/backstageUsername";
import { flyerImage, portraitImage } from "../src/lib/images";
import { withArtistName } from "../src/lib/votingCopy";
import type { Battle } from "../src/data/battles";

test("sanitizeSingleLine removes control characters and collapses whitespace", () => {
  assert.equal(sanitizeSingleLine("  Brad\u0000ley \r\n Smith  ", 100), "Bradley Smith");
  assert.equal(sanitizeSingleLine(42, 100), "");
});

test("sanitizeMultiline keeps line breaks and enforces the limit", () => {
  assert.equal(sanitizeMultiline("Line one\r\n\r\nLine two", 100), "Line one\n\nLine two");
  assert.equal(sanitizeMultiline("x".repeat(50), 10), "x".repeat(10));
});

test("validateApplication requires valid name and email", () => {
  assert.equal(validateApplication(null).ok, false);
  assert.equal(validateApplication({ fullName: "A" }).ok, false);
  assert.equal(validateApplication({ fullName: "A", email: "not-an-email" }).ok, false);

  const valid = validateApplication({
    fullName: "  Name  ",
    email: "  user@example.com ",
    about: "Hello\r\nWorld",
  });

  assert.equal(valid.ok, true);
  if (!valid.ok) return;
  assert.equal(valid.value.fullName, "Name");
  assert.equal(valid.value.email, "user@example.com");
  assert.equal(valid.value.about, "Hello\nWorld");
  assert.ok(MAX_APPLICATION_BYTES >= 1024);
  assert.ok(APPLICATION_LIMITS.about > APPLICATION_LIMITS.fullName);
});

test("submitApplication rejects invalid payloads before calling the network", async () => {
  await assert.rejects(
    () => submitApplication({ fullName: "", email: "" }),
    (error: unknown) => error instanceof ApplyProxyError && error.status === 400
  );
});

test("submitApplication forwards sanitised values and strips newlines from the subject", async () => {
  const originalFetch = globalThis.fetch;
  const originalEmail = process.env.APPLY_EMAIL;
  process.env.APPLY_EMAIL = "ops@example.com";
  let capturedUrl = "";
  let capturedBody: Record<string, string> = {};

  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedBody = JSON.parse(String(init?.body ?? "{}")) as Record<string, string>;
    return new Response(JSON.stringify({ success: "true" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  try {
    const result = await submitApplication({
      fullName: "Test User",
      email: "test@example.com",
      mcName: "MC\r\nInjected",
    });

    assert.deepEqual(result, { success: true });
    assert.equal(capturedUrl, "https://formsubmit.co/ajax/ops@example.com");
    assert.equal(capturedBody["Full Name"], "Test User");
    assert.equal(capturedBody._subject, "New G-Zone MC application: MC Injected");
    assert.equal(capturedBody.Email, "test@example.com");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalEmail === undefined) delete process.env.APPLY_EMAIL;
    else process.env.APPLY_EMAIL = originalEmail;
  }
});

test("submitApplication reports upstream failures as 502", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response("nope", { status: 500 })) as typeof fetch;

  try {
    await assert.rejects(
      () => submitApplication({ fullName: "Test", email: "test@example.com" }),
      (error: unknown) => error instanceof ApplyProxyError && error.status === 502
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rate limiter blocks after the configured limit and recovers after the window", () => {
  let now = 1000;
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => now });

  assert.equal(limiter("ip").allowed, true);
  assert.equal(limiter("ip").allowed, true);
  const blocked = limiter("ip");
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 1);
  assert.equal(limiter("other").allowed, true);

  now += 1001;
  assert.equal(limiter("ip").allowed, true);
});

test("apply guard validates origins, content types and client IPs", () => {
  assert.equal(isAllowedOrigin(undefined, undefined), true);
  assert.equal(isAllowedOrigin("https://www.gzonerapbattle.com", "evil.com"), true);
  assert.equal(isAllowedOrigin("https://evil.example", "gzonerapbattle.com"), false);
  assert.equal(isAllowedOrigin("https://evil.example", "evil.example"), true);
  assert.equal(isAllowedOrigin("not a url", undefined), false);
  assert.equal(
    isAllowedOrigin("http://localhost:3000", "localhost:3000", { NODE_ENV: "production" } as NodeJS.ProcessEnv),
    true
  );
  assert.equal(
    isAllowedOrigin("http://localhost:3000", "other:3000", { NODE_ENV: "production" } as NodeJS.ProcessEnv),
    false
  );

  assert.equal(isJsonContentType("application/json"), true);
  assert.equal(isJsonContentType("application/json; charset=utf-8"), true);
  assert.equal(isJsonContentType("text/plain"), false);
  assert.equal(isJsonContentType(undefined), false);

  assert.equal(headerValue({ "content-type": "application/json" }, "content-type"), "application/json");
  assert.equal(headerValue({ "x-forwarded-for": ["1.2.3.4", "5.6.7.8"] }, "x-forwarded-for"), "1.2.3.4");
  assert.equal(clientIp({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }, "9.9.9.9"), "1.2.3.4");
  assert.equal(clientIp(undefined, "9.9.9.9"), "9.9.9.9");
  assert.equal(clientIp(undefined, undefined), "unknown");
});

test("YouTube helpers parse IDs and build privacy-friendly URLs", () => {
  assert.equal(getYouTubeId("dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeId("https://example.com/video"), null);

  const embed = youTubeEmbedUrl("dQw4w9WgXcQ", { autoplay: true, start: 42 });
  assert.match(embed ?? "", /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
  assert.match(embed ?? "", /autoplay=1/);
  assert.match(embed ?? "", /start=42/);
  assert.equal(youTubeThumbnailUrl("dQw4w9WgXcQ"), "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
});

test("limitResultCopy shortens on a word boundary", () => {
  assert.equal(limitResultCopy(["Short copy"]), "Short copy");

  const limited = limitResultCopy(["one two three four five"], 12);
  assert.equal(limited, "one two...");
  assert.equal(limitResultCopy(["abcdefghijklmnop"], 5), "abcde...");
});

test("arena location maths identifies inside and outside positions", () => {
  assert.ok(calculateDistanceMeters(51.51, 0.01, 51.51, 0.01) < 1);
  assert.ok(calculateDistanceMeters(51.51, 0.01, 51.52, 0.01) > 1000);

  const inside = evaluateArenaPosition(51.5104904, 0.0124622, 10);
  assert.equal(inside.withinArena, true);

  const farAway = evaluateArenaPosition(51.6, 0.0124622, 10);
  assert.equal(farAway.withinArena, false);

  const inaccurate = evaluateArenaPosition(51.5104904, 0.0124622, 500);
  assert.equal(inaccurate.withinArena, false);

  assert.equal(formatMeters(123.6), "124m");
});

test("battle utils parse views and totals", () => {
  assert.equal(parseViews(undefined), 0);
  assert.equal(parseViews("1,234"), 1234);
  assert.equal(parseViews("1.5K"), 1500);
  assert.equal(parseViews("2M"), 2_000_000);
  assert.equal(parseViews("nonsense"), 0);
  assert.equal(calculateTotalViews([]), "0");
  assert.equal(calculateTotalViews([{ views: "1.5K" }, { views: "500" }] as Battle[]), "2.0K");
});

test("rankings score wins and losses and assign stars", () => {
  const battles = [
    { mc1: "a", mc2: "b", winner: "a", isPlaceholder: false },
    { mc1: "b", mc2: "c", winner: "b", isPlaceholder: false },
    { mc1: "a", mc2: "c", winner: "c", isPlaceholder: true },
  ] as unknown as Battle[];

  const rankings = calculateRankings(battles, []);

  const byId = Object.fromEntries(rankings.map((entry) => [entry.id, entry]));
  assert.equal(byId.a.wins, 1);
  assert.equal(byId.a.losses, 0);
  assert.equal(byId.a.totalScore, 3);
  assert.equal(byId.b.wins, 1);
  assert.equal(byId.b.losses, 1);
  assert.equal(byId.b.totalScore, 4);
  assert.equal(byId.c.wins, 0);
  assert.equal(byId.c.losses, 1);
  assert.equal(byId.c.totalScore, 1);
  assert.equal(byId.b.rank, 1);

  assert.equal(getRankStars(0), 0);
  assert.equal(getRankStars(1), 5);
  assert.equal(getRankStars(6), 0);
});

test("username and image helpers normalise input", () => {
  assert.equal(normalizeUsername("  Gzone_MC "), "gzone_mc");
  assert.equal(validateUsername("ab"), "Use 3-24 letters, numbers or underscores. Start with a letter or number.");
  assert.equal(validateUsername("_bad"), "Use 3-24 letters, numbers or underscores. Start with a letter or number.");
  assert.equal(validateUsername("Good_123"), "");
  assert.equal(validateUsername("a".repeat(25)), "Use 3-24 letters, numbers or underscores. Start with a letter or number.");

  assert.equal(portraitImage(undefined, "card"), "");
  assert.equal(portraitImage("https://cdn.example.com/photo.jpg", "card"), "https://cdn.example.com/photo.jpg");
  assert.equal(portraitImage("/flyers/raw.png", "card"), "/flyers/raw.png");
  assert.equal(portraitImage("my-photo.jpg", "profile"), "/portraits/my-photo-profile-600x800.jpg");
  assert.equal(flyerImage("/flyers/event.png", "card"), "/flyers/event-card-640x800.jpg");
});

test("voting copy replaces artist placeholders", () => {
  assert.equal(withArtistName("Voted for {artistName}", "MC Test"), "Voted for MC Test");
});
