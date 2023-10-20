import { cn } from "@/lib/utils"
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import { useEffect, useRef } from "react"

type EditorProps = {
  className?: string
  editorId: string
  mdData: string
}

export default function MarkdownEditor({
  className,
  editorId,
  mdData,
}: EditorProps) {
  const jsonSchemaEditorRef = useRef(null)

  // const mdDataString = JSON.stringify(mdData, null, 2) // Format JSON with indentation

  useEffect(() => {
    if (editorId) {
      // @ts-expect-error - monaco-editor does not accept null refs
      jsonSchemaEditorRef.current = monaco.editor.create(
        // @ts-expect-error - monaco-editor does not accept null refs
        document.getElementById(editorId),
        {
          value: mdData,
          language: "markdown",
          theme: "vs-dark",
          readOnly: false, // Make the editor read-only
          automaticLayout: true, // Automatically adjust the layout when the size of the editor changes
          wordWrap: true,
        },
      )

      return () => {
        if (jsonSchemaEditorRef.current) {
          // @ts-expect-error - monaco-editor type definitions are incomplete
          jsonSchemaEditorRef.current.dispose()
        }
      }
    }
  }, [editorId, mdData])

  return (
    <div
      id={editorId}
      style={{ flex: 1, overflow: "auto" }}
      className={cn({ className })}
    />
  )
}
