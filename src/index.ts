import path from "path";
import { readdir } from "fs/promises";
import { TreeOptions, FileSystemItem } from "./types.js";

/**
 * Tree utility class for generating tree-formatted lists from file system paths
 */
export class TreeUtil {
  private options: Required<TreeOptions>;

  constructor(options: TreeOptions = {}) {
    this.options = {
      maxDepth: options.maxDepth ?? Infinity,
      showHidden: options.showHidden ?? false,
      showSize: options.showSize ?? false,
      showDate: options.showDate ?? false,
      excludePatterns: options.excludePatterns ?? [],
      includePatterns: options.includePatterns ?? [],
      sort: options.sort ?? true,
    };
  }

  /**
   * Generate a tree structure from a given path
   * @param rootPath - The root path to generate tree from
   * @returns The formatted tree string
   */
  public async generateTree(rootPath: string): Promise<string> {
    const absolutePath = path.resolve(rootPath);
    const file = Bun.file(absolutePath);

    if (!(await file.exists())) {
      throw new Error(`Path does not exist: ${rootPath}`);
    }

    const stats = await file.stat();
    if (!stats.isDirectory()) {
      return this.formatFile(absolutePath, "", true);
    }

    return this.formatDirectory(absolutePath, "", true, 0);
  }

  /**
   * Format a directory entry for the tree
   * @param dirPath - Directory path
   * @param prefix - Current prefix for indentation
   * @param isLast - Whether this is the last item at this level
   * @param depth - Current depth level
   * @returns Formatted directory string
   */
  private async formatDirectory(
    dirPath: string,
    prefix: string = "",
    isLast: boolean = true,
    depth: number = 0
  ): Promise<string> {
    const dirName = path.basename(dirPath);
    let result = `${prefix}${isLast ? "└── " : "├── "}${dirName}/\n`;

    // Check if we've reached max depth
    if (depth >= this.options.maxDepth) {
      return result;
    }

    try {
      const items = await this.getDirectoryItems(dirPath);
      const filteredItems = await this.filterItems(items, dirPath);

      if (filteredItems.length === 0) {
        return result;
      }

      const newPrefix = prefix + (isLast ? "    " : "│   ");

      for (let i = 0; i < filteredItems.length; i++) {
        const item = filteredItems[i]!;
        const itemPath = path.join(dirPath, item);
        const isLastItem = i === filteredItems.length - 1;

        try {
          const file = Bun.file(itemPath);
          const stats = await file.stat();
          if (stats.isDirectory()) {
            result += await this.formatDirectory(
              itemPath,
              newPrefix,
              isLastItem,
              depth + 1
            );
          } else {
            result += await this.formatFile(itemPath, newPrefix, isLastItem);
          }
        } catch (error) {
          // Skip items that can't be accessed
          continue;
        }
      }
    } catch (error) {
      // Directory can't be read, return just the directory name
    }

    return result;
  }

  /**
   * Format a file entry for the tree
   * @param filePath - File path
   * @param prefix - Current prefix for indentation
   * @param isLast - Whether this is the last item at this level
   * @returns Formatted file string
   */
  private async formatFile(
    filePath: string,
    prefix: string = "",
    isLast: boolean = true
  ): Promise<string> {
    const fileName = path.basename(filePath);
    let result = `${prefix}${isLast ? "└── " : "├── "}${fileName}`;

    if (this.options.showSize || this.options.showDate) {
      try {
        const file = Bun.file(filePath);
        const stats = await file.stat();
        const details: string[] = [];

        if (this.options.showSize) {
          details.push(this.formatSize(stats.size));
        }

        if (this.options.showDate) {
          details.push(stats.mtime.toISOString().split("T")[0]!);
        }

        if (details.length > 0) {
          result += ` [${details.join(", ")}]`;
        }
      } catch (error) {
        // Skip size/date if can't access file
      }
    }

    return result + "\n";
  }

