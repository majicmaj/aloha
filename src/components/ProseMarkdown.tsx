import React, { HTMLAttributes } from "react";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
};

const ProseMarkdown = ({
  mainContent,
  isUser = false,
}: {
  mainContent: string;
  isUser?: boolean;
}) => {
  return (
    <div>
      <div
        className={`prose prose-sm dark:prose-invert max-w-none text-sm grid  ${
          isUser && "text-white"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(
              props: HTMLAttributes<HTMLElement> & {
                inline?: boolean;
              }
            ) {
              const { inline, className, children, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return (
                <div className="overflow-auto flex flex-col">
                  {!inline && (
                    <div className="p-1 px-2 bg-gray-200 dark:bg-gray-800 rounded-t-lg flex items-center justify-between">
                      <span className="text-gray-800 dark:text-gray-200">
                        {match?.[1] || ""}
                      </span>
                      <button
                        onClick={() =>
                          copyCode(String(children).replace(/\n$/, ""))
                        }
                        className="p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                      </button>
                    </div>
                  )}

                  {!inline && match ? (
                    <SyntaxHighlighter
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      style={vscDarkPlus as any}
                      language={match?.[1] || ""}
                      PreTag="div"
                      className="rounded-b-lg"
                      {...rest}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  )}
                </div>
              );
            },
          }}
        >
          {mainContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ProseMarkdown;
