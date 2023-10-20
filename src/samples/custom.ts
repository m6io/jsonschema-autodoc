export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "A localisation form",
    type: "object",
    required: ["lat", "lon"],
    properties: {
      lat: {
        type: "number",
      },
      lon: {
        type: "number",
      },
    },
  },
}
