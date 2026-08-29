import 'dotenv/config';
import { App } from '@slack/bolt';
import fs from 'fs';
import { execFile } from 'child_process';

// Slack App is created only when Socket Mode is available.
// This prevents normal Playwright runs from failing in GitHub Actions.
export const app = process.env.SLACK_APP_TOKEN
  ? new App({
      token: process.env.SLACK_BOT_TOKEN,
      appToken: process.env.SLACK_APP_TOKEN,
      socketMode: true,
    })
  : null;


// =========================================================
// SEND HEALER APPROVAL MESSAGE
// =========================================================

export async function sendHealerApprovalMessage(
  testName: string,
  filePath: string,
  searchText: string,
  replaceText: string
) {
  // GitHub/local test process without Socket Mode
  // should not crash.
  if (!app) {
    console.log(
      '⚠️ Slack Socket Mode is not available. Skipping approval message.'
    );
    return;
  }

  await app.client.chat.postMessage({
    channel: '#qa-automation',

    text: `🤖 Automation Healer: Approval required for ${testName}`,

    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            `🤖 *Automation Healer*\n\n` +
            `*Test:* ${testName}\n` +
            `*File:* ${filePath}\n` +
            `*Proposed change:* \`${searchText}\` → \`${replaceText}\`\n\n` +
            `⚠️ Approval required before changing automation code.`,
        },
      },

      {
        type: 'actions',
        elements: [
          {
            type: 'button',

            text: {
              type: 'plain_text',
              text: '✅ Approve Fix',
            },

            style: 'primary',

            action_id: 'approve_healing',

            value: JSON.stringify({
              filePath,
              searchText,
              replaceText,
              testName,
            }),
          },

          {
            type: 'button',

            text: {
              type: 'plain_text',
              text: '❌ Reject Fix',
            },

            action_id: 'reject_healing',

            value: JSON.stringify({
              testName,
            }),
          },
        ],
      },
    ],
  });

  console.log('🤖 Healer approval message sent to Slack');
}


// =========================================================
// APPROVE HEALING
// =========================================================

if (app) {
  app.action('approve_healing', async ({ ack, body, client }) => {

    await ack();

    const actionData = JSON.parse(
      (body as any).actions[0].value
    );

    const {
      filePath,
      searchText,
      replaceText,
      testName,
    } = actionData;

    try {

      const fileContent = fs.readFileSync(
        filePath,
        'utf8'
      );

      // Verify expected text exists
      if (!fileContent.includes(searchText)) {

        await client.chat.postMessage({
          channel: (body as any).channel.id,

          text:
            `❌ *Healing Failed*\n\n` +
            `"${searchText}" was not found in:\n` +
            `${filePath}\n\n` +
            `No code was changed.`,
        });

        return;
      }

      // Apply fix
      const updatedContent = fileContent.replace(
        searchText,
        replaceText
      );

      fs.writeFileSync(
        filePath,
        updatedContent,
        'utf8'
      );

      console.log(
        `✅ Healing applied: ${searchText} → ${replaceText}`
      );

      await client.chat.postMessage({
        channel: (body as any).channel.id,

        text:
          `✅ *Fix Applied*\n\n` +
          `Test: ${testName}\n` +
          `File: ${filePath}\n` +
          `Changed: \`${searchText}\` → \`${replaceText}\`\n\n` +
          `🔄 Automatically rerunning Playwright test...`,
      });


      // =====================================================
      // AUTOMATIC PLAYWRIGHT RERUN
      // =====================================================

      execFile(
        'npx',
        ['playwright', 'test', filePath],
        {
          cwd: process.cwd(),
          windowsHide: true,
        },
        async (error, stdout, stderr) => {

          if (error) {

            console.error(
              '❌ Automatic Playwright rerun failed'
            );

            console.error(stdout);
            console.error(stderr);

            await client.chat.postMessage({
              channel: (body as any).channel.id,

              text:
                `❌ *Self-Healing Failed*\n\n` +
                `Test: ${testName}\n\n` +
                `The fix was applied, but the Playwright test still failed.\n\n` +
                `🔎 Manual investigation required.`,
            });

            return;
          }

          console.log(
            '🎉 Automatic Playwright rerun passed'
          );

          await client.chat.postMessage({
            channel: (body as any).channel.id,

            text:
              `🎉 *Self-Healing Successful*\n\n` +
              `Test: ${testName}\n\n` +
              `✅ Fix applied\n` +
              `✅ Playwright test rerun passed\n\n` +
              `🤖 Automation healed successfully.`,
          });
        }
      );

    } catch (error) {

      console.error(
        '❌ Healing failed:',
        error
      );

      await client.chat.postMessage({
        channel: (body as any).channel.id,

        text:
          `❌ *Automation Healer Error*\n\n` +
          `The proposed fix could not be applied.`,
      });
    }
  });


  // =========================================================
  // REJECT HEALING
  // =========================================================

  app.action('reject_healing', async ({ ack, body, client }) => {

    await ack();

    await client.chat.postMessage({
      channel: (body as any).channel.id,

      text:
        `❌ *Healing Rejected*\n\n` +
        `No automation code was changed.`,
    });

    console.log(
      '❌ Healing rejected'
    );
  });
}