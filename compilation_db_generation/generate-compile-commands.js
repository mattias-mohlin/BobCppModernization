#!/usr/bin/env node

/**
 * Generate compile_commands.json for TargetRTS C++ codebase
 * 
 * This script generates a compile_commands.json file for Clangd language server support.
 * It reads compiler settings from target configuration files and scans all source files.
 * 
 * Usage: node generate-compile-commands.js --target <target-config>
 * Example: node generate-compile-commands.js --target WinT.x64-MinGw-12.2.0
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArguments(args) {
  const result = {
    target: null,
    output: 'compile_commands.json',
    help: false
  };

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--target' && i + 1 < args.length) {
      result.target = args[i + 1];
      i++;
    } else if (arg === '--output' && i + 1 < args.length) {
      result.output = args[i + 1];
      i++;
    }
  }

  return result;
}

function showHelp() {
  console.log(`
Usage: node generate-compile-commands.js --target <target-config> [options]

Generate compile_commands.json for Clangd language server support.

Required Arguments:
  --target <config>    Target configuration name (e.g., WinT.x64-MinGw-12.2.0)

Optional Arguments:
  --output <path>      Output file path (default: compile_commands.json)
  --help, -h          Display this help message

Examples:
  node generate-compile-commands.js --target WinT.x64-MinGw-12.2.0
  node generate-compile-commands.js --target LinuxT.x64-gcc-12.x
  node generate-compile-commands.js --target MacT.AArch64-Clang-15.x --output custom.json
`);
}

// ============================================================================
// Workspace Validation
// ============================================================================

function validateWorkspace(workspaceDir) {
  const requiredDirs = ['src', 'include', 'config', 'target', 'libset'];
  const missingDirs = [];

  for (const dir of requiredDirs) {
    const dirPath = path.join(workspaceDir, dir);
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      missingDirs.push(dir);
    }
  }

  if (missingDirs.length > 0) {
    console.error(`Error: Could not find TargetRTS workspace structure.`);
    console.error(`Missing directories: ${missingDirs.join(', ')}`);
    console.error(`Please run this script from the TargetRTS root directory.`);
    return false;
  }

  return true;
}

// ============================================================================
// Target Configuration Parsing
// ============================================================================

function parseTargetConfig(targetName) {
  const dotIndex = targetName.indexOf('.');
  
  if (dotIndex === -1) {
    throw new Error(`Invalid target format: ${targetName}. Expected format: {OS}{Threading}.{Arch}-{Compiler}-{Version}`);
  }

  const osThreading = targetName.substring(0, dotIndex);
  const librarySet = targetName.substring(dotIndex + 1);

  return {
    targetName,
    osThreading,
    librarySet
  };
}

function validateTargetConfig(workspaceDir, config) {
  const errors = [];
  const warnings = [];

  // Check config directory
  const configDir = path.join(workspaceDir, 'config', config.targetName);
  if (!fs.existsSync(configDir)) {
    errors.push(`Target configuration '${config.targetName}' not found in config/ directory.`);
  }

  // Check target directory - try to find the actual folder name
  // The osThreading might be "WinT.x64" but folder is "WinT"
  // Try exact match first, then try variations
  const targetDirCandidates = [
    config.osThreading,  // Try exact match first (e.g., "WinT.x64")
    config.osThreading.split('.')[0],  // Try without architecture (e.g., "WinT")
    config.osThreading.toLowerCase(),  // Try lowercase
    config.osThreading.split('.')[0].toLowerCase()  // Try lowercase without arch
  ];
  
  let targetDir = null;
  for (const candidate of targetDirCandidates) {
    const candidatePath = path.join(workspaceDir, 'target', candidate);
    if (fs.existsSync(candidatePath)) {
      targetDir = candidatePath;
      // Update config with the actual folder name found
      config.actualOsThreading = candidate;
      break;
    }
  }
  
  if (!targetDir) {
    errors.push(`Target folder for '${config.osThreading}' not found in target/ directory. Tried: ${targetDirCandidates.join(', ')}`);
  }

  // Check libset directory (warning only)
  const libsetDir = path.join(workspaceDir, 'libset', config.librarySet);
  if (!fs.existsSync(libsetDir)) {
    warnings.push(`libset folder '${config.librarySet}' not found. Using default compiler settings (g++, C++11).`);
  }

  return { errors, warnings };
}

// ============================================================================
// Makefile Parsing
// ============================================================================

function parseMakeFile(filePath) {
  const variables = {};

  if (!fs.existsSync(filePath)) {
    return variables;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

  let currentVar = null;
  let currentValue = '';

    for (let line of lines) {
    line = line.trim();

    // Skip comments and empty lines
    if (line.startsWith('#') || line === '') {
      continue;
    }

    // Check for variable assignment
      const match = line.match(/^(\w+)\s*=\s*(.*)$/);
    if (match) {
      // Save previous variable if exists
      if (currentVar) {
        variables[currentVar] = currentValue.trim();
      }

      currentVar = match[1];
      currentValue = match[2];

      // Check for line continuation
      if (currentValue.endsWith('\\')) {
        currentValue = currentValue.slice(0, -1) + ' ';
      } else {
        variables[currentVar] = currentValue.trim();
        currentVar = null;
        currentValue = '';
      }
    } else if (currentVar && line.endsWith('\\')) {
      // Continuation line
      currentValue += line.slice(0, -1) + ' ';
    } else if (currentVar) {
      // Last line of multi-line value
      currentValue += line;
      variables[currentVar] = currentValue.trim();
      currentVar = null;
      currentValue = '';
    }
    }

    // Save last variable if exists
    if (currentVar) {
      variables[currentVar] = currentValue.trim();
    }
  } catch (error) {
    // Return empty variables object on read error (permissions, encoding, etc.)
    return variables;
  }

  return variables;
}

function expandMakeVariables(value) {
  const expansions = {
    '$(DEFINE_TAG)': '-D',
    '$(LIB_TAG)': '-l',
    '$(CC)': 'g++',
    '$(DEBUG_TAG)': '',  // Empty for release builds, can be set to -g for debug
  };

  let result = value;
  for (const [variable, expansion] of Object.entries(expansions)) {
    const regex = new RegExp(variable.replace(/[()$]/g, '\\$&'), 'g');
    result = result.replace(regex, expansion);
  }

  // Clean up any remaining unexpanded variables (remove them)
  result = result.replace(/\$\([^)]+\)/g, '');
  
  // Clean up multiple spaces
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

// ============================================================================
// Configuration Loading
// ============================================================================

function loadLibsetConfig(workspaceDir, librarySet) {
  const libsetMkPath = path.join(workspaceDir, 'libset', librarySet, 'libset.mk');
  const variables = parseMakeFile(libsetMkPath);

  // Extract compiler and flags
  const config = {
    compiler: variables.CC || 'g++',
    libsetCCFlags: variables.LIBSETCCFLAGS || '',
    libsetCCExtra: variables.LIBSETCCEXTRA || '',
    found: fs.existsSync(libsetMkPath)
  };

  // If libset not found, use defaults
  if (!config.found) {
    config.compiler = 'g++';
    config.libsetCCFlags = '-std=c++11';
    config.libsetCCExtra = '';
  }

  // Expand makefile variables in flags
  config.libsetCCFlags = expandMakeVariables(config.libsetCCFlags);
  config.libsetCCExtra = expandMakeVariables(config.libsetCCExtra);

  return config;
}

function loadTargetConfig(workspaceDir, osThreading) {
  const targetMkPath = path.join(workspaceDir, 'target', osThreading, 'target.mk');
  const variables = parseMakeFile(targetMkPath);

  // Extract target-specific flags
  const config = {
    targetCCFlags: variables.TARGETCCFLAGS || '',
    found: fs.existsSync(targetMkPath)
  };

  // Expand makefile variables
  if (config.targetCCFlags) {
    config.targetCCFlags = expandMakeVariables(config.targetCCFlags);
  }

  return config;
}

// ============================================================================
// Source File Scanning
// ============================================================================

function scanSourceFiles(srcDir) {
  const sourceFiles = [];
  const sourceExtensions = ['.cc', '.cpp', '.c'];

  function scanDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (sourceExtensions.includes(ext)) {
            sourceFiles.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dir}: ${error.message}`);
    }
  }

  scanDirectory(srcDir);
  return sourceFiles;
}

// ============================================================================
// Include Path Building
// ============================================================================

function buildIncludePaths(workspaceDir, osThreading) {
  const includePaths = [];

  // Add main include directory
  const includeDir = path.join(workspaceDir, 'include');
  if (fs.existsSync(includeDir)) {
    includePaths.push(includeDir);
  }

  // Add src/include directory
  const srcIncludeDir = path.join(workspaceDir, 'src', 'include');
  if (fs.existsSync(srcIncludeDir)) {
    includePaths.push(srcIncludeDir);
  }

  // Add target-specific include directory from target/ folder
  // This folder uses exact OS name (e.g., "WinT", "LinuxT", "MacT")
  const targetIncludeDir = path.join(workspaceDir, 'target', osThreading);
  if (fs.existsSync(targetIncludeDir)) {
    includePaths.push(targetIncludeDir);
  }

  // Add target-specific include directory from src/target/ folder
  // This folder uses lowercase OS name without T (e.g., "win", "linux", "mac")
  // Try multiple variations to find the correct folder
  const srcTargetCandidates = [];
  
  // Strip trailing T and convert to lowercase
  let osName = osThreading;
  if (osName.endsWith('T')) {
    osName = osName.slice(0, -1);
  }
  osName = osName.toLowerCase();
  
  // Add candidates in priority order
  srcTargetCandidates.push(osName);  // e.g., "win", "linux", "mac"
  srcTargetCandidates.push(osThreading.toLowerCase());  // e.g., "wint" (fallback)
  srcTargetCandidates.push(osThreading);  // e.g., "WinT" (original, for special cases)
  
  // Try to find the src/target subfolder
  for (const candidate of srcTargetCandidates) {
    const srcTargetDir = path.join(workspaceDir, 'src', 'target', candidate);
    if (fs.existsSync(srcTargetDir)) {
      includePaths.push(srcTargetDir);
      break;  // Only add the first match
    }
  }

  // Convert to absolute paths with forward slashes
  return includePaths.map(p => path.resolve(p).replace(/\\/g, '/'));
}

// ============================================================================
// Compile Command Generation
// ============================================================================

function generateCompileCommand(workspaceDir, compilerConfig, includePaths, sourceFile) {
  const absoluteSourceFile = path.resolve(sourceFile).replace(/\\/g, '/');
  const absoluteWorkspaceDir = path.resolve(workspaceDir).replace(/\\/g, '/');

  // Build the command parts
  const commandParts = [
    compilerConfig.compiler,
    compilerConfig.mingwTargetFlag,  // Add MinGW target flag if present
    compilerConfig.libsetCCFlags,
    compilerConfig.libsetCCExtra,
    compilerConfig.targetCCFlags
  ].filter(part => part && part.trim() !== '');

  // Add include paths
  const includeFlags = includePaths.map(p => `-I${p}`);
  commandParts.push(...includeFlags);

  // Add compile flag and source file
  commandParts.push('-c', absoluteSourceFile);

  // Join command parts
  const command = commandParts.join(' ');

  return {
    directory: absoluteWorkspaceDir,
    file: absoluteSourceFile,
    command: command
  };
}

function generateCompileCommands(workspaceDir, compilerConfig, includePaths, sourceFiles) {
  const commands = [];

  for (const sourceFile of sourceFiles) {
    const command = generateCompileCommand(workspaceDir, compilerConfig, includePaths, sourceFile);
    commands.push(command);
  }

  return commands;
}

// ============================================================================
// JSON Output
// ============================================================================

function writeCompileCommands(outputPath, commands) {
  const json = JSON.stringify(commands, null, 2);
  fs.writeFileSync(outputPath, json, 'utf-8');
}

// ============================================================================
// Main Function
// ============================================================================

function main() {
  try {
    // Parse arguments
    const args = parseArguments(process.argv);

    if (args.help) {
      showHelp();
      process.exit(0);
    }

    if (!args.target) {
      console.error('Error: --target argument is required.\n');
      showHelp();
      process.exit(1);
    }

    // Get workspace directory
    const workspaceDir = process.cwd();

    // Validate workspace
    if (!validateWorkspace(workspaceDir)) {
      process.exit(1);
    }

    // Parse target configuration
    console.log(`Generating compile_commands.json for target: ${args.target}`);
    const targetConfig = parseTargetConfig(args.target);
    console.log(`  OS/Threading: ${targetConfig.osThreading}`);
    console.log(`  Library Set: ${targetConfig.librarySet}`);

    // Validate target configuration
    const validation = validateTargetConfig(workspaceDir, targetConfig);
    
    if (validation.errors.length > 0) {
      console.error('\nErrors:');
      validation.errors.forEach(err => console.error(`  - ${err}`));
      process.exit(1);
    }

    if (validation.warnings.length > 0) {
      console.warn('\nWarnings:');
      validation.warnings.forEach(warn => console.warn(`  - ${warn}`));
    }

    // Load configurations
    const libsetConfig = loadLibsetConfig(workspaceDir, targetConfig.librarySet);
    const targetMkConfig = loadTargetConfig(workspaceDir, targetConfig.actualOsThreading || targetConfig.osThreading);

    console.log(`  Compiler: ${libsetConfig.compiler}${libsetConfig.found ? '' : ' (default)'}`);

    // Detect MinGW configuration and add target flag
    let mingwTargetFlag = '';
    if (targetConfig.librarySet.includes('MinGw') || targetConfig.librarySet.includes('mingw')) {
      mingwTargetFlag = '--target=x86_64-w64-mingw32';
      console.log(`  MinGW detected: Adding ${mingwTargetFlag}`);
    }

    // Combine compiler configuration
    const compilerConfig = {
      compiler: libsetConfig.compiler,
      mingwTargetFlag: mingwTargetFlag,
      libsetCCFlags: libsetConfig.libsetCCFlags,
      libsetCCExtra: libsetConfig.libsetCCExtra,
      targetCCFlags: targetMkConfig.targetCCFlags
    };

    // Build include paths using the actual folder name that was found
    const includePaths = buildIncludePaths(workspaceDir, targetConfig.actualOsThreading || targetConfig.osThreading);
    console.log(`  Include paths: ${includePaths.length}`);

    // Scan source files
    console.log('\nScanning source files...');
    const srcDir = path.join(workspaceDir, 'src');
    const sourceFiles = scanSourceFiles(srcDir);
    console.log(`  Found ${sourceFiles.length} source files`);

    if (sourceFiles.length === 0) {
      console.warn('Warning: No source files found in src/ directory.');
      process.exit(1);
    }

    // Generate compile commands
    console.log('\nGenerating compile commands...');
    const commands = generateCompileCommands(workspaceDir, compilerConfig, includePaths, sourceFiles);
    console.log(`  Processed ${commands.length} files`);

    // Write output
    const outputPath = path.resolve(workspaceDir, args.output);
    writeCompileCommands(outputPath, commands);

    console.log(`\nSuccessfully generated ${args.output}${validation.warnings.length > 0 ? ' (with warnings)' : ''}`);
    console.log(`Output: ${outputPath}`);

  } catch (error) {
    console.error(`\nError: ${error.message}`);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Entry point
if (require.main === module) {
  main();
}

module.exports = {
  parseArguments,
  parseTargetConfig,
  parseMakeFile,
  expandMakeVariables,
  loadLibsetConfig,
  loadTargetConfig,
  scanSourceFiles,
  buildIncludePaths,
  generateCompileCommand,
  generateCompileCommands
};

// Made with Bob
