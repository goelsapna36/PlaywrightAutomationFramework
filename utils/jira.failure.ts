import {
  findJiraIssue,
  createJiraComment,
  createJiraIssue
} from "./jira.client";

import { sendSlackMessage } from "./slack.client";

export async function handleJiraFailure(
  testName: string,
  errorMessage: string
) {
  try {
    const summary = "Login test failed";

    console.log("🔎 Searching Jira for:", summary);

    const existingIssues = await findJiraIssue(summary);

    console.log("🔎 Existing Jira issues:", existingIssues.length);

    if (existingIssues.length > 0) {
      const issueKey = existingIssues[0].key;

      console.log(`📌 Existing issue found: ${issueKey}`);

      await createJiraComment(
        issueKey,
        `❌ Playwright test failed: ${testName}\n\n${errorMessage}`
      );

      console.log(`✅ Jira comment added to ${issueKey}`);

      await sendSlackMessage(
        `❌ Playwright test failed: ${testName}\nJira: ${issueKey}\n${errorMessage}`
      );

      return issueKey;
    }

    console.log("🆕 No existing issue found. Creating new Jira Bug...");

    const newIssue = await createJiraIssue(
      summary,
      `❌ Playwright test failed: ${testName}\n\n${errorMessage}`
    );

    console.log(`✅ New Jira Bug created: ${newIssue.key}`);

    await sendSlackMessage(
      `❌ Playwright test failed: ${testName}\nJira: ${newIssue.key}\n${errorMessage}`
    );

    return newIssue.key;

  } catch (error: any) {
    console.log("❌ Jira failure handling failed");
    console.log(error.response?.data || error.message);
  }
}