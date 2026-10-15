import sys
src, dst = sys.argv[1], sys.argv[2]
raw = open(src, 'rb').read()
if raw[:3] == b'\xef\xbb\xbf': raw = raw[3:]
t = raw.decode('utf-8')

def rep(old, new, count=1):
    global t
    n = t.count(old)
    assert n == count, f"預期 {count} 處，實際 {n} 處：{old[:60]!r}"
    t = t.replace(old, new)

def rep_between(start, end, new):
    """把 start 開頭、到 end（含）為止的整段換掉"""
    global t
    i = t.index(start); j = t.index(end, i) + len(end)
    assert t.count(start) == 1
    t = t[:i] + new + t[j:]

# ---------- 標題、文案 ----------
rep('<title>ThinkFirst 提示詞練習室</title>', '<title>ThinkFirst 提示詞練習室（Gemini 版）</title>')
rep('<div class="eyebrow">AI 推廣課程・提示詞工程練習</div>', '<div class="eyebrow">AI 推廣課程・提示詞工程練習・Gemini 版</div>')
rep('<div id="ai-status" class="notice">正在連線 Claude…</div>', '<div id="ai-status" class="notice">正在讀取 Gemini 設定…</div>')
rep('<button class="ghost" id="dl-log" type="button" hidden>下載對話紀錄</button>', '<button class="ghost" id="dl-log" type="button">下載對話紀錄</button>')
rep('沒有 Claude 帳號也沒關係。', '不想設定 API 金鑰也沒關係。')
rep('<span>AI 教練與健檢使用你自己的 Claude 帳號額度。請勿輸入個資或機密資料。</span>',
    '<span>AI 教練與健檢使用你自己的 Gemini API 金鑰與額度。請勿輸入個資或機密資料。</span>')

# ---------- 設定區 CSS ----------
rep('/* tabs */', '''/* gemini key box */
.keybox { margin-top: 18px; }
.keybox > summary { list-style: none; cursor: pointer; padding: 12px 16px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.keybox > summary::-webkit-details-marker { display: none; }
.keybox > summary::before { content: "▸"; color: var(--ink-2); transition: transform .15s; }
.keybox[open] > summary::before { transform: rotate(90deg); }
.keybox .kb-title { font-weight: 700; }
.keybox .kb-sub { font-size: 13px; color: var(--ink-2); margin-left: auto; }
.kb-body { padding: 0 16px 16px; display: grid; gap: 10px; }
.kb-body p, .kb-body ol, .kb-body ul { margin: 0; }
.kb-body ol, .kb-body ul { padding-left: 1.3em; }
.kb-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 10px 14px; }
.kb-field { display: grid; gap: 4px; min-width: 0; }
.kb-row { display: flex; gap: 6px; }
.kb-row .ghost { flex: none; white-space: nowrap; }
.kb-body input[type="password"], .kb-body input[type="text"] { width: 100%; min-width: 0; border: 1px solid var(--line); border-radius: 8px; background: var(--paper); padding: 8px 10px; font-family: var(--f-mono); font-size: 13.5px; }
.kb-body input:focus { border-color: var(--accent); outline: none; }
.kb-body a { color: var(--accent); }
@media (max-width: 640px) { .kb-grid { grid-template-columns: minmax(0, 1fr); } }

/* tabs */''')

