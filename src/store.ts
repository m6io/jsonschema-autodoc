import { JSONSchema7 } from "json-schema"
import { create } from "zustand"
import { samples } from "./samples"

type Sample = {
  schema: JSONSchema7
}

export type AppState = {
  schema: JSONSchema7
  label: string
  setLabel: (label: string) => void
  markdownOutput: string
  setMarkdownOutput: (markdownOutput: string) => void
  viewMarkdownInEditor: boolean
  setViewMarkdownInEditor: () => void
}

export const useStore = create<AppState>((set, get) => ({
  schema: samples.Simple.schema as JSONSchema7,
  label: "Simple",
  setLabel: (label: string) => {
    // @ts-expect-error resolve later - TS doesn't like using a string value to query an object
    const sample: Sample = samples[label]
    set({
      label,
      schema: sample.schema as JSONSchema7,
    })
  },
  markdownOutput: "examples",
  setMarkdownOutput: (markdownOutput: string) => {
    if (markdownOutput === "examples" || markdownOutput === "typeDoc") {
      set({
        markdownOutput,
      })
    }
  },
  viewMarkdownInEditor: false,
  setViewMarkdownInEditor: () => {
    set({
      viewMarkdownInEditor: !get().viewMarkdownInEditor,
    })
  },
}))
