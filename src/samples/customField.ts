export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "A registration form",
    description: "A custom-field form example.",
    type: "object",
    definitions: {
      specialString: {
        $id: "/schemas/specialString",
        type: "string",
      },
    },
    properties: {
      mySpecialStringField: {
        $ref: "#/definitions/specialString",
      },
      mySpecialStringArray: {
        type: "array",
        items: {
          $ref: "#/definitions/specialString",
        },
      },
    },
  },
}
