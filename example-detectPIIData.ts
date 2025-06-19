import path from "path";
import { ENV_VARIABLES } from "./environment";
import { askQuestionViaAPI } from "./OpenRouterAICore/services";

import { getDocumentContent } from "./OpenRouterAICore/utils";

let [filePath] = process.argv.slice(2);
filePath = filePath || ENV_VARIABLES.PROJECT_DOCUMENT_PATH; // Default to example.pdf if not provided

if (!filePath) {
    console.error("Usage: npx ts-node example-detectPIIData.ts <filePath>");
    process.exit(1);
}

const systemPrompt = `
Detect PII Data and list down all PII Data into array in below format
find out for Name, Email, Address, Phone, Financial Information
[
  {
    "type": "Name",
    "value": "",
    "context": ""
  },
  {
    "type": "Address",
    "value": "some address",
    "context": "business address"
  },
  {
    "type": "Date",
    "value": "April 29, 2025",
    "context": "Document date"
  },
  {
    "type": "Financial Information",
    "value": "USD ",
    "context": ""
  }
]
give me only json format no extra text like 'Finished asking the question.', so that i can directly parse it and get value.
`;

const run = async () => {
    const text: string = await getDocumentContent(
        path.join(__dirname, filePath)
    );
    askQuestionViaAPI("", systemPrompt, text)
        .then((response) => {
            response = response.split('```JSON').join('')
                        .split('```').join('');
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