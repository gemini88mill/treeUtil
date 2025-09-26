# Tree Utility

A powerful TypeScript/Node.js utility for generating tree-formatted lists from file system paths. This tool provides both a command-line interface and a programmatic API for creating beautiful directory trees.

## Features

- 🌳 Generate tree structures from any file system path
- 📁 Support for directories and files
- 🎨 Beautiful ASCII tree formatting with proper indentation
- 🔍 Filter files and directories with patterns
- 📊 Show file sizes and modification dates
- 🚫 Exclude hidden files and directories
- 📏 Control maximum depth
- 💾 Output to file or console
- 🎯 Pattern matching with glob-like syntax

## Installation

### Standalone Executables (Recommended)

Download pre-built executables from the [Releases](https://github.com/your-username/TreeUtil/releases) page:

- **Windows**: `tree-util-win.exe` - Download and run directly
- **Linux**: `tree-util-linux` - Make executable with `chmod +x tree-util-linux`
- **macOS**: `tree-util-macos` - Make executable with `chmod +x tree-util-macos`

No Node.js or dependencies required!

### From Source

#### Using Bun (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd TreeUtil

# Install dependencies
bun install

# Build the TypeScript code
bun run build

# Make the CLI globally available (optional)
bun link
```

#### Using npm

```bash
# Clone the repository
git clone <repository-url>
cd TreeUtil

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Make the CLI globally available (optional)
npm link
```

## Usage

### Command Line Interface

The tree utility can be used directly from the command line:

#### Using npm/tsx

```bash
# Basic usage - show tree of current directory
npm run dev

# Show tree of specific directory
npm run dev /path/to/directory

# Show hidden files
npm run dev -a

# Limit depth to 2 levels
npm run dev -L 2

# Show file sizes and dates
npm run dev -s -t

# Exclude node_modules
npm run dev -I "node_modules"

# Show only JavaScript files
npm run dev -P "*.js"

# Save output to file
npm run dev -o tree.txt

# Show help information
npm run dev -- --help
npm run dev help

# Or use the built version
npm start
```

#### Using Bun

```bash
# Basic usage - show tree of current directory
bun run dev

# Show tree of specific directory
bun run dev /path/to/directory

# Show hidden files
bun run dev -a

# Limit depth to 2 levels
bun run dev -L 2

# Show file sizes and dates
bun run dev -s -t

# Exclude node_modules
bun run dev -I "node_modules"

# Show only JavaScript files
bun run dev -P "*.js"

# Save output to file
bun run dev -o tree.txt

# Show help information
bun run dev -- --help
bun run dev help

# Or use the built version
bun start

# Direct execution with bun (no build required)
bun src/cli.ts
bun src/cli.ts /path/to/directory
bun src/cli.ts -a -s -t
```

### Command Line Options

| Option                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `-a, --all`               | Show hidden files and directories         |
| `-d, --dirs-only`         | Show only directories                     |
| `-f, --files-only`        | Show only files                           |
| `-L, --level <number>`    | Max display depth of the directory tree   |
| `-s, --size`              | Show file sizes                           |
| `-t, --time`              | Show last modification time               |
| `-I, --ignore <pattern>`  | Ignore files that match the pattern       |
| `-P, --pattern <pattern>` | Include only files that match the pattern |
| `-o, --output <file>`     | Output to file instead of stdout          |
| `--no-sort`               | Do not sort files and directories         |
| `-h, --help`              | Show help information                     |

### Programmatic API

You can also use the tree utility programmatically in your Node.js or Bun applications:

```typescript
import TreeUtil from "./src/index.js";

// Basic usage
const tree = TreeUtil.generate("./my-directory");
console.log(tree);

// With options
const treeWithOptions = TreeUtil.generate("./my-directory", {
  showHidden: true,
  showSize: true,
  showDate: true,
  maxDepth: 3,
  excludePatterns: ["node_modules", "*.log"],
  includePatterns: ["*.js", "*.ts"],
});
console.log(treeWithOptions);

// Using the class directly
const treeUtil = new TreeUtil({
  showHidden: false,
  showSize: true,
});
const customTree = treeUtil.generateTree("./my-directory");
console.log(customTree);
```

#### Running with Bun

```typescript
// Direct execution with bun
bun run example.ts

// Or in a Bun script
bun --bun src/index.ts
```

## API Reference

### TreeUtil.generate(path, options)

Static method to generate a tree structure.

**Parameters:**

- `path` (string): The root path to generate tree from
- `options` (object): Configuration options

**Returns:** (string) The formatted tree string

### TreeUtil constructor

Create a new TreeUtil instance with custom options.

**Parameters:**

- `options` (object): Configuration options

### Options

| Option            | Type     | Default    | Description                       |
| ----------------- | -------- | ---------- | --------------------------------- |
| `maxDepth`        | number   | `Infinity` | Maximum depth to traverse         |
| `showHidden`      | boolean  | `false`    | Show hidden files and directories |
| `showSize`        | boolean  | `false`    | Show file sizes                   |
| `showDate`        | boolean  | `false`    | Show modification dates           |
| `excludePatterns` | string[] | `[]`       | Patterns to exclude               |
| `includePatterns` | string[] | `[]`       | Patterns to include               |
| `sort`            | boolean  | `true`     | Sort files and directories        |

## Examples

### Basic Tree Output

```
my-project/
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   └── Header.js
│   ├── utils/
│   │   └── helper.js
│   └── index.js
├── docs/
│   └── README.md
├── package.json
└── README.md
```

### Tree with File Sizes

```
my-project/
├── src/
│   ├── components/
│   │   ├── Button.js [2.1 KB]
│   │   └── Header.js [1.8 KB]
│   ├── utils/
│   │   └── helper.js [856 B]
│   └── index.js [1.2 KB]
├── docs/
│   └── README.md [3.4 KB]
├── package.json [1.1 KB]
└── README.md [2.7 KB]
```

### Tree with Dates

```
my-project/
├── src/
│   ├── components/
│   │   ├── Button.js [2024-01-15]
│   │   └── Header.js [2024-01-14]
│   ├── utils/
│   │   └── helper.js [2024-01-13]
│   └── index.js [2024-01-16]
├── docs/
│   └── README.md [2024-01-12]
├── package.json [2024-01-10]
└── README.md [2024-01-11]
```

## Pattern Matching

The utility supports simple glob-like pattern matching:

- `*.js` - Match all JavaScript files
- `node_modules` - Match any path containing "node_modules"
- `*.{js,ts}` - Match JavaScript or TypeScript files
- `src/*` - Match anything in the src directory

## Help and Documentation

The tree utility provides comprehensive help information:

### Quick Help

```bash
# Show basic help with all options
npm run dev -- --help
# or
npx tsx src/cli.ts --help
# or (built version)
node dist/src/cli.js --help

# With Bun
bun run dev -- --help
# or
bun src/cli.ts --help
# or (built version)
bun dist/src/cli.js --help
```

### Detailed Help

```bash
# Show comprehensive help with examples and explanations
npm run dev help
# or
npx tsx src/cli.ts help
# or (built version)
node dist/src/cli.js help

# With Bun
bun run dev help
# or
bun src/cli.ts help
# or (built version)
bun dist/src/cli.js help
```

The detailed help includes:

- Complete feature overview
- Detailed option explanations
- Pattern matching examples
- Use case examples
- Troubleshooting tips
- Programmatic usage examples

## Testing

Run the test suite to see the utility in action:

```bash
# With npm
npm test

# With Bun
bun test
```

This will create a temporary directory structure and demonstrate various features of the tree utility.

## Examples

See `example.ts` for a comprehensive demonstration of the tree utility features:

```bash
# With npm/tsx
npx tsx example.ts

# With Bun
bun example.ts
```

This will show various examples including:

- Basic tree generation
- Trees with file sizes and dates
- Custom filtering
- Using the TreeUtil class directly
- Getting file system items programmatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
