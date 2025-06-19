/**
 * Main entry point for the RAG (Retrieval-Augmented Generation) workflow.
 *
 * This function orchestrates the following steps:
 * 1. Validates the presence of a report file path in environment variables.
 * 2. Retrieves the Jira ticket title and project documentation.
 * 3. Adds the project document to the vector store for retrieval.
 * 4. Prepares a user prompt by injecting the Jira title and report content.
 * 5. Writes the prepared prompt to a file for debugging or logging purposes.
 * 6. Iterates over the configured LLM model names, generating responses for each,
 *    and aggregates the results.
 * 7. Writes the final response(s) to an output file and logs the process.
 * 8. Handles errors gracefully, writing error messages to the output file and logging them.
 *
 * @returns {Promise<string>} The aggregated response from all models, or an error message.
 */
import fs from 'fs';
import { GetJiraTitle, GetUserPrompt, GetProjectDocument, GetReportFileContent } from './utils';
import { ENV_VARIABLES } from './environment';
import { GetStore } from './OpenRouterAICore/store/utils';
import { logger } from './OpenRouterAICore/pino';

async function main(): Promise<string> {
    const outputFilePath = process.cwd() + '/' + ENV_VARIABLES.OUTPUT_FILE;
    let response = '';
    try {
        if (ENV_VARIABLES.REPORT_FILE_PATH.trim() === '') {
            throw new Error('Please provide a valid report file path in the environment variables.');
        }

        const jiraTitle: string = await GetJiraTitle();
        const projectDocument = await GetProjectDocument();
        const store = GetStore();
        await store.addDocument(ENV_VARIABLES.JIRA_PROJECT_KEY + '-index', projectDocument);

        let userPrompt: string = await GetUserPrompt();
        userPrompt = userPrompt.replace('##PLACEHOLDER##', jiraTitle.replace('{', ''));

        const reportFileContent = await GetReportFileContent(process.cwd() + '/' + ENV_VARIABLES.REPORT_FILE_PATH);
        userPrompt = userPrompt.replace('##REPORT##', reportFileContent);
        userPrompt = userPrompt.split('{').join('');
        userPrompt = userPrompt.split('}').join('');

        fs.writeFileSync('prompt.txt', userPrompt);
        logger.info(`Getting Response from URL :- ${ENV_VARIABLES.OPEN_ROUTER_API_URL}`);
        const modelNames = ENV_VARIABLES.OPEN_ROUTER_MODEL.split(',');
        for (const modelName of modelNames) {
            logger.info(`Getting Response Model :- ${modelName}`);
            response += `# Response Model:- ${modelName} \n`;
            response += await store.generate(modelName.trim(), ENV_VARIABLES.JIRA_PROJECT_KEY + '-index', userPrompt);
            response += '\n\n\n =================================\n';
        }

        if (response) {
            console.log(response);
            logger.info(`✅ Writing response to file: ${outputFilePath}`);
            fs.writeFileSync(outputFilePath, response, 'utf8');
        }
    } catch (error) {
        if (error instanceof Error) {
            response = `❌ Action failed: ${error.message}`;
        } else {
            response = `❌ Action failed: ${String(error)}`;
        }
        fs.writeFileSync(outputFilePath, response, 'utf8');
        logger.error(response);
    } finally {
        // Do not return from finally block
    }

    return response;
}

main();
