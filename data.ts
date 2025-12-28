import { InfrastructureData } from './types';

export const GRA_TECH_DATA: InfrastructureData = {
  account: {
    name: "Sulaiman's Workspace",
    id: "511738865589", 
    user: "User (Browser)",
    projectEndpoint: "localhost", 
    apiKeyHint: "API Key Active",
    region: "Client Side (Your Browser)"
  },
  subscription: {
    id: "frontend-build-v3",
    name: "GraTech UI Prototype",
    directory: "Local Browser Storage",
    role: "Developer",
    status: "Development Mode", // Honest status
    spending: {
      current: 0.00,
      forecast: 0.00,
      currency: "USD"
    },
    topCosts: [
      { name: "Development Time", amount: 0.00 },
      { name: "API Usage (Free Tier)", amount: 0.00 }
    ]
  },
  localDevice: {
    name: "Current User Device",
    os: "Browser Environment",
    cpuLoad: 0, // Will be read from navigator if possible
    memoryUsed: 0, 
    memoryTotal: 0, 
    cDrive: {
      used: 0, 
      total: 0, 
      status: 'Healthy'
    },
    isConnected: true
  },
  resourceGroups: [
    { name: "frontend-components", location: "React", count: 12, status: "Succeeded" },
    { name: "ai-integrations", location: "Google Cloud API", count: 1, status: "Succeeded" },
    { name: "local-state", location: "Browser Memory", count: 5, status: "Succeeded" }
  ],
  virtualMachines: [], // Removed fake VMs
  appServices: [
    { 
      name: "GraTech-React-App", 
      resourceGroup: "frontend", 
      state: "Running", 
      url: window.location.hostname,
      inboundIp: "127.0.0.1" 
    }
  ],
  aiServices: [
    { name: "Gemini-Flash-2.5", kind: "Remote API", resourceGroup: "Google", endpoint: "generativelanguage.googleapis.com", location: "Cloud" }
  ],
  storageAccounts: [
    { name: "LocalStorage", resourceGroup: "Browser", location: "Client", sku: "Persistent" }
  ],
  dnsRecords: [
    { name: "localhost", type: "A", details: "127.0.0.1", status: "OK", actualIp: "127.0.0.1" }
  ],
  recentWork: [
    { name: "UI Refactor", type: "Service", date: "Today", status: "Completed" },
    { name: "Reality Check", type: "Service", date: "Now", status: "In Progress" }
  ],
  stats: {
    totalResources: 3,
    resourceTypes: {
      "Frontend Components": 15,
      "Active APIs": 1,
      "Local Contexts": 4
    }
  }
};