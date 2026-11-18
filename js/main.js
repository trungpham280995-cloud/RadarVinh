/* Nút chữ: l,t,w,h = vị trí/kích thước trong khung 1366x685; lines = chữ; url = liên kết (lấy từ Canva) */
const ITEMS=[{"l": 33.51, "t": 312.02, "w": 205.49, "h": 72.4, "lines": ["GIỚI THIỆU ĐƠN VỊ", "VĂN BẢN HIỆP ĐỒNG"], "url": "https://docs.google.com/spreadsheets/d/19pZyutXDMCRTwNQ4kmdeGkbGRkk0w29SxyUDkckVm0I/edit?gid=0#gid=0"}, {"l": 342.47, "t": 331.52, "w": 121.82, "h": 33.4, "lines": ["KÍP TRỰC"], "url": "https://docs.google.com/spreadsheets/d/1sliOkw1yqRkbHmVQZ0rvuorsidPPpVSmXpr8GgubyDg/edit?gid=959535423#gid=959535423"}, {"l": 585.49, "t": 312.02, "w": 195.02, "h": 72.4, "lines": ["TÀI LIỆU ĐƠN VỊ", "HỒ SƠ CHỨNG CHỈ"], "url": "https://drive.google.com/drive/folders/1nNsQPKGZPJkw5qZAiRyMI117h6AR0c82?usp=drive_link"}, {"l": 918.89, "t": 309.93, "w": 118.83, "h": 72.4, "lines": ["ĐÁNH GIÁ", "NĂNG LỰC"], "url": "https://radarvinh.com/"}, {"l": 1138.73, "t": 309.94, "w": 205.49, "h": 72.4, "lines": ["PHỔ BIẾN CHỈ THỊ", "BIÊN BẢN BÀN GIAO"], "url": "https://drive.google.com/drive/folders/1voQvkoZxH3e4296nuYftmStVsKEW5wix?usp=drive_link"}, {"l": 61.44, "t": 431.38, "w": 149.64, "h": 111.4, "lines": ["MUA BÁN", "SỬA CHỮA", "HUẤN LUYỆN"], "url": "https://docs.google.com/spreadsheets/d/1YLMDv56bknkMwAeNYZrqVpU9Q--Tb97Qb0UcSEFpMt8/edit?gid=889586634#gid=889586634"}, {"l": 354.48, "t": 447.87, "w": 97.8, "h": 72.4, "lines": ["HỒ SƠ", "AN TOÀN"], "url": "https://drive.google.com/drive/u/1/folders/1OD4BQNyyLH3Vp2mJFdsf6BnTw-GfkkFN"}, {"l": 602.29, "t": 431.38, "w": 161.42, "h": 111.4, "lines": ["QUẢN LÝ", "THIẾT BỊ VẬT TƯ", "GIẤY PHÉP"], "url": "https://drive.google.com/drive/u/1/folders/1aOkMdTfFGUY6GsYgFZ6imvnJD_OVD4bM"}, {"l": 916.37, "t": 450.88, "w": 123.9, "h": 72.4, "lines": ["HỒ SƠ", "BẢO DƯỠNG"], "url": "https://docs.google.com/spreadsheets/d/1AGTtRaWGAe-_HyjD25uW-tirtj0EWRT2R77he6ynuOM/edit?gid=0#gid=0"}, {"l": 1192.57, "t": 467.38, "w": 97.8, "h": 33.4, "lines": ["CHI BỘ"], "url": "https://drive.google.com/drive/folders/1M6k2Eng1rmKOSeAN9xDavID8Y-EjVNDA?usp=sharing"}, {"l": 33.51, "t": 585.83, "w": 205.49, "h": 72.4, "lines": ["SƠ ĐỒ HỆ THỐNG", "DANH SÁCH ĐƠN VỊ"], "url": "https://docs.google.com/spreadsheets/d/1uUzi96M_iwFOv3Vrx2DPViUBDQDGMsDrXrGnZdlfTu8/edit?gid=1224141130#gid=1224141130"}, {"l": 354.48, "t": 585.53, "w": 97.8, "h": 72.4, "lines": ["DIỄN TẬP", "ỨNG PHÓ"], "url": "https://docs.google.com/spreadsheets/d/1lgZIFCF0lpgAHkvGvOXzsn1XkCTQ5TJiWyiupXsiUf0/edit?gid=0#gid=0"}, {"l": 580.26, "t": 566.05, "w": 205.49, "h": 111.4, "lines": ["BÁO CÁO SỰ CỐ", "THỐNG KÊ KỸ THUẬT", "TRẢ LỜI CÔNG VĂN"], "url": "https://docs.google.com/spreadsheets/d/1-8nqRum5PWE03L7Rj6rCTk4HBJ8vMC76XKzC4kYw1iA/edit?gid=0#gid=0"}, {"l": 904.06, "t": 585.55, "w": 148.5, "h": 72.4, "lines": ["PCCC & TKCN", "PCTT & CNCH"], "url": "https://drive.google.com/drive/u/1/folders/12TRmAD864eRVJLgVtIBd0zwMl6i8_Ecl"}, {"l": 1174.99, "t": 585.53, "w": 132.97, "h": 72.4, "lines": ["CHI ĐOÀN", "CÔNG ĐOÀN"], "url": "https://drive.google.com/drive/u/1/folders/1RbYnHgZ0F4dMta0Hf25Ms5lq5m9xxx2w"}];

const title=document.querySelector('.title');
const canvas=document.getElementById('canvas'), stage=document.getElementById('stage'), cards=document.getElementById('cards');
/* ===== Bố cục responsive: luôn tràn khung hình, không còn dải trắng =====
   - Màn hình hẹp hơn thiết kế (16:9, 16:10, 3:2...): phóng theo chiều cao, cắt đều hai bên, nhãn chữ co lại gần nhau để vẫn nằm trọn trong màn hình.
   - Màn hình rộng hơn thiết kế: phóng theo chiều rộng; thừa chiều cao thì cắt bớt phần ảnh phía trên, quá nhiều thì cho cuộn dọc.
   - Tỉ lệ quá đứng (< 1.4) hoặc điện thoại: chuyển sang bố cục dọc. */
