# BobCppModernization
Use of IBM Bob for modernizing old C++ code bases, by developing tools that can work together with Bob for implementing various modernization efforts.

Although some of these tools can work on any C++ code base, they were primarily developed for working with a C++ run-time library, known as the TargetRTS. This library is used in many embedded and cyber physical systems since more than 30 years. Before you can run the tools on that code base, follow these prerequisite [steps](PREREQUISITES.md).

To see the tools in action, see this [video](https://youtu.be/F307KYMUE58).

## Compilation Database Generation for the Clangd Language Server
To be able to work with the C++ code in modern IDEs that use language servers, we need to generate a compilation database. Bob was asked to analyze the code structure of the TargetRTS code base and to generate a Node JS script which can be run to produce such a compilation database for the Clangd language server. The script takes the target configuration as input and computes correct compiler flags based on that. After running the script, C++ files can be edited in the Bob IDE and the Clangd language server will provide code completion, navigation, hover tooltip and similar features expected from a modern IDE.

1. Open the TargetRTS as a workspace folder in Bob. Then open the file `<TARGET-RTS>/src/include/TARGET-MANIFEST.cpp`. Paste this code after the comment:
```cpp
#include "RTBoolean.h"

RTBoolean testBool;
```
2. You should see errors, indicating that Clangd cannot find the file `RTBoolean.h` and the type `RTBoolean`.
3. Run the script [generate-compile-commands.js](compilation_db_generation\generate-compile-commands.js) as described [here](/compilation_db_generation/README.md). If you have a C++ compiler installed you can pick a target configuration that matches it. If not, just pick any target configuration.
4. Restart the Clangd language server from the Command Palette of Bob using the command `clangd: Restart language server`.
5. The errors should now be gone, and you can navigate to `RTBoolean`. A hover tooltip is now also available.

![](/compilation_db_generation/clangd_working.png)

## Improved Documentation
Old code bases typically have poor documentation. And if some documentation exists, it's commonly outdated, inconsistently formatted, or incomplete. Bob supports so called Modes which extend its built-in capabilities with tailored roles for specific tasks. But writing a good Mode definition manually can be lots of work. Instead we can take a different approach: find one header file from the code base with well-written documentation with the desired format (typically Doxygen). Then ask Bob to analyze the header file and generate a corresponding Mode definition. After that we can then use the new Mode to generate consistent documentation on the same format for the entire code base.

1. Create a `.bob` folder at the root of the TargetRTS workspace folder.
2. Copy the generated [Mode definition](/.bob/custom_modes.yaml) into the `.bob` folder.
3. You should now see the "TargetRTS Documentation" Mode in the Mode selection dropdown in the Bob view. If it doesn't immediately appear, restart Bob first. Activate the mode.

![](/doc-generation/doc-mode.png)

4. Open any header file from the TargetRTS which lacks documentation, for example `<TARGET-RTS>/include/RTByteBlock.h`.
5. Ask Bob to generate documentation for the header file. Note that it follows the guidelines provided by the [Mode definition](/.bob/custom_modes.yaml).


## Build MCP Server
Modern build systems like CMake are not always available for old code bases. Instead it's common to see proprietary build scripts which are often not very maintainable. Replacing these old build systems with something more modern is also not always feasible, since applications that use the code base often have customized and extended it. So I instead asked Bob to implement an MCP server which can wrap the existing legacy build system, and make it easier to use from agentic IDEs.

1. Follow [these instructions](/mcp-build-server/README.md) to build the MCP server and to configure Bob to start it.
2. Start a new Bob task and switch to Advanced mode. Type "List TargetRTS build targets". You should see a list of build targets.

![](/mcp-build-server/build-targets.png)

3. If you have C++ build tools and Perl installed, you can also try the other MCP tools to build and clean.


## Modernize Code Base with the C++ Standard Library
Many old code bases were written before the C++ Standard Library was introduced, or supported on necessary target platforms. For example, instead of using standard C++ containers, the code base may have used custom data structures. I asked Bob to create an Architecture Decision Record (ADR) which describes how to modernize the code base with the C++ Standard Library. The result is [here](/adr/001-modernize-data-structures-with-cpp-standard-library.md).

I then asked Bob to implement a proof-of-concept of the ADR for one specific data structure; RTDictionary. After reviewing the [POC](/poc/RTDictionary_POC_README.md), I asked Bob to replace RTDictionary with the new [modern implementation](/poc/RTDictionaryModern.h) based on the C++ Standard Library. 

Finally I verified the new implementation by running the [publically available unit tests](https://github.com/secure-dev-ops/code-realtime/tree/main/art-comp-test/tests) for the TargetRTS. They all passed!

![](/poc/test_results.png)

## Extend Legacy Test System with MCP Server
Old C++ code bases often use proprietary test systems, created long before anyone heard the word "MCP server". I asked Bob to extend such a legacy test system for the TargetRTS library with an MCP server to make it possible to run tests directly from the Bob IDE. This was much more challenging than to create a completely new MCP server (see [Build MCP Server](#build-mcp-server)) since I wanted to keep also the original test system intact. The main problem was that the original test system used `stdout` and `stderr` a lot, which interfers with the MCP server. Bob refactored the test system so it could print all logging to a file instead to make it work.

1. The TargetRTS has a publically available test suite in [this Git repository](https://github.com/secure-dev-ops/code-realtime). Clone it to a local folder. The tests are in the `art-comp-test/tests` folder.
2. The original test system is in the `art-comp-test/runner` folder. The updated version is in [mcp-test-server](mcp-test-server).
3. Follow [these instructions](mcp-test-server/README.md) to build the MCP server and to configure Bob to start it. If you are interested in the details of how Bob changed the test system, see [Bob's generated plan](mcp-test-server/MCP_INTEGRATION_PLAN.md).
4. Below is a sample Bob configuration for running the MCP server. It assumes you have cloned this repository to `c:/bob/git` and the test suite to `c:/bob/git/code-realtime`.

```json
{
  "mcpServers": {
    "test-runner": {
      "command": "node",
      "args": [
        "C:/bob/git/BobCppModernization/mcp-test-server/app.js",
        "--testDir=C:/bob/git/code-realtime/art-comp-test/tests",
        "--targetConfig=WinT.x64-MinGw-12.2.0",
        "--terminateWebServer=never",
        "--testSuiteName=TEST_WITH_MCP_SERVER",
        "--port=4100",
        "--javaVM=C:/openjdk/jdk-21.0.4.7-hotspot/bin/java",
        "--artCompilerJar=c:/Users/USER.NAME/.bobide/extensions/secure-dev-ops.code-realtime-ce-3.3.0-universal/bin/artcompiler.jar",
        "--targetRTSDir=<Target-RTS>",
        "--mcp",
        "--log=C:/bob/mcp_log.txt"
      ],
      "timeout": 3600,
      "disabled": false,
      "alwaysAllow": [],
      "disabledTools": []
    }
  }
}
```

Notes:
* You need to have a Java Runtime Environment (JRE) installed on your machine and the `java` executable in your `PATH`.
* You need to have C++ build tools installed (and in your `PATH`) to build the tests.
* Adjust the `--port` argument to a free port on your machine. You can view test results in the browser at `http://localhost:<port>/`.
* The default timeout is too low (it takes ~20 minutes to run all tests). Set it to the max which is 3600 seconds (1 hour).

5. Start a new task in Bob and type "Run all tests". You should see on the webpage that all tests start to run.

At the end of [this video](https://youtu.be/F307KYMUE58) you can see the MCP server in action, and some examples of more prompts you can try.
