#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const currentDir = process.env.INIT_CWD || __dirname;
const appName = currentDir.split(path.sep).pop(); // Get project name from folder

if (!appName) {
  console.error("❌ No app name detected. Using default 'MyApp'.");
  process.exit(1);
}

const basePath = path.join(__dirname, "..");

// 🔹 Function to replace old app names with the new one
const replaceInFile = (filePath) => {
  const fullPath = path.join(basePath, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8");
    content = content
      .replace(/MyAwesomeApp/g, appName)
      .replace(/meTube/g, appName)
      .replace(/stylish-pack/g, appName)
      .replace(/com\.meTube/g, `com.${appName.replace(/\s+/g, "").toLowerCase()}`)
      .replace(/com\.stylish-pack/g, `com.${appName.replace(/\s+/g, "").toLowerCase()}`);
    fs.writeFileSync(fullPath, content, "utf8");
  }
};

// 🔹 List of files to update
const filesToReplace = [
  "package.json",
  "app.json",
  "android/app/src/main/AndroidManifest.xml",
  "android/app/src/main/java/com/meTube/MainActivity.java",
  "android/app/src/main/java/com/meTube/MainApplication.java",
  "android/app/src/main/java/com/stylishpack/MainActivity.java",
  "android/app/src/main/java/com/stylishpack/MainApplication.java",
  "ios/meTube.xcodeproj/project.pbxproj",
  "ios/meTube/Info.plist",
  "ios/stylish-pack.xcodeproj/project.pbxproj",
  "ios/stylish-pack/Info.plist",
];

filesToReplace.forEach(replaceInFile);

// 🔹 Rename iOS folders & workspace files
const renameFolder = (oldName, newName) => {
  const oldPath = path.join(basePath, "ios", oldName);
  const newPath = path.join(basePath, "ios", newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
};

renameFolder("meTube", appName);
renameFolder("meTubeTests", `${appName}Tests`);
renameFolder("meTube.xcodeproj", `${appName}.xcodeproj`);
renameFolder("meTube.xcworkspace", `${appName}.xcworkspace`);

renameFolder("stylish-pack", appName);
renameFolder("stylish-packTests", `${appName}Tests`);
renameFolder("stylish-pack.xcodeproj", `${appName}.xcodeproj`);
renameFolder("stylish-pack.xcworkspace", `${appName}.xcworkspace`);

// 🔹 Rename Xcode scheme
const schemePathMeTube = path.join(basePath, "ios", "meTube.xcodeproj", "xcshareddata", "xcschemes", "meTube.xcscheme");
const newSchemePathMeTube = path.join(basePath, "ios", `${appName}.xcodeproj`, "xcshareddata", "xcschemes", `${appName}.xcscheme`);

const schemePathStylishPack = path.join(basePath, "ios", "stylish-pack.xcodeproj", "xcshareddata", "xcschemes", "stylish-pack.xcscheme");
const newSchemePathStylishPack = path.join(basePath, "ios", `${appName}.xcodeproj`, "xcshareddata", "xcschemes", `${appName}.xcscheme`);

if (fs.existsSync(schemePathMeTube)) {
  fs.renameSync(schemePathMeTube, newSchemePathMeTube);
  replaceInFile(newSchemePathMeTube);
}

if (fs.existsSync(schemePathStylishPack)) {
  fs.renameSync(schemePathStylishPack, newSchemePathStylishPack);
  replaceInFile(newSchemePathStylishPack);
}

console.log(`✅ Project successfully renamed to "${appName}"! 🚀`);
