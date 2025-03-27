#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Get new app name (only argument needed)
const prevName = process.argv[2] || 'devminds';
const appName = process.argv[3] || require('../package.json').name;

if (!appName) {
  console.error('❌ Usage: node ./scripts/rename.js <newName>');
  console.error('   Example: node ./scripts/rename.js MyNewApp');
  process.exit(1);
}

console.log(`🔄 Renaming from "${prevName}" to "${appName}"...`);

const basePath = path.join(__dirname, '..');

// Helper functions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Update Android strings.xml
function updateAndroidStrings(filePath) {
  const fullPath = path.join(basePath, filePath);
  if (!fs.existsSync(fullPath)) { return; }

  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(
    /<string name="app_name">([^<]*)<\/string>/,
    `<string name="app_name">${appName}</string>`
  );
  fs.writeFileSync(fullPath, content, 'utf8');
}

// Update iOS Info.plist
function updateInfoPlist(filePath) {
  const fullPath = path.join(basePath, filePath);
  if (!fs.existsSync(fullPath)) { return; }

  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(
    /<key>CFBundleDisplayName<\/key>\s*<string>([^<]*)<\/string>/,
    `<key>CFBundleDisplayName</key>\n\t<string>${appName}</string>`
  );
  fs.writeFileSync(fullPath, content, 'utf8');
}

// Standard file replacements
function replaceInFile(filePath) {
  const fullPath = path.join(basePath, filePath);
  if (!fs.existsSync(fullPath)) { return; }

  let content = fs.readFileSync(fullPath, 'utf8');
  const replacements = [
    { pattern: new RegExp(escapeRegExp(prevName), 'gi'), replacement: appName },
    {
      pattern: new RegExp(`com.${escapeRegExp(prevName.replace(/\s+/g, '').toLowerCase())}`, 'g'),
      replacement: `com.${appName.replace(/\s+/g, '').toLowerCase()}`,
    },
  ];

  replacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });

  fs.writeFileSync(fullPath, content, 'utf8');
}

// File paths to update
const filesToReplace = [
  'package.json',
  'app.json',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res/values/strings.xml',
  `android/app/src/main/java/com/${prevName.replace(/\s+/g, '').toLowerCase()}/MainActivity.kt`,
  `android/app/src/main/java/com/${prevName.replace(/\s+/g, '').toLowerCase()}/MainApplication.kt`,
  `ios/${prevName}.xcodeproj/project.pbxproj`,
  `ios/${prevName}/Info.plist`,
];

// Folder renaming
function renameFolder(oldPath, newPath) {
  const fullOldPath = path.join(basePath, oldPath);
  const fullNewPath = path.join(basePath, newPath);

  if (fs.existsSync(fullOldPath)) {
    fs.renameSync(fullOldPath, fullNewPath);
    console.log(`   ↳ Renamed ${oldPath} → ${newPath}`);
  }
}

// Execute all updates
filesToReplace.forEach(replaceInFile);
updateInfoPlist(`ios/${prevName}/Info.plist`);
updateAndroidStrings('android/app/src/main/res/values/strings.xml');

// iOS structure updates
renameFolder(`ios/${prevName}`, `ios/${appName}`);
renameFolder(`ios/${prevName}Tests`, `ios/${appName}Tests`);
renameFolder(`ios/${prevName}.xcodeproj`, `ios/${appName}.xcodeproj`);
renameFolder(`ios/${prevName}.xcworkspace`, `ios/${appName}.xcworkspace`);

// Android structure updates
renameFolder(
  `android/app/src/main/java/com/${prevName.replace(/\s+/g, '').toLowerCase()}`,
  `android/app/src/main/java/com/${appName.replace(/\s+/g, '').toLowerCase()}`
);

// ================================================
// 🛠 CRITICAL XCODE SCHEME FIXES (NEW ADDITIONS)
// ================================================

// 1. Update scheme name in project.pbxproj
const pbxprojPath = `ios/${appName}.xcodeproj/project.pbxproj`;
if (fs.existsSync(path.join(basePath, pbxprojPath))) {
  let pbxprojContent = fs.readFileSync(pbxprojPath, 'utf8');
  pbxprojContent = pbxprojContent.replace(
    new RegExp(escapeRegExp(prevName), 'g'),
    appName
  );
  fs.writeFileSync(pbxprojPath, pbxprojContent, 'utf8');
  console.log(`   ↳ Updated Xcode project references in ${pbxprojPath}`);
}

// 2. Ensure the .xcscheme file is properly named and updated
const schemeDir = `ios/${appName}.xcodeproj/xcshareddata/xcschemes`;
const oldSchemePath = path.join(basePath, schemeDir, `${prevName}.xcscheme`);
const newSchemePath = path.join(basePath, schemeDir, `${appName}.xcscheme`);

if (fs.existsSync(oldSchemePath)) {
  fs.renameSync(oldSchemePath, newSchemePath);
  console.log(`   ↳ Renamed scheme: ${prevName}.xcscheme → ${appName}.xcscheme`);

  // Update the scheme file contents
  let schemeContent = fs.readFileSync(newSchemePath, 'utf8');
  schemeContent = schemeContent.replace(
    new RegExp(escapeRegExp(prevName), 'g'),
    appName
  );
  fs.writeFileSync(newSchemePath, schemeContent, 'utf8');
  console.log(`   ↳ Updated scheme references in ${appName}.xcscheme`);
}

// 3. Update Workspace settings (often missed!)
const workspaceSettingsPath = `ios/${appName}.xcworkspace/contents.xcworkspacedata`;
if (fs.existsSync(path.join(basePath, workspaceSettingsPath))) {
  let workspaceContent = fs.readFileSync(workspaceSettingsPath, 'utf8');
  workspaceContent = workspaceContent.replace(
    new RegExp(escapeRegExp(prevName), 'g'),
    appName
  );
  fs.writeFileSync(workspaceSettingsPath, workspaceContent, 'utf8');
  console.log(`   ↳ Updated workspace references in ${workspaceSettingsPath}`);
}

// ================================================

console.log(`✅ Successfully renamed to "${appName}"`);
console.log('⚠️  Required follow-up steps:');
console.log('   1. Run: cd ios && pod deintegrate && pod install');
console.log('   2. Clean build: npx react-native clean && cd ios && xcodebuild clean');
console.log('   3. Rebuild both iOS and Android projects');
