import { GoogleGenAI, Type } from "@google/genai";
import { Factor, GeminiAnalysis } from '../types';

interface PolicyScenario {
  policyIssue: string;
  problemStreamFactors: Factor[];
  policyStreamFactors: Factor[];
  politicalStreamFactors: Factor[];
  entrepreneurActions: string[];
}

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    scenarioSummary: {
      type: Type.STRING,
      description: "Um resumo breve e objetivo do cenário político, focando nos principais pontos de tensão."
    },
    streamConvergenceAnalysis: {
      type: Type.STRING,
      description: "Análise CRÍTICA do alinhamento (ou desalinhamento) dos três fluxos. A convergência é realmente provável? Quais são as barreiras mais significativas em cada fluxo?"
    },
    policyWindowOutlook: {
      type: Type.STRING,
      description: "Avalie a probabilidade de uma janela de oportunidade se abrir, usando UMA das seguintes classificações: 'Muito Provável', 'Provável', 'Incerteza (50/50)', 'Improvável', 'Muito Improvável'. Justifique com uma análise pessimista e realista."
    },
    entrepreneurialStrategy: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Sugira 3-4 ações estratégicas que o empreendedor político poderia tomar para MITIGAR os desafios e explorar qualquer pequena chance de sucesso."
    },
    potentialChallenges: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Identifique os maiores e mais realistas obstáculos, custos políticos e contra-argumentos que poderiam inviabilizar a mudança da política."
    }
  },
  required: ["scenarioSummary", "streamConvergenceAnalysis", "policyWindowOutlook", "entrepreneurialStrategy", "potentialChallenges"]
};


export const analyzePolicyScenario = async (scenario: PolicyScenario): Promise<GeminiAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const formatFactors = (factors: Factor[]) => factors.map(f => `- ${f.text}`).join('\n') || 'Nenhum fator listado.';
  const formatActions = (actions: string[]) => actions.map(a => `- ${a}`).join('\n') || 'Nenhuma ação listada.';

  const prompt = `
    Você é um cientista político cético e realista, especialista no Modelo de Múltiplos Fluxos de John W. Kingdon. Sua tarefa é fornecer uma análise crítica e pessimista de um cenário de política pública, focando nos obstáculos e na baixa probabilidade de sucesso. Gere uma análise estruturada em formato JSON em português.

    **Resumo do Modelo de Kingdon:**
    - **Fluxo de Problemas:** Problemas que ganham atenção.
    - **Fluxo de Soluções (Políticas Públicas):** Propostas de políticas viáveis.
    - **Fluxo Político:** O clima político (humor nacional, eleições, etc.).
    - **Janela de Oportunidade:** Uma breve chance para mudança quando os três fluxos convergem.
    - **Empreendedor Político:** Agente que acopla os fluxos.

    **Cenário de Política Pública do Usuário:**
    **Questão de Política Pública:** ${scenario.policyIssue}

    **Fatores do Fluxo de Problemas:**
    ${formatFactors(scenario.problemStreamFactors)}

    **Fatores do Fluxo de Soluções (Propostas):**
    ${formatFactors(scenario.policyStreamFactors)}

    **Fatores do Fluxo Político:**
    ${formatFactors(scenario.politicalStreamFactors)}

    **Ações do Empreendedor Político:**
    ${formatActions(scenario.entrepreneurActions)}

    **Sua Tarefa:**
    Com base na entrada do usuário, forneça uma análise CRÍTICA, PESSIMISTA e CONCISA em português. Foque nos desafios, custos políticos e por que a mudança provavelmente falhará. A saída DEVE ser um objeto JSON válido que adere ao esquema fornecido. Para 'policyWindowOutlook', use UMA das classificações predefinidas.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
    }
  });

  const text = response.text.trim();
  try {
    return JSON.parse(text) as GeminiAnalysis;
  } catch (error) {
    console.error("Falha ao analisar a resposta Gemini como JSON:", text);
    throw new Error("Recebida uma resposta JSON inválida da IA.");
  }
};