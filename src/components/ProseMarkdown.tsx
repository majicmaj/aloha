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
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return (
                <div className={`overflow-auto flex flex-col`}>
                  {!inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
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
