(()=>{
  'use strict';
  const form = document.getElementById('queryForm');
  const wordInput = document.getElementById('wordInput');
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const optionGroup = document.getElementById('optionGroup');
  const displayEl = document.getElementById('display');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');

  let currentData = null;
  const labelMap = { meaning:'词义', root:'词根', affixes:'词缀', derivatives:'派生词', mnemonic:'助记' };

  // 初始化：优先从 storage 读取划词选中的单词；若无则使用 scripting 直接读取活动页 selection
  function initPrefill(){
    chrome.storage.local.get(['selectedWord'], (result) => {
      if(result.selectedWord){
        applyPrefill(result.selectedWord, '[Popup] storage');
        chrome.storage.local.remove('selectedWord');
      } else {
        // 先尝试向 content script 请求（更快，无需注入）
        queryTab((tabId) => {
          chrome.tabs.sendMessage(tabId, { type:'GET_SELECTED_WORD' }, (resp) => {
            if(resp && resp.ok && resp.word){
              applyPrefill(resp.word, '[Popup] message contentScript');
            } else {
              // 再注入脚本作为最终回退
              fallbackScript(tabId);
            }
          });
        });
      }
    });
  }

  function queryTab(cb){
    chrome.tabs.query({active:true,currentWindow:true}, (tabs) => {
      const tab = tabs && tabs[0];
      if(!tab){ console.log('[Popup] 无活动标签页'); return; }
      cb(tab.id);
    });
  }

  function fallbackScript(tabId){
    if(!chrome.scripting){ console.log('[Popup] 无 scripting 权限'); return; }
    chrome.scripting.executeScript({
      target:{tabId},
      func: () => {
        const sel = window.getSelection();
        return sel ? sel.toString() : '';
      }
    }, (results) => {
      const raw = results && results[0] && results[0].result ? results[0].result.trim() : '';
      if(raw && /^[A-Za-z][A-Za-z\-'’]*$/.test(raw) && !/\s/.test(raw)){
        applyPrefill(raw, '[Popup] scripting fallback');
      } else {
        console.log('[Popup] 无有效划词可填充');
      }
    });
  }

  function applyPrefill(word, source){
    console.log(source+':', word);
    wordInput.value = word;
    wordInput.select();
  }

  initPrefill();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const w = wordInput.value.trim();
    if(!w) return;
    console.log('[Popup] 提交查询:', w);
    hideError();
    optionGroup.innerHTML='';
    displayEl.value='';
    setLoading(true);
    chrome.runtime.sendMessage({ type: 'LOOKUP_WORD', word: w }, (resp) => {
      setLoading(false);
      if(!resp){ return showError('未收到响应'); }
      if(!resp.ok){ return showError(resp.error || '查询失败'); }
      currentData = normalize(resp.data);
      if(Object.keys(currentData).length === 0){ return showError('结果为空，稍后重试或检查 API Key'); }
      console.log('[Popup] 查询成功，构建选项');
      buildOptions(currentData);
    });
  });

  function setLoading(state){ loadingEl.classList.toggle('hidden', !state); }
  function showError(msg){ errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
  function hideError(){ errorEl.classList.add('hidden'); }

  function normalize(raw){
    if(!raw || typeof raw !== 'object') return {};
    const obj = {
      meaning: raw.meaning || raw.definition || '',
      root: raw.root || '',
      affixes: formatAffixes(raw.affixes),
      derivatives: Array.isArray(raw.derivatives) ? raw.derivatives.join('\n') : (raw.derivatives || ''),
      mnemonic: raw.mnemonic || ''
    };
    Object.entries(obj).forEach(([k,v]) => { if(!v) obj[k] = '（无' + labelMap[k] + '）'; });
    return obj;
  }
  function formatAffixes(a){
    if(!a) return '';
    if(typeof a === 'string') return a;
    if(typeof a === 'object') return Object.entries(a).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(', '):v}`).join('\n');
    return '';
  }

  function buildOptions(data){
    const items = [ 'meaning','root','affixes','derivatives','mnemonic' ];
    items.forEach((key,i) => {
      const id = 'opt_'+key;
      const label = labelMap[key];
      const wrapper = document.createElement('label');
      const input = document.createElement('input');
      input.type='radio'; input.name='section'; input.value=key; input.id=id; if(i===0) input.checked=true;
      const span = document.createElement('span'); span.textContent=label;
      wrapper.appendChild(input); wrapper.appendChild(span); optionGroup.appendChild(wrapper);
      input.addEventListener('change', () => renderSection(key));
    });
    renderSection(items[0]);
  }

  function renderSection(key){
    if(!currentData) return;
    displayEl.value = currentData[key] || '（无内容）';
  }

  wordInput.addEventListener('keydown', e => { if(e.key==='Enter') form.requestSubmit(); });
  clearBtn && clearBtn.addEventListener('click', () => { wordInput.value=''; optionGroup.innerHTML=''; displayEl.value=''; currentData=null; hideError(); wordInput.focus(); });
  copyBtn && copyBtn.addEventListener('click', () => {
    const text = displayEl.value || '';
    if(!text || /^（无/.test(text)) return;
    navigator.clipboard.writeText(text).then(()=>{ const o=copyBtn.textContent; copyBtn.textContent='已复制'; setTimeout(()=>copyBtn.textContent=o,1500); })
    .catch(()=>{ const o=copyBtn.textContent; copyBtn.textContent='复制失败'; setTimeout(()=>copyBtn.textContent=o,1800); });
  });
})();
