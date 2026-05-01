# BobCppModernization
Use of IBM BOB for modernizing old C++ code bases

## Compilation Database Generation for the Clangd Language Server
To be able to work with the C++ code in modern IDEs that use language servers, we need to generate a compilation database. BOB analyzed the code structure of the code base and generated a Node JS script which can be run to produce such a compilation database. The script takes the target configuration as input and computes correct compiler flags based on that.

[More information here.](/compilation_db_generation/README.md)

## Improved Documentation






