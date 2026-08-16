export function analyzeFailure(errorMessage: string): string {

  const error = errorMessage.toLowerCase();

  if (
    error.includes('locator') ||
    error.includes('not found') ||
    error.includes('timeout')
  ) {
    return 'Likely Locator/UI issue';
  }

  
  if (
    error.includes('base_url') ||
    error.includes('environment') ||
    error.includes('configuration')
  ) {
    return 'Configuration issue';
  }

  if (
    error.includes('econnrefused') ||
    error.includes('err_connection')
  ) {
    return 'Network/Environment issue';
  }

  if (
    error.includes('500') ||
    error.includes('internal server error')
  ) {
    return 'Possible Application/API issue';
  }

  if (
    error.includes('expect(received)') ||
    error.includes('assertionerror') ||
    error.includes('object.is equality')
  ) {
    return 'Assertion/Test Logic issue';
  }

  return 'Unknown issue';
}