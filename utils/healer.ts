export function suggestFix(
  errorMessage: string
): string | null {

  if (
    errorMessage.includes("locator('.wrong-title')")
  ) {
    return "Possible locator fix: .wrong-title → .title";
  }

  return null;
}