window.viewerIcon=name=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${({plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',prev:'<path d="M19 12H5m6-6-6 6 6 6"/>',next:'<path d="M5 12h14m-6-6 6 6-6 6"/>',full:'<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>'})[name]}</svg>`;
window.animateViewerOpen=dialog=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 dialog.animate([{opacity:0,transform:'translateY(14px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:230,easing:'ease-out'});
};
window.closeViewer=async dialog=>{
 if(dialog.dataset.closing)return;dialog.dataset.closing='true';
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches){await dialog.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'translateY(8px) scale(.985)'}],{duration:170,easing:'ease-in'}).finished.catch(()=>{});}
 dialog.close();delete dialog.dataset.closing;
};
