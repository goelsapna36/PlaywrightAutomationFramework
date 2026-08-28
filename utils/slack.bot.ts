import 'dotenv/config';
import { app } from './slack.healer';

(async () => {
  await app.start();

  console.log(
    '🤖 Automation Healer Slack Bot is running in Socket Mode...'
  );
})();