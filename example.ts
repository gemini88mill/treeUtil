import TreeUtil from "./src/index.js";

// Example 1: Basic tree generation
console.log("=== Basic Tree ===");
const basicTree = TreeUtil.generate(".");
console.log(basicTree);

// Example 2: Tree with file sizes and dates
console.log("\n=== Tree with File Sizes and Dates ===");
const detailedTree = TreeUtil.generate(".", {
  showSize: true,
  showDate: true,
  maxDepth: 2,
});
console.log(detailedTree);

// Example 3: Tree with custom filtering
console.log("\n=== Tree with Custom Filtering ===");
const filteredTree = TreeUtil.generate(".", {
  showHidden: false,
  excludePatterns: ["node_modules", "dist", "*.log"],
  includePatterns: ["*.ts", "*.js", "*.json", "*.md"],
});
console.log(filteredTree);

// Example 4: Using the class directly
console.log("\n=== Using TreeUtil Class ===");
const treeUtil = new TreeUtil({
  showSize: true,
  maxDepth: 1,
});

const classTree = treeUtil.generateTree("./src");
console.log(classTree);

// Example 5: Get file system items programmatically
console.log("\n=== File System Items ===");
const items = treeUtil.getFileSystemItems("./src");
items.forEach((item) => {
  const type = item.isDirectory ? "📁" : "📄";
  const size = item.size ? ` (${item.size} bytes)` : "";
  console.log(`${type} ${item.name}${size}`);
});
