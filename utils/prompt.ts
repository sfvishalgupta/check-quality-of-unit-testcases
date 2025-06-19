import fs from "fs";
import { getDocumentContent } from "../OpenRouterAICore/utils";
import { downloadFileFromS3 } from "../OpenRouterAICore/services/S3Service";
import { logger } from "../OpenRouterAICore/pino";
import { ENV_VARIABLES } from "../environment";
import { downloadFileFromConfluence } from "./confluenceUtil";


export function getSystemPrompt(systemPromptPath: string): Promise<string> {
    if (!fs.existsSync(systemPromptPath)) {
        throw new Error(`System prompt file not found at ${systemPromptPath}`);
    }
    return getDocumentContent(systemPromptPath);
}

/** 
 * This function is the entry point for the OpenRouterAI example.
 */
export async function getUserPrompt(): Promise<string> {
    logger.info("Reading User Prompt file from:- " + ENV_VARIABLES.USE_FOR);
    let filePath = process.cwd() + '/' + ENV_VARIABLES.USE_FOR + '.txt';
    if (ENV_VARIABLES.USE_FOR.toUpperCase().indexOf("S3") > -1) {
        logger.info("User Prompt from: S3");
        filePath = await downloadFileFromS3("tmp", ENV_VARIABLES.USE_FOR + '.txt');
    } else {
        logger.info("User Prompt from: local");
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`User prompt file not found at ${filePath}`);
    }
    return getDocumentContent(filePath);
}

export async function getProjectDocument(projectDocumentPath?: string): Promise<string> {
    let content: string = "";
    projectDocumentPath = projectDocumentPath ?? ENV_VARIABLES.PROJECT_DOCUMENT_PATH;
    const listOfFiles: string[] = projectDocumentPath.split(",");
    for (let filepath of listOfFiles) {
        const trimmedFilepath = filepath.trim();
        let localFilePath: string = process.cwd() + "/" + trimmedFilepath;
        if (trimmedFilepath.toUpperCase().indexOf("S3") > -1) {
            logger.info("Project Document is in : S3");
            localFilePath = await downloadFileFromS3("tmp", trimmedFilepath);
            logger.info(`Downloaded project document from S3: ${localFilePath}`);
        } else if (trimmedFilepath.toUpperCase().indexOf("CONFLUENCE") > -1) {
            logger.info(`Downloaded project document from Confluence: ${trimmedFilepath}`);
            localFilePath = await downloadFileFromConfluence("tmp", trimmedFilepath);
        } else {
            logger.info(`Project Document is in : Local ${localFilePath}`);
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