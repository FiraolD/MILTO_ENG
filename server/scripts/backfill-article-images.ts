/**
 * One-off backfill: attach placeholder images to existing seed articles.
 * Safe to re-run; only updates rows where image_url is empty.
 */
import pool from "../db";

async function main() {
  const updates: [string, string][] = [
    ["milto-completes-rift-valley-assessment", "https://picsum.photos/seed/milto-news-1/1200/700"],
    ["new-gis-platform-launched", "https://picsum.photos/seed/milto-news-2/1200/700"],
    ["environmental-impact-assessment-lake-tana", "https://picsum.photos/seed/milto-news-3/1200/700"],
  ];
  for (const [slug, url] of updates) {
    await pool.query(
      "UPDATE articles SET image_url = $1 WHERE slug = $2 AND (image_url IS NULL OR image_url = '')",
      [url, slug]
    );
  }
  const rows = await pool.query("SELECT slug, image_url FROM articles");
  console.log(rows);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