const W=1366, H=685, MAX_TOP_CROP=110, MIN_RATIO=1.4;
/* Xoay điện thoại: DỌC -> bản điện thoại; NGANG -> bản laptop (kể cả điện thoại xoay ngang). Khi đổi bố cục: mờ đi -> đổi -> hiện lại (không nháy/giật, không chạy lại hiệu ứng mở đầu). */
let prevM=null, swBusy=false, swPending=false, swBuild=false;
const wantMobile=()=>innerWidth/innerHeight < MIN_RATIO;
function layout(){
  const root=document.documentElement, m=wantMobile();
  if(prevM!==null && m!==prevM){
    if(swBusy){ swPending=true; return; }
    swBusy=true; root.classList.add('rv-switch','rv-sw2');
    setTimeout(()=>{
      swBuild=true; scrollTo(0,0); layoutNow(); swBuild=false; root.classList.add('rv-nointro');
      setTimeout(()=>{ root.classList.remove('rv-switch'); setTimeout(()=>root.classList.remove('rv-sw2'),600); swBusy=false; if(swPending){ swPending=false; layout(); } },340);
    },190);
    return; }
  layoutNow();
}
function layoutNow(){
  const vw=innerWidth, vh=innerHeight, root=document.documentElement;
  /* Bố cục dọc cho: điện thoại/tablet dọc (hẹp hoặc tỉ lệ < 1.4) và điện thoại xoay ngang (màn hình thấp) */
  const mobile = wantMobile(); prevM = mobile;
  root.classList.toggle('mobile', mobile);
  if(mobile){   // điện thoại: dựng đúng thiết kế Canva 685 x 1386, co theo bề ngang (tối đa 560px, canh giữa)
    const cw=Math.min(vw,560), u=cw/685;
    root.style.setProperty('--cw',cw+'px'); root.style.setProperty('--u',u); root.style.setProperty('--sh',(1386*u)+'px');
    buildMobile(); return; }
  let s, ox=0, oy=0, stageH=vh;
  if(vw/vh >= W/H){                       // rộng hơn thiết kế
    s=vw/W; const crop=H-vh/s;
    if(crop<=MAX_TOP_CROP) oy=Math.max(0,crop); else stageH=H*s;
  } else {                                // hẹp hơn thiết kế: phóng theo chiều cao
    s=vh/H; ox=(W-vw/s)/2;
  }
  const Vw=W-2*ox;                        // bề ngang thấy được (đơn vị thiết kế)
  stage.style.height=stageH+'px';
  canvas.style.transform=`translate(${-ox*s}px,${-oy*s}px) scale(${s})`;
  // Tiêu đề: giữ đúng vị trí trên ảnh (lá cờ không bị che); nếu màn hình cắt bớt hai bên thì thu nhỏ chữ một chút
  // để đuôi chữ VINH vẫn sát mép phải như thiết kế. Đường cơ sở giữ nguyên (y = 284).
  const f=Math.min(1,(W-ox-491.3)/(W-491.3));
  title.style.fontSize=(153.17*f)+'px';
  title.style.top=(282.66-1.12294*153.17*f)+'px';
  document.querySelectorAll('.item').forEach(a=>{ a.style.left=(a._xc*Vw/W+ox-a._bw/2)+'px'; });
  
}
function open_(url){ location.href=url; }
addEventListener('pageshow',e=>{
  document.querySelectorAll('.press').forEach(x=>x.classList.remove('press'));
  if(!leaving) return;                                   // quay lại bằng nút Back: đưa giao diện về trạng thái sạch rồi chạy lại hiệu ứng Enter
  restoreUI();
});
function restoreUI(){
  document.querySelectorAll('.press').forEach(x=>x.classList.remove('press'));
  leaving=false; document.documentElement.classList.add('rv-back'); document.documentElement.classList.remove('leaving'); setTimeout(()=>document.documentElement.classList.remove('rv-back'),900);   // rv-back: bảng thời tiết hiện lại êm khi quay về
  const els=document.querySelectorAll('.tile-wrap,.band,.title,.item,.m,.sec.hero h1');
  els.forEach(x=>x.style.animation='none'); void document.body.offsetWidth; els.forEach(x=>x.style.animation='');
  if(document.documentElement.classList.contains('mobile')) playMobileIntro(true);
}
/* Chuyển cảnh khi chọn: nhấn (PRESS_MS) -> Exit (EXIT_MS) -> mở mục mới */
let leaving=false;
const timing=()=>document.documentElement.classList.contains('mobile')?[90,200]:[100,480];   // [nhấn, chuyển cảnh] ms: rút ngắn để sang mục mới nhanh hơn (trước: 120+260 / 140+700)
/* Làm nóng kết nối tới trang đích ngay khi rê chuột / chạm / nhấn vào mục (DNS + TLS), để lúc chuyển sang link mở nhanh hơn */
const warmed=new Set();
function warm(url){ try{ const o=new URL(url,location.href).origin; if(warmed.has(o)||o===location.origin) return; warmed.add(o); const l=document.createElement('link'); l.rel='preconnect'; l.href=o; document.head.appendChild(l); }catch(_){} }
/* Trình duyệt nhúng trong ứng dụng (Zalo, Facebook, Messenger...): để CHÍNH trình duyệt mở liên kết ngay khi chạm (đáng tin cậy nhất, không phụ thuộc hẹn giờ), hiệu ứng chạy song song */
const IN_APP=/Zalo|FBAN|FBAV|FB_IAB|Instagram|Messenger|MicroMessenger|TikTok|Snapchat|Line\//i.test(navigator.userAgent);
function bind(a,url){
  a.href=url;
  ['pointerenter','touchstart','pointerdown','focus'].forEach(ev=>a.addEventListener(ev,()=>warm(url),{passive:true,once:true}));
  a.addEventListener('click',e=>{
    if(e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey) return;   // Ctrl/Shift/chuột giữa: để trình duyệt tự mở tab mới
    if(leaving){ e.preventDefault(); return; }
    if(IN_APP){ leaving=true; a.classList.add('press'); setTimeout(()=>document.documentElement.classList.add('leaving'),timing()[0]); setTimeout(()=>{ if(leaving) restoreUI(); },3000); return; }   // nếu ứng dụng chặn/mở ngoài và trang vẫn còn: khôi phục giao diện
    e.preventDefault(); leaving=true;
    a.classList.add('press');
    setTimeout(()=>{ if(leaving&&!document.hidden) restoreUI(); },12000);   // an toàn: mở link thất bại (mất mạng...) thì giao diện tự trở lại
    if(matchMedia('(prefers-reduced-motion:reduce)').matches){ open_(url); return; }
    const [P,X]=timing();
    setTimeout(()=>document.documentElement.classList.add('leaving'),P);   // nhấn xong -> bắt đầu chuyển cảnh rời đi
    setTimeout(()=>open_(url),P+X);                                       // nội dung cũ biến mất hẳn rồi mới sang mục mới
  });
}
const BAND_C=[347.66,485.16,624.16];   // tâm 3 dải màu (top + 64)
ITEMS.forEach(i=>{
  const a=document.createElement('a'); a.className='item';
  const bc=BAND_C.reduce((p,c)=>Math.abs(c-(i.t+i.h/2))<Math.abs(p-(i.t+i.h/2))?c:p);   // căn tâm chữ đúng tâm dải màu của hàng
  a.style.cssText=`left:${i.l-6}px;top:${bc-(i.h+8)/2}px;width:${i.w+12}px;height:${i.h+8}px;--c:${Math.floor((i.l+i.w/2)/273)}`;
  a.setAttribute('aria-label',i.lines.join(' '));
  const s=document.createElement('span'); s.className='txt'; s.innerHTML=i.lines.join('<br>'); a.appendChild(s);
  a._xc=i.l+i.w/2; a._bw=i.w+12;
  bind(a,i.url); canvas.appendChild(a);
});
/* Gom ảnh vào LỚP ẢNH, chữ + tiêu đề + 3 dải màu vào LỚP CHỮ (chỉ đổi cấu trúc DOM, không đổi vị trí) */
(function(){
  const li=document.createElement('div'); li.className='lyr lyr-img';
  const lt=document.createElement('div'); lt.className='lyr lyr-text';
  canvas.querySelectorAll(':scope > .tile-wrap').forEach(n=>li.appendChild(n));
  canvas.querySelectorAll(':scope > .band, :scope > .title, :scope > .item').forEach(n=>lt.appendChild(n));
  canvas.appendChild(li); canvas.appendChild(lt);
})();
let rz=0; addEventListener('resize',()=>{ if(!rz) rz=requestAnimationFrame(()=>{ rz=0; layout(); }); }); addEventListener('orientationchange',()=>setTimeout(layout,120)); layout();
/* Tiêu đề cũng là liên kết, cùng cơ chế nhấn như các chữ khác */
bind(document.querySelector('.title-link'),document.querySelector('.title-link').href);

