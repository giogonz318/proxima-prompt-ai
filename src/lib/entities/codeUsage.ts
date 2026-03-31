export const CodeUsageSchema = {
  name: "CodeUsage",
  type: "object",
  properties: {
    user_email: {
      type: "string",
      description: "Email of the user",
    },
    date: {
      type: "string",
      description: "Date in YYYY-MM-DD format",
    },
    advanced_count: {
      type: "number",
      description: "Number of advanced code generations today",
    },
  },
  required: ["user_email", "date", "advanced_count"],
} as const;