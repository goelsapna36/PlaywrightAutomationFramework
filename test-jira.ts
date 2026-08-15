import { createJiraComment } from "./utils/jira.client";

async function test() {
  try {
    await createJiraComment(
  "KAN-1",
  "✅ Test comment from my Playwright QA automation."
);
    console.log("✅ Jira comment created successfully");
  } catch (error: any) {
    console.log("❌ Jira comment failed");
    console.log(error.response?.data || error.message);
  }
}

test();