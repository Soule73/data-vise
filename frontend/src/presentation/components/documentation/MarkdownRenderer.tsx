import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
// import 'highlight/styles/github-dark.css';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                    // Personnalisation des composants Markdown
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 mt-8">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3 mt-6">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            {children}
                        </p>
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    code: (props: any) => {
                        const { className, children, ...otherProps } = props;
                        const isInline = !className?.includes('language-');
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : 'text';

                        // Extraire le texte du contenu React
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const getTextContent = (node: any): string => {
                            if (typeof node === 'string') return node;
                            if (typeof node === 'number') return String(node);
                            if (Array.isArray(node)) return node.map(getTextContent).join('');
                            if (node && typeof node === 'object' && node.props && node.props.children) {
                                return getTextContent(node.props.children);
                            }
                            return '';
                        };

                        const codeContent = getTextContent(children);

                        return !isInline && match ? (
                            <div className="relative my-4">
                                <SyntaxHighlighter
                                    language={language}
                                    style={dracula}
                                    className="rounded-lg overflow-x-auto"
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}
                                    {...otherProps}
                                >
                                    {codeContent.replace(/\n$/, '')}

                                </SyntaxHighlighter>
                                <span className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                    {language}
                                </span>
                            </div>
                        ) : (
                            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400" {...otherProps}>
                                {codeContent}
                            </code>
                        );
                    },
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50 dark:bg-indigo-900/20">
                            {children}
                        </blockquote>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-4 space-y-1 text-gray-600 dark:text-gray-300">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-600 dark:text-gray-300">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="mb-1">
                            {children}
                        </li>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-300">
                            {children}
                        </td>
                    ),
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline"
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                            {children}
                        </a>
                    ),
                    img: ({ src, alt }) => (
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-full h-auto rounded-lg shadow-md my-4"
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
