/**
 * Options for configuring the tree utility
 */
export interface TreeOptions {
  /** Maximum depth to traverse (default: Infinity) */
  maxDepth?: number;
  /** Show hidden files and directories (default: false) */
  showHidden?: boolean;
  /** Show file sizes (default: false) */
  showSize?: boolean;
  /** Show modification dates (default: false) */
  showDate?: boolean;
  /** Patterns to exclude from the tree */
  excludePatterns?: string[];
  /** Patterns to include in the tree */
  includePatterns?: string[];
  /** Sort files and directories (default: true) */
  sort?: boolean;
}

/**
 * File system item information
 */
export interface FileSystemItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number | undefined;
  modifiedTime?: Date | undefined;
}

/**
 * Tree node structure
 */
export interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: TreeNode[];
  size?: number;
  modifiedTime?: Date;
  isLast?: boolean;
  level: number;
}

/**
 * CLI options interface
 */
export interface CLIOptions {
  all?: boolean;
  dirsOnly?: boolean;
  filesOnly?: boolean;
  level?: number;
  size?: boolean;
  time?: boolean;
  ignore?: string[];
  pattern?: string[];
  output?: string;
  sort?: boolean;
}
