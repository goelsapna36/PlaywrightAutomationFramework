import axios from "axios";
import "dotenv/config";

const domain = process.env.JIRA_DOMAIN!;
const email = process.env.JIRA_EMAIL!;
const token = process.env.JIRA_TOKEN!;

const auth = Buffer.from(`${email}:${token}`).toString("base64");

const headers = {
  Authorization: `Basic ${auth}`,
  Accept: "application/json",
  "Content-Type": "application/json"
};

// Search existing Jira issue by summary
export async function findJiraIssue(summary: string) {
  const jql = `project = KAN AND summary ~ "${summary}" AND statusCategory != Done`;

  const response = await axios.get(
    `https://${domain}/rest/api/3/search/jql`,
    {
      params: {
        jql,
        maxResults: 10,
        fields: "summary,status"
      },
      headers
    }
  );

  return response.data.issues;
}

// Add comment to Jira issue
export async function createJiraComment(
  issueKey: string,
  comment: string
) {
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
    { headers }
  );

  return response.data;
}

// Create a new Jira Bug
export async function createJiraIssue(
  summary: string,
  description: string
) {
  const response = await axios.post(
    `https://${domain}/rest/api/3/issue`,
    {
      fields: {
        project: {
          key: "KAN"
        },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: description
                }
              ]
            }
          ]
        },
        issuetype: {
          name: "Bug"
        }
      }
    },
    { headers }
  );

  return response.data;
}