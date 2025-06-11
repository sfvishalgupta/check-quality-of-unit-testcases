import fs from "fs";
import { GetJiraTitle } from "./utils/jira";
import { ENV_VARIABLES } from "./environment";
import { askQuestionViaAPI } from "./OpenRouterAICore/services";
import { logger } from "./OpenRouterAICore/pino";
import { getSystemPrompt, getUserPrompt, getProjectDocument, getReportFileContent } from "./utils/prompt";

async function main(): Promise<void> {
  try {
    logger.info("Hello, World! 👋 from github action");

    if (ENV_VARIABLES.REPORT_FILE_PATH.trim() === "") {
      throw new Error(
        "Please provide a valid report file path in the environment variables.",
      );
    }

    const jiraTitle: string = await GetJiraTitle();
    const systemPrompt: string = await getSystemPrompt(
      __dirname + "/prompts/SystemPrompts.txt",
    );
    const projectDocument = await getProjectDocument();
    const reportFileContent = await getReportFileContent(
      process.cwd() + "/" + ENV_VARIABLES.REPORT_FILE_PATH
    );
    let userPrompt: string = await getUserPrompt(
      __dirname + "/prompts/" + ENV_VARIABLES.USE_FOR + ".txt"
    );

    userPrompt = userPrompt.replace("##REPORT##", reportFileContent);
    userPrompt = userPrompt.replace("##PLACEHOLDER##", jiraTitle);
    fs.writeFileSync("prompt.txt", userPrompt);

    const response = await askQuestionViaAPI(
      userPrompt,
      systemPrompt,
      projectDocument,
    );

    if (response) {
      console.log(response);
      const outputFilePath = process.cwd() + "/" + ENV_VARIABLES.OUTPUT_FILE;
      logger.info(`Writing response to file: ${outputFilePath}`);
      fs.writeFileSync(outputFilePath, response, "utf8");
      return response;
    }
    return;
  } catch (error) {
    if (error instanceof Error) {
      logger.info(`❌ Action failed: ${error.message}`);
    } else {
      logger.info(`❌ Action failed: ${String(error)}`);
    }
  }
}

main();
