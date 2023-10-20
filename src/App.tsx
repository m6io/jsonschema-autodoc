import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { useRoutes } from "react-router-dom"
import JsonEditor from "./components/json-editor"
import Samples from "./components/samples"
import { TailwindIndicator } from "./components/tailwind-indicator"
import { AppState, useStore } from "./store"
import "./userWorker"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import jsYaml from "js-yaml"
import { JSONSchema7 } from "json-schema"
import { FileCode, ListTree, MoreVertical } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FaMarkdown } from "react-icons/fa"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import MarkdownEditor from "./components/md-editor"
import { Skeleton } from "./components/ui/skeleton"
import { Toggle } from "./components/ui/toggle"
import { JSONSchemaMarkdown } from "./lib/JSONSchemaMarkdown"

function useIsResizing(): { isResizing: boolean; prevWidth: number } {
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const prevWidthRef = useRef<number>(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      const difference = Math.abs(newWidth - prevWidthRef.current)

      if (difference >= 1) {
        setIsResizing(true)
        prevWidthRef.current = newWidth
        setTimeout(() => {
          setIsResizing(false)
        }, 100)
      } else {
        if (isResizing) {
          setIsResizing(false)
        }
      }
    }

    window.addEventListener("resize", handleResize, true)

    return () => {
      window.removeEventListener("resize", handleResize, true)
    }
  }, [isResizing])

  return { isResizing, prevWidth: prevWidthRef.current }
}

function jsonSchemaToMarkdown(schema: JSONSchema7): string {
  return JSONSchemaMarkdown.doc(schema)
}

const selector = (state: AppState) => ({
  schema: state.schema,
  markdownOutput: state.markdownOutput,
  setMarkdownOutput: state.setMarkdownOutput,
  viewMarkdownInEditor: state.viewMarkdownInEditor,
  setViewMarkdownInEditor: state.setViewMarkdownInEditor,
})

