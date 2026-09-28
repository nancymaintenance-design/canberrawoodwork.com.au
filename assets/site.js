document.querySelector('.menu-toggle')?.addEventListener('click',function(){const nav=document.querySelector('#main-nav');const open=this.getAttribute('aria-expanded')==='true';this.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open);});
document.querySelectorAll('.enquiry-form').forEach(form=>{
  const photoInput=form.querySelector('input[type="file"]');
  const photoName=form.querySelector('[data-file-name]');
  photoInput?.addEventListener('change',()=>{const names=[...photoInput.files].map(file=>file.name);photoName.textContent=names.length?`${names.length} photo${names.length>1?'s':''} selected`:'No photos selected';});
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const fields=[['Name','name'],['Email','email'],['Phone','phone'],['Property address','address'],['Canberra district or area','district'],['Service of interest','service'],['Work details','message']];const photos=[...photoInput.files].map(file=>file.name);const body=fields.map(([label,key])=>`${label}: ${data.get(key)||'—'}`).join('\n')+(photos.length?`\n\nPhotos to attach manually: ${photos.join(', ')}`:'');const subject=`Canberra carpentry enquiry from ${data.get('name')}`;location.href=`mailto:brian@elliservices.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;});
});