/* ===== Con trỏ radar: 2 vòng đồng tâm, 12 chấm vòng ngoài, 2 chấm vòng trong + 1 chấm tâm =====
   Rê vào nút số n (1-15, đọc theo hàng) -> chấm n sáng, vệt quét chạy thuận chiều kim đồng hồ
   từ trục tung (12 giờ) đến chấm đó.  1-12: vòng ngoài từ 12 giờ, mỗi chấm cách 30°;
   13: vòng trong bên trái, 14: chấm tâm, 15: vòng trong bên phải.                         */
(function(){
  /* Chỉ bật khi thật sự có chuột (sự kiện pointermove kiểu 'mouse'); điện thoại/cảm ứng không bị ảnh hưởng. */
  let started=false, api=null;
  function init(e0){
  if(started) return; started=true;   // chỉ dựng con trỏ một lần (có thể được gọi từ trang chính hoặc từ bảng thời tiết trong iframe)
  const NS='http://www.w3.org/2000/svg', OR=22, IR=11, SIZE=52;
  const MAP=[300,330,0,30,60, 270,'L','C','R',90, 240,210,180,150,120];  // góc (độ, tính từ 12 giờ, thuận chiều kim đồng hồ) của nút 1..15
  const CENTER=8;   // nút 8 "QUẢN LÝ THIẾT BỊ VẬT TƯ GIẤY PHÉP" là tâm
  const POS=n=>{ const v=MAP[n-1]; return v==='L'?{d:270,r:IR}:v==='R'?{d:90,r:IR}:v==='C'?{d:0,r:0}:{d:v,r:OR}; };
  const x0=32+OR*Math.sin(-75*Math.PI/180), y0=32-OR*Math.cos(75*Math.PI/180);
  const el=document.createElement('div');
  el.setAttribute('aria-hidden','true'); el.className='radar-cursor';
  el.style.cssText=`position:fixed;left:0;top:0;width:${SIZE}px;height:${SIZE}px;margin:${-SIZE/2}px 0 0 ${-SIZE/2}px;pointer-events:none;z-index:9999;opacity:0;transition:opacity .2s;will-change:transform;filter:drop-shadow(0 0 1.5px rgba(7,24,48,.85)) drop-shadow(0 0 3px rgba(7,24,48,.5))`;
  el.innerHTML=`<svg xmlns="${NS}" viewBox="0 0 64 64" width="${SIZE}" height="${SIZE}">
    <defs><linearGradient id="rcg" gradientUnits="userSpaceOnUse" x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="32" y2="10"><stop offset="0" stop-color="#9CC8FF" stop-opacity="0"/><stop offset="1" stop-color="#9CC8FF" stop-opacity=".75"/></linearGradient></defs>
    <g id="rcsweep" opacity="0"><path d="M32 32L${x0.toFixed(2)} ${y0.toFixed(2)}A${OR} ${OR} 0 0 1 32 10Z" fill="url(#rcg)"/><path d="M32 32V10" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g>
    <path class="rc-s" d="M32 2.5V61.5M2.5 32H61.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <circle class="rc-s" cx="32" cy="32" r="${OR}" fill="none" stroke="#fff" stroke-width="1.6"/>
    <circle class="rc-s" cx="32" cy="32" r="${IR}" fill="none" stroke="#fff" stroke-width="1.4" stroke-opacity=".85"/>
    <g id="rcdot" opacity="0"><circle id="rcdot1" r="5" fill="#9CC8FF" opacity=".3"/><circle id="rcdot2" r="2.6" fill="#9CC8FF" stroke="#fff" stroke-width="1.1"/></g>
    <circle class="rc-c" cx="32" cy="32" r="2.7" fill="#fff"/></svg>`;
  const st=document.createElement('style');
  st.textContent='.rc-c{transition:fill .2s,stroke .2s}.rc-center .rc-c{fill:#9CC8FF;stroke:#fff;stroke-width:1.1}';
  document.head.appendChild(st);
  document.body.appendChild(el);
  document.documentElement.classList.add('has-radar');
  const sweep=el.querySelector('#rcsweep'), dot=el.querySelector('#rcdot'), d1=el.querySelector('#rcdot1'), d2=el.querySelector('#rcdot2');
  let mx=e0.clientX,my=e0.clientY,raf=0,anim=0,lt=0; move(); el.style.opacity=1;
  function move(){ raf=0; el.style.transform=`translate3d(${mx}px,${my}px,0)`; }
  addEventListener('mousemove',e=>{ clearTimeout(lt); mx=e.clientX; my=e.clientY; el.style.opacity=1; if(!raf) raf=requestAnimationFrame(move); },{passive:true});
  document.documentElement.addEventListener('mouseleave',()=>{ el.style.opacity=0; });
  /* Cầu nối cho bảng thời tiết (iframe): chuột đang ở trong iframe thì trang chính không nhận được mousemove,
     nên bảng gửi vị trí (đã quy đổi sang toạ độ trang chính) vào đây để CHÍNH con trỏ radar này tiếp tục chạy theo chuột. */
  api={
    move(x,y){ clearTimeout(lt); mx=x; my=y; el.style.opacity=1; if(!raf) raf=requestAnimationFrame(move); },
    leave(){ clearTimeout(lt); lt=setTimeout(()=>{ el.style.opacity=0; },90); }   // chờ một nhịp: nếu chuột đi tiếp sang vùng khác của trang thì mousemove của trang sẽ hiện lại ngay
  };
  /* Ba cơ chế độc lập:
     1) Nút thường  : quét từ trục tung (12 giờ) thuận chiều kim đồng hồ tới chấm của nút rồi dừng, chấm sáng.
     2) Nút trung tâm: KHÔNG quét; chấm tâm phát sáng trực tiếp (cùng màu/quầng sáng với các chấm khác).
     3) Tiêu đề      : vệt quét quay liên tục 360° (lặp vô hạn) cho tới khi rời chuột; không sáng chấm nào. */
  function reset(){ cancelAnimationFrame(anim); el.classList.remove('rc-center'); }
  function setDot(x,y){ d1.setAttribute('cx',x);d1.setAttribute('cy',y);d2.setAttribute('cx',x);d2.setAttribute('cy',y); }
  function show(n){
    reset();
    if(n===CENTER){
      sweep.style.transition='opacity .15s'; sweep.style.opacity=0;
      setDot(32,32); el.classList.add('rc-center');
      dot.style.transition='opacity .22s ease-out'; dot.style.opacity=1;
      return;
    }
    const t=POS(n), end=t.d===0?360:t.d;               // nút ở 12 giờ: một vòng đầy rồi dừng tại trục tung
    const a=(t.d-90)*Math.PI/180; setDot(32+t.r*Math.cos(a),32+t.r*Math.sin(a));
    sweep.style.transition='none'; sweep.style.opacity=1; dot.style.transition='none'; dot.style.opacity=0;
    const T=Math.max(380,Math.min(900,end*3.2)), t0=performance.now();
    (function step(now){
      const k=Math.min(1,(now-t0)/T), e=1-Math.pow(1-k,3);
      sweep.setAttribute('transform',`rotate(${end*e} 32 32)`);
      if(k>0.55) dot.style.opacity=Math.min(1,(k-0.55)/0.3);
      if(k<1) anim=requestAnimationFrame(step);
    })(t0);
  }
  function spin(){
    reset();
    sweep.style.transition='none'; sweep.style.opacity=1; dot.style.transition='none'; dot.style.opacity=0;
    const PERIOD=900, t0=performance.now();           // 1 vòng = 0,9 giây (bằng thời gian quét một vòng của các nút)
    (function step(now){
      sweep.setAttribute('transform',`rotate(${((now-t0)/PERIOD*360)%360} 32 32)`);
      anim=requestAnimationFrame(step);
    })(t0);
  }
  function hide(){
    reset();
    sweep.style.transition=dot.style.transition='opacity .28s ease-out'; sweep.style.opacity=0; dot.style.opacity=0;
  }
  const tl=document.querySelector('.title-link');
  tl.addEventListener('mouseenter',spin); tl.addEventListener('mouseleave',hide);
  document.querySelectorAll('.item').forEach((a,i)=>{
    a.addEventListener('mouseenter',()=>show(i+1));
    a.addEventListener('mouseleave',hide);
  });
  }
  addEventListener('pointermove',function f(e){ if(e.pointerType!=='mouse') return; removeEventListener('pointermove',f); init(e); },{passive:true});
  /* Điểm vào cho iframe bảng thời tiết: chỉ gọi khi sự kiện là chuột thật (bảng tự kiểm tra pointerType). Trả về true nếu con trỏ radar đang chạy. */
  window.RVRadar={
    move(x,y){ if(!started) init({clientX:x,clientY:y}); else if(api) api.move(x,y); return started; },
    leave(){ if(api) api.leave(); }
  };
})();


