/* NÚT GẠT GIAO DIỆN SÁNG / TỐI của website (thiết kế mới + hiệu ứng chuyển cảnh tỏa ra/thu về, lấy từ file nut-gat-sang-toi.html). Chỉ điều khiển giao diện website; KHÔNG liên quan tới ngày/đêm của bảng thời tiết.
   Vị trí: Laptop = góc trên phải, mép trên thẳng với viên thuốc; Mobile = góc trên phải, mép phải thẳng với bảng/viên thuốc thời tiết. */
(function(){
  'use strict';
  var root=document.documentElement,host=document.getElementById('rv-weather');
  if(!host||window.RVThemeToggle)return;
  var el=document.createElement('label');el.className='tg-switch tg-switch--site tg-switch--init';el.id='rv-theme-toggle';el.title='Ngày / Đêm';
  el.innerHTML='<input class="tg-switch__input" type="checkbox" role="switch" aria-label="Chuyển giao diện sáng/tối"><span class="tg-switch__sky" aria-hidden="true"><span class="tg-switch__halo"></span><span class="tg-switch__stars"></span><span class="tg-switch__clouds"></span><span class="tg-switch__knob"></span></span>';
  document.body.appendChild(el);
  var inp=el.firstChild;
  /* không để thao tác trên nút kích hoạt các thao tác nhấn/giữ của trang */
  ['pointerdown','touchstart','mousedown'].forEach(function(t){el.addEventListener(t,function(e){e.stopPropagation();},{passive:true});});

  /* ---------- Giao diện SÁNG / TỐI của WEBSITE ----------
     Nút chỉ có một chức năng: đổi giao diện website (html[data-theme]) và ghi nhớ bằng localStorage (khóa rvSiteTheme, như trước).
     Không theo giờ, thời tiết hay cài đặt hệ thống; chỉ đổi khi người dùng gạt. Hoàn toàn độc lập với ngày/đêm của bảng thời tiết. */
  var KEY='rvSiteTheme',meta=document.querySelector('meta[name="theme-color"]'),lightMeta=meta&&meta.getAttribute('content');
  function stored(){try{return localStorage.getItem(KEY)==='dark'?'dark':'light';}catch(e){return 'light';}}
  function apply(t){root.setAttribute('data-theme',t);if(meta)meta.setAttribute('content',t==='dark'?'#0b1530':lightMeta);}
  function sync(t){inp.checked=(t==='dark');inp.setAttribute('aria-checked',inp.checked?'true':'false');}
  function go(t){apply(t);sync(t);}

  /* ---------- NIGHTFALL: màn đêm buông dần (sáng -> tối: từ góc TRÊN PHẢI) / ánh sáng trở lại (tối -> sáng: từ góc DƯỚI TRÁI) ----------
     (Hiệu ứng lấy từ bản tham chiếu radar-vinh-website (27).zip: cơ chế, hướng lan, tốc độ, thời gian; chỉ phần chuyển cảnh, không lấy nút gạt/màu/bố cục.)
     Không có tấm phủ nào đè lên trang. Một "mặt sóng" hình tròn (bán kính --nf-r) lan từ góc xuất phát; phía sau mặt sóng, MỖI lớp tự đổi màu đúng tại chỗ:
       - nền trang + các đường trắng giữa ảnh, ba thanh ngang: dải chuyển màu mềm theo mặt sóng (CSS, theo --nf-r);
       - lớp phủ tối trên ảnh (.lyr-img / .mlayer): mặt nạ tròn mềm => ảnh tối dần/sáng dần theo mặt sóng, ảnh vẫn nằm dưới chữ/dải/icon;
       - thẻ chữ mobile và bảng thời tiết: đổi ngay khi mặt sóng đi qua vị trí của chúng.
     data-theme chỉ chốt Ở CUỐI hiệu ứng (cả hai chiều): giao diện cũ giữ nguyên cho tới khi mặt sóng đi hết, rồi mới chuyển hẳn sang giao diện mới (không đổi nền sớm, không nháy).
     Quy tắc CSS: cuối css/theme-toggle.css. */
  var NF={run:null};
  var NF_NIGHT='#0b1530',NF_DAY='#ffffff';                                   // = --rvd-bg (site-dark.css) và nền trắng gốc (main.css)
  var NF_TXT_DAY='#fff',NF_TXT_NIGHT='#fff8e1',NF_TITLE_NIGHT='#fff3c4';        // = màu chữ nút/tiêu đề: sáng (main.css) và tối (site-dark.css)
  var NF_CARD_NIGHT='rgba(30,43,80,.88)',NF_CARD_DAY='rgba(73,101,146,.78)';      // nền thẻ mobile: site-dark.css (--rvd-card) và weather-board.css
  var NF_MT_NIGHT='rgba(255,248,225,.7)',NF_MT_DAY='rgba(255,255,255,.7)',NF_MTX_NIGHT='rgb(31,45,84)',NF_MTX_DAY='rgb(73,101,146)';   // ô "Radar Vinh" mobile: nền + chữ
  var NF_BAND_NIGHT='rgba(15,28,60,.72)',NF_BAND_DAY='rgba(73,101,146,.6)';  // = --rvd-band x --band-opacity (site-dark.css) và --band x --band-opacity (main.css)
  function reduced(){return window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;}
  function nfShown(e){return e&&e.getClientRects().length>0&&getComputedStyle(e).display!=='none';}
  function nfFrame(e,full){var r=e.getBoundingClientRect(),w=e.offsetWidth||r.width||1;return {el:e,l:full?0:r.left,t:full?0:r.top,w:r.width,h:r.height,rl:r.left,rt:r.top,sc:full?1:(r.width/w||1)};}
  function nfEnd(r){
    if(!r||r.done)return;r.done=true;cancelAnimationFrame(r.raf);
    r.regs.forEach(function(f){var e=f.el;['--nf-r','--nf-cx','--nf-cy','--nf-sc','--nf-soft'].forEach(function(k){e.style.removeProperty(k);});e.classList.remove('nf-bg','nf-ov','nf-band','nf-tx','nf-tt','nf-card','nf-mtc');e.style.removeProperty('--nf-p');});
    (r.wx||[]).forEach(function(f){try{f.contentWindow.__rvWipeEnd(r.to);}catch(e){}});   // bảng thời tiết: bỏ bản sao, chốt giao diện
    ['--nf-in','--nf-out','--nf-mi','--nf-mo','--nf-bin','--nf-bout','--nf-ti','--nf-to','--nf-tti','--nf-tto','--nf-cin','--nf-cout','--nf-mbin','--nf-mbout','--nf-mtin','--nf-mtout'].forEach(function(k){root.style.removeProperty(k);});
    root.classList.remove('nf-run');
    apply(r.to);                       // chốt giao diện MỚI (KHÔNG chạm vào trạng thái ô gạt: người dùng có thể đã gạt tiếp)
    NF.run=null;
  }
  function nightfall(to){
    nfEnd(NF.run);   // gạt lại giữa chừng: chốt ngay trạng thái của lần trước rồi chạy lần mới
    var dark=(to==='dark');
    if(reduced()||(!root.animate&&!window.requestAnimationFrame)){apply(to);return;}
    var W=innerWidth,H=innerHeight,ox=dark?W:0,oy=dark?0:H;                    // góc xuất phát
    var diag=Math.hypot(W,H),soft=Math.round(diag*.22),total=diag+soft;
    var dur=dark?2600:2200;
    var regs=[],pend=[],mts=[];
    /* Gom ĐỌC / GHI thành từng pha để chỉ tính layout 1-2 lần (trước đây mỗi phần tử ghi class rồi đọc kích thước ngay -> ~45 lần tính layout cưỡng bức, làm mặt sóng chỉ bắt đầu chạy sau ~300ms) */
    function want(e,cls,full,rot90){if(full||nfShown(e))pend.push({e:e,cls:cls,full:full,rot90:rot90});}     // pha 1 (chỉ ĐỌC): lọc phần tử đang hiện
    var R={regs:regs,to:to,done:false,raf:0};NF.run=R;
    want(root,'nf-bg',true);
    ['cards'].forEach(function(id){var e=document.getElementById(id);if(e)want(e,'nf-bg');});
    [].forEach.call(document.querySelectorAll('.stage'),function(e){want(e,'nf-bg');});
    [].forEach.call(document.querySelectorAll('.lyr-img,.mlayer'),function(e){want(e,'nf-ov');});
    [].forEach.call(document.querySelectorAll('.band'),function(e){want(e,'nf-band');});
    [].forEach.call(document.querySelectorAll('.item .txt'),function(e){want(e,'nf-tx');});      // chữ 15 nút (laptop): đổi màu NGAY TẠI CHỖ theo mặt sóng, từng chữ một
    [].forEach.call(document.querySelectorAll('.title .txt'),function(e){want(e,'nf-tt');});     // tiêu đề (laptop)
    var mta=document.querySelector('.mpage .mtitle a');if(mta&&nfShown(mta))want(mta,'nf-tt',false,true);   // tiêu đề (mobile, xoay 90 độ)
    [].forEach.call(document.querySelectorAll('.mpage .m'),function(e){            // thẻ mobile: nền đổi NGAY TRONG LÒNG thẻ theo mặt sóng
      if(!nfShown(e))return;
      want(e,e.classList.contains('mt-cell')?'nf-mtc':'nf-card');
    });
    root.style.setProperty('--nf-in',dark?NF_NIGHT:NF_DAY);root.style.setProperty('--nf-out',dark?NF_DAY:NF_NIGHT);
    root.style.setProperty('--nf-mi',dark?'#000':'transparent');root.style.setProperty('--nf-mo',dark?'transparent':'#000');
    root.style.setProperty('--nf-bin',dark?NF_BAND_NIGHT:NF_BAND_DAY);root.style.setProperty('--nf-bout',dark?NF_BAND_DAY:NF_BAND_NIGHT);
    root.style.setProperty('--nf-cin',dark?NF_CARD_NIGHT:NF_CARD_DAY);root.style.setProperty('--nf-cout',dark?NF_CARD_DAY:NF_CARD_NIGHT);              // thẻ mobile
    root.style.setProperty('--nf-mbin',dark?NF_MT_NIGHT:NF_MT_DAY);root.style.setProperty('--nf-mbout',dark?NF_MT_DAY:NF_MT_NIGHT);                    // nền ô "Radar Vinh" (mobile)
    root.style.setProperty('--nf-mtin',dark?NF_MTX_NIGHT:NF_MTX_DAY);root.style.setProperty('--nf-mtout',dark?NF_MTX_DAY:NF_MTX_NIGHT);                // chữ ô "Radar Vinh" (mobile)
    root.style.setProperty('--nf-ti',dark?NF_TXT_NIGHT:NF_TXT_DAY);root.style.setProperty('--nf-to',dark?NF_TXT_DAY:NF_TXT_NIGHT);          // chữ các nút
    root.style.setProperty('--nf-tti',dark?NF_TITLE_NIGHT:NF_TXT_DAY);root.style.setProperty('--nf-tto',dark?NF_TXT_DAY:NF_TITLE_NIGHT);   // chữ tiêu đề
    pend.forEach(function(q){q.e.classList.add(q.cls);});                                    // pha 2 (chỉ GHI): thêm class (nf-tx/nf-tt nới hộp vẽ nên phải đo SAU khi thêm)
    pend.forEach(function(q){q.f=nfFrame(q.e,q.full);if(q.rot90){q.ew=q.e.offsetWidth;q.eh=q.e.offsetHeight;}if(q.cls==='nf-mtc'||q.cls==='nf-tx'||q.cls==='nf-card')q.b=q.e.getBoundingClientRect();});   // pha 3 (chỉ ĐỌC): đo khung
    function dist(x,y){return Math.hypot(x-ox,y-oy);}
    pend.forEach(function(q){var f=q.f,e=q.e;                                                // pha 4 (chỉ GHI): tính điểm xuất phát cục bộ và ghi biến
      f.cx=(ox-f.l)/f.sc;f.cy=(oy-f.t)/f.sc;
      if(q.rot90){var ew=q.ew,eh=q.eh,sc=f.h/(ew||1)||1,mx=f.rl+f.w/2,my=f.rt+f.h/2;   // phần tử đang xoay 90 độ: đổi điểm xuất phát về toạ độ cục bộ (chưa xoay)
        f.sc=sc;f.cx=ew/2+(oy-my)/sc;f.cy=eh/2-(ox-mx)/sc;}
      e.style.setProperty('--nf-cx',f.cx.toFixed(1));e.style.setProperty('--nf-cy',f.cy.toFixed(1));e.style.setProperty('--nf-sc',f.sc.toFixed(4));e.style.setProperty('--nf-soft',soft);e.style.setProperty('--nf-r',0);
      var rr=f.rl+f.w,bb=f.rt+f.h,nx=Math.max(f.rl-ox,0,ox-rr),ny=Math.max(f.rt-oy,0,oy-bb),fx=Math.max(Math.abs(f.rl-ox),Math.abs(rr-ox)),fy=Math.max(Math.abs(f.rt-oy),Math.abs(bb-oy));
      f.d0=Math.hypot(nx,ny)-2;f.d1=Math.hypot(fx,fy)+2;   // gần nhất / xa nhất (px màn hình, dư 2px cho an toàn): ngoài khoảng sóng đi qua thì màu của phần tử không đổi nữa
      regs.push(f);
      if(q.cls==='nf-mtc'||q.cls==='nf-tx'||q.cls==='nf-card'){f.d=dist(q.b.left+q.b.width/2,q.b.top+q.b.height/2);e.style.setProperty('--nf-p',0);mts.push(f);}   // ô "Radar Vinh" + chữ thẻ (mobile) và chữ 15 nút (laptop): đổi màu chữ theo tiến trình (--nf-p)
    });
    // bảng thời tiết + viên thuốc (iframe): quét theo ĐÚNG mặt sóng của trang (xem __rvWipe trong js/weather-board.js)
    R.wx=[];[].forEach.call(host.querySelectorAll('iframe'),function(f){try{if(f.contentWindow&&f.contentWindow.__rvWipeStart&&f.contentWindow.__rvWipeStart(to,ox,oy,soft))R.wx.push(f);}catch(e){}});
    // data-theme KHÔNG đổi trong lúc chạy (cả hai chiều): nền/ảnh/chữ giữ giao diện cũ ở phần mặt sóng chưa tới nhờ các lớp .nf-*; chốt ở nfEnd()
    root.classList.add('nf-run');
    var t0=0;
    function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
    function frame(){
      if(R.done)return;
      var now=performance.now(),p=Math.min(1,(now-t0)/dur),r=ease(p)*total;
      var rs=r.toFixed(1);regs.forEach(function(f){if(f.fin||r<=f.d0)return;f.el.style.setProperty('--nf-r',rs);if(r-soft>=f.d1)f.fin=true;});   // --nf-r không kế thừa (xem @property trong css/theme-toggle.css): mỗi ghi chỉ tính lại chính phần tử đó. Chưa tới = giữ 0 (toàn "out"); đã đi hết = ghi đúng 1 lần cuối rồi thôi => mỗi khung chỉ vẽ lại phần đang có mép sóng, không vẽ lại cả trang   // --nf-r không kế thừa (xem @property trong css/theme-toggle.css): mỗi ghi chỉ tính lại chính phần tử đó
      mts.forEach(function(f){if(f.pf||r<=f.d)return;f.el.style.setProperty('--nf-p',Math.max(0,Math.min(1,(r-f.d)/soft)).toFixed(3));if(r-f.d>=soft)f.pf=true;});   // cùng công thức với dải chuyển màu của mặt sóng
      R.wx.forEach(function(f){try{f.contentWindow.__rvWipe(r);}catch(e){}});
      if(p<1)R.raf=requestAnimationFrame(frame);else nfEnd(R);
    }
    // chờ icon của bản sao bảng thời tiết nạp + giải mã xong (thường tức thì) rồi mới bắt đầu đếm thời gian: không trống/nháy icon lúc mặt sóng tới bảng
    Promise.all(R.wx.map(function(f){try{return f.contentWindow.__rvWipeReady();}catch(e){return null;}})).then(function(){
      if(R.done)return;t0=performance.now();R.raf=requestAnimationFrame(frame);
    });
  }
  inp.addEventListener('change',function(){var t=inp.checked?'dark':'light';try{localStorage.setItem(KEY,t);}catch(e){}nightfall(t);});   // chỉ đổi khi người dùng chủ động gạt
  addEventListener('storage',function(e){if(e.key!==KEY)return;var t=stored(),cur=NF.run?NF.run.to:root.getAttribute('data-theme');if(t===cur)return;nfEnd(NF.run);go(t);});   // đổi ở tab khác -> tab này theo
  go(stored());
  /* bật lại transition sau khi trạng thái ban đầu đã vẽ xong (tránh nút "chạy" khi khôi phục trạng thái đã lưu) */
  requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.remove('tg-switch--init');});});

  /* ---------- Vị trí ---------- */
  var probe=document.createElement('div');probe.style.cssText='position:fixed;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px)';document.body.appendChild(probe);
  var raf=0,lastKey='',t0=Date.now(),slideT=0;
  function box(k){return host.querySelector('[data-box="'+k+'"]');}
  /* Mép phải NHÌN THẤY của bảng Mobile: khung iframe có lề trong (viền neon nằm lệch vào trong), nên đo phần tử thật bên trong khung (cùng nguồn gốc) rồi nhân tỉ lệ thu phóng của khung */
  function visRight(){
    try{
      var open=host.classList.contains('rv-weather-open');
      var all=host.querySelectorAll(open?'iframe.rv-neon-frame':'iframe.rv-neon-pf'),fr=null,fb=null,i,rr;   // có thể còn khung cũ đã ẩn (cỡ 0): lấy khung đang hiện
      for(i=all.length-1;i>=0;i--){rr=all[i].getBoundingClientRect();if(rr.width>0){fr=all[i];fb=rr;break;}}
      var d=fr&&fr.contentDocument,e=d&&d.querySelector(open?'.board':'.dash');if(!e)return null;
      var sc=fb.width/(fr.offsetWidth||fb.width),er=e.getBoundingClientRect();
      return er.width>0?fb.left+er.right*sc:null;
    }catch(err){return null;}
  }
  function place(){raf=0;
    var ready=host.classList.contains('rv-weather-ready')||Date.now()-t0>8000;if(!ready){el.classList.remove('tg-on');return;}   // chưa hiện widget: chưa cần đo bố cục (tránh ép dựng layout lúc hiệu ứng mở đầu)
    if(/(^|\s)(float-(on|in|out)|leaving)(\s|$)/.test(root.className))return;   // đang vào/ở/thoát chế độ nổi ảnh: viên thuốc/bảng bị dịch+thu nhỏ nên số đo lúc này sai -> giữ nguyên vị trí nút (cách bảng thời tiết cũng làm), tránh nút bị giật xuống
    var mob=root.classList.contains('mobile'),sx=window.pageXOffset||0,sy=window.pageYOffset||0,vw=root.clientWidth;
    var x,y,r;
    if(mob){
      r=(box('m')||{getBoundingClientRect:function(){return {width:0};}}).getBoundingClientRect();
      var right=visRight();                                                // mép phải thẳng với mép phải nhìn thấy của bảng (đang mở) hoặc viên thuốc (đang thu nhỏ) Mobile
      if(right==null)right=r.width>0?r.right:vw-10;                        // chưa đo được khung bảng: dùng mép khung cũ
      var w=parseFloat(getComputedStyle(el).width)||el.offsetWidth||0,st=parseFloat(getComputedStyle(probe).paddingTop)||0;
      x=right-w+sx;y=st+6+sy;
    }else{
      var pill=host.querySelector('.rv-weather-pill.rv-weather-d'),pr=pill&&pill.getBoundingClientRect();
      r=(pr&&pr.width>0)?pr:(box('d')||{getBoundingClientRect:function(){return {top:12};}}).getBoundingClientRect();
      var w2=parseFloat(getComputedStyle(el).width)||el.offsetWidth||0;
      x=vw-vw*.0155-w2+sx;y=r.top+sy;                                      // mép trên thẳng với viên thuốc Laptop
    }
    /* chế độ nổi ảnh: nút chỉ thu nhỏ + mờ dần quanh tâm của chính nó (tâm mặc định) nên không bị dịch/giật xuống khi lùi ra sau */
    var key=(mob?'m':'d')+Math.round(x*10)+','+Math.round(y*10);
    if(key!==lastKey){lastKey=key;el.style.left=x+'px';el.style.top=y+'px';}
    el.classList.toggle('tg-switch--v',mob);
    el.classList.add('tg-on');
    if(!slideT)slideT=setTimeout(function(){el.classList.add('tg-slide');},700);   // từ lần đặt đầu tiên mới cho nút trượt êm khi bảng mở/thu (tránh trượt lúc vừa hiện)
  }
  function sched(){if(!raf)raf=requestAnimationFrame(place);}
  addEventListener('resize',sched);addEventListener('orientationchange',sched);addEventListener('scroll',sched,{passive:true});
  if(window.ResizeObserver)new ResizeObserver(sched).observe(root);
  /* widget đổi vị trí/trạng thái (hiện, mở, thu gọn, xoay...) -> tính lại */
  if(window.MutationObserver){
    var mo=new MutationObserver(sched);mo.observe(host,{attributes:true,attributeFilter:['class','style']});
    new MutationObserver(function(){sched();setTimeout(sched,200);setTimeout(sched,700);setTimeout(sched,1500);}).observe(host,{attributes:true,attributeFilter:['class']});   // mở/thu bảng: khung bảng dựng/đổi cỡ sau đó nên đo lại
    [box('d'),box('m')].forEach(function(b){if(b)mo.observe(b,{attributes:true,attributeFilter:['style']});});
    mo.observe(root,{attributes:true,attributeFilter:['class']});
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sched);
  sched();setTimeout(sched,600);setTimeout(sched,2500);setTimeout(sched,8100);
  window.RVThemeToggle={place:sched,el:el};
})();
