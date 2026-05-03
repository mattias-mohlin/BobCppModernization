const fs = require('fs');
const path = require('path');

const sep1 = '----------------------------------------------';
const sep11 = '---------------- ';
const sep12 = ' ----------------';
const sep2 = '==============================================';

// Parse --log=FILE argument
let logFilePath = null;
let logFileStream = null;

for (const arg of process.argv) {
    if (arg.startsWith('--log=')) {
        logFilePath = arg.substring(6);
        if (logFilePath) {
            // Resolve to absolute path
            logFilePath = path.resolve(logFilePath);
            try {
                // Create write stream for the log file (append mode)
                logFileStream = fs.createWriteStream(logFilePath, { flags: 'a' });
                //console.log(`Logging to file: ${logFilePath}`);
            } catch (err) {
                //console.error(`Failed to open log file ${logFilePath}: ${err.message}`);
                logFilePath = null;
            }
        }
        break;
    }
}

// Check if running in MCP mode dynamically (to avoid circular dependency with argv.js)
function getLogOutput() {
    if (logFileStream) {
        // Return a function that writes to the file stream
        return (msg) => {
            logFileStream.write(msg + '\n');
        };
    }
    return process.argv.includes('--mcp') ? console.error : console.log;
}

// Clean up file stream on process exit
if (logFileStream) {
    process.on('exit', () => {
        if (logFileStream) {
            logFileStream.end();
        }
    });
    
    process.on('SIGINT', () => {
        if (logFileStream) {
            logFileStream.end();
        }
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        if (logFileStream) {
            logFileStream.end();
        }
        process.exit(0);
    });
}

module.exports = {

    logSeparator : function(msg) {
        const logOutput = getLogOutput();
		if (msg)
			logOutput(sep11 + msg + sep12);
		else
			logOutput(sep1);
    },
    
    logSeparator2 : function() {
        const logOutput = getLogOutput();
        logOutput(sep2);
    },

    heading : function(msg) {
        return '\n--------------------------\n' + msg + '\n--------------------------\n';
    },

    // Log a message to the test script log
    log : function(msg) {
        const logOutput = getLogOutput();
        logOutput(msg);
    }
    
};