  /**
   * Get directory items (files and folders)
   * @param dirPath - Directory path
   * @returns Array of item names
   */
  private async getDirectoryItems(dirPath: string): Promise<string[]> {
    const dir = Bun.file(dirPath);
    if (!(await dir.exists()) || !(await dir.stat()).isDirectory()) {
      return [];
    }

    // Use fs/promises readdir for directory listing (Bun doesn't have a native readdir)
    return await readdir(dirPath);
  }

  /**
   * Filter items based on options
   * @param items - Array of item names
   * @param parentPath - Parent directory path
   * @returns Filtered array of item names
   */
  private async filterItems(
    items: string[],
    parentPath: string
  ): Promise<string[]> {
    let filteredItems = items.filter((item) => {
      // Skip hidden files if not showing hidden
      if (!this.options.showHidden && item.startsWith(".")) {
        return false;
      }

      const itemPath = path.join(parentPath, item);

      // Check exclude patterns
      for (const pattern of this.options.excludePatterns) {
        if (this.matchesPattern(itemPath, pattern)) {
          return false;
        }
      }

      // Check include patterns (if any are specified)
      if (this.options.includePatterns.length > 0) {
        const matches = this.options.includePatterns.some((pattern) =>
          this.matchesPattern(itemPath, pattern)
        );
        if (!matches) {
          return false;
        }
      }

      return true;
    });

    // Sort items if sorting is enabled
    if (this.options.sort) {
      // For async sorting, we need to collect stats first
      const itemsWithStats = await Promise.all(
        filteredItems.map(async (item) => {
          const itemPath = path.join(parentPath, item);
          try {
            const file = Bun.file(itemPath);
            const stats = await file.stat();
            return { item, isDirectory: stats.isDirectory() };
          } catch (error) {
            return { item, isDirectory: false };
          }
        })
      );

      filteredItems = itemsWithStats
        .sort((a, b) => {
          // Sort directories first, then alphabetically
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.item.localeCompare(b.item);
        })
        .map(({ item }) => item);
    }

    return filteredItems;
  }

  /**
   * Check if a path matches a pattern
   * @param itemPath - Item path to check
   * @param pattern - Pattern to match against
   * @returns Whether the path matches the pattern
   */
  private matchesPattern(itemPath: string, pattern: string): boolean {
    // Simple glob-like pattern matching
    if (pattern.includes("*")) {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      return regex.test(itemPath);
    }

    return itemPath.includes(pattern);
  }

  /**
   * Format file size in human-readable format
   * @param bytes - Size in bytes
   * @returns Formatted size string
   */
  private formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  /**
   * Get file system items for a directory
   * @param dirPath - Directory path
   * @returns Array of file system items
   */
  public async getFileSystemItems(dirPath: string): Promise<FileSystemItem[]> {
    const items: FileSystemItem[] = [];

    try {
      const itemNames = await this.getDirectoryItems(dirPath);
      const filteredItems = await this.filterItems(itemNames, dirPath);

      for (const item of filteredItems) {
        const itemPath = path.join(dirPath, item!);
        try {
          const file = Bun.file(itemPath);
          const stats = await file.stat();
          items.push({
            name: item,
            path: itemPath,
            isDirectory: stats.isDirectory(),
            size: stats.isFile() ? stats.size : undefined,
            modifiedTime: stats.mtime,
          });
        } catch (error) {
          // Skip items that can't be accessed
        }
      }
    } catch (error) {
      // Directory can't be read
    }

    return items;
  }

  /**
   * Generate tree with custom options
   * @param rootPath - The root path to generate tree from
   * @param options - Options for tree generation
   * @returns The formatted tree string
   */
  public static async generate(
    rootPath: string,
    options: TreeOptions = {}
  ): Promise<string> {
    const treeUtil = new TreeUtil(options);
    return await treeUtil.generateTree(rootPath);
  }
}

export default TreeUtil;
