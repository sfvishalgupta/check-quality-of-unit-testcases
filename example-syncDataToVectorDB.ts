import { GetStore } from "./OpenRouterAICore/store/utils";
import {
    getProjectDocument,
} from "./utils/prompt";

async function main() {
    const [pdfPath, indexName] = process.argv.slice(2);

    if (!pdfPath || !indexName) {
        console.error("Usage: npx ts-node example-syncDataToVectorDB.ts <pdfPath> <index_name>");
        process.exit(1);
    }

    try {
        const store = GetStore();
        const text = await getProjectDocument(pdfPath);
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