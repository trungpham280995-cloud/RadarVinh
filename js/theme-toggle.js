/* NÚT GẠT GIAO DIỆN SÁNG / TỐI của website (Cloud Shift). Chỉ điều khiển giao diện website; KHÔNG liên quan tới ngày/đêm của bảng thời tiết.
   Vị trí: Laptop = góc trên phải, mép trên thẳng với viên thuốc; Mobile dọc = bản dọc ở góc trên phải, mép phải thẳng với viên thuốc. */
(function(){
  'use strict';
  var root=document.documentElement,host=document.getElementById('rv-weather');
  if(!host||window.RVThemeToggle)return;
  var el=document.createElement('label');el.className='rvt';el.id='rv-theme-toggle';el.title='Ngày / Đêm';
  el.innerHTML='<input class="rvt__input" type="checkbox" role="switch" aria-label="Chế độ ban đêm"><span class="rvt__sky" aria-hidden="true"><span class="rvt__halo"></span><span class="rvt__stars"></span><span class="rvt__clouds"></span><span class="rvt__knob"></span></span>';
  document.body.appendChild(el);
  var inp=el.firstChild;
  /* không để thao tác trên nút kích hoạt các thao tác nhấn/giữ của trang */
  ['pointerdown','touchstart','mousedown'].forEach(function(t){el.addEventListener(t,function(e){e.stopPropagation();},{passive:true});});

  /* ---------- Giao diện SÁNG / TỐI của WEBSITE ----------
     Nút chỉ có một chức năng: đổi giao diện website (html[data-theme]) và ghi nhớ bằng localStorage.
     Không theo giờ, thời tiết hay cài đặt hệ thống; chỉ đổi khi người dùng gạt. Hoàn toàn độc lập với ngày/đêm của bảng thời tiết. */
  var KEY='rvSiteTheme',animT=0,meta=document.querySelector('meta[name="theme-color"]'),lightMeta=meta&&meta.getAttribute('content');
  function stored(){try{return localStorage.getItem(KEY)==='dark'?'dark':'light';}catch(e){return 'light';}}
  /* data-rvwx = giao diện mà BẢNG THỜI TIẾT (iframe) đang hiển thị. Bình thường luôn bằng data-theme; chỉ lệch trong lúc chạy hiệu ứng Nightfall
     (bảng đổi đúng lúc "màn đêm" lan tới vị trí của nó). */
  function setWx(t){root.setAttribute('data-rvwx',t);}
  function apply(t,animate){
    if(animate){root.classList.add('rvt-anim');clearTimeout(animT);animT=setTimeout(function(){root.classList.remove('rvt-anim');},1000);}
    root.setAttribute('data-theme',t);setWx(t);
    inp.checked=(t==='dark');inp.setAttribute('aria-checked',inp.checked?'true':'false');
    if(meta)meta.setAttribute('content',t==='dark'?'#0b1530':lightMeta);
  }

  /* ---------- NIGHTFALL: màn đêm buông dần (sáng -> tối: từ góc TRÊN PHẢI) / ánh sáng trở lại (tối -> sáng: từ góc DƯỚI TRÁI) ----------
     Không có tấm phủ nào đè lên trang. Một "mặt sóng" hình tròn (bán kính --nf-r) lan từ góc xuất phát; phía sau mặt sóng, MỖI lớp tự đổi màu đúng tại chỗ:
       - nền trang + các đường trắng giữa ảnh, ba thanh ngang: dải chuyển màu mềm theo mặt sóng (CSS, theo --nf-r);
       - lớp phủ tối trên ảnh (.lyr-img / .mlayer): mặt nạ tròn mềm => ảnh tối dần/sáng dần theo mặt sóng, ảnh vẫn nằm dưới chữ/dải/icon;
       - thẻ chữ mobile và bảng thời tiết: đổi ngay khi mặt sóng đi qua vị trí của chúng.
     data-theme chỉ chốt ở cuối (sáng->tối) hoặc ở đầu (tối->sáng) để các quy tắc Dark Mode không bật đồng loạt. Quy tắc CSS: cuối theme-toggle.css. */
  var NF={run:null};
  var NF_NIGHT='#0b1530',NF_DAY='#ffffff';                                   // = --rvd-bg (site-dark.css) và nền trắng gốc (main.css)
  var NF_TXT_DAY='#fff',NF_TXT_NIGHT='#fff8e1',NF_TITLE_NIGHT='#fff3c4';        // = màu chữ nút/tiêu đề: sáng (main.css) và tối (site-dark.css)
  var NF_CARD_NIGHT='rgba(30,43,80,.88)',NF_CARD_DAY='rgba(73,101,146,.78)';      // nền thẻ mobile: site-dark.css (--rvd-card) và weather-board.css
  var NF_MT_NIGHT='rgba(255,248,225,.7)',NF_MT_DAY='rgba(255,255,255,.7)',NF_MTX_NIGHT='rgb(31,45,84)',NF_MTX_DAY='rgb(73,101,146)';   // ô "Radar Vinh" mobile: nền + chữ
  var NF_BAND_NIGHT='rgba(15,28,60,.72)',NF_BAND_DAY='rgba(73,101,146,.6)';  // = --rvd-band x --band-opacity (site-dark.css) và --band x --band-opacity (main.css)
  function nfShown(e){return e&&e.getClientRects().length>0&&getComputedStyle(e).display!=='none';}
  function nfFrame(e,full){var r=e.getBoundingClientRect(),w=e.offsetWidth||r.width||1;return {el:e,l:full?0:r.left,t:full?0:r.top,w:r.width,h:r.height,rl:r.left,rt:r.top,sc:full?1:(r.width/w||1)};}
  function nfEnd(r){
    if(!r||r.done)return;r.done=true;cancelAnimationFrame(r.raf);
    r.regs.forEach(function(f){var e=f.el;['--nf-r','--nf-cx','--nf-cy','--nf-sc','--nf-soft'].forEach(function(k){e.style.removeProperty(k);});e.classList.remove('nf-bg','nf-ov','nf-band','nf-tx','nf-tt','nf-card','nf-mtc');e.style.removeProperty('--nf-p');});
    (r.wx||[]).forEach(function(f){try{f.contentWindow.__rvWipeEnd(r.to);}catch(e){}});   // bảng thời tiết: bỏ bản sao, chốt giao diện
    r.cards.forEach(function(c){c.classList.remove('nf-d');});
    ['--nf-in','--nf-out','--nf-mi','--nf-mo','--nf-bin','--nf-bout','--nf-ti','--nf-to','--nf-tti','--nf-tto','--nf-cin','--nf-cout','--nf-mbin','--nf-mbout','--nf-mtin','--nf-mtout'].forEach(function(k){root.style.removeProperty(k);});
    root.classList.remove('nf-run');
    root.setAttribute('data-theme',r.to);setWx(r.to);                       // chốt giao diện (KHÔNG chạm vào trạng thái ô gạt: người dùng có thể đã gạt tiếp)
    if(meta)meta.setAttribute('content',r.to==='dark'?'#0b1530':lightMeta);
    NF.run=null;
  }
  function nightfall(to){
    nfEnd(NF.run);   // gạt lại giữa chừng: chốt ngay trạng thái của lần trước rồi chạy lần mới
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dark=(to==='dark');
    if(reduce||!root.animate&&!window.requestAnimationFrame){apply(to,false);return;}
    var W=innerWidth,H=innerHeight,ox=dark?W:0,oy=dark?0:H;                    // góc xuất phát
    var diag=Math.hypot(W,H),soft=Math.round(diag*.22),total=diag+soft;
    var dur=dark?2600:2200;
    var regs=[],cards=[],events=[];
    function reg(e,cls,full,rot90){if(!nfShown(e)&&!full)return;e.classList.add(cls);var f=nfFrame(e,full);   // thêm class trước khi đo: .nf-tx/.nf-tt nới hộp vẽ (padding) nên phải đo sau
      f.cx=(ox-f.l)/f.sc;f.cy=(oy-f.t)/f.sc;
      if(rot90){var ew=e.offsetWidth,eh=e.offsetHeight,sc=f.h/(ew||1)||1,mx=f.rl+f.w/2,my=f.rt+f.h/2;   // phần tử đang xoay 90 độ: đổi điểm xuất phát về toạ độ cục bộ (chưa xoay)
        f.sc=sc;f.cx=ew/2+(oy-my)/sc;f.cy=eh/2-(ox-mx)/sc;}
      e.style.setProperty('--nf-cx',f.cx.toFixed(1));e.style.setProperty('--nf-cy',f.cy.toFixed(1));e.style.setProperty('--nf-sc',f.sc.toFixed(4));e.style.setProperty('--nf-soft',soft);e.style.setProperty('--nf-r',0);
      regs.push(f);return f;}
    var R={regs:regs,cards:cards,to:to,done:false,raf:0};NF.run=R;
    root.style.setProperty('--nf-in',dark?NF_NIGHT:NF_DAY);root.style.setProperty('--nf-out',dark?NF_DAY:NF_NIGHT);
    root.style.setProperty('--nf-mi',dark?'#000':'transparent');root.style.setProperty('--nf-mo',dark?'transparent':'#000');
    root.style.setProperty('--nf-bin',dark?NF_BAND_NIGHT:NF_BAND_DAY);root.style.setProperty('--nf-bout',dark?NF_BAND_DAY:NF_BAND_NIGHT);
    root.style.setProperty('--nf-cin',dark?NF_CARD_NIGHT:NF_CARD_DAY);root.style.setProperty('--nf-cout',dark?NF_CARD_DAY:NF_CARD_NIGHT);              // thẻ mobile
    root.style.setProperty('--nf-mbin',dark?NF_MT_NIGHT:NF_MT_DAY);root.style.setProperty('--nf-mbout',dark?NF_MT_DAY:NF_MT_NIGHT);                    // nền ô "Radar Vinh" (mobile)
    root.style.setProperty('--nf-mtin',dark?NF_MTX_NIGHT:NF_MTX_DAY);root.style.setProperty('--nf-mtout',dark?NF_MTX_DAY:NF_MTX_NIGHT);                // chữ ô "Radar Vinh" (mobile)
    root.style.setProperty('--nf-ti',dark?NF_TXT_NIGHT:NF_TXT_DAY);root.style.setProperty('--nf-to',dark?NF_TXT_DAY:NF_TXT_NIGHT);          // chữ các nút
    root.style.setProperty('--nf-tti',dark?NF_TITLE_NIGHT:NF_TXT_DAY);root.style.setProperty('--nf-tto',dark?NF_TXT_DAY:NF_TITLE_NIGHT);   // chữ tiêu đề
    reg(root,'nf-bg',true);reg(document.body,'nf-bg',true);
    ['home','cards'].forEach(function(id){var e=document.getElementById(id);if(e)reg(e,'nf-bg');});
    [].forEach.call(document.querySelectorAll('.stage'),function(e){reg(e,'nf-bg');});
    [].forEach.call(document.querySelectorAll('.lyr-img,.mlayer'),function(e){reg(e,'nf-ov');});
    [].forEach.call(document.querySelectorAll('.band'),function(e){reg(e,'nf-band');});
    [].forEach.call(document.querySelectorAll('.item .txt'),function(e){reg(e,'nf-tx');});      // chữ 15 nút (laptop): đổi màu NGAY TẠI CHỖ theo mặt sóng, từng chữ một
    [].forEach.call(document.querySelectorAll('.title .txt'),function(e){reg(e,'nf-tt');});     // tiêu đề (laptop)
    var mta=document.querySelector('.mpage .mtitle a');if(mta&&nfShown(mta))reg(mta,'nf-tt',false,true);   // tiêu đề (mobile, xoay 90 độ)
    function dist(x,y){return Math.hypot(x-ox,y-oy);}
    var mts=[];
    [].forEach.call(document.querySelectorAll('.mpage .m'),function(e){            // thẻ mobile: nền đổi NGAY TRONG LÒNG thẻ theo mặt sóng (cùng dải chuyển màu với ảnh/thanh/chữ)
      if(!nfShown(e))return;
      if(e.classList.contains('mt-cell')){var f=reg(e,'nf-mtc');if(f){var b=e.getBoundingClientRect();f.d=dist(b.left+b.width/2,b.top+b.height/2);mts.push(f);}}   // ô "Radar Vinh": thêm màu chữ theo tiến trình
      else reg(e,'nf-card');
    });
    // bảng thời tiết + viên thuốc (iframe): quét theo ĐÚNG mặt sóng của trang (xem __rvWipe trong weather-board.js), không còn đổi một lần như trước
    R.wx=[];[].forEach.call(host.querySelectorAll('iframe'),function(f){try{if(f.contentWindow&&f.contentWindow.__rvWipeStart&&f.contentWindow.__rvWipeStart(to,ox,oy,soft))R.wx.push(f);}catch(e){}});
    // trạng thái ban đầu
    if(dark){}                                                                       // sáng -> tối: data-theme còn 'light' cho tới cuối
    else{root.setAttribute('data-theme','light');if(meta)meta.setAttribute('content',lightMeta);}   // tối -> sáng: data-theme về 'light' ngay; phần chưa được ánh sáng chạm tới giữ vẻ tối nhờ lớp .nf-run
    root.classList.add('nf-run');
    var t0=performance.now();
    function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
    function frame(){
      if(R.done)return;
      var now=performance.now(),p=Math.min(1,(now-t0)/dur),r=ease(p)*total;
      regs.forEach(function(f){f.el.style.setProperty('--nf-r',r.toFixed(1));});
      mts.forEach(function(f){f.el.style.setProperty('--nf-p',Math.max(0,Math.min(1,(r-f.d)/soft)).toFixed(3));});   // cùng công thức với dải chuyển màu của mặt sóng
      R.wx.forEach(function(f){try{f.contentWindow.__rvWipe(r);}catch(e){}});
      if(p<1)R.raf=requestAnimationFrame(frame);else nfEnd(R);
    }
    R.raf=requestAnimationFrame(frame);
  }
  inp.addEventListener('change',function(){var t=inp.checked?'dark':'light';try{localStorage.setItem(KEY,t);}catch(e){}nightfall(t);});
  addEventListener('storage',function(e){if(e.key!==KEY)return;var t=stored(),cur=NF.run?NF.run.to:root.getAttribute('data-theme');if(t===cur)return;nfEnd(NF.run);apply(t,true);});   // đổi ở tab khác -> tab này theo
  apply(stored(),false);

  /* ---------- Vị trí ---------- */
  var probe=document.createElement('div');probe.style.cssText='position:fixed;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px)';document.body.appendChild(probe);
  var raf=0,lastKey='',t0=Date.now();
  function box(k){return host.querySelector('[data-box="'+k+'"]');}
  function place(){raf=0;
    if(root.classList.contains('float-on')||root.classList.contains('float-out'))return;   // đang chạy hiệu ứng nổi ảnh: KHÔNG đo lại vị trí (viên thuốc đang bị thu phóng sẽ làm nút trôi/nhảy)
    var ready=host.classList.contains('rv-weather-ready')||Date.now()-t0>8000;if(!ready){el.classList.remove('rvt-on');return;}   // chưa hiện widget: chưa cần đo bố cục (tránh ép dựng layout lúc hiệu ứng mở đầu)
    var mob=root.classList.contains('mobile'),sx=window.pageXOffset||0,sy=window.pageYOffset||0,vw=root.clientWidth;
    var x,y,r;
    if(mob){
      r=(box('m')||{getBoundingClientRect:function(){return {width:0};}}).getBoundingClientRect();
      var right=r.width>0?r.right:vw-10;
      var dark=(NF.run?NF.run.to:root.getAttribute('data-theme'))==='dark';  // căn lề phải theo bảng đang mở: CHỈ ở Dark Mode và CHỈ trên điện thoại (<=480px); khi thu gọn, máy tính bảng, laptop và Light Mode: vị trí gốc, không đổi
      if(dark&&vw<=480&&host.classList.contains('rv-weather-open')){
        var gl=box('m')&&box('m').querySelector('.rv-neon-glass'),gr=gl&&gl.getBoundingClientRect();   // mép phải thật của bảng (lớp kính), không phải mép khung chứa
        if(gr&&gr.width>0)right=gr.right;
      }
      var w=parseFloat(getComputedStyle(el).width)||el.offsetWidth||0,st=parseFloat(getComputedStyle(probe).paddingTop)||0;
      x=right-w+sx;y=st+6+sy;
    }else{
      var pill=host.querySelector('.rv-weather-pill.rv-weather-d'),pr=pill&&pill.getBoundingClientRect();
      r=(pr&&pr.width>0)?pr:(box('d')||{getBoundingClientRect:function(){return {top:12};}}).getBoundingClientRect();
      var w2=parseFloat(getComputedStyle(el).width)||el.offsetWidth||0;
      x=vw-vw*.0155-w2+sx;y=r.top+sy;                                      // mép trên thẳng với viên thuốc Laptop
    }
    var key=(mob?'m':'d')+Math.round(x*10)+','+Math.round(y*10);
    el.classList.toggle('rvt--v',mob);
    if(key!==lastKey){lastKey=key;el.style.left=x+'px';el.style.top=y+'px';}
    el.classList.add('rvt-on');
  }
  function sched(){if(!raf)raf=requestAnimationFrame(place);}
  addEventListener('resize',sched);addEventListener('orientationchange',sched);addEventListener('scroll',sched,{passive:true});
  if(window.ResizeObserver)new ResizeObserver(sched).observe(root);
  /* widget đổi vị trí/trạng thái (hiện, mở, thu gọn, xoay...) -> tính lại */
  if(window.MutationObserver){
    var mo=new MutationObserver(sched);mo.observe(host,{attributes:true,attributeFilter:['class']});
    [box('d'),box('m')].forEach(function(b){if(b)mo.observe(b,{attributes:true,attributeFilter:['style']});});
    mo.observe(root,{attributes:true,attributeFilter:['class','data-theme']});
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sched);
  sched();setTimeout(sched,600);setTimeout(sched,2500);setTimeout(sched,8100);
  window.RVThemeToggle={place:sched,el:el};
})();
