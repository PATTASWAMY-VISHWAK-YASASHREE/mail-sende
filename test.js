const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { getLatestFile } = require("./email.js"); // Assuming getLatestFile is exported

const TEST_DIR = "test_downloads";

// Create test directory
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR);
}

// Create a dummy file and a dummy directory
const FILE_PATH = path.join(TEST_DIR, "test_file.txt");
const DIR_PATH = path.join(TEST_DIR, "test_dir");

fs.writeFileSync(FILE_PATH, "test content");
fs.mkdirSync(DIR_PATH, { recursive: true });

// Make the directory newer than the file
const fileTime = new Date(Date.now() - 1000); // 1 second in the past
const dirTime = new Date();
fs.utimesSync(FILE_PATH, fileTime, fileTime);
fs.utimesSync(DIR_PATH, dirTime, dirTime);

console.log("Running test...");

try {
  const latestFile = getLatestFile(TEST_DIR);
  assert.strictEqual(latestFile, FILE_PATH, "getLatestFile should return the file, not the directory.");
  console.log("Test passed!");
} catch (error) {
  console.error("Test failed:", error.message);
} finally {
  // Cleanup
  fs.unlinkSync(FILE_PATH);
  fs.rmdirSync(DIR_PATH);
  fs.rmdirSync(TEST_DIR);
  console.log("Cleanup complete.");
}
