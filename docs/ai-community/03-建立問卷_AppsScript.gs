/**
 * ============================================================
 * 教務處 AI 推廣社群｜種子同仁現況調查問卷 —— 自動建表程式
 * ============================================================
 *
 * 【這支程式做什麼】
 * 執行一次，就會在您的 Google 雲端硬碟自動建立一份完整的
 * Google 表單（共 18 題，含所有選項、必填設定與說明文字），
 * 不必手動一題一題建。完全免費，不需要任何額外訂閱。
 *
 * 【怎麼使用】（照著做，約 2 分鐘）
 *  1. 用您的學校 Google 帳號登入，開啟 https://script.google.com
 *  2. 點左上角「新增專案」
 *  3. 把編輯器裡原本的程式碼「全部刪除」
 *  4. 把本檔案「全部內容」複製貼上進去
 *  5. 點上方的「儲存」圖示（磁片圖案）
 *  6. 上方函式下拉選單選擇「createAiCommunitySurvey」
 *  7. 點「執行」
 *  8. 第一次執行會跳出授權視窗：
 *       點「審查權限」→ 選擇您的帳號 → 若出現「Google 尚未驗證這個應用程式」，
 *       點左下角「進階」→「前往 未命名的專案（不安全）」→「允許」
 *       （這是因為程式是您自己寫的、未經 Google 商店審查，屬正常現象）
 *  9. 執行完成後，畫面下方「執行紀錄」會印出兩個網址：
 *       ★ 編輯網址：您自己用來檢視與修改表單
 *       ★ 填寫網址：貼到邀請信裡發給同仁的連結
 *
 * 【建立後您還要做三件事】
 *  1. 第 2 題「所屬單位」的選項是通用組室名稱，請改成貴校教務處實際的組室。
 *  2. 首頁說明文字中的「○○○」與「分機 ○○○」請改成您的姓名與分機。
 *  3. 表單建立後請自己先填一次，確認流程順暢。
 *
 * ============================================================
 */

