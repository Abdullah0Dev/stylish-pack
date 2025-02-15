#!/usr/bin/env ts-node
import * as fs from "fs";
import * as path from "path";

const appName = process.env.INIT_CWD?.split(path.sep).pop();

if (!appName) {
  console.error("❌ No app name detected. Using default 'MyApp'.");
  process.exit(1);
}

// Helper function to replace placeholders in files
const replaceInFile = (filePath: string) => {
  const fullPath = path.join(__dirname, "..", filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8");
    content = content
      .replace(/MyAwesomeApp/g, appName) // ✅ Replace template app name
      .replace(/metube/g, appName) // ✅ Fix leftover default name
      .replace(/com\.metube/g, `com.${appName.toLowerCase()}`); // ✅ Fix bundle ID
    fs.writeFileSync(fullPath, content, "utf8");
  }
};

// List of files to update
const filesToReplace = [
  "template/package.json",
  "template/app.json",
  "template/android/app/src/main/AndroidManifest.xml",
  "template/android/app/src/main/java/com/metube/MainActivity.java",
  "template/android/app/src/main/java/com/metube/MainApplication.java",
  "template/ios/MeTube.xcodeproj/project.pbxproj", // ✅ Rename this later
  "template/ios/MeTube/Info.plist",
];

filesToReplace.forEach(replaceInFile);

// ✅ 2️⃣ Rename iOS project folder
const renameFolder = (oldName: string, newName: string) => {
  const oldPath = path.join(__dirname, "..", "template", "ios", oldName);
  const newPath = path.join(__dirname, "..", "template", "ios", newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
};

// ✅ Rename iOS folder & project
renameFolder("MeTube", appName);
renameFolder("meTube.xcodeproj", `${appName}.xcodeproj`);
renameFolder("meTube.xcworkspace", `${appName}.xcworkspace`);

console.log(`✅ Project renamed to "${appName}" successfully! 🚀`);
