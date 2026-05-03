import { spawn } from 'child_process';
import { join } from 'path';

export interface BuildResult {
  success: boolean;
  exitCode: number;
  message: string;
  output: string[];
}

/**
 * Executes the TargetRTS build process for a specified target configuration.
 * @param targetRtsRoot - Root directory of TargetRTS
 * @param target - Target configuration name
 * @param buildCommand - Build command to execute (default: "make all")
 * @returns Promise resolving to build result
 */
export async function executeBuild(
  targetRtsRoot: string,
  target: string,
  buildCommand: string = 'make all'
): Promise<BuildResult> {
  const srcDir = join(targetRtsRoot, 'src');
  
  console.error(`\n=== Building TargetRTS ===`);
  console.error(`Target: ${target}`);
  console.error(`Command: perl Build.pl ${target} ${buildCommand}`);
  console.error(`Working directory: ${srcDir}`);
  console.error(`===========================\n`);

  return new Promise((resolve) => {
    const outputLines: string[] = [];
    
    const buildProcess = spawn('perl', ['Build.pl', target, ...buildCommand.split(' ')], {
      cwd: srcDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      windowsHide: false
    });

    // Capture stdout line by line
    buildProcess.stdout?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.error(line);
          outputLines.push(line);
        }
      });
    });

    // Capture stderr line by line
    buildProcess.stderr?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.error(line);
          outputLines.push(line);
        }
      });
    });

    buildProcess.on('error', (error) => {
      console.error(`\nBuild process error: ${error.message}\n`);
      resolve({
        success: false,
        exitCode: -1,
        message: `Failed to start build process: ${error.message}`,
        output: outputLines
      });
    });

    buildProcess.on('close', (code) => {
      const exitCode = code ?? -1;
      const success = exitCode === 0;
      
      console.error(`\n=== Build ${success ? 'Completed Successfully' : 'Failed'} ===`);
      console.error(`Exit code: ${exitCode}`);
      console.error(`===========================\n`);

      resolve({
        success,
        exitCode,
        message: success
          ? `Build completed successfully for target: ${target}`
          : `Build failed for target: ${target} (exit code: ${exitCode})`,
        output: outputLines
      });
    });
  });
}

// Made with Bob
