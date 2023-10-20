export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "A registration form",
    description:
      "This is the same as the simple form, but with an altered bootstrap grid. Set the theme to default, and try shrinking the browser window to see it in action.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  },
}
