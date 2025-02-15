#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Get the app name from the folder name
const currentDir = process.env.INIT_CWD || __dirname;
const bruhName = path.basename(currentDir);
// Get the app name from package.json (source of truth)
const packageJsonPath = path.join(process.cwd(), "./template/package.json");

if (!fs.existsSync(packageJsonPath)) {
  console.error("❌ package.json not found. Ensure the project is initialized.");
  process.exit(1);
}  

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const appName = packageJson.name;

console.log("🚀 App Name->:", appName);

if (!appName) {
  console.error("❌ App name not found in package.json.");
  process.exit(1);
}
console.log("📂 Project Directory:", currentDir);
console.log("🚀 App Name234:", appName);
console.log('App Name:', process.env.INIT_CWD);
console.log('App Name2:', process.argv[2]);

if (!appName) {
  console.error("❌ No app name detected. Provide an app name like: npx @react-native-community/cli@latest init MyApp");
  process.exit(1);
}
const basePath = path.join(__dirname, "..");

// 🔹 Function to replace old app names with the new one
const replaceInFile = (filePath) => {
  const fullPath = path.join(basePath, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8");
    content = content
      .replace(/DeepVoiceSeeker/g, appName)
      .replace(/DeepVoiceSeeker/g, appName)
      .replace(/stylish-pack/g, appName)
      .replace(/com\.DeepVoiceSeeker/g, `com.${appName.replace(/\s+/g, "").toLowerCase()}`)
      .replace(/com\.stylish-pack/g, `com.${appName.replace(/\s+/g, "").toLowerCase()}`);
    fs.writeFileSync(fullPath, content, "utf8");
  }
};

// 🔹 List of files to update
const filesToReplace = [
  "package.json",
  "app.json",
  "android/app/src/main/AndroidManifest.xml",
  "android/app/src/main/java/com/DeepVoiceSeeker/MainActivity.java",
  "android/app/src/main/java/com/DeepVoiceSeeker/MainApplication.java",
  "android/app/src/main/java/com/stylishpack/MainActivity.java",
  "android/app/src/main/java/com/stylishpack/MainApplication.java",
  "ios/DeepVoiceSeeker.xcodeproj/project.pbxproj",
  "ios/DeepVoiceSeeker/Info.plist",
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

renameFolder("DeepVoiceSeeker", appName);
renameFolder("DeepVoiceSeekerTests", `${appName}Tests`);
renameFolder("DeepVoiceSeeker.xcodeproj", `${appName}.xcodeproj`);
renameFolder("DeepVoiceSeeker.xcworkspace", `${appName}.xcworkspace`);

renameFolder("stylish-pack", appName);
renameFolder("stylish-packTests", `${appName}Tests`);
renameFolder("stylish-pack.xcodeproj", `${appName}.xcodeproj`);
renameFolder("stylish-pack.xcworkspace", `${appName}.xcworkspace`);

// 🔹 Rename Xcode scheme
const schemePathMeTube = path.join(basePath, "ios", "DeepVoiceSeeker.xcodeproj", "xcshareddata", "xcschemes", "DeepVoiceSeeker.xcscheme");
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
