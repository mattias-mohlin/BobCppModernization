# BobCppModernization
Use of IBM BOB for modernizing old C++ code bases.

## Compilation Database Generation for the Clangd Language Server
To be able to work with the C++ code in modern IDEs that use language servers, we need to generate a compilation database. I asked BOB to analyze the code structure of the code base and generate a Node JS script which can be run to produce such a compilation database for the Clangd language server. The script takes the target configuration as input and computes correct compiler flags based on that. After running the script, C++ files can be edited in the IDE and the Clangd language server will provide code completion, navigation, hover tooltip and all other features expected from a modern IDE.

[More information here](/compilation_db_generation/README.md)

## Improved Documentation
Old code bases typically have poor documentation. And if some documentation exists, it's commonly outdated, inconsistently formatted, or incomplete. BOB supports so called Modes which extend its built-in capabilities with tailored roles for specific tasks. But writing a good Mode definition manually can be lots of work. I therefore took a different approach: I found one header file from the code base with well-written documentation with the desired format (Doxygen). I then asked BOB to analyze the header file and generate a Mode definition for me. After that I can then use the new Mode to generate consistent documentation on the same format for the entire code base.

[Generated BOB Mode definition](/.bob/custom_modes.yaml)

## Build MCP Server
Modern build systems like CMake are not always available for old code bases. Instead it's common to see proprietary build scripts which are often not very maintainable. Replacing these old build systems with something more modern is also not always feasible, since applications that use the code base may have customized and extended it. So I decided to ask BOB to implement an MCP server which can wrap the existing legacy build system, and make it easier to use from agentic IDEs.

[More information here](/mcp-build-server/README.md)







