import fs from "fs";
import { GetJiraTitle } from "./utils/jira";
import { ENV_VARIABLES } from "./environment";
import { getDocumentContent } from "./OpenRouterAICore/utils";
import { askQuestionViaAPI } from "./OpenRouterAICore/services";

async function getSystemPrompt(): Promise<string> {
  try {
    const systemPromptPath = __dirname + "/prompts/SystemPrompts.txt";
    if (!fs.existsSync(systemPromptPath)) {
      throw new Error(`System prompt file not found at ${systemPromptPath}`);
    }
    return getDocumentContent(systemPromptPath);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading system prompt: ${error.message}`);
    } else {
      console.error(`Error reading system prompt: ${String(error)}`);
    }
    throw error; // Re-throw the error for further handling
  }
}

/** 
 * This function is the entry point for the OpenRouterAI example.
 */
async function getUserPrompt(): Promise<string> {
  try {
    const userPromptPath =
      __dirname + "/prompts/" + ENV_VARIABLES.USE_FOR + ".txt";
    if (!fs.existsSync(userPromptPath)) {
      throw new Error(`User prompt file not found at ${userPromptPath}`);
    }
    return getDocumentContent(userPromptPath);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading user prompt: ${error.message}`);
    } else {
      console.error(`Error reading user prompt: ${String(error)}`);
    }
    throw error; // Re-throw the error for further handling
  }
}

async function getProjectDocument(): Promise<string> {
  try {
    let content = "";
    const projectDocumentPath =
      process.cwd() + "/" + ENV_VARIABLES.PROJECT_DOCUMENT_PATH;
    const listOfFiles: string[] = projectDocumentPath.split(",");
    for (const filepath of listOfFiles) {
      try {
        if (!fs.existsSync(filepath)) {
          throw new Error(
            `Project document file not found at ${projectDocumentPath}`,
          );
        }
        content += await getDocumentContent(projectDocumentPath);
      } catch (e) {
        if (e instanceof Error) {
          console.log(`Project document file not found at ${filepath}`);
        } else {
          console.error(`Error reading project document: ${String(e)}`);
        }
      }
    }
    return content;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading project document: ${error.message}`);
    } else {
      console.error(`Error reading project document: ${String(error)}`);
    }
    throw error; // Re-throw the error for further handling
  }
}

async function getReportFilePath(): Promise<string> {
  try {
    const reportFilePath = process.cwd() + "/" + ENV_VARIABLES.REPORT_FILE_PATH;
    if (!fs.existsSync(reportFilePath)) {
      throw new Error(`Report file not found at ${reportFilePath}`);
    }
    return reportFilePath;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading report file path: ${error.message}`);
    } else {
      console.error(`Error reading report file path: ${String(error)}`);
    }
    throw error; // Re-throw the error for further handling
  }
}

async function run(): Promise<void> {
  try {
    console.log("Hello, World! 👋 from github action");

    if (ENV_VARIABLES.REPORT_FILE_PATH.trim() === "") {
      throw new Error(
        "Please provide a valid report file path in the environment variables.",
      );
    }

    const jiraTitle: string = await GetJiraTitle();
    const systemPrompt: string = await getSystemPrompt();
    const projectDocument = await getProjectDocument();
    const reportFileContent = await getReportFilePath();
    let userPrompt: string = await getUserPrompt();

    userPrompt = userPrompt.replace("##REPORT##", reportFileContent);
    userPrompt = userPrompt.replace("##PLACEHOLDER##", jiraTitle);

    const response = await askQuestionViaAPI(
      userPrompt,
      systemPrompt,
      projectDocument,
    );
    if (response) {
      console.log("Response from API:", response);
    }

    const outputFilePath = process.cwd() + "/" + ENV_VARIABLES.OUTPUT_FILE;
    console.log(`Writing response to file: ${outputFilePath}`);
    fs.writeFileSync(outputFilePath, response, "utf8");

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Action failed: ${error.message}`);
    } else {
      console.log(`Action failed: ${String(error)}`);
    }
  }
}

run();
