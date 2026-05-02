/*******************************************************************************
 * (c) Copyright HCL Technologies Ltd. 2020. 
 *******************************************************************************/

/**
 * Application entry point
 * @author Mattias Mohlin
 */
'use strict';

const argv = require('./argv');
const strftime = require('strftime');
const webServer = require('./webserver')(argv);
const os = require('os');
const TestCase = require('./testCase')(webServer);
const testCaseRegistry = require('./testCaseRegistry')(TestCase, argv);
const testBuilder = require('./testBuilder')(argv);
const testComparator = require('./testComparator')(argv);
const testRunner = require('./testRunner')(argv);
const logger = require('./logger');
const xmlGenerator = require('./xmlGenerator');
const timer = require('./timer')();
const fs = require('fs-extra');
const path = require('path');

// MCP Server imports (only loaded if --mcp is provided)
let Server, StdioServerTransport, ListToolsRequestSchema, CallToolRequestSchema;
if (argv.mcp) {
    const mcp = require('@modelcontextprotocol/sdk/server/index.js');
    const stdio = require('@modelcontextprotocol/sdk/server/stdio.js');
    const types = require('@modelcontextprotocol/sdk/types.js');
    Server = mcp.Server;
    StdioServerTransport = stdio.StdioServerTransport;
    ListToolsRequestSchema = types.ListToolsRequestSchema;
    CallToolRequestSchema = types.CallToolRequestSchema;
}

const env = process.env.NODE_ENV || 'development';

let exitCode = 0;

// Schedule termination of the application
function terminateApp() {
    setTimeout(() => {
        let timestamp = strftime('%B %d, %Y %H:%M:%S', new Date);
        webServer.notifyClients('terminated', {'timestamp' : timestamp});        
        process.exit(exitCode != 0 ? exitCode : testCaseRegistry.getFailedTests().length);
    }, 500);
}

timer.start((elapsed_time) => {
    webServer.notifyClients('timer_tick', {'elapsed_time' : elapsed_time});
})

// Returns a promise for executing a testing step.
// It's resolved with true if step finished successfully, false if step failed.
function stepExecution(stepName, testCase) {
    if (stepName == 'clean') {
        return cleanTest(testCase);
    }
    if (stepName == 'prepareArtIntegration') {
        return new Promise((resolve) => {
            let verdict = testBuilder.prepareArtIntegration(testCase);
            if (!verdict)
                testCase.errorType = stepName + ' Error';
            resolve(verdict);
        });
    }
    if (stepName.startsWith('generate') || stepName == 'exportArt') {
        return new Promise((resolve, reject) => {
            testBuilder.buildTest(testCase, stepName, (verdict) => {
				if (!verdict)
					testCase.errorType = stepName + ' Error';
                resolve(verdict);
            });
        });
    }
    if (stepName == 'compare') {
        return new Promise((resolve, reject) => {
            testComparator.compareGeneratedFiles(testCase, (verdict) => {
				if (!verdict)
					testCase.errorType = stepName + ' Error';
                resolve(verdict);
            });
        });
    }
    if (stepName.startsWith('execute')) {
        return new Promise((resolve, reject) => {
            testRunner.runTest(testCase, (verdict) => {
				if (!verdict)
					testCase.errorType = stepName + ' Error';
                resolve(verdict);
            });
        });
    }

    // default for non-supported step names
    return new Promise((resolve, reject) => {
        logger.log('WARNING: Step is not supported: ' + stepName);
        resolve(true);
    });
}

// Return a promise for building and running the testcase. It's resolved
// with true if all steps of the testcase passed, false if any of the steps failed.
async function buildAndRunTest(testCase) {
	testCase.setState('Started');
    for (var i = 0; i < testCase.steps.length; i++) {
        let result = await stepExecution(testCase.steps[i], testCase);
        if (result == false) {
            testCase.setVerdict(false);
            testCase.setState('Completed');
            testCase.finished();
            return;
        }
    }
    // all steps passed
    testCase.setVerdict(true);
    testCase.setState('Completed');
    testCase.finished();
	// print logs to console if not many cases or only for sanity test cases
	if (testCaseRegistry.getTestCases().length <= 3 || testCase.name.startsWith('sanity')) {
		logger.logSeparator(testCase.name);
		logger.log(testCase.buildLog);
		if (testCase.testLogStdOut) {
			logger.logSeparator(testCase.name);
			logger.log(testCase.testLogStdOut);
		}
		if (testCase.testLogStdErr) {
			logger.logSeparator(testCase.name);
			logger.log(testCase.testLogStdErr);
		}
	}
}

