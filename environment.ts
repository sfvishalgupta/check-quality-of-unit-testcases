import fs from "fs";
import { config } from "dotenv";

if (fs.existsSync(".env")) {
  config({ path: ".env" });
}

export const ENV_VARIABLES = {
  AI_PROVIDER: process.env.AI_PROVIDER ?? "",
  JIRA_API_TOKEN: process.env.JIRA_API_TOKEN ?? "",
  JIRA_EMAIL: process.env.JIRA_EMAIL ?? "",
  JIRA_FETCH_FIELDS: process.env.JIRA_FETCH_FIELDS ?? "",
  JIRA_MAX_RESULT: process.env.JIRA_MAX_RESULT ?? "",
  JIRA_PROJECT_KEY: process.env.JIRA_PROJECT_KEY ?? "",
  JIRA_TICKET_ID: process.env.JIRA_TICKET_ID ?? "",
  JIRA_URL: process.env.JIRA_URL ?? "",
  OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY,
  OPEN_ROUTER_API_URL: process.env.OPEN_ROUTER_API_URL,
  OPEN_ROUTER_MODEL: process.env.OPEN_ROUTER_MODEL ?? "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_API_URL: process.env.GEMINI_API_URL,
  REPORT_FILE_PATH: process.env.REPORT_FILE_PATH ?? "",
  PROJECT_DOCUMENT_PATH: process.env.PROJECT_DOCUMENT_PATH ?? "",
  GITHUB_ISSUE_NUMBER: process.env.GITHUB_ISSUE_NUMBER ?? "",
  OUTPUT_FILE: process.env.OUTPUT_FILE ?? "output.md",
  USE_FOR: process.env.USE_FOR ?? "GenerateTestCasesReport_API",
  VECTOR_DB_COLLECTION_NAME: process.env.VECTOR_DB_COLLECTION_NAME ?? "test_cases",
  AWS_REGION: process.env.AWS_REGION ?? "ap-south-1",
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY ?? "",
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY ?? "",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ?? "",
};
