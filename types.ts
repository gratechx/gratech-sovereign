import React from 'react';

export interface ResourceGroup {
  name: string;
  location: string;
  count: number;
  status: 'Succeeded' | 'Failed' | 'Unknown';
}

export interface VirtualMachine {
  name: string;
  resourceGroup: string;
  status: string;
  publicIP: string;
  size: string;
  location: string;
}

export interface AppService {
  name: string;
  resourceGroup: string;
  state: string;
  url: string;
  inboundIp?: string;
}

export interface AIService {
  name: string;
  kind: string;
  resourceGroup: string;
  endpoint: string;
  location?: string;
}

export interface StorageAccount {
  name: string;
  resourceGroup: string;
  location: string;
  sku: string;
}

export interface DnsRecord {
  name: string;
  type: string;
  details: string; // The current value in DNS
  actualIp?: string; // The real resource IP
  status: 'OK' | 'Mismatch' | 'Unknown' | 'Unbound';
}

export interface RecentWorkItem {
  name: string;
  type: 'Model' | 'Agent' | 'Workflow' | 'Service';
  date: string;
  status?: string;
}

export interface CostItem {
  name: string;
  amount: number;
}

export interface SubscriptionDetails {
  id: string;
  name: string;
  directory: string;
  role: string;
  status: string;
  spending: {
    current: number;
    forecast: number;
    currency: string;
  };
  topCosts: CostItem[];
}

// NEW: Local Device Interface for Omni Agent
export interface LocalDevice {
  name: string;
  os: string;
  cpuLoad: number;
  memoryUsed: number; // in GB
  memoryTotal: number; // in GB
  cDrive: {
    used: number; // GB
    total: number; // GB
    status: 'Healthy' | 'Critical' | 'Warning';
  };
  isConnected: boolean;
}

export interface InfrastructureData {
  account: {
    name: string;
    id: string;
    user: string;
    projectEndpoint?: string;
    apiKeyHint?: string;
    region?: string;
  };
  subscription: SubscriptionDetails;
  localDevice: LocalDevice; // Added Local Device
  resourceGroups: ResourceGroup[];
  virtualMachines: VirtualMachine[];
  appServices: AppService[];
  aiServices: AIService[];
  storageAccounts: StorageAccount[];
  dnsRecords: DnsRecord[];
  recentWork: RecentWorkItem[];
  stats: {
    totalResources: number;
    resourceTypes: Record<string, number>;
  };
}

export type Language = 'en' | 'ar' | 'zh' | 'es' | 'fr' | 'de';
export type Theme = 'dark' | 'light';

// ==================== AI MODEL TYPES ====================

export type GraTechModelId = 
  // Next-Gen / Experimental
  | 'GraTech-GPT5'          // gpt-5-chat
  | 'GraTech-O4'            // o4-mini
  | 'GraTech-Llama-Mav'     // Llama-4-Maverick-17B
  // Super Intelligence
  | 'GraTech-Genius'        // GPT-4o
  | 'GraTech-Omni'          // NEW: The All-Knowing Assistant
  | 'GraTech-Reasoning'     // DeepSeek R1
  | 'GraTech-DeepSeek-V3'   // DeepSeek V3
  // Specialized
  | 'GraTech-Coder'         // DeepSeek Coder / 4o
  | 'GraTech-Transcribe'    // GPT-4o Transcribe
  | 'GraTech-Llama-405'     // Llama 3.1 405B
  // Fast / Light
  | 'GraTech-GPT4.1'        // GPT-4.1
  | 'GraTech-4.1'           // GPT-4.1 Mini / Test
  | 'GraTech-Phi'           // Phi-3 Medium
  // Sovereign / Local
  | 'GraTech-Arabic'        // GPT-4 Arabic
  | 'GraTech-JAIS'          // JAIS 13B Arabic
  | 'GraTech-SDAIA'         // SDAIA Custom
  // Agents
  | 'GraTech-Agent'         // Autonomous Agent
  | 'GraTech-Terminal';     // PowerShell Emulator

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'ai';
  content: string;
  timestamp: number;
  isAnimated?: boolean;
}

export interface RaceResponse {
  modelId: GraTechModelId;
  text: string;
  isComplete: boolean;
  startTime: number;
  endTime?: number;
  tokenCount: number;
  error?: string;
}

// ==================== NAVIGATION ====================

export interface NavItem {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: React.ReactNode;
}

// ==================== CHAT TYPES ====================

export interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
  isTerminal?: boolean;
  timestamp?: number;
  modelId?: GraTechModelId;
}