(() => {
 const dialog=document.querySelector('#book-viewer');
 let pdf,task,imageItem,page=1,zoom=1,busy=false,version=0,opener;
 const assetUrl=s=>s.split('/').map(encodeURIComponent).join('/');
 const mobile=()=>matchMedia('(max-width:760px)').matches;
 const label=(es,en)=>document.documentElement.lang==='es'?es:en;
 const q=s=>dialog.querySelector(s);
 const spread=()=>[page];
 function controls(){
  const pages=spread();q('.book-count').textContent=`${pages.map(n=>String(n).padStart(2,'0')).join('–')} / ${String(pdf.numPages).padStart(2,'0')}`;
  q('[data-book=prev]').disabled=busy||page===1;
  q('[data-book=next]').disabled=busy||pages.at(-1)>=pdf.numPages;
  if(imageItem){q('.book-files a').href=assetUrl(imageItem.images[page-1]);}
 }
 async function draw(){
  if(!pdf)return;busy=true;controls();const id=version;
  const stage=q('.book-stage'),sheets=document.createElement('div');sheets.className='book-sheets';
  const nums=spread();const maxW=Math.max(160,(stage.clientWidth-40)/nums.length),maxH=Math.max(160,stage.clientHeight-40);
  try{
   for(const n of nums){
    if(imageItem){
     const img=new Image();img.alt=label('Página ','Page ')+n;img.decoding='async';
     img.src=assetUrl(imageItem.displayImages?.[n-1]||imageItem.images[n-1]);
     await img.decode();if(id!==version)return;
     const scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight)*zoom;
     img.style.width=`${img.naturalWidth*scale}px`;img.style.height=`${img.naturalHeight*scale}px`;
     sheets.append(img);continue;
    }
    const p=await pdf.getPage(n);if(id!==version)return;
    const native=p.getViewport({scale:1});const scale=Math.min(maxW/native.width,maxH/native.height)*zoom;
    const ratio=window.devicePixelRatio||1,viewport=p.getViewport({scale:scale*ratio});
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    canvas.style.width=`${native.width*scale}px`;canvas.style.height=`${native.height*scale}px`;
    canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label('Página ','Page ')+n);
    await p.render({canvasContext:canvas.getContext('2d'),viewport}).promise;if(id!==version)return;sheets.append(canvas);
   }
   stage.replaceChildren(sheets);stage.classList.toggle('book-zoomed',zoom>1);
  }catch(e){if(id===version)stage.textContent=imageItem?label('No se pudo mostrar esta imagen. Puedes descargarla con el botón inferior.','Unable to display this image. You can download it using the button below.'):label('No se pudo mostrar esta página. Puedes abrir el PDF original.','Unable to display this page. You can open the original PDF.');}
  finally{if(id===version){busy=false;controls();}}
 }
 async function step(direction){
  if(!pdf||busy||(direction<0&&page===1)||(direction>0&&spread().at(-1)>=pdf.numPages))return;
  page+=direction;
  await draw();if(dialog.open&&!matchMedia('(prefers-reduced-motion:reduce)').matches)q('.book-sheets')?.animate([{opacity:.25,transform:`translateX(${direction*12}px)`},{opacity:1,transform:'translateX(0)'}],{duration:220,easing:'ease-out'});
 }
 window.openBook=async index=>{
  const item=typeof index==='object'?index:window.DA_PROJECTS[index];
  if(item.type!=='image-book'&&location.protocol==='file:'){window.open(assetUrl(item.src),'_blank','noopener');return;}
  opener=document.activeElement;const id=++version;page=1;zoom=1;busy=true;pdf=null;
  imageItem=item.type==='image-book'?item:null;
  const url=item.src.split('/').map(encodeURIComponent).join('/');
  dialog.innerHTML=`<div class="book-shell"><div class="book-header"><h2 id="book-title">${label(item.titleEs,item.titleEn)}</h2><button data-book="close" aria-label="${label('Cerrar','Close')}">${window.viewerIcon('close')}</button></div><div class="book-stage" aria-busy="true">${label('Cargando documento…','Loading document…')}</div><div class="book-controls"><div class="book-navigation"><button data-book="prev" disabled aria-label="${label('Página anterior','Previous page')}">${window.viewerIcon('prev')}</button><span class="book-count" aria-live="polite">—</span><button data-book="next" disabled aria-label="${label('Página siguiente','Next page')}">${window.viewerIcon('next')}</button></div><div class="book-tools"><button data-book="zoom" aria-label="${label('Ampliar','Zoom')}" aria-pressed="false">${window.viewerIcon('plus')}</button><button data-book="full" aria-label="${label('Pantalla completa','Fullscreen')}">${window.viewerIcon('full')}</button></div><div class="book-files"><a href="${url}" target="_blank" rel="noopener">${label('Abrir PDF','Open PDF')}</a><a href="${url}" download>${label('Descargar','Download')}</a></div></div></div>`;
  dialog.showModal();window.animateViewerOpen(dialog);document.body.classList.add('viewer-open');q('[data-book=close]').focus();
  try{
   if(task){await task.destroy();task=null;}if(id!==version)return;
   if(imageItem){
    q('.book-files').innerHTML=`<a href="${assetUrl(item.images[0])}" download>${label('Descargar imagen','Download image')}</a>`;
    pdf={numPages:item.images.length};await draw();return;
   }
   const engine=await import('./vendor/pdfjs/build/pdf.mjs');if(id!==version)return;
   engine.GlobalWorkerOptions.workerSrc='./vendor/pdfjs/build/pdf.worker.mjs';
   task=engine.getDocument({url,cMapUrl:'./vendor/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'./vendor/pdfjs/standard_fonts/',wasmUrl:'./vendor/pdfjs/wasm/'});
   const loaded=await task.promise;if(id!==version)return;pdf=loaded;await draw();
  }catch(e){if(id===version)q('.book-stage').textContent=label('No se pudo cargar el visor. Abre o descarga el PDF con los botones inferiores.','The viewer could not load. Open or download the PDF using the buttons below.');}
  finally{if(id===version)q('.book-stage').setAttribute('aria-busy','false');}
 };
 dialog.addEventListener('click',async e=>{
  const action=e.target.closest('[data-book]')?.dataset.book;
  if(action==='close')window.closeViewer(dialog);if(action==='prev')step(-1);if(action==='next')step(1);
  if(action==='zoom'&&pdf&&!busy){zoom=zoom===1?2:1;const button=e.target.closest('button');button.setAttribute('aria-pressed',zoom>1);button.innerHTML=window.viewerIcon(zoom>1?'minus':'plus');draw();}
  if(action==='full'){try{if(document.fullscreenElement)await document.exitFullscreen();else await dialog.requestFullscreen();}catch{dialog.classList.toggle('book-expanded');}if(pdf&&!busy)draw();}
 });
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}});
 dialog.addEventListener('close',()=>{version++;pdf=null;imageItem=null;busy=false;document.body.classList.remove('viewer-open');if(opener?.isConnected)opener.focus({preventScroll:true});if(task){task.destroy();task=null;}});
 dialog.addEventListener('cancel',e=>{e.preventDefault();window.closeViewer(dialog)});
 let start;
 dialog.addEventListener('pointerdown',e=>{if(zoom===1&&e.target.closest('.book-stage'))start={x:e.clientX,y:e.clientY};});
 dialog.addEventListener('pointerup',e=>{if(start){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)step(dx<0?1:-1);}start=null;});
 dialog.addEventListener('pointercancel',()=>start=null);
 let timer;addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>{if(pdf&&dialog.open&&!busy){draw();}},180);});
})();
