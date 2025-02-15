module.exports = {
  placeholderName: "MyAwesomeApp", // This is the name that will be replaced in the template files
  templateDir: "./template",
  postInitScript: "ts-node scripts/post-init.ts", // No need for {{name}}, will be handled in the script
};
