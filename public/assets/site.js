const message=(key,values)=>window.EllisLocale.t(key,values);
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.main-nav');
const setMenu=open=>{
  menuButton?.setAttribute('aria-expanded',String(open));
  navigation?.classList.toggle('is-open',open);
};
menuButton?.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true'){
    setMenu(false);
    menuButton.focus();
  }
});
navigation?.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});

document.querySelectorAll('.enquiry-form').forEach(form=>{
  form.noValidate=true;
  const photoInput=form.querySelector('input[type="file"]');
  const fileName=form.querySelector('[data-file-name]');
  const submitButton=form.querySelector('button[type="submit"]');
  const status=form.querySelector('[data-form-status]')||(()=>{const item=document.createElement('p');item.className='form-status';item.dataset.formStatus='';item.setAttribute('role','status');item.setAttribute('aria-live','polite');form.append(item);return item;})();
  photoInput?.addEventListener('change',()=>{
    const count=photoInput.files.length;
    if(fileName)fileName.textContent=count?message(count===1?'photo':'photos',{count}):message('noPhotos');
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    for(const control of form.elements)control.removeAttribute('aria-invalid');
    const invalid=[...form.elements].find(control=>control.willValidate&&!control.validity.valid);
    if(invalid){
      invalid.setAttribute('aria-invalid','true');
      invalid.setAttribute('aria-describedby','enquiry-status');
      status.id='enquiry-status';
      status.textContent=message(invalid.type==='email'?'invalid':'required');
      status.dataset.state='error';
      invalid.focus();return;
    }
    const data=Object.fromEntries(new FormData(form).entries());
    const originalText=submitButton.textContent;
    submitButton.disabled=true;
    submitButton.textContent=message('sendingButton');
    status.textContent=message('sending');
    status.dataset.state='pending';
    try{
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok){
        const key=response.status===400?'invalid':response.status===503?'unavailable':'error';
        throw new Error(window.EllisLocale.language==='zh'?message(key):(result.error||message(key)));
      }
      form.reset();
      if(fileName)fileName.textContent=message('noPhotos');
      status.textContent=message('success');
      status.dataset.state='success';
    }catch(error){
      status.textContent=window.EllisLocale.language==='zh'?(/[\u3400-\u9fff]/.test(error.message)?error.message:message('error')):(error.message||message('error'));
      status.dataset.state='error';
    }finally{
      submitButton.disabled=false;
      submitButton.textContent=originalText;
    }
  });
});

document.querySelectorAll('[data-carousel]').forEach(carousel=>{
  const slides=[...carousel.querySelectorAll('[data-carousel-slide]')];
  const dots=[...carousel.querySelectorAll('[data-carousel-dot]')];
  const previous=carousel.querySelector('[data-carousel-prev]');
  const next=carousel.querySelector('[data-carousel-next]');
  const pause=carousel.querySelector('[data-carousel-pause]');
  const status=carousel.querySelector('[data-carousel-status]');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(slides.length<2)return;
  let current=0;
  let timer;
  let paused=false;
  let hovered=false;
  let focused=false;
  const show=index=>{
    current=(index+slides.length)%slides.length;
    // Hydrate only the selected slide. Set srcset before src so responsive
    // selection happens before a full-size fallback request can start.
    slides[current].querySelectorAll('img[data-src]').forEach(image=>{
      image.loading='eager';
      if(image.dataset.srcset){image.srcset=image.dataset.srcset;delete image.dataset.srcset;}
      image.src=image.dataset.src;
      delete image.dataset.src;
    });
    slides.forEach((slide,item)=>{
      const active=item===current;
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',String(!active));
    });
    dots.forEach((dot,item)=>{
      const active=item===current;
      if(active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');
    });
    if(status)status.textContent=message('carousel',{current:current+1,total:slides.length});
  };
  const stop=()=>{if(timer){window.clearInterval(timer);timer=undefined;}};
  const start=()=>{
    stop();
    if(status)status.setAttribute('aria-live',paused||focused||motion.matches?'polite':'off');
    if(!paused&&!hovered&&!focused&&!motion.matches&&!document.hidden)timer=window.setInterval(()=>show(current+1),6500);
    if(pause){pause.textContent=message(paused?'resume':'pause');pause.setAttribute('aria-pressed',String(paused));pause.disabled=motion.matches;pause.setAttribute('aria-label',message(motion.matches?'motionOff':paused?'resumeLabel':'pauseLabel'));}
  };
  pause?.addEventListener('click',()=>{paused=!paused;start();});
  previous?.addEventListener('click',()=>{show(current-1);start();});
  next?.addEventListener('click',()=>{show(current+1);start();});
  dots.forEach((dot,index)=>dot.addEventListener('click',()=>{show(index);start();}));
  carousel.addEventListener('mouseenter',()=>{hovered=true;start();});
  carousel.addEventListener('mouseleave',()=>{hovered=false;start();});
  carousel.addEventListener('focusin',()=>{focused=true;start();});
  carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){focused=false;start();}});
  motion.addEventListener('change',start);
  document.addEventListener('visibilitychange',start);
  start();
});
