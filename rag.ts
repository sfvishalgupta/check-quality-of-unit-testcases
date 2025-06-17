import fs from "fs";
import { GetJiraTitle } from "./utils/jira";
import { ENV_VARIABLES } from "./environment";
import { GetStore } from "./OpenRouterAICore/store/utils";
import {
    getUserPrompt,
    getProjectDocument,
    getReportFileContent
} from "./utils/prompt";
import { logger } from "./OpenRouterAICore/pino";

async function main(): Promise<string> {
    const outputFilePath = process.cwd() + "/" + ENV_VARIABLES.OUTPUT_FILE;
    let response = "";
    try {
        if (ENV_VARIABLES.REPORT_FILE_PATH.trim() === "") {
            throw new Error(
                "Please provide a valid report file path in the environment variables.",
            );
        }

        const jiraTitle: string = await GetJiraTitle();
        const projectDocument = await getProjectDocument();
        const store = GetStore();
        await store.addDocument(
            ENV_VARIABLES.JIRA_PROJECT_KEY + "-index",
            projectDocument
        );

        let userPrompt: string = await getUserPrompt();
        userPrompt = userPrompt.replace("##PLACEHOLDER##", jiraTitle.replace('{', ''));

        const reportFileContent = await getReportFileContent(
            process.cwd() + "/" + ENV_VARIABLES.REPORT_FILE_PATH
        );
        userPrompt = userPrompt.replace("##REPORT##", reportFileContent);
        userPrompt = userPrompt.split('{').join('');
        userPrompt = userPrompt.split('}').join('');

        fs.writeFileSync("prompt.txt", userPrompt);
        logger.info(`Getting Response from URL :- ${ENV_VARIABLES.OPEN_ROUTER_API_URL}`);
        const modelNames = ENV_VARIABLES.OPEN_ROUTER_MODEL.split(",");
        for (const modelName of modelNames) {
            logger.info(`Getting Response Model :- ${modelName}`);
            response += `# Response Model:- ${modelName} \n`
            response += await store.generate(
                modelName.trim(),
                ENV_VARIABLES.JIRA_PROJECT_KEY + "-index",
                userPrompt
            );
            response+= "\n\n\n =================================\n";
        }

        if (response) {
            console.log(response);
            logger.info(`✅ Writing response to file: ${outputFilePath}`);
            fs.writeFileSync(outputFilePath, response, "utf8");
        }
    } catch (error) {
        if (error instanceof Error) {
            response = `❌ Action failed: ${error.message}`;
        } else {
            response = `❌ Action failed: ${String(error)}`;
        }
        fs.writeFileSync(outputFilePath, response, "utf8");
        logger.error(response);
    } finally {
        // Do not return from finally block
    }

    return response;
}

main();
