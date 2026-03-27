# baibaiAIGC

baibaiAIGC

## 使用说明

在使用本项目进行降 AIGC 处理之前，请先将需要处理的原始文件放入工作区根目录下的 `origin/` 文件夹。

- 原始输入文件默认从 [origin/](origin/) 目录读取。
- 如果 [origin/](origin/) 目录中不存在对应原始文件，使用时应先让用户上传文件，或提示用户先将文件放入 [origin/](origin/) 后再执行。
- 处理完成后的结果文件统一输出到工作区根目录下的 [finish/](finish/) 文件夹。

## 环境与依赖

- Python 3.8 及以上版本
- 推荐使用虚拟环境（例如本仓库中的 [.venv/](.venv/)）
- 依赖包使用 [requirements.txt](requirements.txt) 管理

安装依赖示例命令（在仓库根目录执行）：

```bash
pip install -r requirements.txt
```

当前必须安装的第三方包：

- `python-docx`：用于读取和写入 `.docx` 文件，由 [scripts/docx_pipeline.py](scripts/docx_pipeline.py) 使用。

## 目录结构说明

项目核心目录含义如下：

- [origin/](origin/): 放置待处理的原始文件（例如原始 `.docx` 论文或 `.txt` 文件）。
- [finish/](finish/): 存放处理完成后的输出文件（例如改写后的 `.docx` 文档）。
- [prompts/](prompts/): 存放三轮降 AIGC 提示词文件 `baibaiaigc1.md`、`baibaiaigc2.md`、`baibaiaigc3.md`。
- [scripts/docx_pipeline.py](scripts/docx_pipeline.py): 辅助在 `.docx` 与纯文本之间转换的脚本，不负责实际三轮改写逻辑。

## 基本使用流程（文本类输入）

1. 准备待改写的中文论文、摘要或技术文档文本，可以是：
   - 直接在对话中粘贴文本，交给 baibaiaigc skill 处理；或
   - 将文本保存为 `.txt` 文件放入 [origin/](origin/)。
2. 调用 baibaiaigc skill，按说明依次执行三轮改写：
   - 第 1 轮：使用 `prompts/baibaiaigc1.md`。
   - 第 2 轮：使用 `prompts/baibaiaigc2.md`。
   - 第 3 轮：使用 `prompts/baibaiaigc3.md`。
3. 最终结果可以直接在对话中返回，或写入文件，建议输出到 [finish/](finish/) 目录中。

如果是基于文件的任务（例如用户给出文件名或路径），默认按如下约定：

- 优先在 [origin/](origin/) 下查找原始文件。
- 找不到时，应提示用户先将原始文件放入 [origin/](origin/) 再继续执行。

## .docx 工作流示例

本仓库提供的 [scripts/docx_pipeline.py](scripts/docx_pipeline.py) 只负责 `.docx` 与纯文本之间的转换，方便你用 baibaiaigc skill 处理内容，然后再生成新的 `.docx` 文件。

### 从 .docx 提取纯文本

1. 将原始 Word 文件放入 [origin/](origin/) 目录，例如：`origin/my_paper.docx`。
2. 在仓库根目录下运行：

```bash
python -m scripts.docx_pipeline extract origin/my_paper.docx > origin/my_paper.txt
```

这样会把文档正文提取为纯文本，输出到 `origin/my_paper.txt`（或你指定的重定向路径）。

### 使用 skill 改写纯文本

接下来可以将 `origin/my_paper.txt` 的内容作为输入，交给 baibaiaigc skill 按三轮流程进行降 AIGC 改写。改写完成后，将最终文本保存为一个新的 `.txt` 文件，例如：`origin/my_paper_final.txt`。

### 将改写结果写回 .docx

当你拿到最终改写后的纯文本文件后，可以通过 `build` 子命令生成新的 `.docx` 文件：

```bash
python -m scripts.docx_pipeline build origin/my_paper_final.txt finish/my_paper_final.docx
```

- `origin/my_paper_final.txt`：包含最终改写文本的纯文本文件。
- `finish/my_paper_final.docx`：将要生成的输出 Word 文档路径，推荐放在 [finish/](finish/) 目录中。

## 注意事项

- 本脚本不会做任何智能改写，仅负责 `.docx` 与纯文本之间的读写，真实的三轮降 AIGC 逻辑由 baibaiaigc skill 实现。
- 如果依赖 `python-docx` 未安装，执行 [scripts/docx_pipeline.py](scripts/docx_pipeline.py) 时会报错并提示安装方式，请确保已通过 `pip install -r requirements.txt` 安装依赖。
- 建议始终保留原始 `.docx` 文件在 [origin/](origin/) 中，以便后续对比或重新处理。
