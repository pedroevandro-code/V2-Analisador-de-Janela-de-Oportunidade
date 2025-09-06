import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex justify-center items-center gap-4 mb-4">
        <LogoIcon className="h-12 w-12 text-convergence" />
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Analisador de Janela de Oportunidade
        </h1>
      </div>
      <p className="max-w-3xl mx-auto text-lg text-gray-400">
        Analise cenários de políticas públicas usando o Modelo de Múltiplos Fluxos de Kingdon. Insira fatores para cada fluxo para obter uma análise baseada em IA sobre a probabilidade de uma "janela de oportunidade" se abrir para mudanças significativas.
      </p>
    </header>
  );
};