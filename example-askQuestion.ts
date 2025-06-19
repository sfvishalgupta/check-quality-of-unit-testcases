import { askQuestionViaAPI } from './OpenRouterAICore/services';

const [question] = process.argv.slice(2);
if (!question) {
    console.error('Usage: npx ts-node example-askQuestion.ts <question>');
    process.exit(1);
}

askQuestionViaAPI(question)
    .then((response) => {
        console.log('Response from API:', response);
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    })
    .finally(() => {
        console.log('Finished asking the question.');
    });
