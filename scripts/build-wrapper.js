const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const STATIC_DIR = "_static";

try {
  if (fs.existsSync(STATIC_DIR)) {
    fs.rmSync(STATIC_DIR, { recursive: true });
  }
} catch (e) {
  console.error("Failed to remove _static:", e);
}

console.log("Building production files...");
execSync("react-scripts build", { stdio: "inherit" });

// Move build to _static
fs.renameSync("build", STATIC_DIR);

// Copy _redirects file from public to _static (if it exists)
const redirectsFile = path.join("public", "_redirects");
const targetRedirects = path.join(STATIC_DIR, "_redirects");

if (fs.existsSync(redirectsFile)) {
  fs.copyFileSync(redirectsFile, targetRedirects);
  console.log("✔ Copied _redirects to _static");
} else {
  console.warn("⚠️  No _redirects file found in public/");
}
