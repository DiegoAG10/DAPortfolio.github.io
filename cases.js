(() => {
 const l=(es,en)=>document.documentElement.lang==='es'?es:en;
 const url=s=>s.split('/').map(encodeURIComponent).join('/');
 const configurations={
  greenforma:{
   subtitle:()=>l('Identidad visual para espacios vivos.','A visual identity for living spaces.'),
   meta:()=>l('Proyecto para cliente · Identidad visual · Manual de marca','Client project · Visual identity · Brand guidelines'),
   sections:()=>[
    {title:l('La marca','The brand'),copy:l('Greenforma se enfoca en paisajismo y jardinería, con una visión que conecta a las personas con la naturaleza y los espacios que habitan. Su identidad reúne formas orgánicas y una estructura visual clara.','Greenforma focuses on landscaping and gardening, connecting people with nature and the spaces they inhabit. Its identity brings together organic forms and a clear visual structure.'),pages:[10]},
    {title:l('Concepto e identidad','Concept and identity'),copy:l('El símbolo parte del crecimiento natural y las formas orgánicas. Se combina con un logotipo que busca claridad y equilibrio, acompañado de reglas de construcción, proporción y uso.','The symbol draws on natural growth and organic forms. It pairs with a wordmark built around clarity and balance, supported by guidelines for construction, proportion, and usage.'),pages:[8,13]},
    {title:l('Sistema visual','Visual system'),copy:l('La paleta combina verdes frescos con tonos profundos y neutros. La familia Outfit aporta una voz tipográfica limpia; el patrón y los iconos extienden el sistema a distintos formatos.','The palette combines fresh greens with deeper tones and neutrals. Outfit provides a clean typographic voice, while patterns and icons extend the system across formats.'),pages:[17,19,22,23]},
    {title:l('Aplicaciones','Applications'),copy:l('Mockups de papelería, objetos, vestimenta, comunicación digital y señalización muestran cómo se adapta la identidad a distintos puntos de contacto.','Mockups of stationery, objects, apparel, digital communication, and signage show how the identity adapts across different touchpoints.'),pages:[31,32,33,34,35,36]}
   ]
  },
  'danfoss-branding':{
   subtitle:()=>l('Una identidad, distintas aplicaciones.','One identity, different applications.'),
   meta:()=>l('Aplicaciones de marca · Material P.O.P. · Comunicación visual','Brand applications · Point-of-purchase materials · Visual communication'),
   sections:()=>[
    {title:l('Contexto','Context'),copy:l('Selección de piezas que trabajan con la identidad existente de Danfoss: materiales de exhibición, comunicación interna, productos y una aplicación conmemorativa.','A selection of pieces working with the existing Danfoss identity: display materials, internal communication, products, and a commemorative application.'),pages:[]},
    {title:l('Comunicación y producto','Communication and products'),copy:l('El rojo de marca, la ilustración y la organización de la información conectan piezas con propósitos distintos: explicar el método 5S y presentar una selección de productos.','Brand red, illustration, and information hierarchy connect pieces with different purposes: explaining the 5S method and presenting a selection of products.'),pages:[1,3]},
    {title:l('Aplicación conmemorativa','Commemorative application'),copy:l('Una composición para el 30 aniversario combina el fondo rojo con un tratamiento dorado del número y la tipografía.','A 30th-anniversary composition combines a red background with gold treatment of the number and typography.'),pages:[0]}
   ]
  },
  logofolio:{
   subtitle:()=>l('Una selección de identidades visuales.','A selection of visual identities.'),
   meta:()=>l('Logofolio · Logotipos y símbolos','Logofolio · Wordmarks and symbols'),
   sections:()=>[{title:l('Selección','Collection'),copy:l('Una mirada conjunta a distintas soluciones de identidad, con aproximaciones tipográficas y simbólicas para cada nombre.','A collection of identity explorations, with typographic and symbolic approaches for each name.'),pages:[]}]
  }
 };
 window.caseContent=item=>{
  const c=configurations[item.slug];
  const image=(n,hero=false)=>`<button class="case-image ${hero?'case-hero':''}" data-case-image="${n}" aria-label="${l('Ampliar imagen','Enlarge image')} ${n+1}"><img src="${url(item.displayImages[n])}" alt="${l(item.titleEs,item.titleEn)} — ${l('lámina','board')} ${n+1}" loading="${hero?'eager':'lazy'}" decoding="async"><span aria-hidden="true">↗</span></button>`;
  return `<article class="page case-page"><a class="case-back" href="#work">← ${l('Volver a proyectos','Back to work')}</a><span class="eyebrow">Branding / ${item.slug==='logofolio'?l('Selección','Collection'):l('Proyecto','Project')}</span><h1>${l(item.titleEs,item.titleEn)}</h1><p class="case-lead">${c.subtitle()}</p><p class="case-meta">${c.meta()}</p>${image(item.images.indexOf(item.src),true)}${c.sections().map(s=>`<section class="case-section"><div class="case-copy"><h2>${s.title}</h2><p>${s.copy}</p></div><div class="case-gallery ${s.pages.length===1?'single':''}">${s.pages.map(n=>image(n)).join('')}</div></section>`).join('')}<div class="case-actions">${item.slug==='greenforma'?`<button class="pill primary" data-case-manual>${l('Ver manual','View guidelines')} (${item.images.length})</button><small>${l('38 imágenes · Navega página por página.','38 images · Browse page by page.')}</small>`:`<button class="pill primary" data-case-all>${l('Ver todas las piezas','View all pieces')} (${item.images.length})</button>`}</div><a class="case-back" href="#work">← ${l('Volver a proyectos','Back to work')}</a></article>`;
 };
 window.bindCase=item=>{
  const open=(n,button)=>{artOpener=button;openArt(window.DA_PROJECTS.indexOf(item));activePiece=n;paintArt();};
  document.querySelectorAll('[data-case-image]').forEach(b=>b.onclick=()=>open(Number(b.dataset.caseImage),b));
  const all=document.querySelector('[data-case-all]');if(all)all.onclick=e=>open(0,e.currentTarget);
  const manual=document.querySelector('[data-case-manual]');if(manual)manual.onclick=()=>window.openBook({...item,type:'image-book',titleEs:'Greenforma — Manual de marca',titleEn:'Greenforma — Brand guidelines'});
 };
})();
