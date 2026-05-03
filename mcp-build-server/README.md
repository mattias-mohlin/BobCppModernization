# TargetRTS Build MCP Server

An MCP (Model Context Protocol) server that provides tools for building the TargetRTS library from source code. This server enables automated builds through a standardized interface with real-time output streaming.

## Overview

This MCP server provides three tools for managing TargetRTS builds:

1. **list_build_targets** - List all available target configurations
2. **build_targetrts** - Build TargetRTS for a specific target configuration
3. **clean_build_artifacts** - Clean build artifacts for a target configuration

## Installation

### Prerequisites

- Node.js (version 20 or higher)
- TypeScript
- perl (must be in PATH; see [here ](https://www.perl.org/get.html) if you don't have Perl already installed)
- TargetRTS source code

### Setup

1. Navigate to the MCP server directory:
   ```bash
   cd mcp-build-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the server:
   ```bash
   npm run build
   ```

4. The server is now ready to use. The compiled JavaScript is in the `build/` directory.

## Configuration

The MCP server can be configured in Bob's settings file. On Windows the default location is:
`C:\Users\USER.NAME\.bob\settings\mcp_settings.json`

Alternatively, you can create a file `.bob/mcp.json` in the root of your workspace folder.

The example below assumes you have cloned this repository to `c:/bob/git`:

Configuration:
```json
{
  "mcpServers": {
    "targetrts-build": {
      "command": "node",
      "args": [
        "c:/bob/git/BobCppModernization/mcp-build-server/build/index.js"
      ],
      "env": {
        "TARGETRTS_ROOT": "<Target-RTS>"
      },
      "disabled": false,
      "alwaysAllow": [],
      "disabledTools": []
    }
  }
}
```

### Environment Variables

- **TARGETRTS_ROOT** (required): Absolute path to the TargetRTS root directory (the folder containing `src/`, `config/`, `include/` subdirectories)

## Available Tools

### 1. list_build_targets

Lists all available target configurations by scanning the `config/` directory.

**Parameters**: None

**Example Usage**:
```
"What TargetRTS build targets are available?"
"List available build configurations"
```

**Example Output**:
```
Available build targets:
- WinT.x64-MinGw-12.2.0
- WinT.x64-Clang-16.x
- LinuxT.x64-gcc-12.x
- MacT.AArch64-Clang-15.x
- VxWorks7T.simnt-Clang-15.x

Total: 5 targets
```

### 2. build_targetrts

Builds the TargetRTS library for a specified target configuration.

**Parameters**:
- `target` (required): Target configuration name (must match a folder in `config/`)
- `build_command` (optional): Build command to pass to Build.pl (default: "make all")

**Build Process**:
1. Validates that the target exists in the `config/` directory
2. Changes to the `src/` directory
3. Executes: `perl Build.pl <target> <build_command>`
4. Streams build output to the console in real-time
5. Returns build status

**Example Usage**:
```
"Build TargetRTS for Windows MinGW"
"Compile TargetRTS using WinT.x64-MinGw-12.2.0"
"Build TargetRTS for target LinuxT.x64-gcc-12.x"
```

### 3. clean_build_artifacts

Cleans build artifacts for a specified target configuration by deleting the `build-<target>` directory.

**Parameters**:
- `target` (required): Target configuration name

**Cleaning Process**:
1. Validates that the target exists in the `config/` directory
2. Locates the `build-<target>` directory
3. Deletes the entire directory if it exists
4. Reports success or if the directory didn't exist

**Example Usage**:
```
"Clean build artifacts for Windows MinGW"
"Delete build files for LinuxT.x64-gcc-12.x"
"Clean the build for WinT.x64-MinGw-12.2.0"
```

## Usage Examples

### Example 1: List and Build

```
User: "What TargetRTS targets are available?"
Bob: [Uses list_build_targets]
     Available build targets:
     - WinT.x64-MinGw-12.2.0
     - LinuxT.x64-gcc-12.x
     ...

User: "Build TargetRTS for Windows MinGW"
Bob: [Uses build_targetrts with target: "WinT.x64-MinGw-12.2.0"]
     [Build output streams to console]
     Build completed successfully for target: WinT.x64-MinGw-12.2.0
```

### Example 2: Clean and Rebuild

```
User: "Clean and rebuild TargetRTS for Linux GCC"
Bob: [Uses clean_build_artifacts with target: "LinuxT.x64-gcc-12.x"]
     Successfully cleaned build artifacts for target: LinuxT.x64-gcc-12.x
     
     [Uses build_targetrts with target: "LinuxT.x64-gcc-12.x"]
     [Build output streams to console]
     Build completed successfully for target: LinuxT.x64-gcc-12.x
```

### Project Structure

```
mcp-build-server/
├── package.json              # Node.js project configuration
├── tsconfig.json            # TypeScript compiler configuration
├── README.md                # This file
├── src/
│   ├── index.ts            # Main MCP server entry point
│   ├── config-scanner.ts   # Target configuration scanner
│   ├── build-executor.ts   # Build command executor
│   └── clean-executor.ts   # Build artifact cleaner
└── build/                   # Compiled JavaScript output
    └── index.js            # Compiled server entry point
```

### Building from Source

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run watch
```

### Testing

To test the server manually:

1. Start the server from a terminal:
   ```bash
   cd mcp-build-server
   node build/index.js
   ```

2. The server will wait for MCP protocol messages on stdin

3. Or test through Bob by asking questions like:
   - "List TargetRTS build targets"
   - "Build TargetRTS for WinT.x64-MinGw-12.2.0"

## Technical Details

### MCP Protocol

The server implements the Model Context Protocol (MCP) using:
- **Transport**: Stdio (stdin/stdout)
- **SDK**: @modelcontextprotocol/sdk
- **Schema Validation**: Zod

### Build Execution

- Uses Node.js `child_process.spawn()` to execute rtperl
- Configures stdio as `['ignore', 'inherit', 'inherit']` for real-time output
- Captures exit codes for success/failure detection
- Runs in the `src/` directory of TargetRTS

### Target Discovery

- Scans the `config/` directory using `fs.readdir()`
- Filters for directories only
- Returns sorted list of target names

### Artifact Cleanup

- Deletes `build-<target>` directory using `fs.rm()` with recursive option
- Handles case where directory doesn't exist (not an error)
- Provides detailed feedback on cleanup operations

## License

MIT

## Support

For issues or questions about this MCP server, refer to the implementation plan in `MCP_BUILD_SERVER_IMPL_PLAN.md`.
