import React, { useState } from 'react';
import { EntrepreneurIcon, PlusIcon, TrashIcon } from './Icons';

interface EntrepreneurCardProps {
  actions: string[];
  setActions: (actions: string[]) => void;
}

export const EntrepreneurCard: React.FC<EntrepreneurCardProps> = ({ actions, setActions }) => {
  const [newAction, setNewAction] = useState('');

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAction.trim()) {
      setActions([...actions, newAction.trim()]);
      setNewAction('');
    }
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl mt-8 border-t-4 border-gray-500 shadow-lg">
      <div className="flex items-center mb-4">
        <EntrepreneurIcon className="h-8 w-8 text-gray-400" />
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-300">Empreendedor Político</h2>
          <p className="text-sm text-gray-400">Ações tomadas por defensores para acoplar os fluxos.</p>
        </div>
      </div>

      <div className="space-y-3 pr-2 overflow-y-auto" style={{maxHeight: '150px'}}>
        {actions.map((action, index) => (
          <div key={index} className="group flex items-start gap-2 bg-gray-700/50 p-3 rounded-md">
            <p className="flex-grow text-gray-300 text-sm">{action}</p>
            <button onClick={() => handleRemoveAction(index)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        {actions.length === 0 && <p className="text-gray-500 text-center italic text-sm py-4">Nenhuma ação adicionada ainda.</p>}
      </div>

      <form onSubmit={handleAddAction} className="mt-6 flex gap-2">
        <input
          type="text"
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
          className="flex-grow bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
          placeholder="ex: Fazer lobby com membros chave do comitê"
        />
        <button type="submit" className="bg-gray-600 text-white font-bold p-2 rounded-md hover:bg-gray-500 transition-colors">
          <PlusIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};