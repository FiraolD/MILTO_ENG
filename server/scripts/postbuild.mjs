/**
 * Post-build step for the compiled server.
 *
 * The root package.json has "type": "module", but server/tsconfig.json
 * compiles the backend to CommonJS. Node would treat the emitted .js files
 * as ESM and fail on require(), so we drop a {"type":"commonjs"} marker
 * package.json inside dist/server to scope the compiled output to CJS.
 */
import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "dist", "server");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "package.json"),
  JSON.stringify({ type: "commonjs" }, null, 2) + "\n"
);
console.log("[postbuild] dist/server marked as CommonJS");
