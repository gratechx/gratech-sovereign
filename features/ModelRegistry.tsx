import React, { useState, useEffect } from 'react';
import { Save, Trash2, Cpu, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CustomModel {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
}

const DEFAULT_MODELS: CustomModel[] = [
  { id: 'gemini-2.5-flash', name: 'Sovereign Flash', description: 'High-speed tactical reasoning.', isCustom: false },
  { id: 'gemini-3-pro-preview', name: 'Sovereign Pro', description: 'Advanced complex logic reasoning.', isCustom: false },
  { id: 'gemini-2.5-flash-image', name: 'Visual Cortex', description: 'Visual generation and analysis.', isCustom: false },
  { id: 'llama-3-70b-instruct', name: 'Llama 3 70B', description: 'Open-source instruct model (Simulated).', isCustom: false },
  { id: 'mistral-large', name: 'Mistral Large', description: 'High-performance open weights (Simulated).', isCustom: false },
  { id: 'gemma-7b', name: 'Gemma 7B', description: 'Lightweight open model (Simulated).', isCustom: false },
];

const ModelRegistry = () => {
  const [models, setModels] = useState<CustomModel[]>(DEFAULT_MODELS);
  const [newModelId, setNewModelId] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sovereign_models');
    if (saved) {
      setModels([...DEFAULT_MODELS, ...JSON.parse(saved)]);
    }
  }, []);

  const saveModel = () => {
    if (!newModelId || !newModelName) {
      setNotification({ msg: 'INVALID INPUT PARAMETERS', type: 'error' });
      return;
    }
    
    const newModel: CustomModel = {
      id: newModelId,
      name: newModelName,
      description: 'User-defined custom neural link.',
      isCustom: true
    };

    const savedCustoms = JSON.parse(localStorage.getItem('sovereign_models') || '[]');
    const updatedCustoms = [...savedCustoms, newModel];
    localStorage.setItem('sovereign_models', JSON.stringify(updatedCustoms));
    
    setModels([...DEFAULT_MODELS, ...updatedCustoms]);
    setNewModelId('');
    setNewModelName('');
    setNotification({ msg: 'NEURAL PATHWAY ESTABLISHED', type: 'success' });
    
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteModel = (id: string) => {
    const savedCustoms = JSON.parse(localStorage.getItem('sovereign_models') || '[]');
    const updatedCustoms = savedCustoms.filter((m: CustomModel) => m.id !== id);
    localStorage.setItem('sovereign_models', JSON.stringify(updatedCustoms));
    setModels([...DEFAULT_MODELS, ...updatedCustoms]);
  };

  return (
    <div className="h-full p-6 md:p-12 overflow-y-auto bg-black text-gray-200 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="border-b border-red-900/30 pb-6">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Cpu className="text-red-600" />
            MODEL MATRIX
          </h2>
          <p className="text-gray-500 text-sm">Configure and connect proprietary neural models.</p>
        </header>

        {/* Add New Model */}
        <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-red-500 tracking-widest flex items-center gap-2">
            <Plus size={16} /> ADD CUSTOM NODE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">INTERNAL DESIGNATION (MODEL ID)</label>
              <input 
                value={newModelId}
                onChange={(e) => setNewModelId(e.target.value)}
                placeholder="e.g., tuned-model-v1"
                className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">DISPLAY ALIAS</label>
              <input 
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="e.g., Project Chaos"
                className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={saveModel}
              className="px-6 py-2 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white transition-all rounded flex items-center gap-2 text-sm font-bold tracking-wide"
            >
              <Save size={16} /> INITIALIZE NODE
            </button>
          </div>
          {notification && (
            <div className={`p-3 text-xs flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
              {notification.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {notification.msg}
            </div>
          )}
        </div>

        {/* Model List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-500 tracking-widest">ACTIVE CONNECTIONS</h3>
          <div className="grid gap-4">
            {models.map((model) => (
              <div key={model.id} className="group flex items-center justify-between p-4 bg-neutral-900/30 border border-white/5 hover:border-red-500/50 transition-all rounded-lg">
                <div className="flex items-start gap-4">
                   <div className={`p-2 rounded ${model.isCustom ? 'bg-blue-900/20 text-blue-500' : 'bg-red-900/20 text-red-500'}`}>
                     <Cpu size={20} />
                   </div>
                   <div>
                     <div className="font-bold text-white flex items-center gap-2">
                       {model.name}
                       {model.isCustom && <span className="text-[9px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-900/50">CUSTOM</span>}
                     </div>
                     <div className="text-xs text-gray-500 font-mono mt-1">{model.id}</div>
                     <div className="text-xs text-gray-600 mt-0.5">{model.description}</div>
                   </div>
                </div>
                {model.isCustom && (
                  <button 
                    onClick={() => deleteModel(model.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    title="Sever Connection"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModelRegistry;