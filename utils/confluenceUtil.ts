
import fs from "fs";
import path from "path";
import { ConfluenceSearchTool } from "../OpenRouterAICore/tools/confluenceSearchTool";
import { logger } from "../OpenRouterAICore/pino";

export async function downloadFileFromConfluence(folder: string, filePath: string): Promise<string> {
    try {
        filePath = filePath.replace('confluence://', '');
        filePath = filePath.replace('CONFLUENCE://', '');
        const outputFile = folder + "/" + filePath + '.txt';
        if (!fs.existsSync(path.dirname(outputFile))) {
            fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        }

        logger.info(`Confluence Space Key is ${filePath}`);
        const pages: any[] = await ConfluenceSearchTool().func(filePath);
        let content = "";
        for (const page of pages) {
            content += page.title + '\n';
            content += page.body.storage.value;
        }
        fs.writeFileSync(outputFile, content);
        return outputFile;

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error downloading file from S3: ${error.message}`);
        } else {
            console.error(`Error downloading file from S3: ${String(error)}`);
        }
        throw error; // Re-throw the error for further handling
    }
}