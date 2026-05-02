const sep1 = '----------------------------------------------';
const sep11 = '---------------- ';
const sep12 = ' ----------------';
const sep2 = '==============================================';

// Check if running in MCP mode dynamically (to avoid circular dependency with argv.js)
function getLogOutput() {
    return process.argv.includes('--mcp') ? console.error : console.log;
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

