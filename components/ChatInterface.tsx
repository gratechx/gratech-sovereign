import React from 'react';
import { Copy } from 'lucide-react';

const CodeBlock = ({ language, code }: { language: string, code: string }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
      <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5">
        <span className="text-xs font-mono text-zinc-400">{language || 'text'}</span>
        <button onClick={handleCopy} className="text-zinc-400 hover:text-white transition-colors">
          {copied ? <span className="text-green-400 text-xs">Copied!</span> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-blue-300 whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
};

const renderMessageContent = (text: string) => {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      if (match) {
        return <CodeBlock key={index} language={match[1]} code={match[2]} />;
      }
      return <pre key={index} className="whitespace-pre-wrap text-sm font-mono bg-zinc-900 p-2 rounded">{part.replace(/```/g, '')}</pre>;
    }
    
    return (
      <div key={index} className="whitespace-pre-wrap">
        {part.split(/(\*\*.*?\*\*)/g).map((subPart, i) => {
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
                return <strong key={i} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
            }
            return subPart;
        })}
      </div>
    );
  });
};

export default renderMessageContent;