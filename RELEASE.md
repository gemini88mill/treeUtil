# Release Guide

This guide explains how to create releases for TreeUtil using GitHub Actions.

## Automated Release Process

The project uses GitHub Actions to automatically build and release standalone executables when you create a version tag.

### How to Create a Release

1. **Update Version**

   ```bash
   # Update version in package.json
   # Example: "version": "1.0.1"
   ```

2. **Commit Changes**

   ```bash
   git add .
   git commit -m "Release v1.0.1"
   git push origin main
   ```

3. **Create and Push Tag**

   ```bash
   # Create a version tag
   git tag v1.0.1
   git push origin v1.0.1
   ```

4. **GitHub Actions Takes Over**
   - The release workflow automatically triggers
   - Builds executables for Windows, Linux, and macOS
   - Creates a GitHub release with all binaries
   - Uploads executables as release assets

### What Happens Automatically

1. **Build Process**:

   - Sets up Bun and Node.js on all platforms
   - Installs dependencies with `bun install`
   - Builds TypeScript to CommonJS with `bun run build:pkg`
   - Creates standalone executables with pkg

2. **Release Creation**:

   - Extracts version from the tag
   - Creates a GitHub release with the tag name
   - Generates release notes with download links
   - Uploads all platform executables

3. **Output Files**:
   - `tree-util-win.exe` - Windows executable
   - `tree-util-linux` - Linux executable
   - `tree-util-macos` - macOS executable

## Manual Release (Alternative)

If you prefer to create releases manually:

1. **Build Locally**

   ```bash
   bun run build:all
   ```

2. **Create GitHub Release**
   - Go to your repo → Releases → "Create a new release"
   - Tag version: `v1.0.1`
   - Upload files from `bin/` folder
   - Write release notes

## Release Workflow Details

### Triggers

- **Automatic**: When you push a tag starting with `v` (e.g., `v1.0.0`)
- **Manual**: Use "Actions" tab → "Release" → "Run workflow"

### Build Matrix

The workflow builds on three platforms simultaneously:

- `windows-latest` → `tree-util-win.exe`
- `ubuntu-latest` → `tree-util-linux`
- `macos-latest` → `tree-util-macos`

### Artifacts

- Each platform creates an artifact with its executable
- All artifacts are collected and uploaded to the release
- Artifacts are retained for 30 days

## Version Numbering

Follow semantic versioning:

- **Major** (`v2.0.0`): Breaking changes
- **Minor** (`v1.1.0`): New features, backward compatible
- **Patch** (`v1.0.1`): Bug fixes, backward compatible

## Pre-release Versions

For pre-release versions, use tags like:

- `v1.1.0-beta.1`
- `v1.1.0-rc.1`
- `v2.0.0-alpha.1`

The workflow will automatically mark these as pre-releases.

## Troubleshooting

### Build Failures

- Check the Actions tab for build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation works locally

### Missing Executables

- Check that `bun run build:pkg` works locally
- Verify pkg configuration in `package.json`
- Ensure all build scripts are correct

### Release Not Created

- Verify the tag starts with `v`
- Check that the tag was pushed to the repository
- Look at the Actions tab for workflow status

## CI/CD Integration

The project also includes a CI workflow (`.github/workflows/ci.yml`) that:

- Runs tests on every push and pull request
- Builds and tests executables on all platforms
- Ensures code quality before releases

## Security

- Uses `GITHUB_TOKEN` for release creation
- No additional secrets required
- All builds run in isolated environments

## Performance

- Parallel builds on all platforms
- Efficient artifact handling
- Fast Bun-based dependency installation
- Compressed executables with GZip

## User Experience

Users can:

1. Go to the Releases page
2. Download the appropriate executable for their platform
3. Use immediately without installing Node.js or dependencies

The release notes automatically include:

- Installation instructions
- Usage examples
- Links to documentation
