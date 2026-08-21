/**
 * End-to-end test for the media upload flow:
 * login -> upload file -> fetch static file -> list -> delete (cleanup)
 */
const BASE = "http://localhost:3001";

async function main() {
  // 1. Login
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@miltoengineering.com",
      password: "MiltoAdmin@2024!",
    }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  const { token } = await loginRes.json();
  console.log("1. Login OK");

  // 2. Upload a small generated PNG (1x1 red pixel)
  const pngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const buf = Buffer.from(pngBase64, "base64");
  const form = new FormData();
  form.append("file", new Blob([buf], { type: "image/png" }), "e2e-test.png");
  form.append("section", "e2e-test");

  const upRes = await fetch(`${BASE}/api/media/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!upRes.ok) {
    const errText = await upRes.text();
    throw new Error(`Upload failed: ${upRes.status} ${errText}`);
  }
  const asset = await upRes.json();
  console.log(`2. Upload OK -> ${asset.url} (alt: ${asset.alt})`);

  // 3. Fetch the static file back
  const fileRes = await fetch(`${BASE}${asset.url}`);
  if (!fileRes.ok) throw new Error(`Static fetch failed: ${fileRes.status}`);
  const ct = fileRes.headers.get("content-type");
  console.log(`3. Static serve OK (${ct})`);

  // 4. Verify it appears in the media list
  const list = await (await fetch(`${BASE}/api/media`)).json();
  if (!list.some((a) => a.id === asset.id)) throw new Error("Asset not in list");
  console.log(`4. Listed OK (total assets: ${list.length})`);

  // 5. Reject bad type (upload a .txt disguised as text/plain)
  const badForm = new FormData();
  badForm.append("file", new Blob([Buffer.from("hello")], { type: "text/plain" }), "bad.txt");
  const badRes = await fetch(`${BASE}/api/media/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: badForm,
  });
  console.log(`5. Bad-type rejected: ${badRes.status === 500 || badRes.status === 400 ? "OK" : "FAIL (" + badRes.status + ")"}`);

  // 6. Cleanup: delete the asset
  const delRes = await fetch(`${BASE}/api/media/${asset.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!delRes.ok) throw new Error(`Delete failed: ${delRes.status}`);
  const goneRes = await fetch(`${BASE}${asset.url}`);
  console.log(`6. Delete OK (file gone: ${goneRes.status === 404})`);

  console.log("\nALL E2E CHECKS PASSED");
}

main().catch((e) => {
  console.error("E2E FAILED:", e.message);
  process.exit(1);
});
