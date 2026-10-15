# 交接摘要：教務處 AI 推廣社群專案

> 用途：從雲端環境轉移到本機繼續。給「人」看，也給本機新的 Claude Code 對話當第一則訊息的背景資料。
> 整理日期：2026-10-15

---

## 第一部分　專案是什麼

**身分**：國立大學教務處承辦人，有一定開發經驗，非資訊本科，習慣用 AI Studio、Claude Pro、Gemini Pro，**沒有額外開發預算**。

**任務**：依《AI 導入教務行政計畫書》，組建約 10 人的 AI 推廣社群（種子同仁）。

**計畫書核心**
- 三階段：工具普及 → 流程優化 → 能力自主；核心原則 **Human-in-the-loop**
- 校訂目標：建置 **NotebookLM 詢答服務**
- 三條軌道：考照輔導、校內競賽組隊、Vibe Coding；每月至少聚會一次
- 風險控管：個資不上傳境外服務

## 第二部分　已經做完的事

| 時間 | 事項 | 狀態 |
|---|---|---|
| 9 月初 | 邀請信＋18 題問卷（Google 表單） | 完成，已回收 8 份 |
| 9/17 | 第一次聚會 | 已辦（主題：非提示詞） |
| 10/7 | 第二次聚會：提示詞六塊拼圖＋ThinkFirst 示範 | 已辦，待辦事項均完成無錯誤 |
| 10 月中 | 練習室網頁修正亂碼，另做 Gemini 版 | 完成，使用者確認無錯誤 |

**已定案的重要決定（不要再重新討論）**
1. 問卷具名，但首頁聲明不列入考核、不提供主管。
2. 三個社群人數都不足 3 人，**正式改為「一個核心社群＋三條任務軌道」**。
3. **社群第一個專案：學分抵免與學程認定的 NotebookLM 詢答**。理由：跨單位、法規明確、已有人握有資料。
4. 資安課不單獨開，**寄生在提示詞課裡**（問卷顯示沒人想上、但多數人不清楚界線）。
5. 誠意只寫確定給得起的：學習資源與備考陪跑、成果於處務會議曝光、優先取得工具權限；**差假、獎金、考績不寫成承諾**。

## 第三部分　檔案在哪裡

### 在 GitHub（本 repo，分支 `claude/university-ai-community-setup-01cle7`）

```
HANDOFF.md                                本檔
docs/ai-community/
  README.md                               文件包使用順序
  01-邀請信.md                             第一次邀請信
  02-問卷題目清單.md                        18 題＋分級判讀對照表
  03-建立問卷_AppsScript.gs                 一鍵生成 Google 表單
tools/thinkfirst-practice/
  thinkfirst-practice-claude.html          Claude 版練習室（只能在 claude.ai 上用 AI 功能）
  thinkfirst-practice-gemini.html          Gemini 版（放學校伺服器、使用者填自己的金鑰）
  dev/make_gemini.py, test_adapter.js      產生與測試 Gemini 版的腳本
```

### 其他 GitHub repo（自己的帳號，公開）
- `u92253024-source/live-presentation-pusher`：會議廣播小工具（Node.js）
- `u92253024-source/thinkfirst`：ThinkFirst skill，本機安裝只要複製 `SKILL.md`

### **不在 GitHub，只存在於對話的附件卡片**（請確認已下載）
| 檔案 | 補充 |
|---|---|
| `提示詞六塊拼圖.pptx`（22 頁） | 產生它的腳本已遺失，要改版請讓 Claude 重做 |
| `prompt-workshop.html`（簡報網頁版） | 線上版：https://claude.ai/artifact/U6uhSRpmnMhYCrBFav2VAt（私有） |
| `講者小抄.pdf / .html` | A4 單頁 |
| `ThinkFirst示範腳本.md` | 六輪對話預演＋對照組 |
| `10-07邀請信.md` | |

### **刻意不放 GitHub 的**
問卷回覆 Excel 與逐人分析。8 人樣本中「單位＋業務」可以反推到個人，與問卷「不提供主管」的承諾不符。請只存本機。

## 第四部分　還沒做、可以接著做的

1. 學分抵免 NotebookLM 詢答服務：蒐集抵免辦法與常見問答，用示範腳本裡產出的 prompt 當起點
2. 第三次聚會：**資料整理與試算表應用**（問卷 4 票，直接命中多位同仁的痛點）
3. 評估要不要把簡報、講者小抄也放進 repo（需要的話請 Claude 重建）
4. 依 Gemini 免費額度政策變化，定期確認練習室預設模型是否仍可用（目前預設 `gemini-3.5-flash-lite`，網頁內有「查詢我可用的模型」按鈕）

