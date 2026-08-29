export async function sendSlackMessage(message: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("SLACK_WEBHOOK_URL is missing in .env");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: message,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Slack notification failed: ${response.status} ${response.statusText}`
    );
  }

  console.log("✅ Slack notification sent successfully");
}


export async function sendHealerSlackMessage(message: string) {
  const webhookUrl = process.env.SLACK_HEALER_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("SLACK_HEALER_WEBHOOK_URL is missing in .env");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: message,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Healer Slack notification failed: ${response.status} ${response.statusText}`
    );
  }

  console.log("🤖 Healer Slack notification sent successfully");
}