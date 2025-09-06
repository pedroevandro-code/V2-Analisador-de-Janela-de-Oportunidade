import React from 'react';
import { GeminiAnalysis } from '../types';
import { SummaryIcon, ConvergenceIcon, StrategyIcon, ChallengeIcon, CheckIcon, WindowIcon, InfoIcon } from './Icons';

interface AnalysisDisplayProps {
  analysis: GeminiAnalysis;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-gray-800/60 p-6 rounded-lg shadow-md border border-gray-700">
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="ml-3 text-xl font-semibold text-gray-200">{title}</h3>
    </div>
    <div className="text-gray-300 space-y-2">{children}</div>
  </div>
);

const outlookConfig: { [key: string]: { color: string; label: string } } = {
  'Muito Provável': { color: 'text-green-400', label: 'Muito Provável' },
  'Provável': { color: 'text-green-500', label: 'Provável' },
  'Incerteza (50/50)': { color: 'text-yellow-400', label: 'Incerteza (50/50)' },
  'Improvável': { color: 'text-orange-500', label: 'Improvável' },
  'Muito Improvável': { color: 'text-red-500', label: 'Muito Improvável' },
};

const OutlookLegend: React.FC = () => (
  <div className="absolute bottom-full mb-2 w-64 bg-gray-900 border border-gray-600 rounded-lg shadow-xl p-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
    <h4 className="font-bold text-white mb-2">Legenda de Prognóstico:</h4>
    <ul className="space-y-1">
      {Object.values(outlookConfig).map(item => (
        <li key={item.label} className="flex items-center">
          <span className={`h-3 w-3 rounded-full mr-2 ${item.color.replace('text-', 'bg-')}`}></span>
          {item.label}
        </li>
      ))}
    </ul>
  </div>
);


export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const outlookText = analysis.policyWindowOutlook || "";
  const [outlookStatus, ...outlookReasonParts] = outlookText.split(':');
  const outlookReason = outlookReasonParts.join(':').trim();

  const statusConfig = outlookConfig[outlookStatus.trim()] || { color: 'text-gray-400', label: outlookStatus.trim() };
  
  return (
    <div className="my-8 space-y-6 animate-fade-in">
      <Section title="Resumo do Cenário" icon={<SummaryIcon className="h-6 w-6 text-gray-400" />}>
        <p>{analysis.scenarioSummary}</p>
      </Section>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Análise de Convergência dos Fluxos" icon={<ConvergenceIcon className="h-6 w-6 text-convergence" />}>
          <p>{analysis.streamConvergenceAnalysis}</p>
        </Section>
        
        <div className="bg-gray-800/60 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-3">
            <WindowIcon className="h-6 w-6 text-gray-400" />
            <h3 className="ml-3 text-xl font-semibold text-gray-200">Perspectiva da Janela de Oportunidade</h3>
            <div className="relative group ml-2">
              <InfoIcon className="h-5 w-5 text-gray-500 cursor-pointer"/>
              <OutlookLegend />
            </div>
          </div>
          <div className="text-gray-300 space-y-2">
             <p>
              <span className={`font-bold text-lg ${statusConfig.color}`}>{statusConfig.label}:</span>
              <span className="font-normal text-gray-300"> {outlookReason}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Estratégia do Empreendedor" icon={<StrategyIcon className="h-6 w-6 text-stream-policy" />}>
          <ul className="space-y-3">
            {analysis.entrepreneurialStrategy.map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Desafios Potenciais" icon={<ChallengeIcon className="h-6 w-6 text-stream-problem" />}>
           <ul className="space-y-3">
            {analysis.potentialChallenges.map((item, index) => (
              <li key={index} className="flex items-start">
                <ChallengeIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
};