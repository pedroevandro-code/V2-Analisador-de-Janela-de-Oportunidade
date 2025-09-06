import React, { useState } from 'react';
import { Factor, StreamType } from '../types';
import { ProblemIcon, PolicyIcon, PoliticalIcon, PlusIcon, TrashIcon } from './Icons';

interface StreamCardProps {
  streamType: StreamType;
  factors: Factor[];
  setFactors: (factors: Factor[]) => void;
}

const streamConfig = {
  [StreamType.Problem]: {
    title: 'Fluxo de Problemas',
    description: 'Problemas significativos que capturam a atenção dos formuladores de políticas.',
    icon: <ProblemIcon className="h-8 w-8" />,
    color: 'stream-problem',
    placeholder: 'ex: Uma crise repentina ou dados convincentes'
  },
  [StreamType.Policy]: {
    title: 'Fluxo de Soluções (Políticas Públicas)',
    description: 'Soluções e propostas viáveis de especialistas.',
    icon: <PolicyIcon className="h-8 w-8" />,
    color: 'stream-policy',
    placeholder: 'ex: Uma proposta de política bem pesquisada'
  },
  [StreamType.Political]: {
    title: 'Fluxo Político',
    description: 'O clima político atual e o humor do público.',
    icon: <PoliticalIcon className="h-8 w-8" />,
    color: 'stream-political',
    placeholder: 'ex: Uma eleição recente ou mudança no humor nacional'
  }
};

export const StreamCard: React.FC<StreamCardProps> = ({ streamType, factors, setFactors }) => {
  const config = streamConfig[streamType];
  const [newFactor, setNewFactor] = useState('');

  const handleAddFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFactor.trim()) {
      setFactors([...factors, { id: Date.now().toString(), text: newFactor.trim() }]);
      setNewFactor('');
    }
  };
  
  const handleRemoveFactor = (id: string) => {
    setFactors(factors.filter(factor => factor.id !== id));
  };

  return (
    <div className={`bg-gray-800/50 p-6 rounded-xl border-t-4 border-${config.color} shadow-lg h-full flex flex-col`}>
      <div className="flex items-center mb-4">
        <div className={`text-${config.color}`}>{config.icon}</div>
        <div className="ml-4">
          <h2 className={`text-2xl font-bold text-${config.color}`}>{config.title}</h2>
          <p className="text-sm text-gray-400">{config.description}</p>
        </div>
      </div>
      
      <div className="flex-grow space-y-3 pr-2 overflow-y-auto" style={{maxHeight: '200px'}}>
        {factors.map(factor => (
          <div key={factor.id} className="group flex items-start gap-2 bg-gray-700/50 p-3 rounded-md">
            <p className="flex-grow text-gray-300 text-sm">{factor.text}</p>
            <button onClick={() => handleRemoveFactor(factor.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
         {factors.length === 0 && <p className="text-gray-500 text-center italic text-sm py-4">Nenhum fator adicionado ainda.</p>}
      </div>

      <form onSubmit={handleAddFactor} className="mt-6 flex gap-2">
        <input
          type="text"
          value={newFactor}
          onChange={(e) => setNewFactor(e.target.value)}
          className={`flex-grow bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-${config.color} focus:border-${config.color} transition`}
          placeholder={config.placeholder}
        />
        <button type="submit" className={`bg-${config.color} text-white font-bold p-2 rounded-md hover:opacity-80 transition-opacity`}>
          <PlusIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};