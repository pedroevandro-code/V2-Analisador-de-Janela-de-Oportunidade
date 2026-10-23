
export interface Factor {
  id: string;
  text: string;
}

export enum StreamType {
  Problem = 'Problem',
  Policy = 'Policy',
  Political = 'Political',
}

export interface ReliabilityItem {
  score: 'Baixa' | 'Média' | 'Alta';
  justification: string;
}

export interface ReliabilityAssessment {
  problem: ReliabilityItem;
  policy: ReliabilityItem;
  political: ReliabilityItem;
  entrepreneur: ReliabilityItem;
}

export interface GeminiAnalysis {
  scenarioSummary: string;
  streamConvergenceAnalysis: string;
  policyWindowOutlook: string;
  entrepreneurialStrategy: string[];
  potentialChallenges: string[];
  reliabilityAssessment: ReliabilityAssessment;
}