# ---------- 設定區 HTML ----------
rep('  <nav class="tabs" role="tablist" aria-label="練習模式">', '''  <details class="card keybox" id="keybox">
    <summary><span class="kb-title">Gemini 連線設定</span><span class="pill s0" id="kb-pill">未設定</span><span class="kb-sub" id="kb-sub">AI 教練與提示詞健檢需要</span></summary>
    <div class="kb-body">
      <p class="small">AI 教練與提示詞健檢會使用<b>你自己的</b> Gemini API 金鑰。金鑰可以免費申請：</p>
      <ol class="small">
        <li>用 Google 帳號登入 <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio 的 API 金鑰頁面</a></li>
        <li>按「Create API key」（建立 API 金鑰）</li>
        <li>複製以 <code>AIza</code> 開頭的金鑰，貼到下方後按「儲存並啟用」</li>
      </ol>
      <div class="kb-grid">
        <div class="kb-field">
          <label for="kb-key" class="small muted">API 金鑰</label>
          <div class="kb-row">
            <input id="kb-key" type="password" autocomplete="off" spellcheck="false" placeholder="AIza…">
            <button type="button" class="ghost" id="kb-show">顯示</button>
          </div>
        </div>
        <div class="kb-field">
          <label for="kb-model" class="small muted">模型（可自行輸入其他名稱）</label>
          <input id="kb-model" type="text" list="kb-models" autocomplete="off" spellcheck="false">
          <datalist id="kb-models">
            <option value="gemini-3.5-flash-lite">最便宜、最快（建議）</option>
            <option value="gemini-3.8-flash">品質較好，額度消耗較多</option>
          </datalist>
        </div>
      </div>
      <div class="bar">
        <button type="button" class="primary" id="kb-save">儲存並啟用</button>
        <button type="button" class="ghost" id="kb-test">測試連線</button>
        <button type="button" class="ghost" id="kb-list">查詢我可用的模型</button>
        <button type="button" class="ghost" id="kb-clear">清除金鑰</button>
        <span class="small muted" id="kb-msg" aria-live="polite"></span>
      </div>
      <div id="kb-models-out" class="bar" hidden></div>
      <div class="notice small">
        <b>使用前請先知道：</b>
        <ul>
          <li>金鑰只存在<b>這台電腦的瀏覽器</b>裡，不會傳到學校伺服器，只會送到 Google。在公用電腦用完請按「清除金鑰」。</li>
          <li>使用免費方案時，Google 可能會用你輸入的內容改進服務。<b>請勿輸入學生個資、成績或任何機密資料。</b></li>
          <li>這個網頁目前用 <code>http://</code> 開啟，傳輸沒有加密。建議請網管改成 <code>https://</code>。</li>
        </ul>
      </div>
    </div>
  </details>

  <nav class="tabs" role="tablist" aria-label="練習模式">''')

