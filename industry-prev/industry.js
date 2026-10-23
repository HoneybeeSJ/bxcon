/* 검토용 로컬 동작. 데이터 전송·문의 접수·외부 분석 스크립트 없음. */
(() => {
  try{if(new URLSearchParams(location.search).has('preview'))sessionStorage.setItem('bxpreview','1');if(sessionStorage.getItem('bxpreview'))document.documentElement.dataset.preview='';}catch{}
  const menu = document.querySelector('.site-nav');
  const menuButton = document.querySelector('.menu-btn');
  const closeMenu = () => { menu?.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false'); };
  menuButton?.addEventListener('click', () => { const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open)); });
  document.querySelectorAll('.industry-menu').forEach(d => {
    document.addEventListener('click',e=>{if(!d.contains(e.target))d.open=false;});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.industry-menu[open]').forEach(d=>{d.open=false;d.querySelector('summary').focus();});if(menu?.classList.contains('open')){closeMenu();menuButton.focus();}}});
  document.querySelectorAll('[role="tablist"]').forEach(list=>{
    const tabs=[...list.querySelectorAll('[role="tab"]')];
    const choose=tab=>{tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});};
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>choose(tab));
      tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();choose(tabs[next]);}});
    });
  });
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&'IntersectionObserver' in window){
    document.documentElement.classList.add('motion-ready');
    const observer=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('visible');observer.unobserve(item.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }
  // CRM 시안처럼 작게, 화면 안에서 한 번만 진행. 다시 보기는 사용자가 선택한다.
  document.querySelectorAll('[data-mini-motion]').forEach(figure=>{
    const messages=JSON.parse(figure.dataset.messages);
    const message=figure.querySelector('.mini-message');
    const replay=figure.querySelector('.mini-replay');
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    let phase=0,timer=null,inView=false;
    const stop=()=>{clearTimeout(timer);timer=null;figure.dataset.running="false";};
    const show=value=>{
      phase=value;figure.dataset.phase=String(value);message.textContent=messages[value];
      message.classList.remove('is-changing');
      if(!preference.matches){void message.offsetWidth;message.classList.add('is-changing');}
    };
    const continueMotion=()=>{
      stop();
      if(preference.matches||!inView||document.hidden||phase===3)return;
      figure.dataset.running="true";
      timer=setTimeout(()=>{show(phase+1);continueMotion();},figure.dataset.variant?1400:1900);
    };
    const applyPreference=()=>{stop();replay.hidden=preference.matches;if(preference.matches)show(3);else continueMotion();};
    replay.addEventListener('click',()=>{show(0);continueMotion();});
    if('IntersectionObserver' in window){
      new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;continueMotion();},{threshold:.35}).observe(figure);
    }else{inView=true;continueMotion();}
    preference.addEventListener('change',applyPreference);
    document.addEventListener('visibilitychange',continueMotion);
    applyPreference();
  });
  const dialog=document.getElementById('inquiry');
  let opener;
  document.querySelectorAll('[data-inquiry]').forEach(btn=>btn.addEventListener('click',()=>{
    opener=btn;
    const track=document.querySelector('.track-tabs [aria-selected=true]');
    const visibleTrack=document.querySelector('.track-panel:not([hidden])');
    const role=visibleTrack?.querySelector('.role-tabs [aria-selected=true]');
    if(role)document.getElementById('inquiry-role').value=role.textContent.trim();
    document.getElementById('inquiry-context').textContent=[document.body.dataset.industry||'산업별',track?.textContent,role?.textContent].filter(Boolean).join(' / ');
    document.getElementById('inquiry-status').textContent='';
    dialog.showModal();
  }));
  dialog?.querySelector('.close').addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog?.addEventListener('close',()=>opener?.focus());
  document.getElementById('copy-inquiry')?.addEventListener('click',async()=>{
    const text=`[BX 맞춤 세일즈 교육 상담]\n분야: ${document.getElementById('inquiry-context').textContent}\n대상: ${document.getElementById('inquiry-role').value}\n교육 과제: ${document.getElementById('inquiry-needs').value||'상담 시 협의'}\n지원: 사전 과제, 현장 실습, 적용 체크리스트, 제출 결과물 피드백\n세부 일정·인원·피드백 범위는 협의`;
    const output=document.getElementById('inquiry-output');output.value=text;output.hidden=false;
    try{await navigator.clipboard.writeText(text);document.getElementById('inquiry-status').textContent='상담 요청 내용을 복사했습니다. 실제 문의는 아래 BX 교육 상담 요청 페이지에서 진행해주세요.';}
    catch{output.focus();output.select();document.getElementById('inquiry-status').textContent='아래 내용을 선택했습니다. 복사해서 실제 BX 문의에 활용하세요.';}
  });
})();
