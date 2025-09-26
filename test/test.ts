import TreeUtil from "../src/index.js";
import fs from "fs";
import path from "path";

// Create test directory structure
function createTestStructure(): string {
  const testDir = "./test-dir";

  // Clean up if exists
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  // Create test structure
  fs.mkdirSync(testDir);
  fs.mkdirSync(path.join(testDir, "src"));
  fs.mkdirSync(path.join(testDir, "docs"));
  fs.mkdirSync(path.join(testDir, "src", "utils"));
  fs.mkdirSync(path.join(testDir, "src", "components"));

  // Create files
  fs.writeFileSync(path.join(testDir, "package.json"), '{"name": "test"}');
  fs.writeFileSync(path.join(testDir, "README.md"), "# Test Project");
  fs.writeFileSync(path.join(testDir, ".gitignore"), "node_modules");
  fs.writeFileSync(
    path.join(testDir, "src", "index.js"),
    'console.log("Hello")'
  );
  fs.writeFileSync(
    path.join(testDir, "src", "utils", "helper.js"),
    "// Helper functions"
  );
  fs.writeFileSync(
    path.join(testDir, "src", "components", "Button.js"),
    "// Button component"
  );
  fs.writeFileSync(path.join(testDir, "docs", "api.md"), "# API Documentation");

  return testDir;
}

// Run tests
async function runTests(): Promise<void> {
  console.log("🌳 Tree Utility Tests\n");

  const testDir = createTestStructure();

  try {
    // Test 1: Basic tree
    console.log("1. Basic tree structure:");
    console.log(await TreeUtil.generate(testDir));

    // Test 2: Show hidden files
    console.log("\n2. With hidden files:");
    console.log(await TreeUtil.generate(testDir, { showHidden: true }));

    // Test 3: Show file sizes
    console.log("\n3. With file sizes:");
    console.log(await TreeUtil.generate(testDir, { showSize: true }));

    // Test 4: Show dates
    console.log("\n4. With modification dates:");
    console.log(await TreeUtil.generate(testDir, { showDate: true }));

    // Test 5: Exclude patterns
    console.log("\n5. Excluding .gitignore:");
    console.log(
      await TreeUtil.generate(testDir, { excludePatterns: [".gitignore"] })
    );

    // Test 6: Include patterns
    console.log("\n6. Only JavaScript files:");
    console.log(
      await TreeUtil.generate(testDir, { includePatterns: ["*.js"] })
    );

    // Test 7: Max depth
    console.log("\n7. Max depth 1:");
    console.log(await TreeUtil.generate(testDir, { maxDepth: 1 }));

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", (error as Error).message);
  } finally {
    // Clean up
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  }
}

// Run tests
runTests().catch(console.error);