// Return a promise for cleaning the testcase. It's resolved
// with null if the clean was successful, or otherwise with an error message.
function cleanTest(testCase) {
    return new Promise((resolve, reject) => {
        testBuilder.cleanTest(testCase, (msg) => {
            // Clean completed. If it was successful run the test.        
            resolve(msg);
        });
    });
}

function commonInfo() {
    return new Promise((resolve, reject) => {
        testBuilder.printCommonArgs();
        resolve();
    });
}

// Return a promise for building and running all testcases.
async function buildAndRunAllTests() {
    let testCases = testCaseRegistry.getTestCases().slice();
    logger.logSeparator();
    logger.log('Running total ' + testCases.length + ' tests ...');
    while (testCases.length) {
        // compute next splice size
        let spliceSize = (argv.maxParallel <= testCases.length) ? argv.maxParallel : testCases.length;
        for (var i = 0; i < spliceSize; i++) {
            if (testCases[i].group === 'performance' || testCases[i].isBigTest) {
                spliceSize = (i == 0) ? 1 : i;
                break;
            }
        }

        let testCasesToRun = testCases.splice(0, spliceSize);
        logger.logSeparator();
        logger.log('Running ' + testCasesToRun.length + ' tests ... ' + testCases.length + ' tests awaiting ...');
        await Promise.all(testCasesToRun.map(buildAndRunTest));
    }
}

// Return a promise for cleaning all testcases.
function cleanAllTests() {
    return Promise.all(testCaseRegistry.getTestCases().map(cleanTest));
}

