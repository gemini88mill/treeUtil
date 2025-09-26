# Standalone Installation Guide

This guide explains how to use TreeUtil as a standalone executable without requiring Node.js to be installed.

## Quick Start

### Option 1: Download Pre-built Executables (Recommended)

1. Download the appropriate executable for your platform from the releases page
2. Make it executable (Linux/macOS): `chmod +x tree-util-linux` or `chmod +x tree-util-macos`
3. Move to a directory in your PATH or use directly

### Option 2: Build from Source

1. Clone the repository
2. Install dependencies: `bun install`
3. Build for your platform:
   - Windows: `bun run build:win`
   - Linux: `bun run build:linux`
   - macOS: `bun run build:macos`
   - All platforms: `bun run build:all`

## Platform-Specific Instructions

### Windows (PowerShell/CMD)

1. **Download**: Get `tree-util-win.exe` from releases
2. **Install**:

   ```powershell
   # Option A: Add to PATH
   $env:PATH += ";C:\path\to\tree-util"
   tree-util-win.exe --help

   # Option B: Rename and use directly
   ren tree-util-win.exe tree-util.exe
   .\tree-util.exe --help
   ```

3. **Usage**:
   ```powershell
   tree-util.exe                    # Current directory
   tree-util.exe C:\path\to\folder  # Specific directory
   tree-util.exe -L 2 -s -t        # With options
   ```

### Linux (Bash)

1. **Download**: Get `tree-util-linux` from releases
2. **Install**:

   ```bash
   # Make executable
   chmod +x tree-util-linux

   # Option A: Add to PATH
   sudo mv tree-util-linux /usr/local/bin/tree-util
   tree-util --help

   # Option B: Use directly
   ./tree-util-linux --help
   ```

3. **Usage**:
   ```bash
   tree-util                    # Current directory
   tree-util /path/to/folder    # Specific directory
   tree-util -L 2 -s -t        # With options
   ```

### macOS (Bash/Zsh)

1. **Download**: Get `tree-util-macos` from releases
2. **Install**:

   ```bash
   # Make executable
   chmod +x tree-util-macos

   # Option A: Add to PATH
   sudo mv tree-util-macos /usr/local/bin/tree-util
   tree-util --help

   # Option B: Use directly
   ./tree-util-macos --help
   ```

3. **Usage**:
   ```bash
   tree-util                    # Current directory
   tree-util /path/to/folder    # Specific directory
   tree-util -L 2 -s -t        # With options
   ```

## Building from Source

### Prerequisites

- Bun (only needed for building, not for using the executable)
- Node.js 18+ (only needed for pkg to create standalone executables)

### Build Commands

```bash
# Install dependencies
bun install

# Build TypeScript (ES modules for development)
bun run build

# Build TypeScript (CommonJS for pkg)
bun run build:pkg

# Build standalone executables
bun run build:win      # Windows only
bun run build:linux    # Linux only
bun run build:macos    # macOS only
bun run build:all      # All platforms
```

### Output

The built executables will be in the `bin/` directory:

- `tree-util-win.exe` - Windows executable
- `tree-util-linux` - Linux executable
- `tree-util-macos` - macOS executable

## Features

The standalone executable includes all the same features as the Node.js version:

- Beautiful ASCII tree formatting
- File filtering with pattern matching
- Size and date display
- Depth limiting
- Hidden file control
- Output to file
- Cross-platform compatibility

## Troubleshooting

### Permission Denied (Linux/macOS)

```bash
chmod +x tree-util-linux
# or
chmod +x tree-util-macos
```

### Command Not Found

Make sure the executable is in your PATH or use the full path:

```bash
# Check if in PATH
which tree-util

# Use full path
/path/to/tree-util --help
```

### Windows Execution Policy

If you get execution policy errors in PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## File Sizes

The standalone executables are larger than the source code because they include:

- Node.js runtime
- All dependencies
- TypeScript compiled code

Typical sizes:

- Windows: ~50-60 MB
- Linux: ~45-55 MB
- macOS: ~50-60 MB

This is normal for pkg-generated executables and ensures complete independence from system Node.js installation.

## Advanced Usage

### Custom Installation Locations

**Windows**:

```powershell
# Install to custom location
mkdir C:\Tools\tree-util
copy tree-util-win.exe C:\Tools\tree-util\tree-util.exe
$env:PATH += ";C:\Tools\tree-util"
```

**Linux/macOS**:

```bash
# Install to custom location
sudo mkdir -p /opt/tree-util
sudo cp tree-util-linux /opt/tree-util/tree-util
sudo ln -s /opt/tree-util/tree-util /usr/local/bin/tree-util
```

### Shell Aliases

Add to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
alias tree='tree-util'
alias treed='tree-util -d'      # directories only
alias treef='tree-util -f'      # files only
alias trees='tree-util -s -t'   # with size and time
```

## Support

For issues with the standalone executables:

1. Check that you downloaded the correct version for your platform
2. Ensure the executable has proper permissions
3. Try running with `--help` to verify it works
4. Check the main README.md for usage examples