## 第五部分　給新對話的注意事項（踩過的坑）

- **回覆語言與格式**：全程繁體中文；每輪更新請輸出完整內容，或先列更新項目再附完整內容（初學者友善）。
- Claude Artifact 格式的 HTML 沒有 `<head>`、`<meta charset>`，**直接放學校伺服器會亂碼**。存檔要用「UTF-8 with BOM」，並補 `[hidden]{display:none!important}`。
- 雲端環境的 LibreOffice 轉檔是壞的，無法逐頁目視檢查 pptx；本機環境不受影響。
- ThinkFirst skill 裝好後要**重開 Claude Code** 才認得。
- 不能把個人 API 金鑰寫死在網頁裡；Gemini 版設計成每位使用者填自己的。

---

## 第六部分　轉移到本機：一步一步

以下以 **Windows** 為例（Mac 步驟相同，只有安裝指令不同）。每一步都有「怎樣算成功」。

### 步驟 1　安裝 Git
- 下載並安裝 https://git-scm.com/download/win，全部按預設值按「下一步」。
- ✅ 成功：開啟 PowerShell，輸入 `git --version`，出現版本號。

### 步驟 2　安裝 Claude Code
- 依官方安裝說明操作：https://code.claude.com/docs/en/overview （安裝指令會更新，請以該頁為準）
- 裝好後在 PowerShell 輸入 `claude`，用您的 Claude Pro 帳號登入。
- ✅ 成功：看到 Claude Code 的歡迎畫面。按 `Ctrl+C` 兩次先離開。

### 步驟 3　把專案抓到本機
```powershell
cd $HOME\Documents
git clone https://github.com/u92253024-source/test1
cd test1
git checkout claude/university-ai-community-setup-01cle7
```
- ✅ 成功：`dir` 看得到 `HANDOFF.md`、`docs`、`tools` 三項。
- 若 clone 要求登入，依畫面指示用 GitHub 帳號授權。

### 步驟 4　把對話附件放進專案
1. 回到雲端對話，把上面表格列的附件**逐一下載**。
2. 在 `test1` 資料夾內建立 `deliverables` 資料夾，全部放進去。
3. 問卷回覆 Excel 也放進去，**但不要 commit**。在 `test1` 資料夾建立 `.gitignore`，內容寫一行：`deliverables/`
- ✅ 成功：`git status` 看不到 `deliverables`。

### 步驟 5　安裝 ThinkFirst（您若已裝過可跳過）
```powershell
git clone https://github.com/u92253024-source/thinkfirst $HOME\thinkfirst
mkdir $HOME\.claude\skills\thinkfirst -Force
copy $HOME\thinkfirst\SKILL.md $HOME\.claude\skills\thinkfirst\SKILL.md
```
- ✅ 成功：重開 Claude Code 後輸入 `/thinkfirst` 有反應。

### 步驟 6　接上對話（二選一）

**方法 A：接續原對話（保留整段歷史）**
```powershell
cd $HOME\Documents\test1
claude --teleport session_01Q6uyr1XEDYDca4yguwZ4K7
```
或輸入 `claude --teleport` 從清單選。指令若跟您的版本不同，以 `claude --help` 為準。
- ✅ 成功：能看到前面的對話。

**方法 B：開新對話（最穩，不依賴指令）**
```powershell
cd $HOME\Documents\test1
claude
```
然後貼上這段：

```
請先讀 HANDOFF.md 與 docs/ai-community/README.md，了解專案背景、已定案的決定與檔案位置。
我已從雲端環境轉移到本機，請全程使用繁體中文，每輪更新請輸出完整內容。
讀完後用 5 句話告訴我你理解的現況，再問我今天要先做哪一項。
```
- ✅ 成功：Claude 能正確說出「一個核心社群＋三條軌道」與「第一個專案是學分抵免詢答」。

### 步驟 7　最後確認
- [ ] 附件都已下載到 `deliverables`
- [ ] `git status` 乾淨，沒有 Excel
- [ ] 本機 `claude` 能開、`/thinkfirst` 能用
- [ ] 新對話能正確複述專案現況

全部打勾後，雲端環境就可以不用了。
