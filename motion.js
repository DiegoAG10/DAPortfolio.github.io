(() => {
 const dialog=document.querySelector('#motion-viewer');let opener;
 const text=(es,en)=>document.documentElement.lang==='es'?es:en;
 window.openMotion=index=>{
  const item=window.DA_PROJECTS[index];opener=document.activeElement;
  const src=item.src.split('/').map(encodeURIComponent).join('/');
  dialog.innerHTML=`<div class="motion-shell"><header class="motion-header"><h2 id="motion-title">${text(item.titleEs,item.titleEn)}</h2><button class="motion-close" aria-label="${text('Cerrar','Close')}">${window.viewerIcon('close')}</button></header><div class="motion-stage"><video controls playsinline preload="metadata" aria-label="${text(item.titleEs,item.titleEn)}" src="${src}">${text('Tu navegador no puede reproducir este video.','Your browser cannot play this video.')}</video></div><div class="motion-footer"><span>Motion</span><p class="motion-error" role="status"></p><a href="${src}" target="_blank" rel="noopener">${text('Abrir original','Open original')}</a></div></div>`;
  dialog.querySelector('video').addEventListener('error',()=>{dialog.querySelector('.motion-error').textContent=text('No se pudo reproducir el video. Puedes abrir el archivo original.','Unable to play the video. You can open the original file.');});
  dialog.querySelector('.motion-close').onclick=close;
  dialog.showModal();window.animateViewerOpen(dialog);document.body.classList.add('viewer-open');dialog.querySelector('.motion-close').focus();
 };
 function close(){dialog.querySelector('video')?.pause();window.closeViewer(dialog);}
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
 dialog.addEventListener('close',()=>{const video=dialog.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}dialog.innerHTML='';document.body.classList.remove('viewer-open');if(opener?.isConnected)opener.focus({preventScroll:true});});
})();
