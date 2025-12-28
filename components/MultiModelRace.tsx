import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Clock, CheckCircle, AlertTriangle, Loader2, Copy, Check, ChevronDown, ChevronUp, Activity, TrendingUp } from 'lucide-react';
import { streamGraTechResponse, getModelConfig } from '../services/aiService';
import { GraTechModelId, RaceResponse, Language } from '../types';
import renderMessageContent from './ChatInterface';

interface MultiModelRaceProps {
  query: string;
  models: GraTechModelId[];
  onComplete?: (results: Record<string, RaceResponse>) => void;
  lang?: Language;
}

const MultiModelRace: React.FC<MultiModelRaceProps> = ({ query, models, onComplete, lang = 'en' }) => {
  const [responses, setResponses] = useState<Record<string, RaceResponse>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
  const [rankings, setRankings] = useState<string[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startRace();
  }, [query, models]);

  const startRace = async () => {
    startTimeRef.current = Date.now();
    setWinner(null);
    setRankings([]);
    
    const initialResponses: Record<string, RaceResponse> = {};
    models.forEach(modelId => {
      initialResponses[modelId] = {
        modelId,
        text: '',
        isComplete: false,
        startTime: Date.now(),
        tokenCount: 0
      };
    });
    setResponses(initialResponses);

    const racePromises = models.map(modelId => runModel(modelId));
    await Promise.allSettled(racePromises);
  };

  const runModel = async (modelId: GraTechModelId) => {
    try {
      let tokenCount = 0;
      await streamGraTechResponse(query, modelId, (chunk) => {
        tokenCount++;
        setResponses(prev => ({
          ...prev,
          [modelId]: {
            ...prev[modelId],
            text: prev[modelId].text + chunk,
            tokenCount
          }
        }));
      });

      const endTime = Date.now();
      setResponses(prev => {
        const next = {
          ...prev,
          [modelId]: { ...prev[modelId], isComplete: true, endTime }
        };
        return next;
      });

      setWinner(prev => prev || modelId);
      setRankings(prev => [...prev, modelId]);

    } catch (error: any) {
      setResponses(prev => ({
        ...prev,
        [modelId]: { ...prev[modelId], isComplete: true, endTime: Date.now(), error: 'Failed' }
      }));
    }
  };

  const toggleExpand = (modelId: string) => {
    setExpandedModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) newSet.delete(modelId);
      else newSet.add(modelId);
      return newSet;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in my-6">
      <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          {lang === 'en' ? 'Race Mode Active' : 'وضع السباق نشط'}
        </h3>
        {winner && (
          <div className="text-sm text-yellow-400 font-mono">
            Winner: {getModelConfig(winner as GraTechModelId).displayName}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {models.map((modelId) => {
          const response = responses[modelId];
          const config = getModelConfig(modelId);
          const isWinner = winner === modelId;
          const isExpanded = expandedModels.has(modelId);
          const duration = response?.endTime ? ((response.endTime - response.startTime) / 1000).toFixed(2) : null;

          return (
            <div key={modelId} className={`border rounded-xl transition-all ${isWinner ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
              <div className="p-4 cursor-pointer" onClick={() => toggleExpand(modelId)}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="font-bold text-white text-sm">{config.displayName}</span>
                  </div>
                  {response?.isComplete ? (
                    <span className="text-xs font-mono text-zinc-500">{duration}s</span>
                  ) : (
                    <Loader2 size={14} className="animate-spin text-gratech-primary" />
                  )}
                </div>
                {!response?.isComplete && (
                   <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gratech-primary/50 w-1/2 animate-[shimmer_1s_infinite]"></div>
                   </div>
                )}
              </div>
              
              {(isExpanded || !response?.isComplete) && (
                <div className="px-4 pb-4 border-t border-white/5 pt-2">
                   <div className="text-sm text-zinc-300 max-h-[300px] overflow-y-auto font-sans leading-relaxed">
                      {response?.text ? renderMessageContent(response.text) : <span className="text-zinc-600 italic">Waiting...</span>}
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiModelRace;