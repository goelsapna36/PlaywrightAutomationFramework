import axios from "axios";
import "dotenv/config";

export async function createJiraComment(
  issueKey: string,
  comment: string
) {
  const domain = process.env.JIRA_DOMAIN!;
  const email = process.env.JIRA_EMAIL!;
  const token = process.env.JIRA_TOKEN!;

  const auth = Buffer.from(`${email}:${token}`).toString("base64");

  const response = await axios.post(
    `https://${domain}/rest/api/3/issue/${issueKey}/comment`,
    {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: comment
              }
            ]
          }
        ]
      }
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}