/* Mobile: dựng bố cục dọc (một lần, khi cần) từ CÙNG dữ liệu ITEMS và CÙNG ảnh với desktop.
   Ảnh dùng thẻ <img decoding="async"> + object-position theo tiêu điểm (--fx/--fy) để không cắt mất chủ thể. */
var mobileBuilt;   // var: layout() chạy trước dòng này
/* Dựng trang điện thoại một lần, từ CÙNG dữ liệu ITEMS + CÙNG ảnh với desktop. Thông số khung/ảnh/ô lấy từ Canva (đơn vị thiết kế). */
function buildMobile(){
  if(mobileBuilt) return; mobileBuilt=true;
  const MOB_LABELS=[["GIỚI THIỆU","ĐƠN VỊ","VĂN BẢN","HIỆP ĐỒNG"],["KÍP TRỰC"],["TÀI LIỆU","ĐƠN VỊ","HỒ SƠ","CHỨNG CHỈ"],["ĐÁNH GIÁ","NĂNG LỰC"],["PHỔ BIẾN","CHỈ THỊ","BIÊN BẢN","BÀN GIAO"],
    ["MUA BÁN","SỬA CHỮA","HUẤN LUYỆN"],["HỒ SƠ","AN TOÀN"],["QUẢN LÝ","THIẾT BỊ","VẬT TƯ","GIẤY PHÉP"],["HỒ SƠ","BẢO DƯỠNG"],["CHI BỘ"],
    ["SƠ ĐỒ","HỆ THỐNG","DANH SÁCH","ĐƠN VỊ"],["DIỄN TẬP","ỨNG PHÓ"],["BC SỰ CỐ","THỐNG KÊ","KỸ THUẬT","TRẢ LỜI CV"],["PCCC & TKCN","PCTT & CNCH"],["CHI ĐOÀN","CÔNG ĐOÀN"]];
  /* [left, top] từng ô: tiêu đề + 15 mục (xếp 2 cột x 8 hàng) */
  const OFF=[[0,0],[1.38,1.73],[1.38,-1.57],[0,3.86],[0,0],[1.37,0],[1.37,2.2],[0,0],[1.38,3.7],[1.38,0],[1.1,0],[1.38,0],[1.38,0],[0,0],[0,0]];   // lệch tâm chữ so với tâm ô (theo Canva)
  const CELLS=[[18.56,2],[193.21,2],[18.56,178.15],[193.05,178.15],[18.56,351.15],[193.21,351.15],[19.94,524.15],[194.43,524.15],[18.56,697.15],[193.05,697.15],[17.18,870.15],[193.21,870.15],[17.18,1043.15],[193.21,1043.15],[16.68,1216.15],[193.21,1216.15]];
  /* khung ảnh: [top,left,w,h, ảnh(tile), imageBox left,top,w,h, xoay, lật X, lật Y] */
  const FR=[
   [-208.7558782818068,52.78198274693119,477.03305364307425,530.6175677210407,0,-226.48765727013551,-510.95611576261683,718.8825582997474,1278.0134369773282,140.3,0,0],
   [274.857794591965,-108.61696808252816,369.7468057862997,247.73215077873274,1,-111.49213262630312,-212.2511172735806,488.2167568858243,867.9409011303544,40,0,1],
   [478.8861928389308,199.62927616893444,246.12938051455296,247.10101642868807,2,-38.58727584324188,-76.6831527566693,361.9181968163096,452.2430801243117,140.3,0,0],
   [759.1760465500126,4.533956564178595,503.1641931420053,246.5739494230618,3,-6.687269348043571,-132.6669268465601,538.4877310070565,538.4877310070565,140.45100979552325,0,0],
   [950.9857016540644,-173.6338660009107,461.6627884934473,410.02303767344364,4,-14.104427386720658,-419.9780216752141,617.1126649895277,1096.716529628128,39.7,0,1],
   [410.013824681858,481.4136380456681,245.9310393485419,510.32867658047337,5,-216.86698820991242,-174.6100613751321,647.1774377828334,970.76615667425,-39.7,1,1],
   [821.0179469296057,497.32672534153875,248.67699404536657,456.0308300726395,6,-182.63088265117972,-216.68692755101583,486.1680443277575,729.9649228616186,140.3,0,0],
   [1.333023000566925,464.07511498223096,246.69703304029161,562.4926243225322,7,-299.73929111989867,10.571791478677085,786.9799075242208,590.445804144646,-39.672222089698124,1,1],
   [1198.5703403422779,250.87152863525782,249.1975099503307,292.0984546513393,8,-54.26167008064118,-73.50567945429327,537.6482731719814,698.180451483549,140.3,0,0],
   [1239.732413479073,568.3377516989498,241.43681655884546,253.75498340703584,9,-104.48877987434656,-133.68748840527118,593.8584179828673,398.6172942624726,140.3,0,0],
   [542.9231478432399,-83.08054458827004,174.74001381364673,192.99878450099519,10,-259.0474379196131,38.62775257163821,535.546278114519,306.1041163233242,140.3,0,0]];
  const tl=document.querySelector('.title-link'), imgs=[...document.querySelectorAll('.tile img')];
  const MOB7='assets/images/mobile-tile.jpg';   // khung hoàng hôn: ảnh sạch (không chữ) đúng như mẫu Canva
  const page=document.createElement('div'); page.className='mpage';
  const layer=document.createElement('div'); layer.className='mlayer';
  FR.forEach(f=>{
    const d=document.createElement('div'); d.className='mf';
    d.style.cssText=`top:${f[0]}px;left:${f[1]}px;width:${f[2]}px;height:${f[3]}px`;
    const im=document.createElement('img'); im.alt=''; im.decoding='async'; im.draggable=false; im.src=f[4]===6?MOB7:(imgs[f[4]].currentSrc||imgs[f[4]].src);
    im.style.cssText=`left:${f[5]}px;top:${f[6]}px;width:${f[7]}px;height:${f[8]}px;transform:translate(${f[7]/2}px,${f[8]/2}px) rotate(${f[9]}deg) translate(${-f[7]/2}px,${-f[8]/2}px)`;
    const fl=document.createElement('div'); fl.className='mfl'; if(f[10]||f[11]) fl.style.transform=`scale(${f[10]?-1:1},${f[11]?-1:1})`;   // Canva lật quanh TÂM KHUNG
    fl.appendChild(im); d.appendChild(fl); layer.appendChild(d);
  });
  page.appendChild(layer);
  const h=document.createElement('h1'); h.className='mtitle'; const ta=document.createElement('a'); ta.setAttribute('aria-label','ĐỘI RADAR VINH');
  const sp=document.createElement('span'); sp.textContent='ĐỘI RADAR VINH'; ta.appendChild(sp); bind(ta,tl.href); h.appendChild(ta); page.appendChild(h);
  const nav=document.createElement('nav'); nav.setAttribute('aria-label','Danh mục liên kết');
  const cell=(k,label,url,cls,aria)=>{ const a=document.createElement('a'); a.className='m'+(cls?' '+cls:''); a.style.cssText=`left:${CELLS[k][0]}px;top:${CELLS[k][1]}px;--k:${k}`;
    a.setAttribute('aria-label',aria); a.innerHTML=label; bind(a,url); nav.appendChild(a); };
  cell(0,'ĐỘI<br>RADAR<br>VINH',tl.href,'mt-cell','ĐỘI RADAR VINH');
  ITEMS.forEach((i,k)=>cell(k+1,MOB_LABELS[k].join('<br>').replace(/&/g,'&amp;'),i.url,'',i.lines.join(' ')));
  nav.querySelectorAll('a.m').forEach((el,n)=>{ if(!n) return; const o=OFF[n-1]; if(o[0]) el.style[o[0]>0?'paddingLeft':'paddingRight']=(Math.abs(o[0])*2)+'px'; if(o[1]) el.style[o[1]>0?'paddingTop':'paddingBottom']=(Math.abs(o[1])*2)+'px'; });
  const mt=document.createElement('div'); mt.className='mtext'; mt.appendChild(h); mt.appendChild(nav); page.appendChild(mt);   // lớp chữ (tiêu đề + 15 ô) nằm trên lớp ảnh
  cards.appendChild(page);
  playMobileIntro(swBuild);   // dựng lần đầu do xoay màn hình: chỉ hiện nhẹ, không chạy lại hiệu ứng mở đầu dài
}

