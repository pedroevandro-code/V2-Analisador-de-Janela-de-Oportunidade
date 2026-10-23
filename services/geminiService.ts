
import { GoogleGenAI, Type } from "@google/genai";
import { Factor, GeminiAnalysis } from '../types';

interface PolicyScenario {
  policyIssue: string;
  problemStreamFactors: Factor[];
  policyStreamFactors: Factor[];
  politicalStreamFactors: Factor[];
  entrepreneurActions: string[];
}

const reliabilitySchema = {
  type: Type.OBJECT,
  properties: {
    score: { 
      type: Type.STRING, 
      description: "Nível de fidedignidade: 'Baixa', 'Média' ou 'Alta'." 
    },
    justification: { 
      type: Type.STRING, 
      description: "Breve explicação do porquê desta nota baseada na qualidade da informação fornecida." 
    }
  },
  required: ["score", "justification"]
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    scenarioSummary: {
      type: Type.STRING,
      description: "Um resumo breve e objetivo do cenário político, focando nos principais pontos de tensão."
    },
    reliabilityAssessment: {
      type: Type.OBJECT,
      properties: {
        problem: reliabilitySchema,
        policy: reliabilitySchema,
        political: reliabilitySchema,
        entrepreneur: reliabilitySchema,
      },
      required: ["problem", "policy", "political", "entrepreneur"],
      description: "Avaliação da qualidade, verossimilhança e robustez das informações fornecidas pelo usuário para cada categoria."
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
  required: ["scenarioSummary", "reliabilityAssessment", "streamConvergenceAnalysis", "policyWindowOutlook", "entrepreneurialStrategy", "potentialChallenges"]
};


export const analyzePolicyScenario = async (scenario: PolicyScenario): Promise<GeminiAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const formatFactors = (factors: Factor[]) => factors.map(f => `- ${f.text}`).join('\n') || 'Nenhum fator listado.';
  const formatActions = (actions: string[]) => actions.map(a => `- ${a}`).join('\n') || 'Nenhuma ação listada.';

  const prompt = `
    Você é um cientista político cético e analista de inteligência, especialista no Modelo de Múltiplos Fluxos de John W. Kingdon. 
    Sua tarefa é dupla: 
    1. Avaliar a FIDEDIGNIDADE e ROBUSTEZ das informações fornecidas (se são vagas, baseadas em senso comum, ou se parecem dados técnicos/factuais sólidos).
    2. Fornecer uma análise crítica e pessimista do cenário de política pública, focando nos obstáculos.

    **Diretriz de Fidedignidade:**
    - ALTA: Dados específicos, indicadores claros, eventos datados ou propostas detalhadas.
    - MÉDIA: Informações plausíveis mas sem detalhamento técnico ou fontes implícitas.
    - BAIXA: Afirmações vagas, clichês políticos, generalizações ou falta de nexo causal claro.

    **Questão de Política Pública:** ${scenario.policyIssue}

    **Fluxo de Problemas:**
    ${formatFactors(scenario.problemStreamFactors)}

    **Fluxo de Soluções (Propostas):**
    ${formatFactors(scenario.policyStreamFactors)}

    **Fluxo Político:**
    ${formatFactors(scenario.politicalStreamFactors)}

    **Ações do Empreendedor:**
    ${formatActions(scenario.entrepreneurActions)}

    Gere uma análise estruturada em formato JSON em português. Foque nos desafios e na veracidade do que foi apresentado.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
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
