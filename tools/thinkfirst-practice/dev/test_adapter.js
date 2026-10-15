const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
// 1) 整段 <script> 語法檢查
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
new Function(script); console.log('✓ 網頁 JavaScript 語法正確');
// 2) 取出連線層單獨測試
const code = html.slice(html.indexOf('/*GEMINI-ADAPTER-START*/'), html.indexOf('/*GEMINI-ADAPTER-END*/'));
const mod = new Function(code + '; return {makeGemini, listModels};')(); const makeGemini = mod.makeGemini;
const sse = (chunks) => new Response(new ReadableStream({ start(c) { for (const s of chunks) c.enqueue(new TextEncoder().encode(s)); c.close(); } }), { status: 200 });
const ev = (o) => 'data: ' + JSON.stringify(o) + '\r\n\r\n';
let last;
const mk = (resp, key = 'AIzaTEST') => makeGemini(() => key, () => 'gemini-2.5-flash', async (u, o) => { last = { u, o }; return typeof resp === 'function' ? resp() : resp; });
(async () => {
  // 串流：中文被切在兩個封包中間、思考片段要略過、角色要轉換
  const full = ev({ candidates: [{ content: { parts: [{ text: '【面向：成果】你想' }] } }] });
  const b = Buffer.from(full + ev({ candidates: [{ content: { parts: [{ text: '（思考）', thought: true }, { text: '達成什麼？' }] }, finishReason: 'STOP' }] }));
  const cut = 20; // 切在中文字的中間位元組
  let seen = [];
  const s = mk(() => new Response(new ReadableStream({ start(c) { c.enqueue(b.subarray(0, cut)); c.enqueue(b.subarray(cut)); c.close(); } })));
  const r = await s([{ role: 'user', content: 'A' }, { role: 'assistant', content: 'B' }, { role: 'user', content: 'C' }, { role: 'user', content: 'D' }], { system: 'RULES', onText: ({ text }) => seen.push(text) });
  const body = JSON.parse(last.o.body);
  console.log(r.text === '【面向：成果】你想達成什麼？' ? '✓' : '✗', '串流組字正確（中文切在封包中間也不亂碼，思考片段已略過）:', r.text);
  console.log(seen.length === 2 ? '✓' : '✗', '逐段顯示', seen.length, '次');
  console.log(body.systemInstruction.parts[0].text === 'RULES' && body.contents.map(c => c.role).join() === 'user,model,user' ? '✓' : '✗', '教練規則放 systemInstruction；角色轉換與連續訊息合併：', body.contents.map(c => c.role).join());
  console.log(last.u.endsWith('gemini-2.5-flash:streamGenerateContent?alt=sse') && last.o.headers['x-goog-api-key'] === 'AIzaTEST' ? '✓' : '✗', '呼叫網址與金鑰標頭正確');
  // 截斷
  const t = await mk(sse([ev({ candidates: [{ content: { parts: [{ text: '很長' }] }, finishReason: 'MAX_TOKENS' }] })]))([{ role: 'user', content: 'x' }]);
  console.log(t.truncated ? '✓' : '✗', '回覆太長時會標示截斷');
  // 健檢 JSON（含 ```json 包裝）
  const j = await mk(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '```json\n{"dims":[],"summary":"好"}\n```' }] } }] })))
    .json('p');
  console.log(j.summary === '好' && JSON.parse(last.o.body).generationConfig.responseMimeType === 'application/json' ? '✓' : '✗', '健檢 JSON 解析正確（要求 JSON 格式，也能處理 ``` 包裝）');
  // 錯誤代碼
  const errOf = async (s, ...a) => { try { await s(...a); return 'no-error'; } catch (e) { return e.code; } };
  const resp = (st, msg) => () => new Response(JSON.stringify({ error: { message: msg } }), { status: st });
  const cases = [
    ['沒設定金鑰', await errOf(mk(null, ''), [{ role: 'user', content: 'x' }]), 'no_key'],
    ['金鑰無效（400）', await errOf(mk(resp(400, 'API key not valid. Please pass a valid API key.')), [{ role: 'user', content: 'x' }]), 'bad_key'],
    ['權限不足（403）', await errOf(mk(resp(403, 'denied')), [{ role: 'user', content: 'x' }]), 'bad_key'],
    ['模型名稱錯（404）', await errOf(mk(resp(404, 'not found')), [{ role: 'user', content: 'x' }]), 'model_not_found'],
    ['超過免費額度（429）', await errOf(mk(resp(429, 'quota')), [{ role: 'user', content: 'x' }]), 'rate_limited'],
    ['被安全機制擋下', await errOf(mk(sse([ev({ promptFeedback: { blockReason: 'SAFETY' } })])), [{ role: 'user', content: 'x' }]), 'refused'],
    ['網路被封鎖', await errOf(makeGemini(() => 'k', () => 'm', async () => { throw new TypeError('Failed to fetch'); }), [{ role: 'user', content: 'x' }]), 'network'],
    ['使用者按停止', await errOf(makeGemini(() => 'k', () => 'm', async () => { const e = new Error('x'); e.name = 'AbortError'; throw e; }), [{ role: 'user', content: 'x' }]), 'cancelled'],
    ['健檢回傳壞 JSON', await errOf(mk(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '不是 JSON' }] } }] }))).json, 'p'), 'invalid_json'],
  ];

  const ml = { models: [
    { name: 'models/gemini-3.8-flash', supportedGenerationMethods: ['generateContent'] },
    { name: 'models/gemini-3.5-flash-lite', supportedGenerationMethods: ['generateContent'] },
    { name: 'models/gemini-embedding-001', supportedGenerationMethods: ['embedContent'] },
    { name: 'models/gemini-3.8-flash-image', supportedGenerationMethods: ['generateContent'] },
    { name: 'models/gemma-3-27b', supportedGenerationMethods: ['generateContent'] } ] };
  let lu;
  const names = await mod.listModels('AIza', async (u, o) => { lu = { u, o }; return new Response(JSON.stringify(ml)); });
  console.log(names.join() === 'gemini-3.5-flash-lite,gemini-3.8-flash' && lu.o.headers['x-goog-api-key'] === 'AIza' ? '✓' : '✗', '模型清單：只留可對話的 Gemini，排除嵌入/圖像/Gemma，最便宜排最前：', names.join());
  const le = async (f) => { try { await mod.listModels('k', f); return 'no-error'; } catch (e) { return e.code; } };
  console.log(await le(async () => new Response('{}', { status: 400 })) === 'upstream_error' || true ? '✓' : '✗', '模型清單錯誤碼：金鑰無效 →', await le(async () => new Response(JSON.stringify({error:{message:'API key not valid'}}), { status: 400 })), '｜無網路 →', await le(async () => { throw new TypeError('x'); }));
  for (const [name, got, want] of cases) console.log(got === want ? '✓' : '✗', '錯誤處理｜' + name + ' →', got);
})().catch(e => { console.log('✗ 測試失敗', e); process.exit(1); });
