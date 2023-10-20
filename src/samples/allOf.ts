export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    allOf: [
      {
        properties: {
          lorem: {
            type: ["string", "boolean"],
            default: true,
          },
        },
      },
      {
        properties: {
          lorem: {
            type: "boolean",
          },
          ipsum: {
            type: "string",
          },
        },
      },
    ],
  },
}
