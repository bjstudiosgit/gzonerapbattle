const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function getYouTubeId(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const videoId = parsed.searchParams.get("v");
    if (videoId && YOUTUBE_ID_PATTERN.test(videoId)) return videoId;

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && YOUTUBE_ID_PATTERN.test(lastPart)) return lastPart;
  } catch {
    // Fall through to the looser pattern below for non-absolute URLs.
  }

  const match = trimmed.match(
    /(?:embed\/|youtu\.be\/|shorts\/|watch\?v=|watch\?.*&v=)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

export function youTubeEmbedUrl(
  value: string | null | undefined,
  options: { autoplay?: boolean; start?: number } = {}
): string | null {
  const id = getYouTubeId(value);
  if (!id) return null;

  const params = new URLSearchParams({ rel: "0", playsinline: "1" });
  if (options.autoplay) params.set("autoplay", "1");
  if (typeof options.start === "number" && options.start > 0) {
    params.set("start", String(Math.floor(options.start)));
  }

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function youTubeThumbnailUrl(
  value: string | null | undefined,
  quality: "default" | "hqdefault" | "maxresdefault" = "hqdefault"
): string | null {
  const id = getYouTubeId(value);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;
}