// MCP Server initialization
if (argv.mcp) {
    // In MCP mode, suppress all console output to stdout by redirecting to stderr
    // This must be done before any other code runs
    const originalConsoleLog = console.log;
    console.log = console.error;
    
    const mcpServer = new Server(
        {
            name: 'test-runner',
            version: '1.0.0',
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    // Register available tools
    mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'get_test_data',
                    description: 'Retrieve information about all registered test cases including their status, verdict, and steps',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
                {
                    name: 'run_all_tests',
                    description: 'Execute all registered test cases. Test execution is asynchronous; use get_test_data to check results',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
                {
                    name: 'run_test',
                    description: 'Execute a specific test case by name. Test execution is asynchronous; use get_test_data to check results',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            testCase: {
                                type: 'string',
                                description: 'Name of the test case to run',
                            },
                        },
                        required: ['testCase'],
                    },
                },
                {
                    name: 'get_build_log',
                    description: 'Retrieve the build log for a specific test case',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            testCase: {
                                type: 'string',
                                description: 'Name of the test case',
                            },
                        },
                        required: ['testCase'],
                    },
                },
                {
                    name: 'get_test_log',
                    description: 'Retrieve the test execution log (stdout or stderr) for a specific test case',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            testCase: {
                                type: 'string',
                                description: 'Name of the test case',
                            },
                            stream: {
                                type: 'string',
                                description: 'Log stream to retrieve',
                                enum: ['stdout', 'stderr'],
                            },
                        },
                        required: ['testCase', 'stream'],
                    },
                },
            ],
        };
    });

    // Tool call handler
    mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        try {
            switch (name) {
                case 'get_test_data': {
                    const testCases = testCaseRegistry.getTestCases();
                    const testSuiteName = testCaseRegistry.getTestSuiteName();
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    testSuite: testSuiteName,
                                    testCases: testCases,
                                }, null, 2),
                            },
                        ],
                    };
                }

                case 'run_all_tests': {
                    // Refresh the test case registry in case there were changes
                    testCaseRegistry.deleteAll();
                    testCaseRegistry.registerTestCases();
                    
                    // Start test execution asynchronously
                    timer.start((elapsed_time) => {
                        webServer.notifyClients('timer_tick', {'elapsed_time' : elapsed_time});
                    });
                    
                    buildAndRunAllTests().then(() => {
                        timer.stop();
                        webServer.notifyClients('timer_tick', {'elapsed_time' : timer.getTotalTime()});
                    });

                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Started execution of ${testCaseRegistry.getTestCases().length} test cases. Use get_test_data to check progress and results.`,
                            },
                        ],
                    };
                }

                case 'run_test': {
                    const testCaseName = args.testCase;
                    if (!testCaseName) {
                        throw new Error('Must specify which testcase to run');
                    }

                    const testCase = testCaseRegistry.getTestCase(testCaseName);
                    if (!testCase) {
                        throw new Error('Specified testcase does not exist');
                    }

                    if (!testCase.isFinished()) {
                        throw new Error('This testcase is already running');
                    }

                    testCase.reset();
                    buildAndRunTest(testCase);

                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Started execution of test case '${testCaseName}'. Use get_test_data to check progress and results.`,
                            },
                        ],
                    };
                }

                case 'get_build_log': {
                    const testCaseName = args.testCase;
                    if (!testCaseName) {
                        throw new Error('Must specify which testcase');
                    }

                    const testCase = testCaseRegistry.getTestCase(testCaseName);
                    if (!testCase) {
                        throw new Error('Specified testcase does not exist');
                    }

                    return {
                        content: [
                            {
                                type: 'text',
                                text: testCase.buildLog || 'No build log available',
                            },
                        ],
                    };
                }

                case 'get_test_log': {
                    const testCaseName = args.testCase;
                    const stream = args.stream;

                    if (!testCaseName) {
                        throw new Error('Must specify which testcase');
                    }

                    if (!stream || (stream !== 'stdout' && stream !== 'stderr')) {
                        throw new Error('"stream" parameter must be either "stdout" or "stderr"');
                    }

                    const testCase = testCaseRegistry.getTestCase(testCaseName);
                    if (!testCase) {
                        throw new Error('Specified testcase does not exist');
                    }

                    const testLog = (stream === 'stdout') ? testCase.testLogStdOut : testCase.testLogStdErr;

                    return {
                        content: [
                            {
                                type: 'text',
                                text: testLog || `No ${stream} log available`,
                            },
                        ],
                    };
                }

                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error: ${error.message}`,
                    },
                ],
                isError: true,
            };
        }
    });

    // Initialize test cases for MCP mode (but don't run them yet)
    testBuilder.getCompilerVersions();
    testCaseRegistry.registerTestCases();
    
    // Set up a no-op callback for test completion in MCP mode
    // We don't want to terminate the server when tests finish
    testCaseRegistry.onAllTestsFinished(() => {
        // Do nothing - keep the MCP server running
    });

    // Start MCP server
    const transport = new StdioServerTransport();
    mcpServer.connect(transport).then(() => {
        // MCP server is now running - do NOT log to stdout as it breaks the JSON-RPC protocol
        // The server will communicate via stdin/stdout using JSON-RPC messages only
    }).catch((error) => {
        console.error('Error starting MCP server: ' + error);
        process.exit(1);
    });

    // When running in MCP mode, we ONLY run the MCP server
    // Do not execute the normal test runner startup code below
    // Exit the function here to prevent any further execution
    return;
}
else if (argv.port) {
    // A port is specified. Start the web server.
    webServer.start((app) => {
        // Routes 
        app.get('/getTestData', function(req, res) {
            let testCases = testCaseRegistry.getTestCases();
            let testSuiteName = testCaseRegistry.getTestSuiteName();
            
            res.contentType("text/json");
            res.send(JSON.stringify({testSuite: testSuiteName, testCases : testCases}));
        });

        app.get('/getTotalTime', function(req, res) {    
            res.contentType("text/json");
            res.send(JSON.stringify(timer.getTotalTime()));
        });
        
        // Run all test cases
        app.get('/runAllTests', function(req, res) {    
            // Refresh the test case registry in case there were changes
            testCaseRegistry.deleteAll();
            testCaseRegistry.registerTestCases();
            // Then start all over again (but omit step of building test library)
            webServer.notifyClients('test_execution_started');    
            timer.start((elapsed_time) => {
                webServer.notifyClients('timer_tick', {'elapsed_time' : elapsed_time});
            })
            buildAndRunAllTests().then(() => {
                timer.stop();
                webServer.notifyClients('timer_tick', {'elapsed_time' : timer.getTotalTime()}); // Final timer update for accurracy
                webServer.notifyClients('test_execution_stopped');    
            })
        
            let testCases = testCaseRegistry.getTestCases();
            
            res.contentType("text/json");
            res.send(JSON.stringify(testCases));
        });
        
        // Run a specific testcase
        app.get('/runTest', function(req, res) {    
            let testCaseName = req.query.testCase;
            if (!testCaseName) {
                res.send('Must specify which testcase to run');
                return;
            }
            
            let testCase = testCaseRegistry.getTestCase(testCaseName);
            if (!testCase) {
                res.send('Specified testcase does not exist');
                return;
            }
        
            if (!testCase.isFinished()) {
                res.send('This testcase is already running');
                return;
            }
        
            testCase.reset();
            buildAndRunTest(testCase);
            
            res.send('ok');
        });
        
        // Clean a specific testcase
        app.get('/cleanTest', function(req, res) {    
            let testCaseName = req.query.testCase;
            if (!testCaseName) {
                res.send('Must specify which testcase to clean');
                return;
            }
            
            let testCase = testCaseRegistry.getTestCase(testCaseName);
            if (!testCase) {
                res.send('Specified testcase does not exist');
                return;
            }
        
            if (!testCase.isFinished()) {
                res.send('This testcase cannot currently be cleaned');
                return;
            }
            
            cleanTest(testCase)
            .then((msg) => { 
                if (!msg)
                    msg = 'Test case ' + testCase.name + ' successfully cleaned.';
                webServer.notifyClients('testcase_cleaned', msg);            
            });
            
            res.send('ok');
        });
        
        // Clean all testcases
        app.get('/cleanAllTests', function(req, res) {    
            cleanAllTests().then((results) => {
                let msg = (results.join('') == '') ? 'Successfully cleaned ' + results.length + ' test cases.': results.join(os.EOL);            
                res.send(msg);   
            });
        });
        
        // Return the build log for a test case
        app.get('/buildLog', function(req, res) {
            let testCaseName = req.query.testCase;
            if (!testCaseName) {
                res.send(null);
                return;
            }
        
            let testCase = testCaseRegistry.getTestCase(testCaseName);
            if (!testCase) {
                res.send(null);
                return;
            }
            res.contentType("text/plain");
            res.send(testCase.buildLog);
        });
        
        // Return the test log for a test case
        app.get('/testLog', function(req, res) {
            let testCaseName = req.query.testCase;
            if (!testCaseName) {
                res.send(null);
                return;
            }
            let testCase = testCaseRegistry.getTestCase(testCaseName);
            if (!testCase) {
                res.send(null);
                return;
            }
        
            let stream = req.query.stream;
            if (!stream || stream != 'stdout' && stream != 'stderr') {
                res.send('"stream" parameter missing. Should be either stdout or stderr!');
                return;
            }
            let testLog = (stream == 'stdout') ? testCase.testLogStdOut : testCase.testLogStdErr;
        
            res.contentType("text/plain");
            res.send(testLog);
        });
        
        // Terminate the web server
        app.get('/terminate', function(req, res) {
            terminateApp();
            res.end();
        });

    });

}

// Only run the normal test execution flow if NOT in MCP mode
if (!argv.mcp) {
    testBuilder.getCompilerVersions();

    // Read tests
    testCaseRegistry.registerTestCases();
    testCaseRegistry.onAllTestsFinished( () => {
    });

    webServer.notifyClients('test_execution_started');

    commonInfo()
    .then(() => {
        return buildAndRunAllTests();
    })
    .catch((err) => {
        logger.log('Error when building or running tests: ' + err);
        exitCode = -1;
    })
    .finally(() => {
    // All tests have finished.
    timer.stop();
    webServer.notifyClients('timer_tick', {'elapsed_time' : timer.getTotalTime()}); // Final timer update for accurracy
    webServer.notifyClients('test_execution_stopped');

    logger.logSeparator2();
    let failedTests = testCaseRegistry.getFailedTests();    
    let finishedTests = testCaseRegistry.getFinishedTests();

    logger.log(`Ran a total of ${finishedTests.length} tests in ${timer.getTotalTimeStr()}`);
    if (failedTests.length == 0 && finishedTests.length == testCaseRegistry.getTestCases().length) {
        // No failures and all were run
        logger.log('All tests passed!');
    } 
    else if (failedTests.length > 0) {
        logger.log(failedTests.length + ' tests failed:');        
        logger.log(failedTests.map((t) => { return t.name + os.EOL; } ).join(''));
    }

    if (argv.genXML) {
        xmlGenerator.writeXML(testCaseRegistry, argv, timer);
    }

    if (!webServer.isStarted() || argv.terminateWebServer == 'always' ||
        (argv.terminateWebServer == 'ifNoFailures' && failedTests.length == 0)) {
        terminateApp();
    }
    else {
        logger.log(`View test execution result at http://${argv.hostname}:${argv.port}`);
    }
    });
}