# ---------- 連線層：Claude → Gemini ----------
rep_between('  /* ---------- Claude 連線 ---------- */',
            '  function errText(code) { return ERR[code] || "連線中斷，請按「重新送出」再試一次。"; }',
r'''  /* ---------- Gemini 連線 ---------- */
  /*GEMINI-ADAPTER-START*/
  const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
  function gErr(code, extra) { const e = new Error(code); e.code = code; if (extra) Object.assign(e, extra); return e; }
  function toContents(messages) {
    const out = [];
    for (const m of messages) {
      const role = m.role === "assistant" ? "model" : "user";
      const text = String(m.content || "");
      if (out.length && out[out.length - 1].role === role) out[out.length - 1].parts[0].text += "\n\n" + text;
      else out.push({ role, parts: [{ text }] });
    }
    return out;
  }
  function partsText(cand) {
    const parts = (cand && cand.content && cand.content.parts) || [];
    return parts.filter((p) => !p.thought && typeof p.text === "string").map((p) => p.text).join("");
  }
  async function gFail(res) {
    let msg = "";
    try { const j = await res.json(); msg = (j && j.error && j.error.message) || ""; } catch (e) {}
    if (res.status === 401 || res.status === 403 || /api key/i.test(msg)) return gErr("bad_key", { detail: msg });
    if (res.status === 404) return gErr("model_not_found", { detail: msg });
    if (res.status === 429) return gErr("rate_limited", { detail: msg });
    if (res.status === 400 && /token/i.test(msg)) return gErr("prompt_too_large", { detail: msg });
    return gErr("upstream_error", { detail: msg });
  }
  function makeGemini(getKey, getModel, fetchImpl) {
    const doFetch = fetchImpl || ((u, o) => fetch(u, o));
    async function call(path, body, signal) {
      const key = getKey();
      if (!key) throw gErr("no_key");
      let res;
      try {
        res = await doFetch(GEMINI_BASE + encodeURIComponent(getModel()) + path, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify(body),
          signal
        });
      } catch (e) { throw gErr(e && e.name === "AbortError" ? "cancelled" : "network"); }
      if (!res.ok) throw await gFail(res);
      return res;
    }
    async function sample(messages, opts) {
      opts = opts || {};
      const body = { contents: toContents(messages), generationConfig: { maxOutputTokens: 8192 } };
      if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };
      const res = await call(":streamGenerateContent?alt=sse", body, opts.signal);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "", text = "", finish = "", blocked = "";
      const handle = (line) => {
        if (!line.startsWith("data:")) return;
        const data = line.slice(5).trim();
        if (!data) return;
        let j;
        try { j = JSON.parse(data); } catch (e) { return; }
        if (j.promptFeedback && j.promptFeedback.blockReason) blocked = j.promptFeedback.blockReason;
        const c = j.candidates && j.candidates[0];
        if (!c) return;
        const piece = partsText(c);
        if (piece) { text += piece; if (opts.onText) opts.onText({ text }); }
        if (c.finishReason) finish = c.finishReason;
      };
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf("\n")) >= 0) { handle(buf.slice(0, i).replace(/\r$/, "")); buf = buf.slice(i + 1); }
        }
        buf += dec.decode();
        if (buf) handle(buf);
      } catch (e) { throw gErr(e && e.name === "AbortError" ? "cancelled" : "network", { text }); }
      if (blocked || (!text && /SAFETY|PROHIBITED|BLOCKLIST|SPII/.test(finish))) throw gErr("refused", { text });
      if (!text) throw gErr("empty_completion");
      return { text, truncated: finish === "MAX_TOKENS" };
    }
    sample.json = async function (prompt, opts) {
      opts = opts || {};
      const res = await call(":generateContent", {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 8192 }
      }, opts.signal);
      let j;
      try { j = await res.json(); } catch (e) { throw gErr("invalid_json"); }
      if (j.promptFeedback && j.promptFeedback.blockReason) throw gErr("refused");
      const raw = partsText(j.candidates && j.candidates[0]).trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      try { return JSON.parse(raw); } catch (e) { throw gErr("invalid_json"); }
    };
    return sample;
  }
  async function listModels(key, fetchImpl) {
    if (!key) throw gErr("no_key");
    let res;
    try { res = await (fetchImpl || ((u, o) => fetch(u, o)))(GEMINI_BASE + "?pageSize=200", { headers: { "x-goog-api-key": key } }); }
    catch (e) { throw gErr("network"); }
    if (!res.ok) throw await gFail(res);
    const j = await res.json();
    const bad = /embed|image|tts|live|audio|imagen|veo|robotics|computer-use|aqa|learnlm|gemma|native/i;
    const names = (j.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent") && /^models\/gemini/.test(m.name) && !bad.test(m.name))
      .map((m) => m.name.replace(/^models\//, ""));
    const rank = (n) => (/lite/.test(n) ? 0 : /flash/.test(n) ? 1 : 2);
    return Array.from(new Set(names)).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  }
  /*GEMINI-ADAPTER-END*/

  const DEFAULT_MODEL = "gemini-3.5-flash-lite";
  const getKey = () => String(store.get("gkey", "") || "").trim();
  const getModel = () => String(store.get("gmodel", "") || "").trim() || DEFAULT_MODEL;
  const sample = makeGemini(getKey, getModel);
  let aiState = "pending";

  const downloads = {
    async save({ filename, data }) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + data], { type: "text/markdown;charset=utf-8" }));
      a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      return { status: "saved" };
    }
  };

  const OFF_TEXT = "AI 教練需要先設定 Gemini API 金鑰：展開上方「Gemini 連線設定」，可以免費申請。不想設定也能練習：改用「七面向學習單」，或到「帶去其他 AI」複製教練提示詞。";
  function applyAiState(msg) {
    const st = $("#ai-status");
    if (aiState === "ready") { st.hidden = true; }
    else if (aiState === "off") { st.hidden = false; st.className = "notice warn"; st.textContent = msg || OFF_TEXT; }
    $("#start-btn").disabled = aiState !== "ready";
    $("#ck-ai").disabled = aiState !== "ready";
    $("#ck-ai-note").textContent = aiState === "off" ? "需要先設定 Gemini API 金鑰才能使用 AI 健檢，可以先用下方的自我檢查。" : "";
    const pill = $("#kb-pill");
    pill.className = "pill " + (aiState === "ready" ? "s2" : "s0");
    pill.textContent = aiState === "ready" ? "已啟用" : "未設定";
    $("#kb-sub").textContent = aiState === "ready" ? "模型：" + getModel() : "AI 教練與提示詞健檢需要";
    renderCoach();
  }
  function refreshKeyState(msg) {
    aiState = getKey() ? "ready" : "off";
    applyAiState(msg);
  }
  const ERR = {
    no_key: "還沒有設定 Gemini API 金鑰。請展開上方「Gemini 連線設定」貼上金鑰。",
    bad_key: "API 金鑰無效、已被停用，或沒有使用這個模型的權限。請到上方「Gemini 連線設定」重新確認。",
    model_not_found: "找不到這個模型名稱，請到上方「Gemini 連線設定」換一個模型，例如 gemini-3.5-flash-lite，或按「查詢我可用的模型」。",
    network: "連不到 Gemini 伺服器。可能是網路暫時中斷，或目前的網路封鎖了 googleapis.com。",
    rate_limited: "使用量暫時達到上限（免費額度每分鐘有次數限制），請稍等一分鐘再按「重新送出」。",
    refused: "Gemini 的安全機制擋下了這段內容，請換個說法再試。",
    prompt_too_large: "對話太長了，請按「重新開始」開一輪新的練習。",
    empty_completion: "Gemini 這次沒有產生內容，請按「重新送出」再試。",
    invalid_json: "健檢結果格式有誤，請再按一次。"
  };
  const FATAL = ["no_key", "bad_key"];
  function errText(code) { return ERR[code] || "Gemini 回應時發生錯誤，請按「重新送出」再試一次。"; }''')

