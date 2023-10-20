export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "A registration form",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      password: {
        type: "string",
        title: "Password",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      firstName: {
        type: "string",
        title: "First name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
    },
  },
}
