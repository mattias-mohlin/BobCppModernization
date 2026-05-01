# Generate compile_commands.json for TargetRTS

This script generates a `compile_commands.json` file for the TargetRTS C++ codebase, enabling Clangd language server support in VS Code for improved code navigation, IntelliSense, and error detection.

## Prerequisites

- **Node.js** (version 12 or higher)
- **VS Code** with the **Clangd extension** installed

## Installation

No installation required. The script is a standalone Node.js file located in the TargetRTS root directory.

## Usage

Run the script from the TargetRTS root directory:

```bash
node generate-compile-commands.js --target <target-config>
```

### Required Arguments

- `--target <config>` - Target configuration name (must match a folder in the `config/` directory)

### Optional Arguments

- `--output <path>` - Custom output file path (default: `compile_commands.json`)
- `--help`, `-h` - Display help message

## Examples

### Windows with MinGW
```bash
node generate-compile-commands.js --target WinT.x64-MinGw-12.2.0
```

### Linux with GCC
```bash
node generate-compile-commands.js --target LinuxT.x64-gcc-12.x
```

### macOS with Clang
```bash
node generate-compile-commands.js --target MacT.AArch64-Clang-15.x
```

### Custom Output Path
```bash
node generate-compile-commands.js --target WinT.x64-MinGw-12.2.0 --output my-compile-commands.json
```

## Available Target Configurations

Target configurations are defined in the `config/` directory. Common configurations include:

| Target Configuration | Description |
|---------------------|-------------|
| `WinT.x64-MinGw-12.2.0` | Windows, 64-bit, MinGW GCC 12.2.0 |
| `WinT.x64-Clang-16.x` | Windows, 64-bit, Clang 16.x |
| `WinT.x64-VisualC++-17.0` | Windows, 64-bit, Visual C++ 17.0 |
| `WinT.x86-VisualC++-17.0` | Windows, 32-bit, Visual C++ 17.0 |
| `LinuxT.x64-gcc-4.x` | Linux, 64-bit, GCC 4.x |
| `LinuxT.x64-gcc-7.x` | Linux, 64-bit, GCC 7.x |
| `LinuxT.x64-gcc-12.x` | Linux, 64-bit, GCC 12.x |
| `MacT.x64-Clang-14.x` | macOS, 64-bit Intel, Clang 14.x |
| `MacT.AArch64-Clang-15.x` | macOS, ARM64, Clang 15.x |
| `VxWorks7T.simnt-Clang-15.x` | VxWorks 7, Simulator, Clang 15.x |

To see all available configurations, list the subdirectories in the `config/` folder.

## How It Works

The script performs the following steps:

1. **Parses the target configuration** to extract:
   - OS and threading model (e.g., `WinT`, `LinuxT`)
   - Library set (e.g., `x64-MinGw-12.2.0`)

2. **Reads compiler settings** from:
   - `libset/{library_set}/libset.mk` - Compiler command and flags
   - `target/{OS}/target.mk` - OS-specific compiler flags

3. **Scans source files** recursively in the `src/` directory for:
   - `.cc` files (primary)
   - `.cpp` files
   - `.c` files

4. **Builds include paths**:
   - `include/` - Public headers
   - `src/include/` - Private headers
   - `target/{OS}/` - Target-specific headers

5. **Generates compile commands** for each source file with:
   - Absolute paths for all files and directories
   - Complete compiler command with all flags
   - Proper include path directives

6. **Writes `compile_commands.json`** to the workspace root

## Using with VS Code and Clangd

### Initial Setup

1. Install the **Clangd extension** in VS Code:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "clangd"
   - Install the official Clangd extension

2. Disable the default C++ IntelliSense (optional but recommended):
   - Open VS Code settings (Ctrl+,)
   - Search for "C_Cpp.intelliSenseEngine"
   - Set to "Disabled" or "Tag Parser"

### Generate compile_commands.json

Run the script with your target configuration:

```bash
node generate-compile-commands.js --target WinT.x64-MinGw-12.2.0
```

### Reload VS Code

After generating the file:
- Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")
- Or restart the Clangd language server (Ctrl+Shift+P → "clangd: Restart language server")

### Verify It's Working

Open any C++ source file in the `src/` directory. You should now have:
- ✅ Accurate code completion
- ✅ Go to definition (F12)
- ✅ Find all references (Shift+F12)
- ✅ Real-time error detection
- ✅ Hover documentation

## Troubleshooting

### "Could not find TargetRTS workspace structure"