# ---------- 教練呼叫：規則改用 systemInstruction ----------
rep('const res = await sample([{ role: "user", content: COACH_RULES }].concat(turns), {\n        cache: false,',
    'const res = await sample(turns, {\n        system: COACH_RULES,')

# ---------- 設定區的行為；收尾改成讀取金鑰狀態 ----------
rep('  aiReady.then(() => {}, () => {});', '''  /* ---------- Gemini 連線設定 ---------- */
  $("#kb-key").value = getKey();
  $("#kb-model").value = getModel();
  $("#keybox").open = !getKey();
  const kbMsg = (s) => { $("#kb-msg").textContent = s; };
  $("#kb-show").addEventListener("click", (e) => {
    const k = $("#kb-key"); const show = k.type === "password";
    k.type = show ? "text" : "password"; e.currentTarget.textContent = show ? "隱藏" : "顯示";
  });
  $("#kb-save").addEventListener("click", () => {
    const key = $("#kb-key").value.trim();
    if (!key) { kbMsg("請先貼上 API 金鑰。"); $("#kb-key").focus(); return; }
    store.set("gkey", key);
    store.set("gmodel", $("#kb-model").value.trim() || DEFAULT_MODEL);
    $("#kb-model").value = getModel();
    showErr(null); refreshKeyState(); kbMsg("已儲存。可以按「測試連線」確認金鑰能用。");
  });
  $("#kb-clear").addEventListener("click", () => {
    store.del("gkey"); $("#kb-key").value = ""; refreshKeyState(); kbMsg("已清除這台電腦上的金鑰。");
  });
  $("#kb-test").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    if (!getKey()) { kbMsg("請先貼上金鑰並按「儲存並啟用」。"); return; }
    btn.disabled = true; kbMsg("測試中…");
    try {
      const r = await sample([{ role: "user", content: "請只回覆「連線成功」四個字。" }]);
      kbMsg("✓ 連線成功（" + getModel() + "）：" + r.text.trim().slice(0, 20));
    } catch (err) {
      kbMsg("✗ " + errText((err && err.code) || "upstream_error"));
    } finally { btn.disabled = false; }
  });

  $("#kb-list").addEventListener("click", async (e) => {
    const btn = e.currentTarget, box = $("#kb-models-out");
    if (!getKey()) { kbMsg("請先貼上金鑰並按「儲存並啟用」。"); return; }
    btn.disabled = true; kbMsg("查詢中…");
    try {
      const names = await listModels(getKey());
      box.innerHTML = "";
      names.forEach((n) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "chip"; b.textContent = n;
        b.addEventListener("click", () => { $("#kb-model").value = n; store.set("gmodel", n); applyAiState(); kbMsg("已改用 " + n + "，可按「測試連線」確認。"); });
        box.appendChild(b);
      });
      box.hidden = !names.length;
      kbMsg(names.length ? "這把金鑰可用的模型共 " + names.length + " 個（越前面通常越便宜），點一下就套用。" : "沒有找到可用的 Gemini 模型。");
    } catch (err) { kbMsg("✗ " + errText((err && err.code) || "upstream_error")); }
    finally { btn.disabled = false; }
  });

  refreshKeyState();''')

head = ('<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n<style>\n'
        '/* 基本設定（原本由 claude.ai 自動補上） */\n:root { color-scheme: light; }\nbody { margin: 0; }\n'
        'img { max-width: 100%; }\n[hidden] { display: none !important; }\n</style>\n')
cut = t.index('<div class="wrap">')
out = head + t[:cut].rstrip('\n') + '\n</head>\n<body>\n' + t[cut:].rstrip('\n') + '\n</body>\n</html>\n'
assert 'window.claude' not in out, "還有殘留的 window.claude"
open(dst, 'wb').write(b'\xef\xbb\xbf' + out.encode('utf-8'))
print("完成，所有替換點都只命中一次；window.claude 已全部移除")
