import { ENV_VARIABLES } from '../environment';
import { JiraSearchTool } from '../OpenRouterAIExample/tools';
import { JiraIssue } from '../OpenRouterAIExample/types';

/**
 * This function extracts text from the Jira issue description.
 * It traverses the content structure of the Jira issue and collects text from paragraphs.
 * 
 * @param jiraIssue - The Jira issue object containing the description.
 * @returns An array of strings, each representing a paragraph of text.
 */
const extractParagraphText = (jiraIssue: any): string[] => {
    const result: string[] = [];
    function traverse(node: any) {
        if (!node) return;

        if (node.type === 'paragraph' && Array.isArray(node.content)) {
            const text = node.content
                .filter((child: any) => child.type === 'text')
                .map((child: any) => child.text)
                .join('');
            if (text.trim()) result.push(text);
        }

        if (Array.isArray(node.content)) {
            node.content.forEach(traverse);
        }
    }

    traverse(jiraIssue);
    return result;
}


/**
 * This function fetches the Jira title and description for the given Jira ticket ID.
 * It uses the JiraSearchTool to search for the issue and formats the output.
 */
export const GetJiraTitle = async (): Promise<string> => {
    try {
        if (!ENV_VARIABLES.JIRA_TICKET_ID || !ENV_VARIABLES.JIRA_PROJECT_KEY) {
            throw new Error('Jira ticket ID or project key is not set in environment variables.');
        }
        const jiraId: string = ENV_VARIABLES.JIRA_TICKET_ID;
        const jql: string = `project = '${ENV_VARIABLES.JIRA_PROJECT_KEY}' AND (key = ${jiraId} OR parent = ${jiraId})`;
        const response: JiraIssue[] = await JiraSearchTool.func(jql);
        const parentIssue: JiraIssue = response.find(issue => issue.key === jiraId) as JiraIssue;
        const subIssues: JiraIssue[] = response.filter(issue => issue.key !== jiraId);
        const placeHolder: string = `
        Jira Story is below in format of title : description
        **${parentIssue.key} :- ${parentIssue.fields.summary}** : ${extractParagraphText(parentIssue.fields.description).join('\n')}

        Jira sub story is below in format of title : description
        ${subIssues.map(issue => `
        - **${issue.fields.summary}**: ${extractParagraphText(issue.fields.description).join('\n')}
        `).join('\n')}
    `;
        return placeHolder;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error in GetJiraTitle: ${error.message}`);
        } else {
            console.error(`Error in GetJiraTitle: ${String(error)}`);
        }
    }
    return '';
}