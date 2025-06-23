import fs from 'fs';
import { config } from 'dotenv';
import { logger } from 'OpenRouterAICore/pino';

if (fs.existsSync('.env')) {
    logger.info('Loading env file from .env');
    config({ path: '.env' });
}
if (process.env.NODE_ENV != '' && fs.existsSync(`.env.${process.env.NODE_ENV}`)) {
    logger.info(`Loading env file from .env.${process.env.NODE_ENV}`);
    config({ path: `.env.${process.env.NODE_ENV}` });
} else {
    logger.info(`stage not set.`);
}

export const ERRORS = {
    ENV_NOT_SET: "ENV_NOT_SET",
    FILE_NOT_FOUND: "FILE_NOT_FOUND",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    URL_NOT_FOUND: "URL_NOT_FOUND",
}

export const ENV_VARIABLES = {
    DEFAULT_MODEL: 'deepseek/deepseek-chat-v3-0324:free',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_API_URL: process.env.GEMINI_API_URL,
    GITHUB_ISSUE_NUMBER: process.env.GITHUB_ISSUE_NUMBER ?? '',
    GITHUB_OWNER: process.env.GITHUB_OWNER ?? '',
    GITHUB_REPO: process.env.GITHUB_REPO ?? '',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? '',
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN ?? '',
    JIRA_EMAIL: process.env.JIRA_EMAIL ?? '',
    JIRA_FETCH_FIELDS: process.env.JIRA_FETCH_FIELDS ?? '',
    JIRA_MAX_RESULT: process.env.JIRA_MAX_RESULT ?? '',
    JIRA_PROJECT_KEY: process.env.JIRA_PROJECT_KEY ?? '',
    JIRA_SPACE_KEY_OUTPUT: process.env.JIRA_SPACE_KEY_OUTPUT ?? 'MyTestSpac',
    JIRA_TICKET_ID: process.env.JIRA_TICKET_ID ?? '',
    JIRA_URL_OUTPUT: process.env.JIRA_URL_OUTPUT ?? '',
    JIRA_URL: process.env.JIRA_URL ?? '',
    OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY,
    OPEN_ROUTER_API_URL: process.env.OPEN_ROUTER_API_URL,
    OPEN_ROUTER_MODEL: process.env.OPEN_ROUTER_MODEL ?? '',
    PROJECT_DOCUMENT_PATH: process.env.PROJECT_DOCUMENT_PATH ?? '',
    REPORT_FILE_PATH: process.env.REPORT_FILE_PATH ?? '',
    USE_FOR: process.env.USE_FOR ?? 'GenerateTestCasesReport_API',
    VECTOR_DB_COLLECTION_NAME: process.env.VECTOR_DB_COLLECTION_NAME ?? 'test_cases',
};
