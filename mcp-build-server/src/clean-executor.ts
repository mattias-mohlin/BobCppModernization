import { rm } from 'fs/promises';
import { join } from 'path';
import { access } from 'fs/promises';

export interface CleanResult {
  success: boolean;
  message: string;
  directoryDeleted: boolean;
}

/**
 * Cleans build artifacts for a specified target configuration by deleting the build directory.
 * @param targetRtsRoot - Root directory of TargetRTS
 * @param target - Target configuration name
 * @returns Promise resolving to clean result
 */
export async function cleanBuildArtifacts(
  targetRtsRoot: string,
  target: string
): Promise<CleanResult> {
  const buildDir = join(targetRtsRoot, `build-${target}`);
  
  console.error(`\n=== Cleaning Build Artifacts ===`);
  console.error(`Target: ${target}`);
  console.error(`Build directory: ${buildDir}`);
  console.error(`================================\n`);

  try {
    // Check if directory exists
    await access(buildDir);
    
    // Directory exists, delete it
    console.error(`Deleting build directory...`);
    await rm(buildDir, { recursive: true, force: true });
    
    console.error(`\n=== Clean Completed Successfully ===`);
    console.error(`Deleted: build-${target}/`);
    console.error(`====================================\n`);
    
    return {
      success: true,
      message: `Successfully cleaned build artifacts for target: ${target}`,
      directoryDeleted: true
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Directory doesn't exist - not an error
      console.error(`\n=== Clean Completed ===`);
      console.error(`Build directory does not exist (already clean)`);
      console.error(`=======================\n`);
      
      return {
        success: true,
        message: `Build directory for target ${target} does not exist (already clean)`,
        directoryDeleted: false
      };
    }
    
    // Other error occurred
    console.error(`\n=== Clean Failed ===`);
    console.error(`Error: ${(error as Error).message}`);
    console.error(`====================\n`);
    
    return {
      success: false,
      message: `Failed to clean build artifacts: ${(error as Error).message}`,
      directoryDeleted: false
    };
  }
}

// Made with Bob
