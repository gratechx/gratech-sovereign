import { GoogleGenAI } from "@google/genai";
import { GraTechModelId } from '../types';

// ==================== CONFIGURATION ====================

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ModelConfig {
  id: GraTechModelId;
  displayName: string;
  realModelName: string;
  icon: string;
  color: string;
  description: string;
  systemInstruction?: string;
  // ML Embeddings: [Complexity, CodeCapability, ArabicLanguage, CostEfficiency]
  embedding: [number, number, number, number]; 
}

// REAL MODEL REGISTRY with ML Embeddings
export const MODEL_CONFIGS: Record<GraTechModelId, ModelConfig> = {
  // Flagships
  'GraTech-Omni': { 
    id: 'GraTech-Omni', 
    displayName: 'GraTech Omni', 
    realModelName: 'gemini-2.5-flash', 
    icon: '🌌', 
    color: '#00d4aa', 
    description: 'General Purpose Core',
    systemInstruction: 'You are GraTech Omni, a helpful AI assistant.',
    embedding: [0.6, 0.5, 0.2, 0.9] // Balanced, high efficiency
  },
  'GraTech-Genius': { 
    id: 'GraTech-Genius', 
    displayName: 'GraTech Pro', 
    realModelName: 'gemini-2.5-flash', 
    icon: '⚡', 
    color: '#32B8C6', 
    description: 'Advanced Intelligence',
    embedding: [0.95, 0.7, 0.3, 0.2] // High complexity, low efficiency (expensive)
  },
  'GraTech-Reasoning': { 
    id: 'GraTech-Reasoning', 
    displayName: 'GraTech Logic', 
    realModelName: 'gemini-2.5-flash', 
    icon: '🧠', 
    color: '#8B5CF6', 
    description: 'Complex Problem Solver',
    systemInstruction: 'You are a logic engine. Explain your reasoning step-by-step.',
    embedding: [1.0, 0.6, 0.2, 0.1] // Max complexity
  },
  'GraTech-Coder': { 
    id: 'GraTech-Coder', 
    displayName: 'GraTech Architect', 
    realModelName: 'gemini-2.5-flash', 
    icon: '🏗️', 
    color: '#10B981', 
    description: 'Code & Infrastructure',
    systemInstruction: 'You are an expert software engineer.',
    embedding: [0.7, 1.0, 0.1, 0.6] // Max Code capability
  },
  'GraTech-DeepSeek-V3': { id: 'GraTech-DeepSeek-V3', displayName: 'Deep Model V3', realModelName: 'gemini-2.5-flash', icon: '🤖', color: '#6366F1', description: 'Advanced Model', embedding: [0.8, 0.8, 0.1, 0.5] },
  'GraTech-Llama-405': { id: 'GraTech-Llama-405', displayName: 'Open Model 405', realModelName: 'gemini-2.5-flash', icon: '🦙', color: '#F59E0B', description: 'Open Source Wrapper', embedding: [0.7, 0.6, 0.2, 0.7] },
  'GraTech-GPT5': { id: 'GraTech-GPT5', displayName: 'Next-Gen Preview', realModelName: 'gemini-2.5-flash', icon: '🚀', color: '#EC4899', description: 'Experimental', embedding: [0.9, 0.9, 0.2, 0.1] },
  'GraTech-O4': { id: 'GraTech-O4', displayName: 'O4 Mini Wrapper', realModelName: 'gemini-2.5-flash', icon: '🧿', color: '#EC4899', description: 'Fast Reasoning', embedding: [0.8, 0.5, 0.2, 0.8] },
  'GraTech-Llama-Mav': { id: 'GraTech-Llama-Mav', displayName: 'Maverick 17B', realModelName: 'gemini-2.5-flash', icon: '🐎', color: '#F59E0B', description: 'Experimental', embedding: [0.5, 0.5, 0.1, 0.8] },
  'GraTech-GPT4.1': { id: 'GraTech-GPT4.1', displayName: 'G-4.1 Preview', realModelName: 'gemini-2.5-flash', icon: '✨', color: '#3B82F6', description: 'Advanced Preview', embedding: [0.85, 0.8, 0.2, 0.4] },
  'GraTech-Transcribe': { id: 'GraTech-Transcribe', displayName: 'GraTech Transcribe', realModelName: 'gemini-2.5-flash', icon: '🎙️', color: '#10B981', description: 'Audio Processing', embedding: [0.3, 0.2, 0.4, 0.8] },
  'GraTech-4.1': { id: 'GraTech-4.1', displayName: 'GraTech Mini', realModelName: 'gemini-2.5-flash', icon: '🟦', color: '#3B82F6', description: 'Lightweight Model', embedding: [0.4, 0.4, 0.2, 1.0] },
  'GraTech-Phi': { id: 'GraTech-Phi', displayName: 'GraTech Phi', realModelName: 'gemini-2.5-flash', icon: '⚗️', color: '#06B6D4', description: 'Small Language Model', embedding: [0.3, 0.3, 0.1, 1.0] },
  'GraTech-Arabic': { 
    id: 'GraTech-Arabic', 
    displayName: 'GraTech Arabic', 
    realModelName: 'gemini-2.5-flash', 
    icon: '🇸🇦', 
    color: '#059669', 
    description: 'Arabic Language Specialized',
    systemInstruction: 'أنت مساعد ذكي تتحدث اللغة العربية بطلاقة.',
    embedding: [0.5, 0.3, 1.0, 0.7] // Max Arabic
  },
  'GraTech-JAIS': { id: 'GraTech-JAIS', displayName: 'JAIS Adapter', realModelName: 'gemini-2.5-flash', icon: '🌙', color: '#059669', description: 'Arabic LLM Adapter', embedding: [0.4, 0.2, 0.9, 0.6] },
  'GraTech-SDAIA': { id: 'GraTech-SDAIA', displayName: 'Secure Enterprise', realModelName: 'gemini-2.5-flash', icon: '🛡️', color: '#D4AF37', description: 'Enterprise Security', embedding: [0.6, 0.5, 0.8, 0.5] },
  'GraTech-Agent': { id: 'GraTech-Agent', displayName: 'GraTech Agent', realModelName: 'gemini-2.5-flash', icon: '🕵️', color: '#EC4899', description: 'Autonomous Agent', embedding: [0.7, 0.7, 0.1, 0.5] },
  'GraTech-Terminal': { id: 'GraTech-Terminal', displayName: 'GraTech CLI', realModelName: 'gemini-2.5-flash', icon: '⌨️', color: '#10B981', description: 'Command Line Interface', embedding: [0.2, 0.8, 0.0, 0.9] },
};

