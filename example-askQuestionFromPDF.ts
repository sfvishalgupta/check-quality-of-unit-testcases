import path from "path";
import { ENV_VARIABLES } from "./environment";
import { askQuestionViaAPI } from "./OpenRouterAICore/services";

import { getDocumentContent } from "./OpenRouterAICore/utils";

let [pdfPath, question] = process.argv.slice(2);
pdfPath = pdfPath || ENV_VARIABLES.PROJECT_DOCUMENT_PATH; // Default to example.pdf if not provided

if (!question || !pdfPath) {
    console.error("Usage: npx ts-node example-askQuestionFromPDF.ts <pdfPath> <question>");
    process.exit(1);
}

const systemPrompt = `Act as a Technical Architect, answer the question based on the following document:
Please provide a detailed and accurate response based on the content of the document only.
don;t add any additional information or context outside of the document. and no other text rather than answering the question.`;

const run = async () => {
    const text: string = await getDocumentContent(
        path.join(__dirname, pdfPath)
    );
    askQuestionViaAPI(question, systemPrompt, text)
        .then((response) => {
            console.log("Response from API:", response);
        })
        .catch((error) => {
            console.error("Error occurred:", error);
        })
        .finally(() => {
            console.log("Finished asking the question.");
        });
}
run();