/* ===== Animation mở đầu bản điện thoại — THIẾT KẾ (3) =====
   Mở đầu (Canva "Nền mobie Radar Vinh"): ô trắng + chữ fade-in -> thu nhỏ về góc trên trái thành ô "ĐỘI RADAR VINH" (khung ảnh/đường kẻ nền chuyển về đúng giao diện cuối).
   GĐ A: GIỚI THIỆU trượt ngang ra khỏi ô tiêu đề; rồi từng ô cột phải trượt xuống từ vị trí ô phía trên (8 ô, lần lượt).
   GĐ B: 7 ô cột trái lần lượt trượt từ phải sang trái, ra từ ô cùng hàng của cột phải.
   Cuối: chữ trắng "ĐỘI RADAR VINH" trượt từ trên xuống (opacity 80%) rồi sáng dần lên 100%.
   Mỗi ô là CHÍNH phần tử gốc (không tạo bản sao): chỉ dùng transform/clip-path/opacity; phần đang chồng lên ô nguồn được cắt đi nên ô "chui ra" từ ô nguồn, không bị ẩn rồi hiện lại ở chỗ khác.
   Tất cả toạ độ tính theo đơn vị thiết kế bên trong .mpage nên tự co theo mọi kích thước màn hình. Chỉnh nhịp ở object C bên dưới. */
