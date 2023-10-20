export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Examples",
    description: "A text field with example values.",
    type: "object",
    properties: {
      browser: {
        type: "string",
        title: "Browser",
        examples: ["Firefox", "Chrome", "Opera", "Vivaldi", "Safari"],
      },
    },
  },
}
