#!/usr/bin/env node

import { Command } from "commander";
import TreeUtil from "./index.js";
import { TreeOptions, CLIOptions } from "./types.js";
import path from "path";

const program = new Command();

// Add a custom help command
program
  .command("help")
  .description("Show detailed help information")
  .action(() => {
    console.log(`
🌳 Tree Utility - Detailed Help

DESCRIPTION:
  Tree Utility is a powerful TypeScript/Node.js tool for generating beautiful
  directory tree structures from file system paths. It provides both command-line
  and programmatic interfaces with extensive customization options.

FEATURES:
  • Beautiful ASCII tree formatting with proper indentation
  • Filter files and directories with pattern matching
  • Show file sizes and modification dates
  • Control maximum depth and sorting
  • Exclude hidden files and directories
  • Output to console or file
  • TypeScript support with full type safety

BASIC USAGE:
  tree-util [path] [options]

  The path argument is optional and defaults to the current directory (.).
  All options are also optional and can be combined.

DETAILED OPTIONS:

  Display Options:
    -a, --all              Include hidden files and directories (those starting with .)
    -d, --dirs-only        Show only directories, completely skip files
    -f, --files-only       Show only files, completely skip directories
    -L, --level <number>   Limit the depth of directory traversal
                          Example: -L 2 shows only 2 levels deep

  Information Options:
    -s, --size             Display file sizes in human-readable format (B, KB, MB, etc.)
    -t, --time             Show last modification dates in YYYY-MM-DD format

  Filtering Options:
    -I, --ignore <pattern> Exclude files/directories matching the pattern
                          Can be used multiple times for multiple patterns
                          Example: -I "node_modules" -I "*.log"
    
    -P, --pattern <pattern> Include only files/directories matching the pattern
                          Can be used multiple times for multiple patterns
                          Example: -P "*.js" -P "*.ts"

  Output Options:
    -o, --output <file>    Save the tree output to a file instead of console
    --no-sort              Disable automatic sorting (directories first, then alphabetically)

PATTERN MATCHING:
  The utility supports simple glob-like pattern matching:
  
  • *.js          - Matches all files ending with .js
  • node_modules  - Matches any path containing "node_modules"
  • *.{js,ts}     - Matches files ending with .js or .ts
  • src/*         - Matches anything in the src directory
  • *.log         - Matches all log files

EXAMPLES BY USE CASE:

  Basic Usage:
    $ tree-util                    # Current directory
    $ tree-util /path/to/project   # Specific directory
    $ tree-util -L 1               # Only immediate children

  Development Projects:
    $ tree-util -I "node_modules" -I "dist" -I "*.log"
    $ tree-util -P "*.{js,ts,jsx,tsx}"
    $ tree-util -s -t              # With sizes and dates

  Documentation:
    $ tree-util -P "*.md" -P "*.txt"
    $ tree-util -d                 # Only directories
    $ tree-util -o project-tree.txt # Save to file

  System Administration:
    $ tree-util /etc -L 2 -I "*.tmp"
    $ tree-util /var/log -P "*.log" -s

OUTPUT FORMAT EXPLANATION:
  The tree uses ASCII characters to show hierarchy:
  
  ├── file.txt          # File with more items below
  ├── directory/        # Directory (note the trailing slash)
  │   ├── subfile.txt   # Nested file (indented with │)
  │   └── subdir/       # Nested directory (└── for last item)
  └── lastfile.txt      # Last item at current level

  When showing sizes/dates: file.txt [1.2 KB, 2024-01-15]

PROGRAMMATIC USAGE:
  You can also use TreeUtil in your TypeScript/JavaScript code:
  
  import TreeUtil from './src/index.js';
  
  const tree = TreeUtil.generate('./my-directory', {
    showHidden: true,
    showSize: true,
    maxDepth: 3
  });

TROUBLESHOOTING:
  • "Path does not exist" - Check the path you're providing
  • No output - Directory might be empty or all files filtered out
  • Permission errors - Some directories may require elevated permissions

For more examples and advanced usage, see the example.ts file or run:
  npx tsx example.ts
`);
  });