async function playMobileIntro(quick){
  const C={fade:700,hold:300,shrink:900,right:1420,left:1540,rowGap:263,ramp:230,ramp1:300,wave0:70,waveInc:12,gap:10,slide:1400,glow:850,drop:560,over:.04,peak:.58,dx:120,dy:-120,fly:2300,flyStep:60,flyEase:'cubic-bezier(.22,.7,.2,1)',
           ease:'cubic-bezier(.4,0,.1,1)',eio:'cubic-bezier(.45,0,.15,1)',sine:'cubic-bezier(.37,0,.63,1)'};     // ms
  const P=playMobileIntro, tok=P.tok=(P.tok||0)+1; P.active=true;
  (P.run||[]).forEach(a=>{ try{a.cancel();}catch(e){} }); P.run=[];
  const page=document.querySelector('#cards .mpage'); if(!page){ P.active=false; return; }
  const layer=page.querySelector('.mlayer'), title=page.querySelector('.mtitle');
  const cells=[...page.querySelectorAll('nav a.m')], frames=[...page.querySelectorAll('.mlayer .mf')];
  const c0=cells[0], W=165;
  if(!P.fin) P.fin={c0:c0.style.cssText, f:[0,3,6].map(i=>{ const im=frames[i].querySelector('img'); return {el:frames[i],img:im,css:frames[i].style.cssText,icss:im.style.cssText}; })};
  const FIN=P.fin;
  const restoreGeom=()=>{ FIN.f.forEach(o=>{ o.el.style.cssText=o.css; o.img.style.cssText=o.icss; }); c0.style.cssText=FIN.c0; layer.style.opacity=''; };
  const showAll=()=>{ cells.forEach(c=>{ c.style.visibility=''; c.style.zIndex=''; c.style.willChange=''; c.style.opacity=''; c.style.pointerEvents=''; }); title.style.visibility=''; title.style.willChange=''; };
  restoreGeom(); showAll();
  if(quick){ P.run.push(page.animate([{opacity:0},{opacity:1}],{duration:450,easing:'ease-out'})); P.active=false; return; }   // quay lại bằng Back: hiện lại nhanh
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){ P.active=false; return; }                                          // giảm chuyển động: hiện thẳng giao diện cuối

  const px=o=>{ const r={}; for(const k in o) r[k]=typeof o[k]==='number'?o[k]+'px':o[k]; return r; };
  /* Nền (11 khung ảnh) luôn ở đúng vị trí giao diện cuối và KHÔNG bị tác động trong suốt phần thu nhỏ: chỉ ô trắng chuyển động */
  const B0={left:19.936016594034896,top:14.962730182271542,width:344.4424862826363,height:338.8040852398609,paddingLeft:19.452111426067224,paddingTop:17.4739596,fontSize:93.3333,borderRadius:44};
  const B1={left:18.560387367341747,top:2,width:W,height:W,paddingLeft:8.24,paddingTop:10.17,fontSize:46.667,borderRadius:8.8};
  Object.assign(c0.style,px(B0)); c0.style.opacity='0';
  cells.slice(1).forEach(c=>{ c.style.opacity='.001'; c.style.willChange='transform,opacity'; c.style.pointerEvents='none'; }); title.style.visibility='hidden';   // gần như trong suốt: tạo sẵn lớp GPU + vẽ sẵn chữ cho cả 15 ô trước khi trượt

  const run=a=>(P.run.push(a),a), fin=a=>a.finished.catch(()=>0), sleep=ms=>new Promise(r=>setTimeout(r,ms)), alive=()=>tok===P.tok;
  layer.style.opacity='0';                                      // nền chỉ hiện khi ảnh đã giải mã xong (không bị hiện lắt nhắt)
  try{ await Promise.race([Promise.all([document.fonts.load('93px Anton','ĐỘI RADAR VINH ƠƯẠỘ'),...[...layer.querySelectorAll('img')].map(im=>im.decode().catch(()=>0))]),sleep(15000)]); }catch(e){}
  if(!alive()) return; layer.style.opacity='';
  /* 0. Các ảnh phía sau trượt vào khung từ góc TRÊN BÊN PHẢI (cùng kiểu "trôi" như bản ngang: ease-out dài, ảnh nào gần góc phải trên vào trước, mờ -> rõ) */
  const FX=[...frames].map(el=>{ const l=parseFloat(el.style.left), t=parseFloat(el.style.top), w=parseFloat(el.style.width), h=parseFloat(el.style.height); return {el,d:Math.hypot(l+w/2-685,t+h/2)}; }).sort((p,q)=>p.d-q.d);
  const fly=FX.map((o,n)=>run(o.el.animate([{translate:`${C.dx}px ${C.dy}px`,opacity:0},{translate:'0px 0px',opacity:1}],{duration:C.fly,delay:n*C.flyStep,easing:C.flyEase,fill:'backwards'})));
  await new Promise(r=>requestAnimationFrame(()=>r())); if(!alive()) return;
  await sleep((FX.length-1)*C.flyStep+C.fly*.62); if(!alive()) return;     // ảnh gần vào hẳn thì ô trắng bắt đầu hiện

  /* 1. Ô trắng + chữ fade-in */
  let a=run(c0.animate([{opacity:0},{opacity:1}],{duration:C.fade,easing:'ease-out',fill:'forwards'}));
  await fin(a); if(!alive()) return; c0.style.opacity=''; a.cancel();
  await sleep(C.hold); if(!alive()) return;

  await Promise.all(fly.map(fin)); if(!alive()) return; fly.forEach(x=>x.cancel());
  /* 2-3. Thu nhỏ về góc trên trái = ô "ĐỘI RADAR VINH" cuối (chỉ ô trắng chuyển động, nền đứng yên) */
  const o={duration:C.shrink,easing:C.eio,fill:'forwards'}, an=[];
  an.push(c0.animate([px(B0),px(B1)],o));
  an.forEach(run); await Promise.all(an.map(fin)); if(!alive()) return;
  restoreGeom(); an.forEach(x=>x.cancel());                   // trạng thái cuối trùng khớp 100% với CSS/inline gốc

  /* Ô trượt ra từ ô nguồn: phần còn chồng lên ô nguồn bị cắt (clip-path) nên ô "chui ra" từ dưới ô nguồn */
  const pos=k=>[parseFloat(cells[k].style.left),parseFloat(cells[k].style.top)];
  /* Đường chuyển động "nảy nhẹ": tăng tốc êm (sine) -> vọt qua đích một chút -> nảy về êm; vận tốc liên tục bằng 0 ở hai đầu và ở đỉnh vọt nên không bị giật/cứng */
  const bounceX=(dur)=>{
    const N=Math.max(30,Math.round(dur/16)), o=C.over, u1=C.peak, r=[];
    for(let n=0;n<=N;n++){ const u=n/N;
      r.push(u<=u1 ? (1+o)*(.5-.5*Math.cos(Math.PI*u/u1)) : 1+o*(.5+.5*Math.cos(Math.PI*(u-u1)/(1-u1)))); }
    r[N]=1; return r;
  };
  /* TOÀN BỘ chuỗi trượt (cột phải + cột trái) được dựng thành MỘT dòng thời gian duy nhất: 15 animation tạo cùng lúc, mỗi ô có độ trễ riêng,
     chỉ dùng transform + opacity (chạy trên GPU). Nhờ vậy ô sau bắt đầu khi ô trước đang chạy, và nếu luồng chính bị bận (giải mã ảnh, GC...)
     thì các ô VẪN trượt liên tục theo đồng hồ chung — không còn chuyện khựng ở giữa chừng rồi mới trượt tiếp.
     Ô nằm DƯỚI ô nguồn (z-index) nên "chui ra" từ ô nguồn; các ô cột phải mờ dần vào trong ~0,2s đầu để không lộ ra đột ngột khi ô nguồn chưa kịp tới nơi. */
  const cellAnim=(k,src,delay,dur,ramp)=>{
    const el=cells[k], [L,T]=pos(k), [sL,sT]=pos(src), X=bounceX(dur), N=X.length-1, total=delay+dur, st=`translate(${sL-L}px,${sT-T}px)`;
    const kf=[]; if(delay>0) kf.push({offset:0,opacity:0,transform:st});
    X.forEach((x,n)=>{ const t=n/N*dur, o=ramp?Math.min(1,t/ramp):1;
      if(n===0&&!ramp&&delay>0) kf.push({offset:delay/total,opacity:0,transform:st});                       // đứng yên (ẩn) dưới ô nguồn cho tới đúng lúc xuất phát
      kf.push({offset:(delay+t)/total,transform:`translate(${(sL-L)*(1-x)}px,${(sT-T)*(1-x)}px)`,opacity:ramp?o*o*(3-2*o):1}); });
    el.style.opacity=''; el.style.visibility='';
    const an=run(el.animate(kf,{duration:total,easing:'linear'}));
    fin(an).then(()=>{ if(alive()) el.style.pointerEvents=''; });
    return an;
  };
  /* thứ tự lớp: ô tiêu đề trên cùng; cột phải xếp chồng từ trên xuống; cột trái nằm dưới cột phải */
  c0.style.zIndex='60';
  [1,3,5,7,9,11,13,15].forEach((k,i)=>{ cells[k].style.zIndex=String(40-i); });
  [2,4,6,8,10,12,14].forEach(k=>{ cells[k].style.zIndex='10'; });
  /* Thời điểm (ms) một ô vừa chạm vị trí cuối */
  const arrive=dur=>dur*C.peak*Math.acos(1-2/(1+C.over))/Math.PI;
  const R=[1,3,5,7,9,11,13,15], L7=[2,4,6,8,10,12,14];
  /* GĐ A: cột phải theo đúng thứ tự cũ, mỗi hàng cách hàng trước C.rowGap ms (hàng sau bắt đầu khi hàng trước còn đang chạy); ô đầu xuất phát từ ô tiêu đề, các ô sau từ ô phía trên */
  /* GĐ B: 7 ô trái bắt đầu ngay khi ô cuối cột phải chạm vị trí cuối; độ trễ giữa các ô 70, 82, 94, ... ms (tăng dần), cùng thời lượng + cùng đường cong */
  const baseB=(R.length-1)*C.rowGap+arrive(C.right), dl=[0]; for(let i=1;i<L7.length;i++) dl.push(dl[i-1]+C.wave0+C.waveInc*(i-1));
  const anims=[...R.map((k,i)=>cellAnim(k,i?R[i-1]:0,i*C.rowGap,C.right,i?Math.max(C.ramp,arrive(C.right)-C.rowGap+60):Math.round(C.right*.3))),
               ...L7.map((k,i)=>cellAnim(k,k+1,baseB+dl[i],C.left,0))];
  await Promise.all(anims.map(fin)); if(!alive()) return;
  anims.forEach(x=>x.cancel()); cells.forEach(c=>{ c.style.willChange=''; c.style.pointerEvents=''; c.style.opacity=''; });
  cells.forEach(c=>{ c.style.zIndex=''; });
  /* Cuối: chữ trắng trượt từ trên xuống (opacity 80%), tới vị trí cuối thì sáng dần lên 100% */
  await sleep(C.gap); if(!alive()) return;
  title.style.visibility='';
  title.style.willChange='transform,opacity';
  const t0=run(title.animate([{opacity:0},{opacity:.8}],{duration:450,easing:C.sine,fill:'forwards'}));
  const t1=run(title.animate([{transform:`translateY(${-C.drop}px)`},{transform:'translateY(0px)'}],{duration:C.slide,easing:C.ease,fill:'forwards'}));
  await fin(t1); if(!alive()) return;
  const sp=title.querySelector('span'), g=1.58;                  // 241,3px / 153,17px: quầng sáng nhân theo cỡ chữ để giống bản ngang
  const glow=`0 0 ${8*g}px rgba(255,255,255,.9),0 0 ${22*g}px rgba(255,255,255,.55)`, none='0 0 0 rgba(255,255,255,0),0 0 0 rgba(255,255,255,0)';
  const t2=run(title.animate([{opacity:.8},{opacity:1}],{duration:C.glow,easing:C.sine}));
  const t3=run(sp.animate([{offset:0,filter:'brightness(1)',textShadow:none,easing:C.sine},
                           {offset:.4,filter:'brightness(1.15)',textShadow:glow,easing:C.sine},
                           {offset:1,filter:'brightness(1)',textShadow:none}],{duration:C.glow}));
  await Promise.all([fin(t2),fin(t3)]); if(!alive()) return;
  [t0,t1,t2,t3].forEach(x=>x.cancel()); title.style.willChange=''; P.run=[]; P.active=false;
}

