export default {
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Widgets",
    type: "object",
    properties: {
      stringFormats: {
        type: "object",
        title: "String formats",
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          uri: {
            type: "string",
            format: "uri",
          },
        },
      },
      boolean: {
        type: "object",
        title: "Boolean field",
        properties: {
          default: {
            type: "boolean",
            title: "checkbox (default)",
            description: "This is the checkbox-description",
          },
          radio: {
            type: "boolean",
            title: "radio buttons",
            description: "This is the radio-description",
          },
          select: {
            type: "boolean",
            title: "select box",
            description: "This is the select-description",
          },
        },
      },
      string: {
        type: "object",
        title: "String field",
        properties: {
          default: {
            type: "string",
            title: "text input (default)",
          },
          textarea: {
            type: "string",
            title: "textarea",
          },
          placeholder: {
            type: "string",
          },
          color: {
            type: "string",
            title: "color picker",
            default: "#151ce6",
          },
        },
      },
      secret: {
        type: "string",
        default: "I'm a hidden string.",
      },
      disabled: {
        type: "string",
        title: "A disabled field",
        default: "I am disabled.",
      },
      readonly: {
        type: "string",
        title: "A readonly field",
        default: "I am read-only.",
      },
      readonly2: {
        type: "string",
        title: "Another readonly field",
        default: "I am also read-only.",
        readOnly: true,
      },
      widgetOptions: {
        title: "Custom widget with options",
        type: "string",
        default: "I am yellow",
      },
      selectWidgetOptions: {
        title: "Custom select widget with options",
        type: "string",
        enum: ["foo", "bar"],
      },
      selectWidgetOptions2: {
        title: "Custom select widget with options, overriding the enum titles.",
        type: "string",
        oneOf: [
          {
            const: "foo",
            title: "Foo",
          },
          {
            const: "bar",
            title: "Bar",
          },
        ],
      },
    },
  },
}
