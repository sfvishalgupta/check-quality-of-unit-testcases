import { ENV_VARIABLES } from './environment';
import { GetStore } from './OpenRouterAICore/store/utils';
import { GetProjectDocument } from './utils';

async function main() {
    let [pdfPath, indexName] = process.argv.slice(2);

    if (!pdfPath || !indexName) {
        pdfPath = ENV_VARIABLES.PROJECT_DOCUMENT_PATH;
        indexName = ENV_VARIABLES.JIRA_PROJECT_KEY + '-index';
        // console.error('Usage: npx ts-node example-syncDataToVectorDB.ts <pdfPath> <index_name>');
        // process.exit(1);
    }

    try {
        const store = GetStore();
        const text = await GetProjectDocument(pdfPath);
        await store.addDocument(indexName, text);
        console.log(`Document added to index "${indexName}" successfully.`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error syncing data to vector DB: ${error.message}`);
        } else {
            console.error(`Error syncing data to vector DB: ${String(error)}`);
        }
        process.exit(1);
    }
}

main();