/* ===== Chế độ nổi ảnh =====
   Bật : nhấn giữ chuột trái ~3 giây (2,8 giây) trên ẢNH (kể cả phần ảnh dưới dải màu; KHÔNG phải chữ/tiêu đề).
         Hai lớp đổi chỗ: ảnh tiến lên, chữ + 3 dải màu lùi xuống; hai lớp đi xuyên qua nhau (đổi z-index đúng giữa chuyển cảnh).
   Chạy: ảnh dưới con trỏ nổi lên, ảnh cũ hạ xuống đồng thời (mỗi ảnh nội suy liên tục từ trạng thái hiện tại).
   Tắt : nhấn chuột trái 1 lần ở bất kỳ đâu (chỉ để thoát, không mở link) -> chuyển cảnh NGƯỢC; hoặc tải lại trang. */
(function(){
  const HOLD_MS=2800, MOVE_TOL=24, FALL_HOLD=1500;
  const LYR_MS=1800;                          // thời lượng chuyển cảnh và thời điểm hai lớp ngang nhau
  const root=document.documentElement;
  let armed=false, mode=false, busy=false, holdT=0, hx=0, hy=0, lx=0, ly=0, raf=0, cur=null, swallow=false, seq=[];
  const timers=new WeakMap();
  const later=(f,ms)=>{ const id=setTimeout(f,ms); seq.push(id); return id; };
  const tileAt=(x,y)=>{ for(const e of document.elementsFromPoint(x,y)){ const t=e.closest&&e.closest('.tile'); if(t) return t; } return null; };
  function setLv(t,lv){
    const w=t.parentElement, old=timers.get(t); if(old) clearTimeout(old);
    if(lv){ t.dataset.lv=lv; w.classList.add('up','top'); timers.set(t,0); }
    else { delete t.dataset.lv; w.classList.remove('top'); timers.set(t,setTimeout(()=>w.classList.remove('up'),FALL_HOLD)); }
  }
  function hover(t){ if(t===cur) return; const prev=cur; cur=t; root.classList.toggle('float-hov',!!t); if(prev) setLv(prev,0); if(t) setLv(t,2); }
  function start(t){
    if(armed||busy) return; armed=true; busy=true; swallow=true;
    root.classList.remove('float-out'); root.classList.add('float-on','float-in');   // ảnh tiến lên, chữ lùi xuống, cùng lúc
    later(()=>root.classList.remove('float-in'),LYR_MS+40);
    later(()=>{ busy=false; mode=true; },LYR_MS);   // xong: bật tương tác ảnh
  }
  function stop(instant){
    if(!armed) return;
    armed=false; mode=false; cur=null; root.classList.remove('float-hov'); seq.forEach(clearTimeout); seq=[];
    document.querySelectorAll('.tile[data-lv]').forEach(t=>setLv(t,0));
    if(instant){ root.classList.remove('float-on','float-in','float-out'); busy=false; return; }
    busy=true;
    root.classList.remove('float-on','float-in'); root.classList.add('float-out');   // ảnh chìm xuống, chữ tiến lên, cùng lúc (ngược lúc vào)
    later(()=>root.classList.remove('float-out'),LYR_MS+40);
    later(()=>{ busy=false; },LYR_MS);
  }
  addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse') return; lx=e.clientX; ly=e.clientY;
    if(holdT && Math.hypot(lx-hx,ly-hy)>MOVE_TOL){ clearTimeout(holdT); holdT=0; }
    if(mode && !raf) raf=requestAnimationFrame(()=>{ raf=0; if(mode) hover(tileAt(lx,ly)); });
  },{passive:true});
  addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0) return;
    if(armed){ swallow=false; return; }
    if(root.classList.contains('mobile')||busy||(e.target.closest&&e.target.closest('.item,.title-link'))) return;      // không kích hoạt trên chữ
    const t=tileAt(e.clientX,e.clientY); if(!t) return;                              // chỉ khi nhấn trúng ảnh
    hx=lx=e.clientX; hy=ly=e.clientY; clearTimeout(holdT);
    holdT=setTimeout(()=>{ holdT=0; const tt=tileAt(lx,ly); const x=document.elementFromPoint(lx,ly);
      if(tt && !(x&&x.closest&&x.closest('.item,.title-link'))) start(tt); },HOLD_MS);
  });
  ['pointerup','pointercancel'].forEach(ev=>addEventListener(ev,()=>{ clearTimeout(holdT); holdT=0; }));
  addEventListener('dragstart',e=>e.preventDefault());
  /* Lần thả chuột ngay sau khi bật và lần nhấn đầu tiên trong chế độ nổi chỉ để bỏ qua/thoát, không kích hoạt link */
  addEventListener('click',e=>{
    if(swallow){ swallow=false; e.preventDefault(); e.stopImmediatePropagation(); return; }
    if(armed){ e.preventDefault(); e.stopImmediatePropagation(); stop(); }
  },true);
  addEventListener('pageshow',()=>{ stop(true); swallow=false; });
  addEventListener('resize',()=>{ if(armed&&root.classList.contains('mobile')) stop(true); });
})();

/* ===== Chữ trắng "ĐỘI RADAR VINH" (bản điện thoại) khi vào / ra chế độ nổi ảnh =====
   mobTitleOut: về độ mờ 80% rồi lướt từ từ lên phía trên (đảo ngược lúc chữ trượt xuống ở cuối chuỗi mở đầu), cuối cùng mờ hẳn.
   mobTitleIn : khi thoát chế độ nổi ảnh, chữ trượt xuống lại + sáng lên như cuối chuỗi mở đầu. */
function mobTitleCancel(){
  const t=document.querySelector('#cards .mtitle'); if(!t) return;
  mobTitleIn.tok=(mobTitleIn.tok||0)+1;
  [...(mobTitleOut.run||[]),...(mobTitleIn.run||[])].forEach(a=>{ try{a.cancel();}catch(e){} }); mobTitleOut.run=[]; mobTitleIn.run=[];
  t.style.visibility=''; t.style.willChange='';
}
async function mobTitleOut(){
  const t=document.querySelector('#cards .mtitle'); if(!t) return;
  const D=1500, drop=560, sine='cubic-bezier(.37,0,.63,1)';
  t.style.willChange='transform,opacity';
  const a=t.animate([{transform:'translateY(0px)'},{transform:`translateY(${-drop}px)`}],{duration:D,easing:sine,fill:'forwards'});
  const b=t.animate([{offset:0,opacity:1},{offset:.3,opacity:.8},{offset:.78,opacity:.8},{offset:1,opacity:0}],{duration:D,easing:'linear',fill:'forwards'});
  mobTitleOut.run=[a,b];
  try{ await Promise.all([a.finished,b.finished]); }catch(e){ return; }
  t.style.visibility='hidden'; a.cancel(); b.cancel(); t.style.willChange=''; mobTitleOut.run=[];
}
async function mobTitleIn(){
  const t=document.querySelector('#cards .mtitle'); if(!t) return;
  const C={slide:1400,glow:850,drop:560,ease:'cubic-bezier(.4,0,.1,1)',sine:'cubic-bezier(.37,0,.63,1)'};
  const tok=mobTitleIn.tok=(mobTitleIn.tok||0)+1, ok=()=>tok===mobTitleIn.tok;
  (mobTitleOut.run||[]).forEach(a=>{ try{a.cancel();}catch(e){} }); mobTitleOut.run=[];
  t.style.visibility=''; t.style.willChange='transform,opacity';
  const t0=t.animate([{opacity:0},{opacity:.8}],{duration:450,easing:C.sine,fill:'forwards'});
  const t1=t.animate([{transform:`translateY(${-C.drop}px)`},{transform:'translateY(0px)'}],{duration:C.slide,easing:C.ease,fill:'forwards'});
  mobTitleIn.run=[t0,t1];
  try{ await t1.finished; }catch(e){ return; } if(!ok()) return;
  const sp=t.querySelector('span'), g=1.58, glow=`0 0 ${8*g}px rgba(255,255,255,.9),0 0 ${22*g}px rgba(255,255,255,.55)`, none='0 0 0 rgba(255,255,255,0),0 0 0 rgba(255,255,255,0)';
  const t2=t.animate([{opacity:.8},{opacity:1}],{duration:C.glow,easing:C.sine});
  const t3=sp.animate([{offset:0,filter:'brightness(1)',textShadow:none,easing:C.sine},{offset:.4,filter:'brightness(1.15)',textShadow:glow,easing:C.sine},{offset:1,filter:'brightness(1)',textShadow:none}],{duration:C.glow});
  mobTitleIn.run=[t0,t1,t2,t3];
  try{ await Promise.all([t2.finished,t3.finished]); }catch(e){ return; } if(!ok()) return;
  [t0,t1,t2,t3].forEach(x=>x.cancel()); t.style.willChange=''; mobTitleIn.run=[];
}

