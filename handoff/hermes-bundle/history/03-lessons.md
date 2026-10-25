# 踩過的坑

1. **ThinkFirst 先查到的是同名的別的專案**，最後確認是使用者自己的 `u92253024-source/thinkfirst`（Claude Code skill）。名稱撞名要向使用者確認網址。
2. skill 安裝後要重開才生效，第一次呼叫會 `Unknown skill`。
3. Claude Artifact 格式 HTML 沒有 head 與編碼宣告，放學校伺服器會亂碼，且錯誤編碼可能讓整段 JavaScript 語法錯誤。
4. 雲端環境的 LibreOffice 壞掉，pptx 只能做幾何與結構檢查；要逐頁看請在本機。
5. 雲端容器重置會清掉檔案，成品要即時推 GitHub 或下載。
6. 網路政策擋了 YouTube、Anthropic 文件、校內伺服器；影片內容靠使用者提供逐字稿。
7. 自動模式曾擋下「把問卷衍生分析寫進 repo」，原因正是個資考量，判斷正確。
8. 預設的 Gemini 模型曾因政策變動對新帳號失效，所以加了「查詢我可用的模型」。
9. Gemini 免費方案內容可能被用於改進服務，網頁已警告勿輸入個資。
10. LLM 可能編造條號：任何法規問答都必須限定只能引用提供的文件。
