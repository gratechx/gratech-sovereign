import React, { useState } from 'react';
import { GRA_TECH_DATA } from '../data';
import { Layers, AlertCircle, BoxSelect, Trash2 } from 'lucide-react';

const ResourceGroups: React.FC = () => {
  const [groups, setGroups] = useState(GRA_TECH_DATA.resourceGroups);

  const handleDelete = (groupName: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the resource group '${groupName}'? This action is permanent.`);
    if (isConfirmed) {
      setGroups(prev => prev.filter(g => g.name !== groupName));
    }
  };

  const handleDeleteAllEmpty = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete ALL empty resource groups? This action cannot be undone.");
    if (isConfirmed) {
      setGroups(prev => prev.filter(g => g.count > 0));
    }
  };

  const emptyGroups = groups.filter(g => g.count === 0);
  const activeGroups = groups.filter(g => g.count > 0);

  return (
    <div className="space-y-8">
      {/* Alert for empty groups */}
      {emptyGroups.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-start gap-4 animate-in fade-in duration-500">
          <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-orange-400 font-semibold mb-1">Attention Required: Empty Groups</h3>
                <p className="text-orange-200/70 text-sm">
                  The following resource groups are empty and should be removed to maintain hygiene.
                </p>
              </div>
              <button 
                onClick={handleDeleteAllEmpty}
                className="ml-4 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Trash2 size={14} />
                Delete All Empty
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {emptyGroups.map(g => (
                <div key={g.name} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-orange-500/20 text-orange-300 text-xs rounded border border-orange-500/30 group">
                  <span>{g.name}</span>
                  <button 
                    onClick={() => handleDelete(g.name)}
                    className="p-1 hover:bg-orange-500/20 rounded text-orange-300/60 hover:text-red-400 transition-colors"
                    title="Delete Resource Group"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-400" />
                Active Resource Groups
            </h2>
            <span className="text-sm text-gray-500">{activeGroups.length} Groups</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeGroups.sort((a,b) => b.count - a.count).map((group, idx) => (
            <div key={idx} className="bg-gray-800 hover:bg-gray-750 border border-gray-700 p-4 rounded-lg flex items-center justify-between group transition-all">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center shrink-0">
                  <BoxSelect className="w-5 h-5 text-gray-400 group-hover:text-azure-400 transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-white truncate pr-2" title={group.name}>{group.name}</h3>
                  <p className="text-xs text-gray-500">{group.location}</p>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-xl font-bold text-white">{group.count}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Resources</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceGroups;