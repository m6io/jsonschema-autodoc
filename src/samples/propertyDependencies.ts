export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Property dependencies",
    description: "These samples are best viewed without live validation.",
    type: "object",
    properties: {
      unidirectional: {
        title: "Unidirectional",
        src: "https://spacetelescope.github.io/understanding-json-schema/reference/object.html#dependencies",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          credit_card: {
            type: "number",
          },
          billing_address: {
            type: "string",
          },
        },
        required: ["name"],
        dependencies: {
          credit_card: ["billing_address"],
        },
      },
      bidirectional: {
        title: "Bidirectional",
        src: "https://spacetelescope.github.io/understanding-json-schema/reference/object.html#dependencies",
        description:
          "Dependencies are not bidirectional, you can, of course, define the bidirectional dependencies explicitly.",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          credit_card: {
            type: "number",
          },
          billing_address: {
            type: "string",
          },
        },
        required: ["name"],
        dependencies: {
          credit_card: ["billing_address"],
          billing_address: ["credit_card"],
        },
      },
    },
  },
}