program
  .name("tree-util")
  .description("Generate tree-formatted lists from file system paths")
  .version("1.0.0")
  .argument(
    "[path]",
    "Path to generate tree from (defaults to current directory)",
    "."
  )
  .option("-a, --all", "Show hidden files and directories")
  .option("-d, --dirs-only", "Show only directories")
  .option("-f, --files-only", "Show only files")
  .option(
    "-L, --level <number>",
    "Max display depth of the directory tree",
    parseInt
  )
  .option("-s, --size", "Show file sizes")
  .option("-t, --time", "Show last modification time")
  .option(
    "-I, --ignore <pattern>",
    "Ignore files that match the pattern (can be used multiple times)",
    collect,
    []
  )
  .option(
    "-P, --pattern <pattern>",
    "Include only files that match the pattern (can be used multiple times)",
    collect,
    []
  )
  .option("-o, --output <file>", "Output to file instead of stdout")
  .option("--no-sort", "Do not sort files and directories")
  .action(async (targetPath: string, options: CLIOptions) => {
    try {
      const treeOptions: TreeOptions = {
        showHidden: options.all ?? false,
        showSize: options.size ?? false,
        showDate: options.time ?? false,
        maxDepth: options.level || Infinity,
        excludePatterns: options.ignore ?? [],
        includePatterns: options.pattern ?? [],
        sort: options.sort ?? true,
      };

      // Handle dirs-only and files-only options
      if (options.dirsOnly) {
        treeOptions.includePatterns = treeOptions.includePatterns || [];
        treeOptions.includePatterns.push("*/");
      }
      if (options.filesOnly) {
        treeOptions.excludePatterns = treeOptions.excludePatterns || [];
        treeOptions.excludePatterns.push("*/");
      }

      const tree = TreeUtil.generate(targetPath, treeOptions);

      if (options.output) {
        const fs = await import("fs");
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, tree);
        console.log(`Tree output written to: ${outputPath}`);
      } else {
        console.log(tree);
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
      process.exit(1);
    }
  });

// Helper function to collect multiple values for the same option
function collect(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

// Add comprehensive help text
program.addHelpText(
  "after",
  `

🌳 Tree Utility - A powerful tool for generating directory trees

USAGE:
  tree-util [path] [options]

ARGUMENTS:
  path                    Path to generate tree from (defaults to current directory)

OPTIONS:
  -a, --all              Show hidden files and directories (starting with .)
  -d, --dirs-only        Show only directories, skip files
  -f, --files-only       Show only files, skip directories
  -L, --level <number>   Max display depth of the directory tree
  -s, --size             Show file sizes in human-readable format
  -t, --time             Show last modification dates
  -I, --ignore <pattern> Exclude files/directories matching pattern (can be used multiple times)
  -P, --pattern <pattern> Include only files/directories matching pattern (can be used multiple times)
  -o, --output <file>    Save output to file instead of printing to console
  --no-sort              Disable sorting (directories first, then alphabetically)
  -h, --help             Show this help information
  -V, --version          Show version information

EXAMPLES:
  $ tree-util                    # Show tree of current directory
  $ tree-util /path/to/dir       # Show tree of specific directory
  $ tree-util -a                 # Show hidden files and directories
  $ tree-util -L 2               # Limit depth to 2 levels
  $ tree-util -s -t              # Show file sizes and modification dates
  $ tree-util -I "node_modules"  # Exclude node_modules directory
  $ tree-util -I "*.log"         # Exclude log files
  $ tree-util -P "*.js"          # Show only JavaScript files
  $ tree-util -P "*.{js,ts}"     # Show only JS and TS files
  $ tree-util -o tree.txt        # Save output to tree.txt file
  $ tree-util -d                 # Show only directories
  $ tree-util -f                 # Show only files

PATTERN MATCHING:
  Patterns support simple glob-like syntax:
  • *.js          - Match all JavaScript files
  • node_modules  - Match any path containing "node_modules"
  • *.{js,ts}     - Match JavaScript or TypeScript files
  • src/*         - Match anything in the src directory

OUTPUT FORMAT:
  The tree is displayed with ASCII characters:
  ├── file.txt          # File with siblings below
  ├── directory/        # Directory with trailing slash
  │   ├── subfile.txt   # Nested file
  │   └── subdir/       # Nested directory
  └── lastfile.txt      # Last item at current level

For more information, visit: https://github.com/your-repo/tree-util
`
);

program.parse();