function createAiCommunitySurvey() {

  // ---------- 建立表單本體 ----------
  var form = FormApp.create('教務處 AI 推廣社群｜種子同仁現況調查');

  form.setDescription(
    '您好，感謝您獲推薦參與教務處 AI 推廣社群。\n\n' +
    '這份問卷約需 5 分鐘，目的是讓我們了解大家目前的起點，\n' +
    '以便安排合適的課程深度、聚會主題與分組方向。\n\n' +
    '【本問卷沒有標準答案】\n' +
    '完全沒有接觸過 AI，是非常重要且非常正常的起點資訊，\n' +
    '請放心依實際情況作答，不需要為了「看起來會」而勾選。\n\n' +
    '【本問卷的用途】\n' +
    '僅供本處課程規劃與社群分組使用，\n' +
    '不作為考績、績效或任何評比依據，也不會提供予單位主管。\n\n' +
    '如有任何疑問，歡迎隨時與我聯繫。\n' +
    '教務處 ○○○　分機 ○○○'
  );

  form.setProgressBar(false);            // 單頁問卷，不顯示進度條
  form.setShowLinkToRespondAgain(false); // 送出後不顯示「再填一次」
  form.setConfirmationMessage(
    '感謝您的填答！\n\n' +
    '我們會依大家的回覆規劃課程深度與聚會主題，\n' +
    '首次社群聚會的時間與地點將另行通知。'
  );

  // 限制只有校內 Google 帳號可填寫（個人帳號會失敗，失敗就自動略過）
  try {
    form.setRequireLogin(true);
  } catch (e) {
    Logger.log('提醒：無法設定「限校內帳號填寫」，可能您使用的是個人 Google 帳號，此設定已略過（不影響表單使用）。');
  }

  // 順便收集填答者的 Email，方便後續聯繫（若不需要可刪除這一整段 try）
  try {
    form.setEmailCollectionType(FormApp.EmailCollectionType.VERIFIED);
  } catch (e1) {
    try {
      form.setCollectEmail(true);
    } catch (e2) {
      Logger.log('提醒：無法自動收集 Email，此設定已略過（不影響表單使用）。');
    }
  }


  // ========== 第一部分：基本資料 ==========
  form.addSectionHeaderItem()
      .setTitle('第一部分：基本資料')
      .setHelpText('共 2 題');

  // Q1 姓名
  form.addTextItem()
      .setTitle('1. 您的姓名')
      .setRequired(true);

  // Q2 所屬單位　※※※ 請改成貴校實際組室名稱 ※※※
  form.addListItem()
      .setTitle('2. 您所屬的單位')
      .setChoiceValues([
        '註冊組',
        '課務組',
        '招生組',
        '教學發展中心',
        '綜合業務組',
        '教務處行政辦公室',
        '其他'
      ])
      .setRequired(true);


  // ========== 第二部分：AI 使用經驗盤點 ==========
  form.addSectionHeaderItem()
      .setTitle('第二部分：AI 使用經驗')
      .setHelpText('共 9 題。請依實際情況作答，沒有標準答案。');

  // Q3 用過哪些工具
  form.addCheckboxItem()
      .setTitle('3. 您使用過下列哪些 AI 工具？（可複選）')
      .setChoiceValues([
        'Google Gemini',
        'ChatGPT',
        'Claude',
        'NotebookLM',
        'Microsoft Copilot',
        'Perplexity',
        'AI 繪圖工具（如 Midjourney、Imagen）',
        'AI 逐字稿／會議紀錄工具',
        '目前都還沒有使用過'
      ])
      .showOtherOption(true)
      .setRequired(true);

  // Q4 使用頻率
  form.addMultipleChoiceItem()
      .setTitle('4. 您使用 AI 工具的頻率大約是？')
      .setChoiceValues([
        '幾乎每天使用',
        '每週使用數次',
        '每月使用數次',
        '很少使用，偶爾試試',
        '從未使用'
      ])
      .setRequired(true);

  // Q5 ★核心分級題：實際做過什麼
  form.addCheckboxItem()
      .setTitle('5. 以下事情，您實際做過哪些？（可複選）')
      .setHelpText('請依實際做過的勾選，做過一次也算。這題沒有多勾比較好的問題。')
      .setChoiceValues([
        '用 AI 查詢資料或詢問不懂的事情',
        '用 AI 潤飾、改寫或翻譯文字',
        '用 AI 產出公文、簽稿或通知的初稿',
        '用 AI 摘要長篇文件、會議紀錄或法規',
        '上傳自己的檔案（PDF、Word、Excel）請 AI 分析',
        '用 AI 整理或分析表格、數據資料',
        '為了得到更好的結果，反覆修改自己的提問方式',
        '把好用的提問內容存下來，之後重複使用',
        '教過或協助過其他同仁使用 AI 工具',
        '以上皆未做過'
      ])
      .setRequired(true);

  // Q6 ★NotebookLM（對應校訂目標）
  form.addMultipleChoiceItem()
      .setTitle('6. 關於 NotebookLM，您目前的狀況是？')
      .setChoiceValues([
        '沒聽過',
        '聽過，但沒有用過',
        '用過，但還不太熟',
        '用過，能自行上傳資料並進行問答',
        '很熟悉，可以教其他同仁使用'
      ])
      .setRequired(true);

  // Q7 自動化／開發工具經驗
  form.addCheckboxItem()
      .setTitle('7. 您使用過下列哪些工具？（可複選）')
      .setHelpText('這題是為了了解課程可以規劃到什麼深度，沒有勾選完全不影響參與。')
      .setChoiceValues([
        'Excel／Google 試算表的函式（如 VLOOKUP、樞紐分析）',
        'Google 表單，並曾設定過自動回覆或串接',
        'Google Apps Script',
        'Google Colab 或 Python',
        'Power Automate 或其他自動化工具',
        '網頁 HTML／CSS 編輯',
        'Google AI Studio',
        '以上都沒有使用過'
      ])
      .showOtherOption(true)
      .setRequired(false);

  // Q8 執行力
  form.addMultipleChoiceItem()
      .setTitle('8. 您是否曾在 AI 協助下，完成一個有實際成果的小工具或流程改善？')
      .setChoiceValues([
        '沒有做過',
        '有想法，但還沒動手',
        '動手做過，但沒有完成',
        '完成過，目前自己在使用',
        '完成過，並且分享給其他同仁使用'
      ])
      .setRequired(false);

  // Q9 ★HITL 素養
  form.addMultipleChoiceItem()
      .setTitle('9. 當 AI 給出的內容可能有錯誤時，您的處理方式比較接近？')
      .setChoiceValues([
        '還沒特別注意過這件事',
        '知道要查證，但不確定該怎麼查',
        '重要的數字、日期與法規會再自行核對',
        '會要求 AI 附上出處，並逐一查核來源'
      ])
      .setRequired(true);

  // Q10 ★風險認知
  form.addMultipleChoiceItem()
      .setTitle('10. 關於「個資與敏感資料不應上傳至境外 AI 服務」，您的了解程度是？')
      .setChoiceValues([
        '第一次聽到',
        '知道有這個原則，但不確定界線在哪裡',
        '清楚知道，使用時會主動避開',
        '能向其他同仁說明判斷標準'
      ])
      .setRequired(true);

  // Q11 ★分軌題
  form.addCheckboxItem()
      .setTitle('11. 社群規劃了三個方向，您想參與哪些？（可複選）')
      .setHelpText('可以複選，也可以先選觀望，後續隨時能調整。')
      .setChoiceValues([
        '考照輔導組——有意取得 AI 相關證照，希望有人一起備考',
        '校內活動參與組——想參加校內行政 AI 競賽、組隊實作',
        'Vibe Coding 進階社群——想學習開發單位專用的小工具',
        '先觀望，想多了解一陣子再決定'
      ])
      .setRequired(true);


  // ========== 第三部分：業務痛點蒐集 ==========
  form.addSectionHeaderItem()
      .setTitle('第三部分：您的業務現況')
      .setHelpText('共 3 題。這部分的答案，將直接成為社群第一批要處理的實際題目。');

  // Q12 最耗時的重複性業務
  form.addParagraphTextItem()
      .setTitle('12. 您目前的業務中，最耗時且高度重複的工作是什麼？請簡述 1 至 2 項。')
      .setHelpText(
        '請以業務類型描述即可，無須填寫學生個資、身分證號或具體個案內容。\n' +
        '例：每學期彙整各系所開課資料並核對格式。'
      )
      .setRequired(true);

  // Q13 詢答服務需求（餵養 NotebookLM 校訂目標）
  form.addParagraphTextItem()
      .setTitle('13. 如果有一個「能回答教務業務問題的 AI 助理」，您最希望它能回答哪一類問題？')
      .setHelpText('例：抵免學分的規定、各系必修學分數、成績更正的作業流程。')
      .setRequired(false);

  // Q14 現有資料來源
  form.addCheckboxItem()
      .setTitle('14. 您手邊是否有已整理好、可作為 AI 問答資料來源的文件？（可複選）')
      .setChoiceValues([
        '法規、辦法或要點彙編',
        '常見問答（FAQ）整理',
        '作業手冊或 SOP',
        '歷年公文或簽稿範例',
        '簡報、教材或教育訓練資料',
        '目前沒有現成整理好的'
      ])
      .showOtherOption(true)
      .setRequired(false);


  // ========== 第四部分：工具與環境現況 ==========
  form.addSectionHeaderItem()
      .setTitle('第四部分：工具與環境')
      .setHelpText('共 4 題，最後一部分了。');

  // Q15 裝置
  form.addCheckboxItem()
      .setTitle('15. 您處理公務時主要使用的裝置？（可複選）')
      .setChoiceValues([
        '辦公室公務桌機',
        '個人筆記型電腦',
        '手機或平板'
      ])
      .setRequired(true);

  // Q16 帳號可用性（第一次聚會前必須處理完）
  form.addMultipleChoiceItem()
      .setTitle('16. 您是否有本校 Google Workspace 帳號，並可正常使用 Gemini？')
      .setChoiceValues([
        '可以正常使用',
        '有帳號，但沒用過 Gemini',
        '不確定',
        '沒有帳號'
      ])
      .setRequired(true);

  // Q17 自費訂閱（投入意願的間接指標）
  form.addMultipleChoiceItem()
      .setTitle('17. 您目前是否有自費訂閱任何 AI 服務？')
      .setHelpText('本題不涉及費用補助，僅供了解大家的使用情況。')
      .setChoiceValues([
        '有，目前付費訂閱中',
        '曾經訂閱過，目前沒有',
        '只使用免費版',
        '沒有使用'
      ])
      .setRequired(false);

  // Q18 課程主題偏好（最多選 3 項）
  var q18 = form.addCheckboxItem()
      .setTitle('18. 對於社群的課程與聚會，您希望優先安排哪些主題？（可複選，最多 3 項）')
      .setChoiceValues([
        'AI 工具基礎操作入門',
        '提示詞（Prompt）撰寫技巧',
        '公文與文書寫作應用',
        '資料整理與試算表應用',
        'NotebookLM 詢答服務建置實作',
        'AI 證照考照準備',
        'Apps Script／自動化入門',
        '資安、個資與 AI 使用倫理'
      ])
      .showOtherOption(true)
      .setRequired(true);

  // 限制最多勾選 3 項（若此 API 在您的環境不支援，會自動略過）
  try {
    var rule = FormApp.createCheckboxValidation()
                      .setHelpText('最多只能選擇 3 項')
                      .requireSelectAtMost(3)
                      .build();
    q18.setValidation(rule);
  } catch (e) {
    Logger.log('提醒：無法設定「最多選 3 項」的限制，此設定已略過（不影響表單使用）。');
  }


  // ---------- 完成，印出網址 ----------
  Logger.log('==========================================');
  Logger.log('✅ 問卷建立完成！共 18 題');
  Logger.log('==========================================');
  Logger.log('★ 編輯網址（您自己修改用）：');
  Logger.log(form.getEditUrl());
  Logger.log('');
  Logger.log('★ 填寫網址（貼到邀請信裡發給同仁）：');
  Logger.log(form.getPublishedUrl());
  Logger.log('==========================================');
  Logger.log('別忘了三件事：');
  Logger.log('  1. 修改第 2 題的組室名稱為貴校實際組室');
  Logger.log('  2. 修改首頁說明中的「○○○」為您的姓名與分機');
  Logger.log('  3. 自己先填一次，確認流程順暢');
  Logger.log('==========================================');
}
