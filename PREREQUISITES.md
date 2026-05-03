### Install Bob and necessary extensions
1. If you don't already have IBM Bob, download and install it from [here](https://bob.ibm.com/).
2. Install the [Code RealTime - Community Edition](https://open-vsx.org/extension/secure-dev-ops/code-realtime-ce) extension into Bob.
3. Install the [Clangd](https://open-vsx.org/extension/llvm-vs-code-extensions/vscode-clangd) extension into Bob.

### Locate the TargetRTS C++ library
1. Go to the location where Bob stores installed extensions. On Windows it's by default `c:\Users\USER.NAME\.bobide\extensions\`.
2. Find the folder for the Code RealTime extension you installed above. The exact name of the folder depends on the current version of the extension, and at the time of writing it was `secure-dev-ops.code-realtime-ce-3.3.0-universal`.
3. Inside that folder, locate the folder named `TargetRTS`. Copy this folder to a different location and take note of the path. In later steps this path is referred to as `<TARGET-RTS>`.

Now you are ready to follow the [README](README.md) guide to run various Bob-created tools on the TargetRTS.

[!NOTE]  
    The Community Edition of Code RealTime only contains the API (i.e. C++ header files) of the TargetRTS (the source code is part of the Commercial Edition). But you can still run the Bob-generated tools on it. You can see the behavior when the tools are run on the full TargetRTS in [this video](https://youtu.be/F307KYMUE58).

