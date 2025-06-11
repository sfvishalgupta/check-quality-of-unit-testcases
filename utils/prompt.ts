import fs from "fs";
import { getDocumentContent } from "../OpenRouterAICore/utils";
import { ENV_VARIABLES } from "../environment";
import { downloadFileFromS3 } from "./S3Util";
import { logger } from "../OpenRouterAICore/pino";

export function getSystemPrompt(systemPromptPath: string): Promise<string> {
    if (!fs.existsSync(systemPromptPath)) {
        throw new Error(`System prompt file not found at ${systemPromptPath}`);
    }
    return getDocumentContent(systemPromptPath);
}

/** 
 * This function is the entry point for the OpenRouterAI example.
 */
export function getUserPrompt(userPromptPath: string): Promise<string> {
    logger.info("Reading User Prompt file from:- " + userPromptPath);
    if (!fs.existsSync(userPromptPath)) {
        throw new Error(`User prompt file not found at ${userPromptPath}`);
    }
    return getDocumentContent(userPromptPath);
}

export async function getProjectDocument(): Promise<string> {
    let content: string = "";
    const projectDocumentPath: string = ENV_VARIABLES.PROJECT_DOCUMENT_PATH;
    const listOfFiles: string[] = projectDocumentPath.split(",");
    for (let filepath of listOfFiles) {
        let localFilePath: string = process.cwd() + "/" + filepath;
        logger.info("Project Document is in :" + ENV_VARIABLES.PROJECT_DOCUMENTS);
        if (ENV_VARIABLES.PROJECT_DOCUMENTS.toUpperCase() == "S3") {
            localFilePath = await downloadFileFromS3(filepath);
            logger.info(`Downloaded project document from S3: ${localFilePath}`);
        }
        if (!fs.existsSync(localFilePath)) {
            throw new Error(
                `Project document file not found at ${localFilePath}`,
            );
        }
        content += await getDocumentContent(localFilePath);
    }
    return content;
}

export function getReportFileContent(reportFilePath: string): Promise<any> {
    logger.info("Reading Report file from :- " + reportFilePath);
    if (!fs.existsSync(reportFilePath)) {
        throw new Error(`Report file not found at ${reportFilePath}`);
    }
    return getDocumentContent(reportFilePath);
}