import { test, expect } from '@playwright/test';
import postapi from '../../utils/test-data/api_request/POst_Api.json';

test.use({
  baseURL: process.env.Base_API_URL
});

test('POST API Request Test', async ({ request }) => {

  const post = await request.post('/booking', {
    data: postapi
  });

  console.log('Status:', post.status());
  console.log('URL:', post.url());
  console.log('Content-Type:', post.headers()['content-type']);

  const responseText = await post.text();

  console.log('Response:', responseText);

  expect(post.status()).toBe(200);
  expect(post.statusText()).toBe('OK');
  expect(post.headers()['content-type']).toContain('application/json');
});