export function DropdownMenuDemo() {
  const { markdownOutput, setMarkdownOutput } = useStore(selector)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="left">
        <DropdownMenuLabel>Show as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={markdownOutput}
          onValueChange={setMarkdownOutput}
        >
          <DropdownMenuRadioItem value="examples">
            <FileCode className="h-4 w-4" />
            <span>Schema with Examples</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="typeDoc">
            <ListTree className="h-4 w-4" />
            <span>Schema Type Doc</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const routes = [{ path: "/", element: <Home /> }]

function generateSample(schema: JSONSchema7 | any): any {
  if (!schema) {
    return null
  }

  switch (schema.type) {
    case "object": {
      const result: Record<string, any> = {}
      if (schema.properties) {
        for (const key in schema.properties) {
          result[key] = generateSample(schema.properties[key])
        }
      }
      if (schema.required) {
        schema.required.forEach((key: string) => {
          if (result[key] === undefined) {
            result[key] = "REQUIRED_VALUE"
          }
        })
      }
      return result
    }
    case "string": {
      if (schema.enum && schema.enum.length) {
        return schema.enum[0]
      }
      if (schema.examples && schema.examples.length) {
        return schema.examples[0]
      }
      if (schema.default !== undefined) {
        return schema.default
      }
      return "sample_string"
    }
    case "boolean": {
      if (schema.default !== undefined) {
        return schema.default
      }
      return false
    }
    case "number":
    case "integer": {
      if (schema.examples && schema.examples.length) {
        return schema.examples[0]
      }
      if (schema.default !== undefined) {
        return schema.default
      }
      return 0
    }
    case "array": {
      if (schema.items) {
        return [generateSample(schema.items)]
      }
      return []
    }
    default:
      return null
  }
}

function generateMarkdown(schemaData: JSONSchema7): string | undefined {
  const title = schemaData?.title || "Untitled"
  const schema = JSON.stringify(schemaData, null, 2)
  const jsonSample = JSON.stringify(generateSample(schemaData), null, 2)
  const yamlSample = jsYaml.dump(generateSample(schemaData), { indent: 4 })
  return `# ${title}
  
## Schema:

\`\`\`json
${schema}
\`\`\`

## Sample (JSON):
  
\`\`\`json
${jsonSample}
\`\`\`
  
## Sample (YAML):

\`\`\`yaml
${yamlSample}
\`\`\`
`
}

function Home() {
  const { schema } = useStore(selector)
  const { markdownOutput, viewMarkdownInEditor, setViewMarkdownInEditor } =
    useStore(selector)
  const { isResizing } = useIsResizing() // This is a custom hook that returns true if the window is being resized. This is mainly a workaround for the monaco-editor not resizing properly when the window is resized.

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          JSON Schema <br className="hidden sm:inline" />
          documentation examples.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Some basic examples of in-broswer JSON Schema to Markdown
          auto-generated documentation.
        </p>
      </div>
      <div className="grid w-full gap-6">
        <Samples />
        <div className="border bg-transparent p-5 shadow">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <div className="flex items-center justify-center [&>div]:w-full">
                <div className="bg-transparent">
                  <div className="flex items-center justify-between border bg-transparent px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-6">
                      JSON Schema
                    </h3>
                    <Button variant="ghost" disabled></Button>
                  </div>

                  <div className="h-full">
                    <div
                      className={cn(
                        "flex h-[400px] flex-col",
                        isResizing && "hidden",
                      )}
                    >
                      <JsonEditor
                        editorId="jsonSchemaEditorContainer"
                        jsonData={schema}
                      />
                    </div>
                    <div
                      className={cn(
                        "flex h-[400px] flex-col",
                        !isResizing && "hidden",
                      )}
                    >
                      <div
                        className={cn(
                          "grid h-full items-center justify-center overflow-y-scroll border",
                        )}
                      >
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="flex w-full items-center justify-center [&>div]:w-full">
                <div className="bg-transparent">
                  <div className="flex items-center justify-between border bg-transparent px-4 py-5 sm:px-6">
                    <h3 className="flex text-base font-semibold leading-6 lg:hidden">
                      MD Doc
                    </h3>
                    <h3 className="hidden text-base font-semibold leading-6 lg:flex">
                      Markdown Documentation
                    </h3>
                    <div className="flex">
                      <Toggle
                        pressed={viewMarkdownInEditor}
                        onPressedChange={setViewMarkdownInEditor}
                        variant="outline"
                        aria-label="Toggle markdown"
                      >
                        <FaMarkdown className="h-4 w-4" />
                      </Toggle>
                      <DropdownMenuDemo />
                    </div>
                  </div>
                  <div className="h-full">
                    <div
                      className={cn(
                        "flex h-[400px] flex-col",
                        isResizing && "hidden",
                      )}
                    >
                      {(() => {
                        switch (markdownOutput) {
                          case "examples":
                            return viewMarkdownInEditor ? (
                              <MarkdownEditor
                                editorId="markdownExamplesEditorContainer"
                                mdData={generateMarkdown(schema) || ""}
                              />
                            ) : (
                              <div
                                className={cn(
                                  "grid items-center justify-center overflow-y-scroll border",
                                )}
                              >
                                <Markdown
                                  className={cn(
                                    "prose prose-sm prose-zinc p-3 dark:prose-invert md:prose-base prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 md:p-10 lg:p-5",
                                  )}
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw]}
                                  components={{
                                    code(props) {
                                      const {
                                        children,
                                        className,
                                        node,
                                        ...rest
                                      } = props
                                      const match = /language-(\w+)/.exec(
                                        className || "",
                                      )
                                      return match ? (
                                        // @ts-expect-error - type definitions are incomplete
                                        <SyntaxHighlighter
                                          {...rest}
                                          children={String(children).replace(
                                            /\n$/,
                                            "",
                                          )}
                                          style={vscDarkPlus}
                                          language={match[1]}
                                          PreTag="div"
                                          wrapLongLines
                                        />
                                      ) : (
                                        <code {...rest} className={className}>
                                          {children}
                                        </code>
                                      )
                                    },
                                  }}
                                >
                                  {generateMarkdown(schema)}
                                </Markdown>
                              </div>
                            )
                          case "typeDoc":
                            return viewMarkdownInEditor ? (
                              <MarkdownEditor
                                editorId="markdownTypeDocEditorContainer"
                                mdData={jsonSchemaToMarkdown(schema) || ""}
                              />
                            ) : (
                              <div
                                className={cn(
                                  "grid items-center justify-center overflow-y-scroll border",
                                )}
                              >
                                <Markdown
                                  className="prose prose-sm prose-zinc p-3
              dark:prose-invert md:prose-base prose-code:m-0 prose-code:whitespace-pre-wrap prose-code:rounded-md prose-code:bg-muted-foreground prose-code:p-[0.2em] prose-code:px-[0.4em] prose-code:font-mono prose-code:text-xs prose-code:text-muted md:p-10 lg:p-5" // source: https://github.com/remarkjs/react-markdown/issues/505#issuecomment-724911501
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw]}
                                  components={{
                                    code(props) {
                                      const {
                                        children,
                                        className,
                                        node,
                                        ...rest
                                      } = props
                                      const match = /language-(\w+)/.exec(
                                        className || "",
                                      )
                                      return match ? (
                                        // @ts-expect-error - type definitions are incomplete
                                        <SyntaxHighlighter
                                          {...rest}
                                          children={String(children).replace(
                                            /\n$/,
                                            "",
                                          )}
                                          style={vscDarkPlus}
                                          language={match[1]}
                                          PreTag="div"
                                          wrapLongLines
                                        />
                                      ) : (
                                        <code
                                          {...rest}
                                          className="before:content-[''] after:content-['']"
                                        >
                                          {children}
                                        </code>
                                      )
                                    },
                                  }}
                                >
                                  {jsonSchemaToMarkdown(schema)}
                                </Markdown>
                              </div>
                            )
                          default:
                            return (
                              <div
                                className={cn(
                                  "grid h-full items-center justify-center overflow-y-scroll border",
                                )}
                              >
                                <div>
                                  Error rendering markdown. Please select a
                                  valid option or contact the admin.
                                </div>
                              </div>
                            )
                        }
                      })()}
                    </div>
                    <div
                      className={cn(
                        "flex h-[400px] flex-col",
                        !isResizing && "hidden",
                      )}
                    >
                      <div
                        className={cn(
                          "grid h-full items-center justify-center overflow-y-scroll border",
                        )}
                      >
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const children = useRoutes(routes)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
      </div>
      <TailwindIndicator />
    </ThemeProvider>
  )
}

export default App