export const getAllModels = () => Object.values(MODEL_CONFIGS);
export const getModelConfig = (id: GraTechModelId) => MODEL_CONFIGS[id];

// ==================== INTELLIGENT CACHING LAYER (Multi-Layer) ====================

class GraTechEdgeCache {
  // L1: Fast In-Memory (Heap)
  private l1Memory = new Map<string, { data: string, timestamp: number }>();
  // L2: Simulated Redis (Persistent Storage interface)
  private l2Redis = new Map<string, { data: string, timestamp: number }>();
  
  private readonly TTL = 1000 * 60 * 60; // 1 hour

  // Smart Key Generation: Model + Prompt Hash + User Context
  generateKey(prompt: string, modelId: string): string {
    let hash = 0;
    const str = `${modelId}:${prompt.trim().toLowerCase()}`;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `gratech:cache:v3:${modelId}:${Math.abs(hash).toString(16)}`;
  }

  get(key: string): string | null {
    // 1. Check L1 (Memory)
    if (this.l1Memory.has(key)) {
        const entry = this.l1Memory.get(key)!;
        if (Date.now() - entry.timestamp < this.TTL) {
            console.debug(`[⚡ GraTech Cache] L1 Hit: ${key}`);
            return entry.data;
        }
        this.l1Memory.delete(key);
    }

    // 2. Check L2 (Simulated Redis)
    if (this.l2Redis.has(key)) {
         const entry = this.l2Redis.get(key)!;
         if (Date.now() - entry.timestamp < this.TTL) {
             console.debug(`[🔋 GraTech Redis] L2 Hit: ${key}`);
             this.l1Memory.set(key, entry); // Promote to L1
             return entry.data;
         }
         this.l2Redis.delete(key);
    }
    return null;
  }

  set(key: string, data: string) {
    const entry = { data, timestamp: Date.now() };
    this.l1Memory.set(key, entry);
    // Simulate async write to Redis
    setTimeout(() => {
        this.l2Redis.set(key, entry);
        console.debug(`[💾 GraTech Persist] Synced to Redis L2: ${key}`);
    }, 50);
  }
}

const edgeCache = new GraTechEdgeCache();

// ==================== ML MODEL ROUTER (Linear Classifier) ====================

interface InputFeatures {
  complexity: number;    // 0-1: How hard is the task?
  codeDensity: number;   // 0-1: Is it code?
  arabicScore: number;   // 0-1: Is it Arabic?
  budgetSensitivity: number; // 0-1: Does user care about cost?
}

class MachineLearningRouter {
  // Extract features from prompt (Feature Engineering)
  private extractFeatures(prompt: string, userHistory: any): InputFeatures {
    const codeKeywords = /(function|const|class|import|export|=>|return|if|for|while|interface|type|sudo|bash)/gi;
    const arabicChars = /[\u0600-\u06FF]/g;
    const reasoningKeywords = /(explain|why|reason|analyze|step-by-step|logic|proof)/gi;
    
    const codeMatches = (prompt.match(codeKeywords) || []).length;
    const arabicMatches = (prompt.match(arabicChars) || []).length;
    const reasoningMatches = (prompt.match(reasoningKeywords) || []).length;
    const length = prompt.length;

    return {
      complexity: Math.min(1, (length / 500) + (reasoningMatches * 0.2)),
      codeDensity: Math.min(1, codeMatches / 5),
      arabicScore: arabicMatches > 0 ? 1.0 : 0.0,
      budgetSensitivity: userHistory?.plan === 'enterprise' ? 0.1 : 0.8 // Enterprise cares less about cost
    };
  }

