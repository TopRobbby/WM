import React, { useState } from 'react';
import { Terminal, Send, Sparkles, User, Bot, HelpCircle, Copy, Check, Shield, Radio } from 'lucide-react';

export const ExpertConsultant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Welcome to the **VortexMark Forensic Architecture Console**. I am your specialized AI expert in **Digital Forensic Watermarking, Anti-Piracy Steganography, and Hardened RTMP/RTMPS Streaming Servers**.

Key focus areas I can assist you with:
1. **Low-Cost 3-Character Burned Watermarking**: Architectures for zero-transcode per-viewer burn injection, Base32/Base62 indexing, and continuous Lissajous drifting orbits.
2. **Hardened RTMP/RTMPS Hosting**: Production NGINX-RTMP, MediaMTX, and SRS configurations with HMAC-SHA256 token verification and Cloud VM deployment.
3. **Anti-Collusion Defense**: Tardos codes and temporal permutation preventing pirates from averaging multiple subscriber feeds.
4. **Court-Admissible Forensics**: Technical chain of custody and DMCA 512 dynamic blocking affidavits.

Ask a question or select a quick topic below:`,
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickPrompts = [
    'Why is the large 48px–72px drifting 7-hue 3-char burn so hard for pirates to bypass or manipulate?',
    'How does continuous Lissajous drifting defeat modern AI video inpainting (ProPainter, DeepFill)?',
    'Explain how cycling across 7 hue color spectrums defeats chroma-key and delogo filters.',
    'How do we achieve low-cost 3-character burned watermarking for 50,000 viewers without GPU re-encoding?',
    'Provide a production-ready NGINX-RTMP on_publish HMAC webhook verification script in Node.js.',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || input.trim();
    if (!question || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: question }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/expert-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          conversationHistory: newMessages.slice(1, -1),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'Consultation response generated.',
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error communicating with AI consultant. Please verify your connection or server configuration.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-orange-500/20 pb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-orange-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            FORENSIC WATERMARKING & RTMP EXPERT TERMINAL
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-[11px] font-mono text-orange-400">
            <Radio className="w-3 h-3 text-orange-400 animate-pulse" />
            SECURE CONSULT CHANNEL
          </div>
          <span className="text-xs font-mono text-zinc-300 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded">
            Gemini 3.8 Flash
          </span>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono custom-scrollbar">
        <span className="text-zinc-500 shrink-0 uppercase text-[10px] tracking-wider">Tactical Queries:</span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-orange-400 rounded border border-zinc-800 hover:border-orange-500/50 whitespace-nowrap transition-colors"
          >
            {q.slice(0, 52)}...
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#050507] border border-orange-500/30 rounded-xl p-4 h-[490px] overflow-y-auto space-y-4 relative custom-scrollbar shadow-[0_0_20px_rgba(255,85,0,0.05)]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(255,85,0,0.15)]">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-xs font-mono leading-relaxed relative group ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(255,85,0,0.25)]'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {msg.content}

              {msg.role === 'assistant' && (
                <button
                  onClick={() => copyMessage(msg.content, idx)}
                  className="absolute top-2 right-2 p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-700"
                  title="Copy response"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-orange-500/50 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 bg-zinc-950 p-3 rounded-lg border border-orange-500/40 w-fit animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-orange-400" />
            Analyzing steganographic carrier vectors & zero-transcode RTMP topology...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask expert on 3-char low cost burned watermarking, RTMP security, or anti-collusion..."
            className="w-full bg-[#050507] border border-orange-500/30 focus:border-orange-500 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,85,0,0.3)] disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          SEND
        </button>
      </form>
    </div>
  );
};
