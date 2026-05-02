#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { scanBuildTargets, validateTarget } from './config-scanner.js';
import { executeBuild } from './build-executor.js';
import { cleanBuildArtifacts } from './clean-executor.js';

// Get TargetRTS root from environment variable or use default
const TARGETRTS_ROOT = process.env.TARGETRTS_ROOT || 'c:/git/rsarte-target-rts/rsa_rt/C++/TargetRTS';

console.error('TargetRTS Build MCP Server starting...');
console.error(`TargetRTS Root: ${TARGETRTS_ROOT}`);

// Define tool schemas
const ListBuildTargetsSchema = z.object({});

const BuildTargetRTSSchema = z.object({
  target: z.string().describe('Target configuration name (must match a folder in config/)'),
  build_command: z.string().optional().default('make all').describe('Build command to pass to Build.pl (default: "make all")'),
});

const CleanBuildArtifactsSchema = z.object({
  target: z.string().describe('Target configuration name'),
});

// Create server instance
const server = new Server(
  {
    name: 'targetrts-build-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: 'list_build_targets',
    description: 'List all available target configurations for building TargetRTS. Scans the config/ directory and returns available build targets.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'build_targetrts',
    description: 'Build the TargetRTS library for a specified target configuration. Executes rtperl Build.pl with the selected target and streams output to console.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target configuration name (must match a folder in config/)',
        },
        build_command: {
          type: 'string',
          description: 'Build command to pass to Build.pl (default: "make all")',
          default: 'make all',
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'clean_build_artifacts',
    description: 'Clean build artifacts for a specified target configuration by deleting the build-<target> directory.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target configuration name',
        },
      },
      required: ['target'],
    },
  },
];

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_build_targets': {
        ListBuildTargetsSchema.parse(args);
        
        const targets = await scanBuildTargets(TARGETRTS_ROOT);
        
        return {
          content: [
            {
              type: 'text',
              text: `Available build targets:\n${targets.map(t => `- ${t}`).join('\n')}\n\nTotal: ${targets.length} targets`,
            },
          ],
        };
      }

      case 'build_targetrts': {
        const parsed = BuildTargetRTSSchema.parse(args);
        
        // Validate target exists
        const isValid = await validateTarget(TARGETRTS_ROOT, parsed.target);
        if (!isValid) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Target configuration '${parsed.target}' not found in config/ directory.\n\nUse list_build_targets to see available targets.`,
              },
            ],
            isError: true,
          };
        }
        
        // Execute build
        const result = await executeBuild(TARGETRTS_ROOT, parsed.target, parsed.build_command);
        
        // Format output with line-by-line build output
        let outputText = `${result.message}\nExit code: ${result.exitCode}`;
        
        if (result.output.length > 0) {
          outputText += '\n\n=== Build Output ===\n';
          outputText += result.output.join('\n');
        }
        
        return {
          content: [
            {
              type: 'text',
              text: outputText,
            },
          ],
          isError: !result.success,
        };
      }

      case 'clean_build_artifacts': {
        const parsed = CleanBuildArtifactsSchema.parse(args);
        
        // Validate target exists
        const isValid = await validateTarget(TARGETRTS_ROOT, parsed.target);
        if (!isValid) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Target configuration '${parsed.target}' not found in config/ directory.\n\nUse list_build_targets to see available targets.`,
              },
            ],
            isError: true,
          };
        }
        
        // Clean build artifacts
        const result = await cleanBuildArtifacts(TARGETRTS_ROOT, parsed.target);
        
        let message = result.message;
        if (result.directoryDeleted) {
          message += `\nDeleted: build-${parsed.target}/`;
        }
        
        return {
          content: [
            {
              type: 'text',
              text: message,
            },
          ],
          isError: !result.success,
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: 'text',
            text: `Invalid arguments: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          },
        ],
        isError: true,
      };
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('TargetRTS Build MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Made with Bob
