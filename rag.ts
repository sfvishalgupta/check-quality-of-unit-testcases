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

async function main(): Promise<void> {
    const outputFilePath = process.cwd() + "/" + ENV_VARIABLES.OUTPUT_FILE;
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

        let userPrompt: string = await getUserPrompt(
            __dirname + "/prompts/" + ENV_VARIABLES.USE_FOR + ".txt"
        );

        userPrompt = userPrompt.replace("##PLACEHOLDER##", jiraTitle.replace('{', ''));

        const reportFileContent = await getReportFileContent(
            process.cwd() + "/" + ENV_VARIABLES.REPORT_FILE_PATH
        );
        userPrompt = userPrompt.replace("##REPORT##", reportFileContent);
        userPrompt = userPrompt.split('{').join('');
        userPrompt = userPrompt.split('}').join('');

        fs.writeFileSync("prompt.txt", userPrompt);
        logger.info(`Getting Response from URL :- ${ENV_VARIABLES.OPEN_ROUTER_API_URL}`);
        logger.info(`Getting Response Model :- ${ENV_VARIABLES.OPEN_ROUTER_MODEL}`);
        const response = await store.generate(
            ENV_VARIABLES.JIRA_PROJECT_KEY + "-index",
            userPrompt
        );

        if (response) {
            console.log(response);
            logger.info(`✅ Writing response to file: ${outputFilePath}`);
            fs.writeFileSync(outputFilePath, response, "utf8");
            return response;
        }
    } catch (error) {
        let response = null;
        if (error instanceof Error) {
            response = `❌ Action failed: ${error.message}`; 
            logger.error(`❌ Action failed: ${error.message}`);
        } else {
            response = `❌ Action failed: ${String(error)}`; 
        }
        fs.writeFileSync(outputFilePath, response, "utf8");
        logger.error(response);
    }
}

main();
