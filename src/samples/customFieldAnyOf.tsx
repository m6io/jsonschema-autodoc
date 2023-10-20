export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Location",
    type: "object",
    anyOf: [
      {
        title: "City",
        properties: {
          city: {
            type: "string",
          },
        },
        required: ["city"],
      },
      {
        title: "Coordinates",
        properties: {
          lat: {
            type: "number",
          },
          lon: {
            type: "number",
          },
        },
        required: ["lat", "lon"],
      },
    ],
  },
}
