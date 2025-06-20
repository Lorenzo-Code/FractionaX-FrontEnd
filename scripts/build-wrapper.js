const fs = require("fs");
const fse = require("fs-extra");
const { execSync } = require("child_process");

(async () => {
  try {
    if (fs.existsSync("_static")) {
      await fse.remove("_static");
    }

    execSync("node sammy.js", { stdio: "inherit" });
    execSync("yarn react-scripts build", { stdio: "inherit" });

    await fse.move("build", "_static");
    console.log("✅ Build completed and moved to _static");
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  }
})();
