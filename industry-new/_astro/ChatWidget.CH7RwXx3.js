import{n as e}from"./rolldown-runtime.CbXtAM7H.js";import{t}from"./react.CyOsqXVf.js";import{n,t as r}from"./chat.2bT93ZVV.js";import{t as i}from"./jsx-runtime.BPMVGbCv.js";import{t as a}from"./ChatWidgetBoot.astro_astro_type_script_index_0_lang.D4zCpwxc.js";var o=e(t(),1),s=i(),c=`bxcon-chat-nudge-dismissed`,l=`궁금한 점이 있으신가요? 지금 바로 BXCON 상담팀에 문의해보세요.`,u=1e4,d=e=>{let t=String(e||``).trim();return t.length>0?t:l},f=(e,t)=>e.some(e=>e.id===t.id)?e:[...e,t].sort((e,t)=>new Date(e.created_at).getTime()-new Date(t.created_at).getTime()),p=()=>typeof window.bxconGetUtmParams==`function`?window.bxconGetUtmParams():{};function m({initialOpen:e=!1}){let[t,i]=(0,o.useState)(e),[l,m]=(0,o.useState)(!1),[h,g]=(0,o.useState)(!1),[_,v]=(0,o.useState)(``),[y,b]=(0,o.useState)(``),[x,S]=(0,o.useState)([]),[C,w]=(0,o.useState)(null),[T,E]=(0,o.useState)(0),[D,O]=(0,o.useState)(null),[k,A]=(0,o.useState)(!1),[j,M]=(0,o.useState)(null),[N,P]=(0,o.useState)(``),[F,I]=(0,o.useState)(``),[L,R]=(0,o.useState)(!1),[z,B]=(0,o.useState)(!1),V=(0,o.useRef)(null),H=(0,o.useRef)(null),U=(0,o.useRef)(null),W=(0,o.useRef)([]),G=(0,o.useRef)(null),K=(0,o.useRef)(null),q=()=>(K.current||=a(()=>import(`./chat-browser.Ba79CBmu.js`),[]),K.current),J=async({createIfMissing:e,name:t,phone:n})=>{let i=await q(),a=i.getChatSupabaseClient();if(!a)throw Error(`채팅 설정이 비어 있습니다.`);G.current=a,await i.ensureAnonymousChatUser(a);let{data:{session:o}}=await a.auth.getSession();if(!o?.access_token)throw Error(`채팅 세션을 만들지 못했습니다.`);let s=localStorage.getItem(r),c=await fetch(`/api/chat/session/`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${o.access_token}`},body:JSON.stringify({conversationId:s||null,sourcePage:window.location.pathname,referrer:document.referrer||``,...p(),...window.bxconGetFirstTouch?.(),...await window.bxconGetGaContext?.(),createIfMissing:e,name:t,phone:n})}),l=await c.json();if(!c.ok||l.error)throw Error(l.error||`채팅 세션을 불러오지 못했습니다.`);return l.conversation?(localStorage.setItem(r,l.conversation.id),w(l.conversation),S(l.messages||[]),M(l.accessToken||o.access_token),v(``),m(!0),l.conversation):(M(o.access_token),m(!1),null)};(0,o.useEffect)(()=>{let e=()=>{(0,o.startTransition)(()=>i(!0))};return window.addEventListener(`bxcon-chat:open`,e),()=>window.removeEventListener(`bxcon-chat:open`,e)},[]),(0,o.useEffect)(()=>{C&&requestAnimationFrame(()=>{V.current?.scrollTo({top:V.current.scrollHeight})})},[C,x,t]),(0,o.useEffect)(()=>{W.current=x},[x]),(0,o.useEffect)(()=>{C&&(P(C.name||``),I(C.phone||``))},[C?.id,C?.name,C?.phone]),(0,o.useEffect)(()=>{let e=!1,t=async()=>{try{let t=encodeURIComponent(window.location.pathname||`/`),n=await(await fetch(`/api/chat/nudge/?path=${t}`,{cache:`no-store`})).json();e||O(n.nudge||null)}catch{}},n=`requestIdleCallback`in window?window.requestIdleCallback(t,{timeout:3e3}):window.setTimeout(t,1200);return()=>{e=!0,`cancelIdleCallback`in window&&typeof n==`number`?window.cancelIdleCallback(n):window.clearTimeout(n)}},[]),(0,o.useEffect)(()=>{if(!D||k||t||sessionStorage.getItem(c)===`1`)return;let e=null,n=()=>{let e=document.documentElement.scrollHeight-window.innerHeight;(e>0?window.scrollY/e*100:0)>=D.min_scroll_percent&&(sessionStorage.setItem(c,`1`),A(!0))};return e=window.setTimeout(()=>{sessionStorage.setItem(c,`1`),A(!0)},D.min_time_seconds*1e3),window.addEventListener(`scroll`,n,{passive:!0}),()=>{e&&window.clearTimeout(e),window.removeEventListener(`scroll`,n)}},[t,D,k]),(0,o.useEffect)(()=>{if(!t||C)return;if(!localStorage.getItem(`bxcon-chat-session`)){v(``),m(!1);return}let e=!1;return(async()=>{try{v(`채팅을 준비하고 있습니다.`);let t=await q(),n=t.getChatSupabaseClient();if(!n)throw Error(`채팅 설정이 비어 있습니다.`);G.current=n,await t.ensureAnonymousChatUser(n);let{data:{session:i}}=await n.auth.getSession();if(!i?.access_token)throw Error(`채팅 세션을 만들지 못했습니다.`);let a=localStorage.getItem(r),o=await fetch(`/api/chat/session/`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${i.access_token}`},body:JSON.stringify({conversationId:a||null,sourcePage:window.location.pathname,referrer:document.referrer||``,...p(),...window.bxconGetFirstTouch?.(),...await window.bxconGetGaContext?.(),createIfMissing:!1})}),s=await o.json();if(!o.ok||s.error)throw Error(s.error||`채팅 세션을 불러오지 못했습니다.`);if(!s.conversation){localStorage.removeItem(r),v(``),m(!1);return}e||(localStorage.setItem(r,s.conversation.id),w(s.conversation),S(s.messages||[]),M(s.accessToken||i.access_token),v(``),m(!0))}catch(t){e||v(t instanceof Error?t.message:`채팅을 시작하지 못했습니다.`)}})(),()=>{e=!0}},[C,t]),(0,o.useEffect)(()=>{if(!C||!j||!G.current)return;let e=G.current;return e.realtime.setAuth(j),H.current?.unsubscribe(),U.current?.unsubscribe(),H.current=e.channel(`chat-messages-${C.id}`).on(`postgres_changes`,{event:`INSERT`,schema:`public`,table:`chat_messages`,filter:`conversation_id=eq.${C.id}`},e=>{let n=e.new;S(e=>f(e,n)),n.sender_type===`admin`&&!t&&E(e=>e+1)}).subscribe(),U.current=e.channel(`chat-conversation-${C.id}`).on(`postgres_changes`,{event:`UPDATE`,schema:`public`,table:`chat_conversations`,filter:`id=eq.${C.id}`},e=>{w(e.new)}).subscribe(),()=>{H.current?.unsubscribe(),U.current?.unsubscribe()}},[C,t,j]),(0,o.useEffect)(()=>{if(!C||!j)return;let e=!1,n=!1,r=new AbortController,i=async()=>{if(!n){n=!0;try{let n=(await G.current?.auth.getSession())?.data.session?.access_token||j,i=await fetch(`/api/chat/messages/?conversationId=${encodeURIComponent(C.id)}`,{headers:{Authorization:`Bearer ${n}`},cache:`no-store`,signal:r.signal}),a=await i.json();if(!i.ok||a.error||e)return;let o=(a.messages||[]).sort((e,t)=>new Date(e.created_at).getTime()-new Date(t.created_at).getTime());if(!t){let e=new Set(W.current.map(e=>e.id)),t=o.filter(t=>t.sender_type===`admin`&&!e.has(t.id)).length;t>0&&E(e=>e+t)}W.current=o,S(o)}catch(e){e instanceof DOMException&&e.name}finally{n=!1}}};i();let a=window.setInterval(i,u);return()=>{e=!0,r.abort(),window.clearInterval(a)}},[C,t,j]),(0,o.useEffect)(()=>{t&&E(0)},[t]);let Y=()=>{sessionStorage.setItem(c,`1`),A(!1)},X=()=>{Y(),i(!0)},Z=async()=>{let e=N.trim(),t=F.trim();if(!e||!t){v(`이름과 연락처를 모두 입력해주세요.`);return}if(!L){v(`개인정보 수집 및 상담 연락에 동의해주세요.`);return}B(!0),v(``);try{await J({createIfMissing:!0,name:e,phone:t})}catch(e){v(e instanceof Error?e.message:`상담을 시작하지 못했습니다.`)}finally{B(!1)}},Q=async()=>{let e=y.trim();if(!(!e||h)){g(!0),v(``);try{let t=C,n=G.current;if(!t||!n)throw Error(`이름과 연락처를 입력한 뒤 상담을 시작해주세요.`);let{data:{session:r}}=await n.auth.getSession();if(!r?.access_token)throw Error(`채팅 세션이 만료되었습니다. 새로고침 후 다시 시도해주세요.`);let i=await fetch(`/api/chat/send-message/`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${r.access_token}`},body:JSON.stringify({conversationId:t.id,body:e})}),a=await i.json();if(!i.ok||a.error)throw Error(a.error||`메시지를 전송하지 못했습니다.`);S(a.messages||[]),b(``)}catch(e){v(e instanceof Error?e.message:`메시지를 전송하지 못했습니다.`)}finally{g(!1)}}},$=!C?.name||!C?.phone;return(0,s.jsxs)(s.Fragment,{children:[k&&D&&(0,s.jsxs)(`aside`,{className:`chat-nudge`,role:`status`,children:[(0,s.jsx)(`button`,{className:`chat-nudge__close`,onClick:Y,type:`button`,"aria-label":`닫기`,children:`×`}),(0,s.jsxs)(`span`,{className:`chat-nudge__badge`,children:[(0,s.jsx)(`i`,{"aria-hidden":`true`}),`BXCON Live`]}),(0,s.jsx)(`p`,{children:d(D.message)}),(0,s.jsx)(`span`,{className:`chat-nudge__response-time`,children:`평균 응답시간 3분 미만`}),(0,s.jsx)(`button`,{className:`chat-nudge__cta`,onClick:X,type:`button`,children:`상담 시작하기`})]}),(0,s.jsxs)(`div`,{className:`chat-widget ${t?`is-open`:``}`,children:[(0,s.jsxs)(`button`,{className:`chat-widget__launcher`,type:`button`,onClick:()=>i(e=>!e),"aria-expanded":t,"aria-controls":`bxcon-chat-panel`,"aria-label":n,children:[(0,s.jsxs)(`svg`,{className:`chat-widget__icon`,"aria-hidden":`true`,viewBox:`0 0 24 24`,children:[(0,s.jsx)(`path`,{fill:`currentColor`,d:`M6.25 4h11.5A3.25 3.25 0 0 1 21 7.25v6.5A3.25 3.25 0 0 1 17.75 17H10l-5.65 3.35L5.2 17A3.25 3.25 0 0 1 3 13.75v-6.5A3.25 3.25 0 0 1 6.25 4Z`}),(0,s.jsx)(`circle`,{cx:`8`,cy:`10.5`,r:`1.1`,fill:`white`}),(0,s.jsx)(`circle`,{cx:`12`,cy:`10.5`,r:`1.1`,fill:`white`}),(0,s.jsx)(`circle`,{cx:`16`,cy:`10.5`,r:`1.1`,fill:`white`})]}),(0,s.jsx)(`img`,{className:`chat-widget__logo`,src:`/chat-widget-logo.webp`,alt:``,width:`100`,height:`100`,loading:`lazy`,decoding:`async`}),T>0&&(0,s.jsx)(`strong`,{children:T})]}),t&&(0,s.jsxs)(`section`,{className:`chat-widget__panel`,id:`bxcon-chat-panel`,children:[(0,s.jsxs)(`header`,{className:`chat-widget__header`,children:[(0,s.jsxs)(`div`,{className:`chat-widget__header-copy`,children:[(0,s.jsx)(`span`,{className:`eyebrow`,children:`Live Support`}),(0,s.jsx)(`h2`,{children:`상담 채팅`}),(0,s.jsx)(`p`,{children:`보고 계신 내용과 연결해서 편하게 상담해드릴게요.`})]}),(0,s.jsx)(`button`,{className:`chat-widget__header-close`,type:`button`,onClick:()=>i(!1),"aria-label":`채팅 닫기`,children:(0,s.jsx)(`span`,{"aria-hidden":`true`,children:`×`})})]}),(0,s.jsxs)(`div`,{className:`chat-widget__messages`,ref:V,children:[!C&&t&&(0,s.jsx)(`article`,{className:`chat-widget__bubble chat-widget__bubble--system`,children:(0,s.jsx)(`span`,{children:`안녕하세요. 원활한 상담을 위해 이름과 연락처를 먼저 알려주세요.`})}),!l&&_&&(0,s.jsx)(`p`,{className:`chat-widget__hint`,children:_}),x.map(e=>(0,s.jsx)(`article`,{className:`chat-widget__bubble chat-widget__bubble--${e.sender_type}`,children:(0,s.jsx)(`span`,{children:e.body})},e.id))]}),$?(0,s.jsxs)(`form`,{className:`chat-widget__intake`,onSubmit:e=>{e.preventDefault(),Z()},children:[(0,s.jsxs)(`div`,{className:`chat-widget__intake-heading`,children:[(0,s.jsx)(`strong`,{children:`상담 정보`}),(0,s.jsx)(`span`,{children:`담당자가 답변드릴 때 필요한 정보입니다.`})]}),(0,s.jsxs)(`label`,{children:[(0,s.jsx)(`span`,{children:`이름`}),(0,s.jsx)(`input`,{autoComplete:`name`,maxLength:80,onChange:e=>P(e.target.value),placeholder:`성함을 입력해주세요`,required:!0,value:N})]}),(0,s.jsxs)(`label`,{children:[(0,s.jsx)(`span`,{children:`연락처`}),(0,s.jsx)(`input`,{autoComplete:`tel`,inputMode:`tel`,onChange:e=>I(e.target.value),placeholder:`010-0000-0000 또는 지역번호 포함`,required:!0,value:F})]}),(0,s.jsxs)(`label`,{className:`chat-widget__consent`,children:[(0,s.jsx)(`input`,{checked:L,onChange:e=>R(e.target.checked),required:!0,type:`checkbox`}),(0,s.jsx)(`span`,{children:`개인정보 수집 및 상담 연락에 동의합니다.`})]}),_&&(0,s.jsx)(`p`,{className:`chat-widget__status`,role:`status`,children:_}),(0,s.jsx)(`button`,{className:`chat-widget__start`,disabled:z,type:`submit`,children:z?`상담 준비 중`:`상담 시작하기`})]}):(0,s.jsxs)(`footer`,{className:`chat-widget__footer`,children:[(0,s.jsx)(`textarea`,{value:y,onChange:e=>b(e.target.value),onKeyDown:e=>{e.key!==`Enter`||e.shiftKey||e.nativeEvent.isComposing||(e.preventDefault(),Q())},placeholder:`궁금하신 내용을 편하게 남겨주세요`,rows:3}),(0,s.jsxs)(`div`,{className:`chat-widget__actions`,children:[(0,s.jsx)(`span`,{className:`chat-widget__status`,children:_}),(0,s.jsxs)(`button`,{className:`chat-widget__send`,disabled:h||!y.trim(),onClick:Q,type:`button`,"aria-label":`메시지 보내기`,children:[(0,s.jsx)(`span`,{children:h?`전송 중`:`보내기`}),(0,s.jsx)(`svg`,{"aria-hidden":`true`,viewBox:`0 0 24 24`,children:(0,s.jsx)(`path`,{d:`M5 12h13m0 0-5-5m5 5-5 5`})})]})]})]})]})]}),(0,s.jsx)(`style`,{children:`
        .chat-widget {
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          z-index: 60;
          display: grid;
          justify-items: end;
          gap: 0.8rem;
        }

        .chat-widget__launcher {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 5rem;
          height: 5rem;
          padding: 0.7rem;
          border: 1px solid var(--engagement-border);
          border-radius: 1.55rem;
          background: var(--engagement-surface);
          color: #1465d9;
          box-shadow: 0 22px 50px rgba(6, 12, 24, 0.2);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .chat-widget__launcher:hover {
          transform: translateY(-2px);
          box-shadow: 0 28px 60px rgba(17, 24, 39, 0.28);
        }

        .chat-widget__launcher img {
          position: absolute;
          display: block;
          width: min(100%, 3.95rem);
          height: min(100%, 3.95rem);
          object-fit: contain;
          opacity: 0;
          transform: scale(0.82);
          transition:
            opacity 160ms ease,
            transform 160ms ease;
        }

        .chat-widget__icon {
          width: 2.15rem;
          height: 2.15rem;
          transition:
            opacity 160ms ease,
            transform 160ms ease;
        }

        @media (min-width: 761px) {
          .chat-widget__launcher:hover .chat-widget__icon,
          .chat-widget__launcher:focus-visible .chat-widget__icon {
            opacity: 0;
            transform: scale(0.78);
          }

          .chat-widget__launcher:hover .chat-widget__logo,
          .chat-widget__launcher:focus-visible .chat-widget__logo {
            opacity: 1;
            transform: scale(1);
          }
        }

        .chat-widget.is-open .chat-widget__launcher {
          display: none;
        }

        .chat-widget__launcher strong {
          position: absolute;
          top: -0.25rem;
          right: -0.15rem;
          display: inline-grid;
          min-width: 1.5rem;
          height: 1.5rem;
          padding-inline: 0.3rem;
          place-items: center;
          border-radius: 999px;
          background: var(--engagement-accent);
          color: #fff;
          box-shadow: 0 10px 22px rgba(47, 99, 255, 0.28);
          font-size: 0.78rem;
        }

        .chat-widget__panel {
          width: min(24rem, calc(100vw - 2rem));
          height: min(40rem, calc(100vh - 6rem));
          display: grid;
          grid-template-rows: auto 1fr auto;
          border: 1px solid var(--engagement-border);
          border-radius: 1.75rem;
          background: var(--engagement-surface);
          box-shadow: var(--engagement-shadow);
          backdrop-filter: blur(22px);
          overflow: hidden;
        }

        .chat-widget__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 1.1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          background:
            radial-gradient(circle at 10% 0%, rgba(47, 99, 255, 0.3), transparent 38%),
            linear-gradient(135deg, var(--engagement-header), var(--engagement-header-soft));
          color: #fff;
        }

        .chat-widget__header .eyebrow {
          color: rgba(255, 255, 255, 0.68);
          font-size: 0.72rem;
        }

        .chat-widget__header h2 {
          margin: 0.2rem 0 0;
          font-size: 1.12rem;
          color: #fff;
        }

        .chat-widget__header-copy {
          display: grid;
          gap: 0.2rem;
          min-width: 0;
        }

        .chat-widget__header-copy p {
          margin: 0.2rem 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .chat-widget__header-close {
          display: inline-grid;
          flex: 0 0 auto;
          width: 2.75rem;
          height: 2.75rem;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          padding: 0;
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          cursor: pointer;
          font-size: 1.7rem;
          line-height: 1;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
        }

        .chat-widget__header-close:hover {
          border-color: rgba(255, 255, 255, 0.38);
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .chat-widget__header-close span {
          transform: translateY(-0.06rem);
        }

        .chat-widget__messages {
          display: grid;
          align-content: start;
          gap: 0.78rem;
          padding: 1.1rem;
          background:
            linear-gradient(180deg, var(--engagement-surface), var(--engagement-surface-soft)),
            radial-gradient(circle at 88% 8%, rgba(47, 99, 255, 0.08), transparent 28%);
          overflow: auto;
        }

        .chat-widget__bubble {
          max-width: 88%;
          padding: 0.82rem 0.92rem;
          border-radius: 1.05rem;
          line-height: 1.55;
          white-space: pre-wrap;
          box-shadow: 0 10px 24px rgba(17, 24, 39, 0.07);
        }

        .chat-widget__bubble--system {
          max-width: 100%;
          border: 1px solid rgba(47, 99, 255, 0.12);
          background: rgba(47, 99, 255, 0.07);
          color: var(--engagement-header);
        }

        .chat-widget__bubble--visitor {
          margin-left: auto;
          border-bottom-right-radius: 0.35rem;
          background: var(--engagement-accent);
          color: #fff;
        }

        .chat-widget__bubble--admin {
          border: 1px solid var(--engagement-border);
          border-bottom-left-radius: 0.35rem;
          background: #fff;
          color: var(--engagement-ink);
        }

        .chat-widget__footer {
          display: grid;
          gap: 0.72rem;
          padding: 0.95rem;
          border-top: 1px solid rgba(17, 17, 17, 0.08);
          background: var(--engagement-surface);
        }

        .chat-widget__intake {
          display: grid;
          gap: 0.78rem;
          padding: 1rem;
          border-top: 1px solid rgba(17, 17, 17, 0.08);
          background: var(--engagement-surface);
        }

        .chat-widget__intake-heading {
          display: grid;
          gap: 0.2rem;
        }

        .chat-widget__intake-heading strong {
          color: var(--engagement-ink);
          font-size: 0.92rem;
        }

        .chat-widget__intake-heading span {
          color: rgba(17, 17, 17, 0.58);
          font-size: 0.76rem;
        }

        .chat-widget__intake > label:not(.chat-widget__consent) {
          display: grid;
          gap: 0.34rem;
          color: var(--engagement-ink);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .chat-widget__intake input:not([type='checkbox']) {
          width: 100%;
          min-height: 2.75rem;
          padding: 0 0.85rem;
          border: 1px solid var(--engagement-border);
          border-radius: 0.85rem;
          background: var(--engagement-surface-soft);
          color: var(--engagement-ink);
          font-size: 0.9rem;
          outline: none;
        }

        .chat-widget__intake input:not([type='checkbox']):focus {
          border-color: rgba(47, 99, 255, 0.5);
          box-shadow: 0 0 0 4px rgba(47, 99, 255, 0.12);
        }

        .chat-widget__consent {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: rgba(17, 17, 17, 0.68);
          font-size: 0.74rem;
          line-height: 1.45;
        }

        .chat-widget__consent input {
          width: 1rem;
          height: 1rem;
          margin-top: 0.05rem;
          accent-color: var(--engagement-accent);
        }

        .chat-widget__start {
          min-height: 2.8rem;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--engagement-accent), var(--engagement-accent-strong));
          color: #fff;
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(47, 99, 255, 0.2);
        }

        .chat-widget__start:disabled {
          cursor: wait;
          opacity: 0.55;
        }

        .chat-widget__footer textarea {
          width: 100%;
          resize: none;
          padding: 0.9rem 1rem;
          border: 1px solid var(--engagement-border);
          border-radius: 1.05rem;
          background: var(--engagement-surface-soft);
          color: var(--engagement-ink);
          line-height: 1.5;
          outline: none;
        }

        .chat-widget__footer textarea:focus {
          border-color: rgba(47, 99, 255, 0.5);
          box-shadow: 0 0 0 4px rgba(47, 99, 255, 0.12);
        }

        .chat-widget__actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .chat-widget__status,
        .chat-widget__hint {
          color: rgba(17, 17, 17, 0.58);
          font-size: 0.82rem;
        }

        .chat-widget__send {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          min-height: 2.55rem;
          padding: 0 0.95rem;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--engagement-accent), var(--engagement-accent-strong));
          color: #fff;
          font-size: 0.92rem;
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(47, 99, 255, 0.2);
        }

        .chat-widget__send:disabled {
          cursor: not-allowed;
          opacity: 0.42;
          box-shadow: none;
        }

        .chat-widget__send svg {
          width: 1rem;
          height: 1rem;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .chat-nudge {
          position: fixed;
          right: 1rem;
          bottom: 5.65rem;
          z-index: 59;
          width: min(22.5rem, calc(100vw - 2rem));
          padding: 1.05rem;
          border: 1px solid var(--engagement-border);
          border-radius: 1.35rem;
          background:
            linear-gradient(135deg, var(--engagement-surface), var(--engagement-surface-soft)),
            var(--engagement-surface);
          box-shadow:
            0 28px 74px rgba(15, 23, 42, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(18px);
        }

        .chat-nudge::before {
          content: "";
          position: absolute;
          top: 0;
          left: 1.05rem;
          right: 1.05rem;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, var(--engagement-accent), #5d85ff);
        }

        .chat-nudge__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          min-height: 1.65rem;
          padding: 0 0.62rem;
          margin-bottom: 0.72rem;
          border: 1px solid rgba(47, 99, 255, 0.14);
          border-radius: 999px;
          background: rgba(47, 99, 255, 0.08);
          color: var(--engagement-accent-strong);
          font-size: 0.74rem;
          font-weight: 850;
          letter-spacing: 0.02em;
        }

        .chat-nudge__badge i {
          width: 0.46rem;
          height: 0.46rem;
          border-radius: 999px;
          background: #1fcb83;
          box-shadow: 0 0 0 4px rgba(31, 203, 131, 0.16);
        }

        .chat-nudge p {
          margin: 0 2.4rem 1rem 0;
          color: #0f172a;
          font-size: 0.98rem;
          font-weight: 800;
          line-height: 1.58;
          letter-spacing: 0;
          word-break: keep-all;
        }

        .chat-nudge__response-time {
          display: inline-flex;
          align-items: center;
          min-height: 1.8rem;
          padding: 0 0.68rem;
          margin: -0.15rem 0 0.85rem;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.055);
          color: rgba(15, 23, 42, 0.68);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0;
        }

        .chat-nudge__close {
          position: absolute;
          top: 0.72rem;
          right: 0.72rem;
          display: inline-grid;
          width: 2.35rem;
          height: 2.35rem;
          place-items: center;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 999px;
          background: rgba(248, 250, 252, 0.8);
          cursor: pointer;
          color: rgba(15, 23, 42, 0.62);
          font-size: 1.35rem;
          line-height: 1;
          transition:
            background-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .chat-nudge__close:hover {
          background: #0f172a;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .chat-nudge__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.9rem;
          width: 100%;
          border: 0;
          border-radius: 999px;
          padding: 0 1rem;
          background: linear-gradient(135deg, var(--engagement-accent), var(--engagement-accent-strong));
          color: #ffffff;
          font-size: 0.92rem;
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(47, 99, 255, 0.22);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .chat-nudge__cta:hover,
        .chat-nudge__cta:focus-visible {
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(47, 99, 255, 0.3);
        }

        @media (max-width: 760px) {
          .chat-widget {
            right: max(0.7rem, env(safe-area-inset-right));
            bottom: max(0.7rem, env(safe-area-inset-bottom));
          }

          .chat-widget__launcher {
            width: 4.1rem;
            height: 4.1rem;
            padding: 0.58rem;
            border-radius: 1.25rem;
          }

          .chat-widget__launcher img {
            width: min(100%, 3.1rem);
            height: min(100%, 3.1rem);
          }

          .chat-widget__icon {
            width: 1.9rem;
            height: 1.9rem;
          }

          .chat-widget__launcher:hover .chat-widget__icon,
          .chat-widget__launcher:focus-visible .chat-widget__icon {
            opacity: 1;
            transform: none;
          }

          .chat-widget__launcher:hover .chat-widget__logo,
          .chat-widget__launcher:focus-visible .chat-widget__logo {
            opacity: 0;
            transform: scale(0.82);
          }

          .chat-widget__panel {
            width: calc(100vw - 1.5rem);
            height: min(75vh, 34rem);
          }

          .chat-nudge {
            right: max(0.7rem, env(safe-area-inset-right));
            width: calc(100vw - 1.5rem);
            bottom: calc(4.85rem + env(safe-area-inset-bottom));
            padding: 1rem;
          }

          .chat-nudge p {
            margin-right: 2.15rem;
          }
        }
      `})]})}export{m as default};