**Cause**: The script is not being run from the TargetRTS root directory.

**Solution**: Navigate to the TargetRTS root directory (the one containing `src/`, `include/`, `config/`, etc.) and run the script from there.

```bash
cd c:/git/rsarte-target-rts/rsa_rt/C++/TargetRTS
node generate-compile-commands.js --target WinT.x64-MinGw-12.2.0
```

### "Target configuration not found"

**Cause**: The specified target name doesn't match any folder in the `config/` directory.

**Solution**: Check the available configurations:
- List directories in `config/` folder
- Ensure the target name matches exactly (case-sensitive)
- Use `--help` to see example target names

### "libset folder not found" warning

**Cause**: The libset folder for the specified library set doesn't exist.

**Impact**: The script will use default compiler settings (g++, C++11).

**Solution**: This is usually fine for basic IntelliSense support. If you need exact compiler settings, verify the libset folder exists or choose a different target configuration.

### Clangd not recognizing the file

**Possible causes and solutions**:

1. **compile_commands.json not in workspace root**
   - Verify the file exists in the TargetRTS root directory
   - Check the output path shown by the script

2. **Clangd not reloaded**
   - Reload VS Code window or restart Clangd language server
   - Close and reopen the source file

3. **Wrong target configuration**
   - Regenerate with the correct target for your development environment
   - Ensure the compiler in the configuration matches your system

4. **Clangd extension not installed**
   - Install the official Clangd extension from the VS Code marketplace

## Configuration Details

### Target Configuration Format

Target configurations follow the naming pattern:
```
{OS}{Threading}.{Arch}-{Compiler}-{Version}
```

Where:
- **OS**: Operating system (Win, Linux, Mac, VxWorks7)
- **Threading**: Threading model (T = multi-threaded)
- **Arch**: Architecture (x64, x86, AArch64, simnt)
- **Compiler**: Compiler toolchain (MinGw, gcc, Clang, VisualC++)
- **Version**: Compiler version (e.g., 12.2.0, 17.0, 12.x)

### Compiler Settings

The script reads compiler settings from makefile variables:

**From `libset/{library_set}/libset.mk`**:
- `CC` - Compiler command (e.g., `g++`, `clang++`)
- `LIBSETCCFLAGS` - Base compiler flags
- `LIBSETCCEXTRA` - Additional compiler flags

**From `target/{OS}/target.mk`**:
- `TARGETCCFLAGS` - OS-specific compiler flags

### Fallback Behavior

If the libset folder is not found, the script uses these defaults:
- **Compiler**: `g++`
- **Flags**: `-std=c++11`

This provides basic IntelliSense support even when exact compiler settings are unavailable.

## Output Format

The generated `compile_commands.json` file contains an array of compilation database entries:

```json
[
  {
    "directory": "/absolute/path/to/TargetRTS",
    "file": "/absolute/path/to/TargetRTS/src/RTAbortController/ct.cc",
    "command": "g++ [flags] -I[includes] -c [source_file]"
  }
]
```

Each entry specifies:
- **directory**: Absolute path to the workspace root
- **file**: Absolute path to the source file
- **command**: Complete compile command as it would be executed

## Script Output

The script provides informative output during execution:

```
Generating compile_commands.json for target: WinT.x64-MinGw-12.2.0
  OS/Threading: WinT
  Library Set: x64-MinGw-12.2.0
  Compiler: g++
  Include paths: 3

Scanning source files...
  Found 1411 source files

Generating compile commands...
  Processed 1411 files

Successfully generated compile_commands.json
Output: C:\git\rsarte-target-rts\rsa_rt\C++\TargetRTS\compile_commands.json
```

## Advanced Usage

### Regenerating for Different Targets

You can regenerate the file for different target configurations as needed:

```bash
# For Windows development
node generate-compile-commands.js --target WinT.x64-MinGw-12.2.0

# For Linux development
node generate-compile-commands.js --target LinuxT.x64-gcc-12.x
```

The file will be overwritten each time, so you only need one configuration active at a time.

### Multiple Workspaces

If you work with multiple TargetRTS workspaces, run the script in each workspace directory to generate a separate `compile_commands.json` for each.

## License

Licensed Materials - Property of HCL and/or IBM

Copyright HCL Technologies Ltd. 2016, 2024. All Rights Reserved.

Copyright IBM Corporation 1999, 2016. All Rights Reserved.

U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule.

## Support

For issues or questions about this script, refer to the implementation plan in `COMPILE_COMMANDS_IMPL_PLAN.md`.