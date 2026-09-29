const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.main-nav');
menuButton?.addEventListener('click',()=>{
  const expanded=menuButton.getAttribute('aria-expanded')==='true';
  menuButton.setAttribute('aria-expanded',String(!expanded));
  navigation?.classList.toggle('is-open',!expanded);
});

document.querySelectorAll('.enquiry-form').forEach(form=>{
  const photoInput=form.querySelector('input[type="file"]');
  const fileName=form.querySelector('[data-file-name]');
  const submitButton=form.querySelector('button[type="submit"]');
  const status=form.querySelector('[data-form-status]')||(()=>{const item=document.createElement('p');item.className='form-status';item.dataset.formStatus='';item.setAttribute('role','status');item.setAttribute('aria-live','polite');form.append(item);return item;})();
  photoInput?.addEventListener('change',()=>{
    const count=photoInput.files.length;
    if(fileName)fileName.textContent=count?`${count} photo${count===1?'':'s'} selected`:'No photos selected';
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form).entries());
    const originalText=submitButton.textContent;
    submitButton.disabled=true;
    submitButton.textContent='Sending enquiry…';
    status.textContent='Sending your enquiry…';
    status.dataset.state='pending';
    try{
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(result.error||'We could not send your enquiry.');
      form.reset();
      if(fileName)fileName.textContent='No photos selected';
      status.textContent='Thanks — your enquiry has been sent. We will be in touch soon.';
      status.dataset.state='success';
    }catch(error){
      status.textContent=error.message||'We could not send your enquiry. Please call 0405 878 406.';
      status.dataset.state='error';
    }finally{
      submitButton.disabled=false;
      submitButton.textContent=originalText;
    }
  });
});