/* ===== Chế độ nổi ảnh — BẢN ĐIỆN THOẠI =====
   Bật : nhấn giữ ~3 giây ở BẤT KỲ vị trí nào (kể cả trên ô/chữ), không di chuyển quá ~24px, sau khi chuỗi mở đầu đã xong.
         Lớp ảnh tiến lên trước, lớp chữ + ô lùi ra sau và tan dần; hai lớp đi xuyên qua nhau (cùng thông số như bản ngang).
   Chạy: chạm/rê lên ảnh nào thì ảnh đó nổi lên (các ảnh khác tối đi), ảnh trước đó hạ xuống.
   Tắt : chạm 1 lần ở bất kỳ đâu (chỉ để thoát, không mở link) -> chuyển cảnh NGƯỢC; hoặc tải lại trang. */
(function(){
  const HOLD_MS=3000, MOVE_TOL=24, FALL_HOLD=1500, LYR_MS=1800;
  const root=document.documentElement, cardsEl=document.getElementById('cards');
  let armed=false, mode=false, busy=false, holdT=0, hx=0, hy=0, lx=0, ly=0, raf=0, cur=null, swallow=false, seq=[];
  const timers=new WeakMap(), later=(f,ms)=>{ const id=setTimeout(f,ms); seq.push(id); return id; };
  const isMob=()=>root.classList.contains('mobile');
  const frameAt=(x,y)=>{ for(const e of document.elementsFromPoint(x,y)){ const t=e.closest&&e.closest('#cards .mf'); if(t) return t; } return null; };
  function setLv(t,lv){
    const old=timers.get(t); if(old) clearTimeout(old);
    if(lv){ t.dataset.lv=lv; t.classList.add('up','top'); timers.set(t,0); }
    else { delete t.dataset.lv; t.classList.remove('top'); timers.set(t,setTimeout(()=>t.classList.remove('up'),FALL_HOLD)); }
  }
  function hover(t){ if(t===cur) return; const prev=cur; cur=t; root.classList.toggle('float-hov',!!t); if(prev) setLv(prev,0); if(t) setLv(t,2); }
  const TITLE_LEAD=1200;                                    // chữ lướt lên gần xong (bắt đầu mờ hẳn) thì lớp ảnh mới bắt đầu tiến lên
  function start(){
    if(armed||busy||!isMob()) return; armed=true; busy=true; swallow=true;
    mobTitleOut();                                          // 1) chữ ĐỘI RADAR VINH về mờ 80% rồi lướt từ từ lên phía trên
    later(swap,TITLE_LEAD);
  }
  function swap(){                                          // 2) lớp ảnh ra trước, lớp ô lùi ra sau và đi xuyên qua nhau
    root.classList.add('float-3d'); void cardsEl.offsetWidth; getComputedStyle(cardsEl.querySelector('.mlayer')).translate;   // chốt trạng thái nghỉ 3D (tương đương 2D) rồi mới chuyển
    root.classList.remove('float-out'); root.classList.add('float-on','float-in');
    later(()=>root.classList.remove('float-in'),LYR_MS+40);
    later(()=>{ busy=false; mode=true; },LYR_MS);           // xong: bật tương tác ảnh
  }
  function stop(instant){
    if(!armed) return;
    const swapped=root.classList.contains('float-3d');
    armed=false; mode=false; cur=null; root.classList.remove('float-hov'); seq.forEach(clearTimeout); seq=[];
    cardsEl.querySelectorAll('.mf[data-lv]').forEach(t=>setLv(t,0));
    if(instant){ root.classList.remove('float-on','float-in','float-out','float-3d'); mobTitleCancel(); busy=false; return; }
    busy=true;
    if(!swapped){ mobTitleCancel(); mobTitleIn().then(()=>{ busy=false; }); return; }   // chưa kịp đảo lớp: chỉ đưa chữ về
    root.classList.remove('float-on','float-in'); root.classList.add('float-out');   // ảnh chìm xuống, ô tiến lên, cùng lúc (ngược lúc vào)
    later(()=>{ root.classList.remove('float-out','float-3d'); mobTitleIn().then(()=>{ busy=false; }); },LYR_MS+40);   // xong thì chữ trắng trượt xuống + sáng lên lại
  }
  addEventListener('pointermove',e=>{
    if(!isMob()) return; lx=e.clientX; ly=e.clientY;
    if(holdT && Math.hypot(lx-hx,ly-hy)>MOVE_TOL){ clearTimeout(holdT); holdT=0; }
    if(mode && !raf) raf=requestAnimationFrame(()=>{ raf=0; if(mode) hover(frameAt(lx,ly)); });
  },{passive:true});
  addEventListener('pointerdown',e=>{
    if(!isMob()||(e.pointerType==='mouse'&&e.button!==0)) return;
    if(armed){ swallow=false; if(mode){ lx=e.clientX; ly=e.clientY; hover(frameAt(lx,ly)); } return; }
    if(busy||playMobileIntro.active) return;                                          // chưa xong chuỗi mở đầu / đang chuyển cảnh
    hx=lx=e.clientX; hy=ly=e.clientY; clearTimeout(holdT);
    holdT=setTimeout(()=>{ holdT=0; start(); },HOLD_MS);
  });
  ['pointerup','pointercancel'].forEach(ev=>addEventListener(ev,e=>{ clearTimeout(holdT); holdT=0; if(mode&&e.pointerType!=='mouse') hover(null); }));
  addEventListener('contextmenu',e=>{ if(isMob()&&e.target.closest&&e.target.closest('#cards')) e.preventDefault(); });   // chặn menu khi nhấn giữ
  /* Lần thả/nhấn ngay sau khi bật chỉ để bỏ qua; lần chạm đầu tiên trong chế độ nổi chỉ để thoát, không kích hoạt link */
  addEventListener('click',e=>{
    if(!isMob()) return;
    if(swallow){ swallow=false; e.preventDefault(); e.stopImmediatePropagation(); return; }
    if(armed){ e.preventDefault(); e.stopImmediatePropagation(); stop(); }
  },true);
  addEventListener('pageshow',()=>{ stop(true); swallow=false; });
  addEventListener('resize',()=>{ if(armed&&!isMob()) stop(true); });
})();
