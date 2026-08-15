"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJiraComment = createJiraComment;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
async function createJiraComment(issueKey, comment) {
    const domain = process.env.JIRA_DOMAIN;
    const email = process.env.JIRA_EMAIL;
    const token = process.env.JIRA_TOKEN;
    const auth = Buffer.from(`${email}:${token}`).toString("base64");
    const response = await axios_1.default.post(`https://${domain}/rest/api/3/issue/${issueKey}/comment`, {
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
    }, {
        headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    return response.data;
}
