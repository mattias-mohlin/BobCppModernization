import { readdir } from 'fs/promises';
import { join } from 'path';
import { stat } from 'fs/promises';

/**
 * Scans the TargetRTS config directory for available build target configurations.
 * @param targetRtsRoot - Root directory of TargetRTS
 * @returns Array of target configuration names
 */
export async function scanBuildTargets(targetRtsRoot: string): Promise<string[]> {
  const configDir = join(targetRtsRoot, 'config');
  
  try {
    const entries = await readdir(configDir, { withFileTypes: true });
    
    // Filter to only include directories
    const targets = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
    
    return targets;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Config directory not found: ${configDir}`);
    }
    throw error;
  }
}

/**
 * Validates that a target configuration exists.
 * @param targetRtsRoot - Root directory of TargetRTS
 * @param target - Target configuration name to validate
 * @returns true if target exists, false otherwise
 */
export async function validateTarget(targetRtsRoot: string, target: string): Promise<boolean> {
  const targetPath = join(targetRtsRoot, 'config', target);
  
  try {
    const stats = await stat(targetPath);
    return stats.isDirectory();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

// Made with Bob
