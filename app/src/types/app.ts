export type ModelConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  offlineMode: boolean;
};

export type DocumentStatus = {
  docId: string;
  sourcePath: string;
  sourceKind: string;
  completedRounds: number[];
  nextRound: number;
  currentInputPath: string;
  currentOutputPath: string;
  manifestPath: string;
  latestOutputPath: string;
  extractedFromDocx: boolean;
};

export type RoundResult = {
  round: number;
  outputPath: string;
  manifestPath: string;
  chunkLimit: number;
  inputSegmentCount: number;
  outputSegmentCount: number;
  paragraphCount: number;
  offlineMode: boolean;
  docEntry: Record<string, unknown>;
  skillContext: Record<string, unknown>;
};

export type ExportResult = {
  format: "txt" | "docx";
  path: string;
};
