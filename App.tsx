import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Header } from './components/Header';
import { StreamCard } from './components/StreamCard';
import { EntrepreneurCard } from './components/EntrepreneurCard';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Loader } from './components/Loader';
import { Factor, StreamType, GeminiAnalysis } from './types';
import { analyzePolicyScenario } from './services/geminiService';
import { ConvergenceIcon } from './components/Icons';

const App: React.FC = () => {
  const [policyIssue, setPolicyIssue] = useState<string>('Renda Básica Universal');
  const [problemFactors, setProblemFactors] = useState<Factor[]>([
    { id: 'p1', text: 'Aumento da desigualdade de renda e deslocamento de empregos devido à automação.' },
    { id: 'p2', text: 'Altas taxas de pobreza em certos grupos demográficos.' },
  ]);
  const [policyFactors, setPolicyFactors] = useState<Factor[]>([
    { id: 'po1', text: 'Existem modelos bem pesquisados para a implementação da RBU de vários think tanks.' },
    { id: 'po2', text: 'Programas piloto bem-sucedidos em outros países fornecem estruturas viáveis.' },
  ]);
  const [politicalFactors, setPoliticalFactors] = useState<Factor[]>([
    { id: 'pl1', text: 'Próximo ciclo eleitoral com a justiça econômica como tema principal.' },
    { id: 'pl2', text: 'Mudança no humor do público favorecendo redes de segurança social mais fortes pós-pandemia.' },
  ]);
  const [entrepreneurActions, setEntrepreneurActions] = useState<string[]>([
    'Formar coalizões com líderes de tecnologia e organizações de justiça social.',
    'Publicar artigos de opinião e aparecer em programas de notícias para enquadrar a RBU como uma solução para a automação.',
  ]);

  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeminiAnalysis(null);

    try {
      const analysis = await analyzePolicyScenario({
        policyIssue,
        problemStreamFactors: problemFactors,
        policyStreamFactors: policyFactors,
        politicalStreamFactors: politicalFactors,
        entrepreneurActions,
      });
      setGeminiAnalysis(analysis);
    } catch (e) {
      console.error(e);
      setError('Falha ao obter análise da IA. Verifique o console para detalhes e garanta que sua chave de API esteja configurada.');
    } finally {
      setIsLoading(false);
    }
  }, [policyIssue, problemFactors, policyFactors, politicalFactors, entrepreneurActions]);
  
  const updateFactors = (stream: StreamType, newFactors: Factor[]) => {
    switch(stream) {
      case StreamType.Problem: setProblemFactors(newFactors); break;
      case StreamType.Policy: setPolicyFactors(newFactors); break;
      case StreamType.Political: setPoliticalFactors(newFactors); break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="bg-gray-800/50 rounded-lg p-6 my-8 border border-gray-700 shadow-lg">
          <label htmlFor="policy-issue" className="block text-sm font-medium text-gray-400 mb-2">Questão de Política Pública para Análise</label>
          <input
            id="policy-issue"
            type="text"
            value={policyIssue}
            onChange={(e) => setPolicyIssue(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-lg text-convergence focus:ring-2 focus:ring-convergence focus:border-convergence transition"
            placeholder="ex: Financiamento das Mudanças Climáticas"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StreamCard streamType={StreamType.Problem} factors={problemFactors} setFactors={(f) => updateFactors(StreamType.Problem, f)} />
          <StreamCard streamType={StreamType.Policy} factors={policyFactors} setFactors={(f) => updateFactors(StreamType.Policy, f)} />
          <StreamCard streamType={StreamType.Political} factors={politicalFactors} setFactors={(f) => updateFactors(StreamType.Political, f)} />
        </div>
        
        <EntrepreneurCard actions={entrepreneurActions} setActions={setEntrepreneurActions} />

        <div className="text-center my-10">
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="bg-convergence text-gray-900 font-bold py-3 px-8 rounded-full text-xl hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center mx-auto shadow-lg"
          >
            <ConvergenceIcon className="h-6 w-6 mr-3"/>
            {isLoading ? 'Analisando...' : 'Analisar Janela de Oportunidade'}
          </button>
        </div>

        {isLoading && <Loader />}
        {error && <div className="text-center p-4 my-4 bg-red-900/50 border border-red-500 rounded-lg">{error}</div>}
        {geminiAnalysis && <AnalysisDisplay analysis={geminiAnalysis} />}
      </div>
    </div>
  );
};

export default App;