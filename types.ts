
export interface Factor {
  id: string;
  text: string;
}

export enum StreamType {
  Problem = 'Problem',
  Policy = 'Policy',
  Political = 'Political',
}

export interface GeminiAnalysis {
  scenarioSummary: string;
  streamConvergenceAnalysis: string;
  policyWindowOutlook: string;
  entrepreneurialStrategy: string[];
  potentialChallenges: string[];
}
