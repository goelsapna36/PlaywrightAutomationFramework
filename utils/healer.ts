import { sendHealerApprovalMessage } from './slack.healer';

export type HealResult = {
  status: 'HEALABLE' | 'ESCALATE' | 'UNKNOWN';
  reason: string;
  action: string;
};

export async function healFailure(
  testName: string,
  errorMessage: string,
  filePath: string
): Promise<HealResult> {

  // Remove ANSI terminal color codes from Playwright error
  const cleanErrorMessage = errorMessage.replace(
    /\u001b\[[0-9;]*m/g,
    ''
  );

  const error = cleanErrorMessage.toLowerCase();

  // =========================================================
  // LOCATOR / UI FAILURE
  // =========================================================

  if (
    error.includes('locator') ||
    error.includes('not found') ||
    error.includes('timeout')
  ) {

    const expectedMatch = cleanErrorMessage.match(
      /Expected:\s*["']?([^"'\n]+)["']?/i
    );

    const receivedMatch = cleanErrorMessage.match(
      /Received:\s*["']?([^"'\n]+)["']?/i
    );

    if (expectedMatch && receivedMatch) {

      const expected = expectedMatch[1].trim();
      const received = receivedMatch[1].trim();

      const result: HealResult = {
        status: 'HEALABLE',
        reason: `Expected "${expected}" but received "${received}"`,
        action: `Change "${expected}" to "${received}"`
      };

      console.log(
        `🤖 Proposed healing: "${expected}" → "${received}"`
      );

      await sendHealerApprovalMessage(
        testName,
        filePath,
        expected,
        received
      );

      return result;
    }

    return {
      status: 'HEALABLE',
      reason: 'Likely locator/UI change',
      action: 'Manual review required'
    };
  }

  // =========================================================
  // NETWORK / ENVIRONMENT FAILURE
  // =========================================================

  if (
    error.includes('econnrefused') ||
    error.includes('err_connection') ||
    error.includes('network')
  ) {
    return {
      status: 'ESCALATE',
      reason: 'Network/Environment issue',
      action: 'Check environment or application availability'
    };
  }

  // =========================================================
  // APPLICATION / API FAILURE
  // =========================================================

  if (
    error.includes('500') ||
    error.includes('internal server error')
  ) {
    return {
      status: 'ESCALATE',
      reason: 'Possible application/API issue',
      action: 'Developer investigation required'
    };
  }

  // =========================================================
  // ASSERTION FAILURE
  // =========================================================

  if (
    error.includes('expect(received)') ||
    error.includes('assertionerror') ||
    error.includes('object.is equality')
  ) {
    return {
      status: 'ESCALATE',
      reason: 'Assertion/Test Logic issue',
      action: 'Manual investigation required'
    };
  }

  // =========================================================
  // UNKNOWN FAILURE
  // =========================================================

  return {
    status: 'UNKNOWN',
    reason: 'Unknown failure',
    action: 'Manual investigation required'
  };
}