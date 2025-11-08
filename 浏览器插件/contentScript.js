// contentScript.js - 划词捕获逻辑（增强版）
(()=>{
  'use strict';

  let lastStored = '';
  const WORD_RE = /^[A-Za-z][A-Za-z\-'’]*$/; // 支持内部连字符与撇号

  function sanitize(raw){
    if(!raw) return '';
    // 去掉前后标点
    const trimmed = raw.trim().replace(/^[^A-Za-z]+|[^A-Za-z]+$/g,'');
    return trimmed;
  }

  function maybeStore(raw){
    const word = sanitize(raw);
    if(!word) return;
    if(word.length > 50){
      console.log('[ContentScript] 过长忽略:', word.slice(0,30));
      return;
    }
    if(!WORD_RE.test(word)){
      console.log('[ContentScript] 非单词模式忽略:', word);
      return;
    }
    if(word === lastStored){
      // 避免频繁写入
      return;
    }
    lastStored = word;
    chrome.storage.local.set({ selectedWord: word, selectedWordTs: Date.now() }, () => {
      console.log('[ContentScript] 已存储划词单词:', word);
    });
  }

  function capture(){
    const sel = window.getSelection();
    if(!sel) return;
    const text = sel.toString();
    if(!text) return;
    maybeStore(text);
  }

  // 多种事件确保稳定：mouseup / selectionchange / dblclick
  document.addEventListener('mouseup', () => setTimeout(capture, 5));
  document.addEventListener('selectionchange', () => setTimeout(capture, 20));
  document.addEventListener('dblclick', () => setTimeout(capture, 5));

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg && msg.type === 'GET_SELECTED_WORD'){
      // 直接返回 lastStored 与当前 selection 的对比，避免遗漏最新未存储的
      const currentSel = window.getSelection()?.toString() || '';
      const candidate = currentSel.trim() || lastStored;
      const sanitized = sanitize(candidate);
      if(sanitized && WORD_RE.test(sanitized)){
        sendResponse({ ok:true, word: sanitized });
      } else {
        sendResponse({ ok:false });
      }
      return true; // async safe
    }
  });

  console.log('[ContentScript] 划词监听初始化完成');
})();
