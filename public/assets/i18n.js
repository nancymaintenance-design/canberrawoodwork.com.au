// Every runtime message is maintained as a pair. Build/test checks both values.
window.EllisMessages={
  photos:{en:'{count} photos selected',zh:'已选择 {count} 张照片'},
  photo:{en:'1 photo selected',zh:'已选择 1 张照片'},
  noPhotos:{en:'No photos selected',zh:'未选择照片'},
  sendingButton:{en:'Sending enquiry…',zh:'正在提交…'},
  sending:{en:'Sending your enquiry…',zh:'正在提交您的咨询…'},
  success:{en:'Thanks — your enquiry has been sent. We will be in touch soon.',zh:'感谢您的咨询，信息已提交。我们会与您联系。'},
  error:{en:'We could not send your enquiry. Please call 0405 878 406.',zh:'暂时无法提交咨询，请致电 0405 878 406。'},
  unavailable:{en:'The enquiry service is not configured yet. Please call 0405 878 406.',zh:'在线咨询服务暂不可用，请致电 0405 878 406。'},
  invalid:{en:'Please provide your name, a valid email address and a description of the work.',zh:'请填写姓名、有效的电子邮箱和施工需求。'},
  required:{en:'Please complete the required fields and confirm your consent.',zh:'请填写所有必填项，并勾选隐私声明同意项。'},
  faqCount:{en:'{count} of {total} questions',zh:'共 {total} 个问题，显示 {count} 个'},
  question:{en:'{count} QUESTION',zh:'{count} 个问题'},
  questions:{en:'{count} QUESTIONS',zh:'{count} 个问题'},
  carousel:{en:'Showing {current} of {total} work photos',zh:'施工照片 {current} / {total}'},
  pause:{en:'Pause',zh:'暂停'},
  resume:{en:'Resume',zh:'继续播放'},
  resumeLabel:{en:'Resume automatic photo rotation',zh:'继续自动轮播照片'},
  pauseLabel:{en:'Pause automatic photo rotation',zh:'暂停自动轮播照片'},
  motionOff:{en:'Automatic rotation off: reduced motion',zh:'已关闭自动轮播：减少动态效果'}
};
window.EllisLocale={
  language:document.documentElement.lang.startsWith('zh')?'zh':'en',
  t(key,values={}){
    const message=window.EllisMessages[key];
    if(!message)throw new Error(`Unknown UI message ${key}`);
    return message[this.language].replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??''));
  }
};
const syncLanguageFragment=()=>{
  for(const link of document.querySelectorAll('[data-language-switch]'))link.hash=location.hash;
};
syncLanguageFragment();
window.addEventListener?.('hashchange',syncLanguageFragment);
