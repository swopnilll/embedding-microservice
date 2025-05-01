export function jsonToText(obj: any): string {
  if (!obj || typeof obj !== "object") {
    return String(obj);
  }

  try {
    // Pretty stringify JSON and flatten into plain text
    return Object.entries(obj)
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return `${key}: ${jsonToText(value)}`; // Recursive flattening
        }
        return `${key}: ${value}`;
      })
      .join("\n");
  } catch (error) {
    return "Invalid JSON structure.";
  }
}
