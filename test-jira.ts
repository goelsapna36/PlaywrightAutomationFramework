import {
  findJiraIssue,
  createJiraComment,
  createJiraIssue
} from "./utils/jira.client";

async function test() {
  try {
    const summary = "Login test failed";

    const existingIssues = await findJiraIssue(summary);

    if (existingIssues.length > 0) {
      const existingIssue = existingIssues[0];

      console.log(`ℹ️ Existing Jira issue found: ${existingIssue.key}`);

      await createJiraComment(
        existingIssue.key,
        "⚠️ Same Playwright failure occurred again."
      );

      console.log(`✅ Comment added to ${existingIssue.key}`);
    } else {
      const newIssue = await createJiraIssue(
        summary,
        "❌ Login test failed in Playwright automation."
      );

      console.log(`✅ New Jira issue created: ${newIssue.key}`);
    }

  } catch (error: any) {
    console.log("❌ Jira operation failed");
    console.log(error.response?.data || error.message);
  }
}

test();