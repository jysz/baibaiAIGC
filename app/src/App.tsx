import { useEffect } from "react";
import { DocumentCard } from "./components/DocumentCard";
import { ModelConfigCard } from "./components/ModelConfigCard";
import { ResultCard } from "./components/ResultCard";
import { useAppState } from "./hooks/useAppState";
import {
  exportRound,
  getDocumentStatus,
  loadModelConfig,
  pickInputFile,
  readOutput,
  runRound,
  saveModelConfig,
} from "./lib/tauri";

export function App() {
  const {
    modelConfig,
    documentStatus,
    roundResult,
    previewText,
    notice,
    busy,
    error,
    setModelConfig,
    setDocumentStatus,
    setRoundResult,
    setPreviewText,
    setNotice,
    setBusy,
    setError,
  } = useAppState();

  useEffect(() => {
    loadModelConfig()
      .then((config) => setModelConfig(config))
      .catch((appError: unknown) => setError(String(appError)));
  }, [setError, setModelConfig]);

  async function handleSaveModelConfig() {
    try {
      setBusy(true);
      setError("");
      setNotice("");
      const saved = await saveModelConfig(modelConfig);
      setModelConfig(saved);
      setNotice("模型设置已保存到本地。")
    } catch (appError) {
      setError(String(appError));
    } finally {
      setBusy(false);
    }
  }

  async function handlePickFile() {
    try {
      setBusy(true);
      setError("");
      setNotice("");
      const filePath = await pickInputFile();
      if (!filePath) {
        setNotice("已取消选择文档。");
        return;
      }
      const status = await getDocumentStatus(filePath);
      setDocumentStatus(status);
      setRoundResult(null);
      setPreviewText("");
      setNotice(`已导入文档，当前可执行第 ${status.nextRound} 轮。`);
    } catch (appError) {
      setError(String(appError));
    } finally {
      setBusy(false);
    }
  }

  async function handleRunRound() {
    if (!documentStatus) {
      setNotice("请先导入一个 txt 或 docx 文档。");
      return;
    }
    try {
      setBusy(true);
      setError("");
      setNotice("");
      const result = await runRound(documentStatus.sourcePath, modelConfig);
      setRoundResult(result);
      const preview = await readOutput(result.outputPath);
      setPreviewText(preview.text);
      const status = await getDocumentStatus(documentStatus.sourcePath);
      setDocumentStatus(status);
      setNotice(`第 ${result.round} 轮已完成，可以继续导出或进入下一轮。`);
    } catch (appError) {
      setError(String(appError));
    } finally {
      setBusy(false);
    }
  }

  async function handleExport(targetFormat: "txt" | "docx") {
    if (!roundResult) {
      setNotice("请先执行至少一轮处理，再导出结果。");
      return;
    }
    try {
      setBusy(true);
      setError("");
      setNotice("");
      const result = await exportRound(roundResult.outputPath, targetFormat);
      setNotice(`已导出 ${result.format.toUpperCase()}：${result.path}`);
    } catch (appError) {
      setError(String(appError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">白白降重</p>
          <h1>按轮处理文档，保留清晰记录</h1>
          <p className="hero-copy">
            这是一个面向中文论文与技术文档的 Windows 桌面工作台。你可以配置模型、导入 txt 或 Word，逐轮执行改写，并在每轮结束后导出 txt 或 Word。
          </p>
        </div>
        {busy ? <span className="status-tag">处理中</span> : <span className="status-tag idle">待命</span>}
      </div>

      {error ? <div className="error-banner">{error}</div> : null}
  {notice ? <div className="notice-banner">{notice}</div> : null}

      <section className="content-grid">
        <ModelConfigCard
          value={modelConfig}
          busy={busy}
          onChange={setModelConfig}
          onSave={handleSaveModelConfig}
        />
        <DocumentCard
          value={documentStatus}
          busy={busy}
          onPickFile={handlePickFile}
          onRunRound={handleRunRound}
        />
      </section>

      <ResultCard
        result={roundResult}
        previewText={previewText}
        busy={busy}
        onExportTxt={() => handleExport("txt")}
        onExportDocx={() => handleExport("docx")}
      />
    </main>
  );
}
