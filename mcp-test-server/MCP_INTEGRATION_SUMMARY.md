# MCP Server Integration - Summary of Changes

## Issue Fixed
**Problem:** `StdioServerTransport is not a constructor` error when starting with `--mcp` flag.

**Root Cause:** `StdioServerTransport` was being imported from the wrong module. It's exported from `@modelcontextprotocol/sdk/server/stdio.js`, not from `@modelcontextprotocol/sdk/server/index.js`.

**Solution:** Updated the import statement in `app.js` to correctly import `StdioServerTransport` from the stdio module.

## Files Modified

### 1. package.json
- Added dependency: `"@modelcontextprotocol/sdk": "^1.0.4"`

### 2. argv.js
- Added `--mcp` command-line option (boolean, default: false)
- Description: "Start MCP (Model Context Protocol) server for programmatic access to test execution."

### 3. app.js
**Imports (lines 26-35):**
```javascript
// MCP Server imports (only loaded if --mcp is provided)
let Server, StdioServerTransport, ListToolsRequestSchema, CallToolRequestSchema;
if (argv.mcp) {
    const mcp = require('@modelcontextprotocol/sdk/server/index.js');
    const stdio = require('@modelcontextprotocol/sdk/server/stdio.js');  // FIXED: Import from stdio module
    const types = require('@modelcontextprotocol/sdk/types.js');
    Server = mcp.Server;
    StdioServerTransport = stdio.StdioServerTransport;  // FIXED: Use stdio.StdioServerTransport
    ListToolsRequestSchema = types.ListToolsRequestSchema;
    CallToolRequestSchema = types.CallToolRequestSchema;
}
```

**MCP Server Initialization (lines 169-420):**
- Creates MCP server instance when `--mcp` flag is provided
- Registers two request handlers:
  - `ListToolsRequestSchema`: Returns list of available tools
  - `CallToolRequestSchema`: Handles tool execution
- Implements 5 tools:
  1. `get_test_data` - Get all test cases with status
  2. `run_all_tests` - Execute all tests
  3. `run_test` - Execute specific test
  4. `get_build_log` - Get build log for a test
  5. `get_test_log` - Get test log (stdout/stderr)
- Connects to stdio transport for MCP communication

### 4. README.md
- Added comprehensive "MCP Server Mode" section
- Documented all 5 MCP tools with parameters and return values
- Provided usage examples
- Included MCP client configuration example

### 5. Test Files Created
- `test-mcp.js` - Unit tests for MCP SDK imports and initialization
- `verify-mcp-startup.js` - Verification script for app.js startup with --mcp

### 6. Documentation Created
- `MCP_INTEGRATION_PLAN.md` - Detailed implementation plan
- `MCP_INTEGRATION_SUMMARY.md` - This file

## How to Use

### Start MCP Server Only
```bash
node app.js --testDir=../tests --targetConfig=WinT.x64-MinGw-12.2.0 --javaVM=C:/openjdk/jdk-21.0.4.7-hotspot/bin/java --artCompilerJar=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/bin/artcompiler.jar --targetRTSDir=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/TargetRTS --mcp
```

### Start Both Web Server and MCP Server
```bash
node app.js --testDir=../tests --targetConfig=WinT.x64-MinGw-12.2.0 --javaVM=C:/openjdk/jdk-21.0.4.7-hotspot/bin/java --artCompilerJar=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/bin/artcompiler.jar --targetRTSDir=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/TargetRTS --port=4444 --mcp
```

### Configure MCP Client (e.g., Cline)
Add to your MCP client settings:
```json
{
  "mcpServers": {
    "test-runner": {
      "command": "node",
      "args": [
        "c:/git/rtistic-pub-doc/art-comp-test/runner/app.js",
        "--testDir=../tests",
        "--targetConfig=WinT.x64-MinGw-12.2.0",
        "--javaVM=C:/openjdk/jdk-21.0.4.7-hotspot/bin/java",
        "--artCompilerJar=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/bin/artcompiler.jar",
        "--targetRTSDir=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/TargetRTS",
        "--mcp"
      ]
    }
  }
}
```

## MCP Tools Available

### 1. get_test_data
**Purpose:** Retrieve information about all registered test cases  
**Parameters:** None  
**Returns:** JSON with test suite name and array of test cases

### 2. run_all_tests
**Purpose:** Execute all registered test cases  
**Parameters:** None  
**Returns:** Confirmation message  
**Note:** Execution is asynchronous; use `get_test_data` to check progress

### 3. run_test
**Purpose:** Execute a specific test case  
**Parameters:**
- `testCase` (string, required): Name of test case to run

**Returns:** Confirmation message  
**Note:** Execution is asynchronous; use `get_test_data` to check results

### 4. get_build_log
**Purpose:** Retrieve build log for a test case  
**Parameters:**
- `testCase` (string, required): Name of test case

**Returns:** Plain text build log

### 5. get_test_log
**Purpose:** Retrieve test execution log  
**Parameters:**
- `testCase` (string, required): Name of test case
- `stream` (string, required): Either "stdout" or "stderr"

**Returns:** Plain text log content

## Testing

All tests pass successfully:
```bash
node test-mcp.js              # ✅ Passed
node verify-mcp-startup.js    # ✅ Passed
```

## Benefits

1. **Programmatic Access:** Run tests without opening web browser
2. **IDE Integration:** Use tests directly from development tools via MCP
3. **Automation:** Easier integration with CI/CD pipelines through MCP clients
4. **Flexibility:** Can run MCP server alone or alongside web server
5. **Consistency:** Same test execution logic as web interface

## Architecture

The MCP server:
- Uses stdio transport for communication with MCP clients
- Shares the same test execution infrastructure as the web server
- Only initializes when `--mcp` flag is provided (backward compatible)
- Can run independently or alongside the web server
- Provides asynchronous test execution with status polling

## Notes

- MCP server and web server can run simultaneously without conflicts
- Both interfaces share the same test state and execution logic
- Test execution is asynchronous; clients must poll for results
- The MCP server uses the Model Context Protocol standard for communication