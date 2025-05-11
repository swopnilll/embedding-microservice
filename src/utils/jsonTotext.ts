export function jsonToText(obj: any): string {
  if (!obj || typeof obj !== "object") {
    return String(obj);
  }

  const keysToInclude = ["name", "title", "description", "status"];

  try {
    return keysToInclude
      .filter((key) => key in obj && obj[key])
      .map((key) => `${key}: ${obj[key]}`)
      .join(". ");
  } catch (error) {
    return "Invalid JSON structure.";
  }
}
