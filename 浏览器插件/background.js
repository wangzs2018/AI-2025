// background.js (service worker)
// 负责与 Deepseek API 通信，不直接暴露密钥。密钥建议放在用户本地的 chrome.storage 中或未提交的 config.json。

async function fetchWordData(word) {
  if(!word) throw new Error('缺少单词');
  const apiKey = await getApiKey();
  if(!apiKey) throw new Error('未配置 API Key，请在扩展存储中设置');

  // 统一 prompt：要求 Deepseek 返回规范 JSON，避免解析困难
  const prompt = `请针对英文单词 "${word}" 返回严格 JSON，仅含字段: meaning(词义)，root(词根)，affixes(词缀，可含前缀/后缀说明)，derivatives(常见派生词数组)，mnemonic(助记)。只返回纯 JSON，不要附加额外文字。`;

  const body = {
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "你是一个英文字源与词汇助手，只输出有效 JSON。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  };

  const resp = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if(!resp.ok){
    const text = await resp.text();
    throw new Error(`API 请求失败: ${resp.status} ${text}`);
  }
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if(!content) throw new Error('API 返回空内容');
  // 内容期望是纯 JSON
  try {
    return JSON.parse(content);
  } catch(e){
    // 尝试提取 JSON
    const match = content.match(/\{[\s\S]*\}/);
    if(match){
      try{ return JSON.parse(match[0]); }catch(e2){ /* ignore */ }
    }
    throw new Error('解析 JSON 失败: ' + e.message);
  }
}

function getApiKey(){
  return new Promise(resolve => {
    chrome.storage.sync.get(['deepseekApiKey'], (res) => {
      resolve(res.deepseekApiKey || null);
    });
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.type === 'LOOKUP_WORD'){
    fetchWordData(msg.word)
      .then(result => sendResponse({ ok:true, data: result }))
      .catch(err => sendResponse({ ok:false, error: err.message }));
    return true; // async response
  }
});
