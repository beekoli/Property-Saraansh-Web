# Daily News → WordPress drafts

Turns each morning's Noida news shortlist into **draft** posts in the WordPress
**News** category, each with a branded gold/teal cover image. You review the
drafts in wp-admin and hit Publish — they appear on **/news** automatically.

## One-time setup
1. Make sure `.env` in this folder has your real values (it's git-ignored):
   ```
   WP_URL=https://login.propertysaraansh.com
   WP_USERNAME=your-wp-username
   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```
2. Make sure a category with slug **news** exists in WordPress.
3. Node.js must be installed (you already have it for the website).

## Each day
1. Take the shortlist from your "Daily Noida Real Estate + Infra Update" task and
   save it as **`today.md`** in this folder, in the format shown in
   `today.example.md` (a JSON array, or Markdown with a ```json block).
2. Double-click **`run-news-drafts.bat`** (first run installs dependencies).
3. Open wp-admin → Posts → Drafts, review, and Publish the ones you want.

## Options
- Preview covers without posting anything:
  `run-news-drafts.bat --dry-run`  (writes `preview-1.png`, `preview-2.png`, …)
- Use a different input file:
  `run-news-drafts.bat path\to\shortlist.md`

## Notes
- Posts are always created as **drafts** — nothing goes live until you publish.
- The cover image is set as the post's Featured Image, which the /news cards use.
- If cover generation ever fails on a machine, the draft is still created (just
  without a cover); you can add one in WordPress.
- `.env` never leaves your PC and is excluded from git.