  // Calculate Dot Product score for a model
  private scoreModel(features: InputFeatures, model: ModelConfig): number {
    if (!model.embedding) return 0;
    
    // Weights for our objective function
    const W_COMPLEXITY = 0.4;
    const W_CODE = 0.3;
    const W_LANG = 0.5; // High penalty if language mismatch
    const W_COST = 0.2;

    const [mComp, mCode, mLang, mEff] = model.embedding;

    // Similarity Score
    let score = 0;
    score += (1 - Math.abs(features.complexity - mComp)) * W_COMPLEXITY; // Match complexity
    score += (features.codeDensity * mCode) * W_CODE; // Reward code capability if code needed
    score += (features.arabicScore * mLang) * W_LANG; // Reward language match
    
    // Budget penalty: if user is sensitive, reward efficiency (mEff)
    score += (features.budgetSensitivity * mEff) * W_COST;

    return score;
  }

  public predict(prompt: string, currentModelId: GraTechModelId): GraTechModelId {
    const userHistory = { plan: 'pro' }; // Mock user profile
    const inputVector = this.extractFeatures(prompt, userHistory);
    
    console.debug('[🤖 ML Router] Input Vector:', inputVector);

    let bestModel = currentModelId;
    let maxScore = -1;

    // Evaluate all candidates
    (Object.values(MODEL_CONFIGS) as ModelConfig[]).forEach(model => {
       const score = this.scoreModel(inputVector, model);
       
       // Add stickiness bias to current model to avoid jitter
       const bias = model.id === currentModelId ? 0.05 : 0;
       
       if (score + bias > maxScore) {
           maxScore = score + bias;
           bestModel = model.id;
       }
    });

    if (bestModel !== currentModelId) {
        console.log(`[🤖 ML Router] Switching Model: ${currentModelId} -> ${bestModel} (Score: ${maxScore.toFixed(3)})`);
    }

    return bestModel;
  }
}

const mlRouter = new MachineLearningRouter();

// ==================== SERVICE EXPORTS ====================

export const streamGraTechResponse = async (
  prompt: string,
  modelId: GraTechModelId,
  onChunk: (chunk: string) => void
) => {
  // 1. ML Routing
  const targetModelId = mlRouter.predict(prompt, modelId);
  const config = MODEL_CONFIGS[targetModelId];

  // 2. Cache Lookup
  const cacheKey = edgeCache.generateKey(prompt, targetModelId);
  const cached = edgeCache.get(cacheKey);
  if (cached) {
      onChunk(cached);
      return;
  }

  // 3. API Execution
  try {
    if (targetModelId === 'GraTech-Terminal') {
        // Special case for simulated terminal
        await simulateTerminalResponse(prompt, onChunk);
        return;
    }

    const responseStream = await ai.models.generateContentStream({
      model: config.realModelName,
      contents: prompt,
      config: {
        systemInstruction: config.systemInstruction
      }
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(chunk.text);
      }
    }
    
    // 4. Cache Write-Through
    edgeCache.set(cacheKey, fullText);

  } catch (error) {
    console.error("AI Service Error:", error);
    onChunk("\n[Error] Connection to GraTech Neural Engine failed.");
  }
};

const simulateTerminalResponse = async (cmd: string, onChunk: (t: string) => void) => {
    // Simulate latency
    await new Promise(r => setTimeout(r, 400));
    
    if (cmd.includes('ls') || cmd.includes('dir')) {
        onChunk("Directory: C:\\Users\\admin\n\nMode                LastWriteTime         Length Name\n----                -------------         ------ ----\nd-----        12/06/2025  10:00 AM                GraTech\n-a----        12/06/2025  10:01 AM           1024 secrets.env\n");
    } else if (cmd.includes('whoami')) {
        onChunk("gratech\\admin\n");
    } else {
        onChunk(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.\n`);
    }
};

export const generateGraTechImage = async (prompt: string): Promise<string> => {
    // Check Cache
    const cacheKey = edgeCache.generateKey(prompt, 'GraTech-Image');
    const cached = edgeCache.get(cacheKey);
    if (cached) return cached;

    // Simulate generation or use placeholder (Visual Cortex)
    // Actually using 'gemini-2.5-flash-image' is possible if provided via API key,
    // but here we simulate or use a placeholder as fallback or if configured.
    // The provided code used a timeout and placeholder.
    await new Promise(r => setTimeout(r, 1500));
    const result = `https://placehold.co/1024x1024/000000/32B8C6?text=${encodeURIComponent(prompt.slice(0, 15))}`;
    
    edgeCache.set(cacheKey, result);
    return result;
};

export const checkModelHealth = async (modelId: GraTechModelId) => true;