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

export const ENV_VARIABLES = {
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN ?? '',
    JIRA_EMAIL: process.env.JIRA_EMAIL ?? '',
    JIRA_FETCH_FIELDS: process.env.JIRA_FETCH_FIELDS ?? '',
    JIRA_MAX_RESULT: process.env.JIRA_MAX_RESULT ?? '',
    JIRA_PROJECT_KEY: process.env.JIRA_PROJECT_KEY ?? '',
    JIRA_TICKET_ID: process.env.JIRA_TICKET_ID ?? '',
    JIRA_URL: process.env.JIRA_URL ?? '',
    OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY,
    OPEN_ROUTER_API_URL: process.env.OPEN_ROUTER_API_URL,
    OPEN_ROUTER_MODEL: process.env.OPEN_ROUTER_MODEL ?? '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_API_URL: process.env.GEMINI_API_URL,
    REPORT_FILE_PATH: process.env.REPORT_FILE_PATH ?? '',
    PROJECT_DOCUMENT_PATH: process.env.PROJECT_DOCUMENT_PATH ?? '',
    GITHUB_ISSUE_NUMBER: process.env.GITHUB_ISSUE_NUMBER ?? '',
    OUTPUT_FILE: process.env.OUTPUT_FILE ?? 'output.md',
    USE_FOR: process.env.USE_FOR ?? 'GenerateTestCasesReport_API',
    VECTOR_DB_COLLECTION_NAME: process.env.VECTOR_DB_COLLECTION_NAME ?? 'test_cases',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? '',
};
