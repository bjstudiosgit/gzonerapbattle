# Backstage connection

The local entrance now uses the official Supabase client and the supplied public project configuration in ignored `.env.local`. The project responds successfully. The Backstage tables, preference function, private video bucket and access policies were applied on 18 October 2026 after confirming their names were unused and there were no existing Storage policies. Google sign-in is enabled. The dedicated Google Cloud project `gzone-backstage` contains the registered Gzone Backstage app and Gzone Backstage Web OAuth client. The client credentials are saved in Supabase; the Google secret is not in the website files. The owner completed real Google sign-in, creating a member account; the members area and saved session load successfully after a refresh. The app remains in Google Testing mode, but its basic identity scopes are exempt from the test-user restriction. No video uploads or marketing emails have been performed.

## Connect the existing project

1. Done locally: installed `@supabase/supabase-js` and connected `src/lib/backstage.ts`.
2. Done locally: saved the project URL and publishable browser key in ignored `.env.local`.
3. Production builds use the public browser URL and publishable key in `.env.production`. Hosting environment variables can override these values. Never put a secret or service-role key in a Vite variable.
4. Done: applied `backstage-schema.sql` to the supplied project after inspecting existing resources. Do not rerun it: it intentionally fails if its names already exist instead of overwriting existing resources.
5. Done: allowlisted `http://127.0.0.1:5173/backstage`, `http://localhost:5173/backstage` and `https://www.gzonerapbattle.co.uk/backstage`. Done: created the Google web OAuth client with callback `https://gzbiqhftbsqmdcofodhl.supabase.co/auth/v1/callback` and enabled Google in Supabase with its app credentials. The existing default Site URL was left unchanged; Backstage explicitly supplies its return address.
6. Real sign-in, callback and session persistence after reload are verified. Sign-out and a second real browser account still need release checks. Google exempts basic name, email and profile scopes from its Testing-mode test-user restriction; see the Google audience reference below. Review branding and deployment settings before the public rollout. Restart Vite whenever environment variables change. The entrance checks Google availability before redirecting, so visitors get a clear message if the provider is disabled.

Google uses a full-page OAuth redirect to avoid the popup blocker on the previous voting screen. A verified email is not proof that an account is operated by a real person.

## Mailing list

Signing in with the updates checkbox selected subscribes the member; unticking it does not subscribe a new member or change an existing preference. The optional updates checkbox is preselected as requested by the site owner. Visitors can untick it before signing in. Its selection is saved only after successful authentication. Members can unsubscribe from the members' area without losing access. The RPC gets the user's confirmed email from Supabase Auth, so the browser cannot subscribe another email.

`backstage_email_preferences` stores each user's current choice and its timestamp. Only that user can read their row. Database administrators can export the current opted-in list with:

```sql
select email, updated_at as opted_in_at
from public.backstage_email_preferences
where opted_in = true
order by updated_at desc;
```

The table is a mailing-list register, not a campaign sender. Connect a mailing provider before sending campaigns, and keep both subscription changes and unsubscribe links synchronized with this register. No marketing emails are sent by this implementation.

## Private videos

Upload the original video to the private `backstage-videos` bucket after the project is configured. Add its object path, title and description in `backstage_videos`; set `published` to true when ready. The browser can read only published entries after sign-in. The Storage policy also checks that the requested object has a published entry. The player requests a one-hour signed URL on demand; no video URL is embedded in the public entrance or client source.

Signed URLs expire but can be shared while valid. This is account-gated delivery, not DRM. Test anonymous reads fail, authenticated reads work only for published objects, and one account cannot read or modify another account's mailing preference. Do not put private video files in the website's public folder.

## References

- [Google app audiences and basic identity scope exception](https://support.google.com/cloud/answer/15549945?hl=en)
- [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase auth state changes](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Supabase private buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals)


## Local verification

The site passes TypeScript and production build checks. The entrance was checked at desktop and 390px mobile widths, including optional checkbox behavior and locked cards returning focus to the pass. A temporary isolated quiz page verified answer locking, four correct answers plus one wrong answer scoring 4/5, and replay resetting to round 1 with zero points. That temporary page was removed.

Live checks confirmed anonymous reads and preference updates return permission denied. Ten database checks passed for the private bucket, RLS, grants and owner/publication policies. Real Google sign-in, callback, session persistence after reload, and authenticated preference and video-list loading passed. A temporary database transaction verified the subscription and unsubscribe RPC, reading the authenticated user's own preference, and blocking another simulated identity from reading that preference; all changes were rolled back, preserving the member's unsubscribed state. This does not replace testing subscription writes through the browser, two real browser accounts, sign-out or playback of an actual private video. Those checks remain before release. No mock login or public bypass route is present in the website.