import { create } from "zustand";
import type { DocumentStatus, ModelConfig, RoundResult } from "../types/app";

const defaultModelConfig: ModelConfig = {
  baseUrl: "",
  apiKey: "",
  model: "",
  temperature: 0.7,
  offlineMode: false,
};

type AppState = {
  modelConfig: ModelConfig;
  documentStatus: DocumentStatus | null;
  roundResult: RoundResult | null;
  previewText: string;
  notice: string;
  busy: boolean;
  error: string;
  setModelConfig: (config: ModelConfig) => void;
  setDocumentStatus: (status: DocumentStatus | null) => void;
  setRoundResult: (result: RoundResult | null) => void;
  setPreviewText: (text: string) => void;
  setNotice: (notice: string) => void;
  setBusy: (busy: boolean) => void;
  setError: (error: string) => void;
};

export const useAppState = create<AppState>((set) => ({
  modelConfig: defaultModelConfig,
  documentStatus: null,
  roundResult: null,
  previewText: "",
  notice: "",
  busy: false,
  error: "",
  setModelConfig: (modelConfig) => set({ modelConfig }),
  setDocumentStatus: (documentStatus) => set({ documentStatus }),
  setRoundResult: (roundResult) => set({ roundResult }),
  setPreviewText: (previewText) => set({ previewText }),
  setNotice: (notice) => set({ notice }),
  setBusy: (busy) => set({ busy }),
  setError: (error) => set({ error }),
}));
