import { Octokit } from 'octokit';
import { ENV_VARIABLES } from '../environment';
import { PullRequestFile } from '../types';
import { logger } from '../OpenRouterAICore/pino';

const octokit = new Octokit({
    auth: ENV_VARIABLES.GITHUB_TOKEN, // Replace with your GitHub token
});

export async function GetPullRequestDiff(): Promise<string[]> {
    const files: string[] = [];
    try {
        const pull_number = ENV_VARIABLES.GITHUB_ISSUE_NUMBER;
        if (!pull_number) {
            throw new Error('GITHUB_ISSUE_NUMBER is not set in environment variables');
        }
        logger.info(`Pull Request Number is ${pull_number}`);

        if (ENV_VARIABLES.GITHUB_OWNER.trim() == '') {
            throw new Error('GITHUB_OWNER is not set in environment variables');
        }
        logger.info(`Github Owner is ${ENV_VARIABLES.GITHUB_OWNER}`);

        if (ENV_VARIABLES.GITHUB_REPO.trim() == '') {
            throw new Error('GITHUB_REPO is not set in environment variables');
        }
        logger.info(`Github Repo is ${ENV_VARIABLES.GITHUB_REPO}`);

        const listFilesResponse = await octokit.rest.pulls.listFiles({
            owner: ENV_VARIABLES.GITHUB_OWNER,
            repo: ENV_VARIABLES.GITHUB_REPO,
            pull_number: Number(pull_number),
        });

        (listFilesResponse.data as PullRequestFile[]).forEach((file: PullRequestFile) => {
            files.push(file.filename);
        });
    } catch (e) {
        if (e instanceof Error) {
            logger.info(`Error found in git diff function: ${e.message}`);
        } else {
            logger.info(`Error found in git diff function: ${String(e)}`);
        }
    }
    return files;
}
