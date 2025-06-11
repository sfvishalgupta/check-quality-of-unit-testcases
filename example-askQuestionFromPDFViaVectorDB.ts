import { GetStore } from "./OpenRouterAICore/store/utils";
import { ENV_VARIABLES } from "./OpenRouterAICore/environment";

async function main() {
    const [indexName, ...questionParts] = process.argv.slice(2);
    const question = questionParts.join(" ");

    if (!indexName || !question) {
        console.error("Usage: npx ts-node example-askQuestionFromPDF.ts <index_name> <question>");
        process.exit(1);
    }

    const store = GetStore();
    const response = await store.generate(indexName, question);

    if (ENV_VARIABLES.STREAMING && response?.on) {
        response.on('data', (data: any) => process.stdout.write(data));
        response.on('end', () => console.log("\nResponse completed."));
    } else {
        console.log(response);
    }
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
