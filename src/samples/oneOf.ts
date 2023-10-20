export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    oneOf: [
      {
        properties: {
          lorem: {
            type: "string",
          },
        },
        required: ["lorem"],
      },
      {
        properties: {
          ipsum: {
            type: "string",
          },
        },
        required: ["ipsum"],
      },
    ],
  },
}
