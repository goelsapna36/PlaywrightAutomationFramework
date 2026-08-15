"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jira_client_1 = require("./utils/jira.client");
async function test() {
    try {
        await (0, jira_client_1.createJiraComment)("KAN-1", "✅ Test comment from my Playwright QA automation.");
        console.log("✅ Jira comment created successfully");
    }
    catch (error) {
        console.log("❌ Jira comment failed");
        console.log(error.response?.data || error.message);
    }
}
test();
