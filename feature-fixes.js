/* Separate script: icon-size handlers must not depend on successful execution of the 2 MB app script. */
(function () {
  'use strict';
  function initChatCssTools(){
    const input=document.getElementById('custom-css-input');
    const newBtn=document.getElementById('chat-css-new-btn');
    const updateBtn=document.getElementById('chat-css-update-btn');
    const importBtn=document.getElementById('chat-css-import-btn');
    const fileInput=document.getElementById('chat-css-import-file');
    if(input&&newBtn&&updateBtn&&importBtn&&fileInput&&!newBtn.dataset.ready){
      newBtn.dataset.ready='1';
      newBtn.addEventListener('click',()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();});
      updateBtn.addEventListener('click',async()=>{
        try{
          if(typeof _0x24f906==='undefined'||!_0x24f906.appearancePresets)throw new Error('预设数据库尚未就绪');
          const themeSelect=document.getElementById('theme-preset-select');
          if(!themeSelect||!themeSelect.value){alert('请先在上方“气泡主题”中选择要更新的预设。');return;}
          const opt=themeSelect.options[themeSelect.selectedIndex];
          const rows=await _0x24f906.appearancePresets.where('type').equals('bubble_theme').toArray();
          let row=rows.find(r=>String(r.id)===String(themeSelect.value));
          if(!row&&opt)row=rows.find(r=>r.name===opt.textContent.trim());
          if(!row){alert('未能识别当前气泡主题预设，请重新选择后再试。');return;}
          const previous=row.value&&typeof row.value==='object'?row.value:{};
          await _0x24f906.appearancePresets.update(row.id,{value:{...previous,base:previous.base||'default',custom:input.value}});
          alert('已更新所选气泡主题预设中的自定义 CSS。');
        }catch(e){alert('更新失败：'+(e.message||e));}
      });
      importBtn.addEventListener('click',()=>fileInput.click());
      fileInput.addEventListener('change',async()=>{
        const f=fileInput.files&&fileInput.files[0];if(!f)return;
        try{
          let text='';
          if(/\.docx$/i.test(f.name)){
            if(typeof JSZip!=='undefined'){
              const zip=await JSZip.loadAsync(f);const doc=zip.file('word/document.xml');
              if(!doc)throw new Error('DOCX中未找到正文');
              const xml=await doc.async('text');
              text=xml.replace(/<\/w:p>/g,'\n').replace(/<w:tab[^>]*\/>/g,'\t').replace(/<[^>]+>/g,'')
                .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
            }else if(typeof mammoth!=='undefined'&&mammoth.extractRawText){const result=await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()});text=result.value||'';}
            else throw new Error('当前环境没有可用的 DOCX 解析组件，请将代码另存为 TXT 后导入。');
          }else text=await f.text();
          if(!text.trim())throw new Error('文件内容为空');
          input.value=text;input.dispatchEvent(new Event('input',{bubbles:true}));alert('代码已导入到当前聊天 CSS 输入框，请检查后保存。');
        }catch(e){alert('导入失败：'+(e.message||e));}finally{fileInput.value='';}
      });
    }
  }
  function initDesktopSizing() {
    const iconSlider = document.getElementById('desktop-icon-size-slider');
    const widgetSlider = document.getElementById('desktop-widget-size-slider');
    const iconValue = document.getElementById('desktop-icon-size-value');
    const widgetValue = document.getElementById('desktop-widget-size-value');
    if (iconSlider && !iconSlider.dataset.sizingReady) {
      iconSlider.dataset.sizingReady = '1';
      const applyIcon = value => {
        const n = Math.max(36, Math.min(88, Number(value) || 55));
        document.querySelectorAll('.icon-bg-desktop').forEach(el => {
          el.style.setProperty('width', n + 'px', 'important');
          el.style.setProperty('height', n + 'px', 'important');
          el.style.setProperty('min-width', n + 'px', 'important');
          el.style.setProperty('min-height', n + 'px', 'important');
          el.style.setProperty('flex', '0 0 ' + n + 'px', 'important');
          el.querySelectorAll('img').forEach(img => {
            img.style.setProperty('width', '100%', 'important');
            img.style.setProperty('height', '100%', 'important');
          });
        });
        if (iconValue) iconValue.textContent = n + 'px';
        try { localStorage.setItem('ephone_desktop_icon_size', String(n)); } catch (_) {}
      };
      let saved = Number(iconSlider.value) || 55;
      try { saved = Number(localStorage.getItem('ephone_desktop_icon_size')) || saved; } catch (_) {}
      iconSlider.value = String(Math.max(36, Math.min(88, saved)));
      iconSlider.addEventListener('input', e => applyIcon(e.target.value));
      iconSlider.addEventListener('change', e => applyIcon(e.target.value));
      applyIcon(iconSlider.value);
    }
    if (widgetSlider && !widgetSlider.dataset.sizingReady) {
      widgetSlider.dataset.sizingReady = '1';
      const applyWidget = value => {
        const n = Math.max(36, Math.min(110, Number(value) || 55));
        document.querySelectorAll('.small-widget-icon-wrapper').forEach(el => {
          el.style.setProperty('width', n + 'px', 'important');
          el.style.setProperty('height', n + 'px', 'important');
          el.style.setProperty('min-width', n + 'px', 'important');
          el.style.setProperty('min-height', n + 'px', 'important');
          el.style.setProperty('flex', '0 0 ' + n + 'px', 'important');
          el.querySelectorAll('img').forEach(img => {
            img.style.setProperty('width', '100%', 'important');
            img.style.setProperty('height', '100%', 'important');
          });
        });
        if (widgetValue) widgetValue.textContent = n + 'px';
        try { localStorage.setItem('ephone_desktop_widget_size', String(n)); } catch (_) {}
      };
      let saved = Number(widgetSlider.value) || 55;
      try { saved = Number(localStorage.getItem('ephone_desktop_widget_size')) || saved; } catch (_) {}
      widgetSlider.value = String(Math.max(36, Math.min(110, saved)));
      widgetSlider.addEventListener('input', e => applyWidget(e.target.value));
      widgetSlider.addEventListener('change', e => applyWidget(e.target.value));
      applyWidget(widgetSlider.value);
    }
  }
  function init() {
    try { initChatCssTools(); } catch (e) { console.error('Chat CSS tools init failed:', e); }
    try { initDesktopSizing(); } catch (e) { console.error('Desktop sizing init failed:', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
