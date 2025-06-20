const { execSync } = require("child_process");
const fs = require("fs");

// Step 1: Run the production build
execSync("react-scripts build", { stdio: "inherit" });

// Step 2: Rename "build" to "_static"
fs.renameSync("build", "_static");

// Step 3: Copy the _redirects file if it exists
const redirectsSource = "public/_redirects";
const redirectsDestination = "_static/_redirects";

if (fs.existsSync(redirectsSource)) {
  fs.copyFileSync(redirectsSource, redirectsDestination);
  console.log("✔ Copied _redirects to _static/");
} else {
  console.warn("⚠️  public/_redirects not found. SPA routing may break.");
}
