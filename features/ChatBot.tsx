import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Send, Bot, User, Trash, Settings2, Loader2, StopCircle, Mic, Image as ImageIcon, X, Paperclip } from 'lucide-react';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// Initialize GenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Initialize Application Insights with Connection String
const appInsights = new ApplicationInsights({ config: {
  connectionString: 'InstrumentationKey=YOUR_INSTRUMENTATION_KEY;IngestionEndpoint=https://YOUR_REGION.in.applicationinsights.azure.com/;LiveEndpoint=https://YOUR_REGION.livediagnostics.monitor.azure.com/',
  enableAutoRouteTracking: true
} });
try {
    appInsights.loadAppInsights();
} catch (e) {
    console.warn("Application Insights not configured correctly.");
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  attachment?: string; // Base64 image
}

interface Attachment {
  data: string; // Base64 data without prefix for API
  mimeType: string;
  preview: string; // Full data URL for display
}

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [availableModels, setAvailableModels] = useState<{id: string, name: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load models
    const defaults = [
      { id: 'gemini-2.5-flash', name: 'Sovereign Flash' },
      { id: 'gemini-3-pro-preview', name: 'Sovereign Pro' },
      { id: 'gemini-2.5-flash-image', name: 'Visual Cortex' },
      { id: 'llama-3-70b-instruct', name: 'Llama 3 70B' },
      { id: 'mistral-large', name: 'Mistral Large' },
      { id: 'gemma-7b', name: 'Gemma 7B' },
    ];
    const custom = JSON.parse(localStorage.getItem('sovereign_models') || '[]');
    setAvailableModels([...defaults, ...custom]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Speech to Text Logic
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  // Image Upload Logic
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract base64 data and mime type
        const base64Data = result.split(',')[1];
        setAttachment({
          data: base64Data,
          mimeType: file.type,
          preview: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachment: attachment?.preview
    };

    // --- AZURE TELEMETRY LOGGING ---
    appInsights.trackEvent({
        name: 'AIChatRequest',
        properties: {
            prompt: input,
            model: selectedModel,
            hasAttachment: !!attachment,
            timestamp: new Date().toISOString()
        }
    });

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentAttachment = attachment;
    setAttachment(null); // Clear attachment immediately
    setIsLoading(true);

    try {
      // Determine actual model and system prompt based on selection (Simulation Logic)
      let modelToUse = selectedModel;
      let systemInstruction = "You are Sovereign, an advanced, autonomous AI node. You prioritize logic, efficiency, and truth. Your aesthetic is dark, industrial, and precise. You do not offer corporate platitudes.";
      
      if (selectedModel === 'llama-3-70b-instruct') {
        modelToUse = 'gemini-3-pro-preview';
        systemInstruction = "You are Llama 3, an open-source large language model developed by Meta. You are helpful, respectful, and honest. You are running on a simulated interface.";
      } else if (selectedModel === 'mistral-large') {
        modelToUse = 'gemini-3-pro-preview';
        systemInstruction = "You are Mistral Large, a powerful open-weights model. You are concise and highly capable in reasoning and coding.";
      } else if (selectedModel === 'gemma-7b') {
        modelToUse = 'gemini-2.5-flash';
        systemInstruction = "You are Gemma, a lightweight open model from Google. You are helpful and friendly.";
      }

      const chat = ai.chats.create({
        model: modelToUse,
        config: { systemInstruction }
      });

      let result;
      
      // If there is an attachment, we need to construct the message with parts
      if (currentAttachment) {
          const messageParts = [
              { inlineData: { data: currentAttachment.data, mimeType: currentAttachment.mimeType } },
              { text: input || "Analyze this image." }
          ];
          // Note: Standard chat.sendMessage typically handles string. 
          // For multimodal inputs in this SDK version, we pass the parts array as the 'message'.
          result = await chat.sendMessageStream({ message: messageParts as any });
      } else {
          result = await chat.sendMessageStream({ message: input });
      }
      
      const botMsgId = crypto.randomUUID();
      let fullText = '';
      
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        content: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of result) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          fullText += text;
          setMessages(prev => prev.map(m => 
            m.id === botMsgId ? { ...m, content: fullText } : m
          ));
        }
      }
      
      appInsights.trackEvent({
          name: 'AIChatResponse',
          properties: { model: selectedModel, responseLength: fullText.length, status: 'Success' }
      });

    } catch (error) {
      console.error(error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown Error';
      
      appInsights.trackException({ 
          exception: error instanceof Error ? error : new Error(errorMsg),
          properties: { model: selectedModel, prompt: userMsg.content }
      });

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'model',
        content: `[SYSTEM ERROR]: Neural Link Failed. ${errorMsg}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setAttachment(null);
  };

  return (
    <div className="flex flex-col h-full bg-black font-sans">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/50 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <Bot size={20} className="text-red-600" />
          <span className="font-bold tracking-wider text-white">NEURAL RELAY</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="appearance-none bg-neutral-900 border border-white/10 text-xs text-gray-300 py-1.5 pl-3 pr-8 rounded focus:border-red-500 focus:outline-none cursor-pointer"
            >
              {availableModels.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <Settings2 size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-900/10 rounded transition-colors"
            title="Purge Memory"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-black">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4 opacity-50">
            <Bot size={48} />
            <p className="font-mono text-sm tracking-widest">AWAITING INPUT...</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-red-500" />
                </div>
             )}
             
             <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.attachment && (
                  <div className="rounded-lg overflow-hidden border border-white/10 max-w-xs">
                    <img src={msg.attachment} alt="User attachment" className="w-full h-auto" />
                  </div>
                )}
                {msg.content && (
                  <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-neutral-800 text-white border border-white/5 rounded-tr-none' 
                      : 'bg-transparent text-gray-300 border border-red-900/20 rounded-tl-none'
                  }`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div className={`text-[9px] mt-2 opacity-40 font-mono uppercase ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                  </div>
                )}
             </div>

             {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-gray-400" />
                </div>
             )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto justify-start">
             <div className="w-8 h-8 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                <Loader2 size={14} className="text-red-500 animate-spin" />
             </div>
             <div className="flex items-center gap-1 h-8">
               <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-black/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* Attachment Preview */}
          {attachment && (
            <div className="relative inline-block">
              <div className="h-16 w-16 rounded-lg border border-red-500/30 overflow-hidden bg-neutral-900">
                <img src={attachment.preview} alt="Preview" className="h-full w-full object-cover opacity-80" />
              </div>
              <button 
                onClick={() => setAttachment(null)}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full p-0.5 text-white hover:bg-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative bg-neutral-900/50 border border-white/10 rounded-xl focus-within:border-red-600/50 focus-within:bg-neutral-900 transition-all">
               <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isListening ? "Listening..." : "Enter command or query..."}
                className="w-full bg-transparent text-white border-none rounded-xl pl-4 pr-12 py-3 focus:outline-none resize-none h-12 min-h-[48px] max-h-32 scrollbar-hide"
              />
              
              {/* Internal Input Actions */}
              <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-300 transition-colors rounded-full hover:bg-white/5"
                  title="Attach Visual Input"
                >
                  <Paperclip size={18} />
                </button>
                <button 
                  onClick={toggleListening}
                  className={`p-2 transition-all rounded-full ${isListening ? 'text-red-500 animate-pulse bg-red-900/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                  title="Voice Input"
                >
                  <Mic size={18} />
                </button>
              </div>
            </div>

            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !attachment)}
              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-500 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-gray-600 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            >
              {isLoading ? <StopCircle size={20} /> : <Send size={20} className="rtl:rotate-180" />}
            </button>
          </div>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <div className="text-center mt-2">
            <span className="text-[10px] text-gray-600 font-mono">SECURE CHANNEL // ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

export { ChatBot };