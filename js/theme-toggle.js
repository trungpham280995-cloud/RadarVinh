/* NÚT GẠT GIAO DIỆN SÁNG / TỐI của website (thiết kế mới + hiệu ứng chuyển cảnh tỏa ra, bản tối ưu hiệu năng cho điện thoại). Chỉ điều khiển giao diện website; KHÔNG liên quan tới ngày/đêm của bảng thời tiết.
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
  function cur(){return root.getAttribute('data-theme')==='dark'?'dark':'light';}
  function setMeta(t){if(meta)meta.setAttribute('content',t==='dark'?'#0b1530':lightMeta);}
  function apply(t){root.setAttribute('data-theme',t);setMeta(t);}
  function sync(t){inp.checked=(t==='dark');inp.setAttribute('aria-checked',inp.checked?'true':'false');}
  function go(t){apply(t);sync(t);FX.shown=FX.want=t;}

  /* ==========================================================================================================
     CHUYỂN CẢNH SÁNG <-> TỐI (bản tối ưu cho điện thoại)

     Vì sao bản cũ ("Nightfall") bị giật trên điện thoại: mỗi khung hình JS ghi lại một biến CSS lên ~25 phần tử nên trình duyệt phải
     tính lại style + VẼ LẠI trên luồng chính: nền trang, mặt nạ lớp phủ ảnh, nền + màu chữ của 14 thẻ kính (mỗi thẻ có backdrop-filter blur 20px
     nên phải làm mờ lại phía sau MỖI khung), tiêu đề cỡ chữ 241px tô bằng background-clip:text, và hai bản sao bảng thời tiết bị che bằng mặt nạ
     (box-shadow/text-shadow neon bị vẽ lại 2 lần mỗi khung). Thêm vào đó, thêm/bỏ class trên <html> kích hoạt 3 bộ quan sát bố cục (đo lại
     bảng thời tiết) đúng lúc bắt đầu và kết thúc => khựng ở hai đầu; và phải chờ icon bảng thời tiết tới 400ms trước khi sóng chạy.

     Bản mới: KHÔNG vẽ lại trang trong lúc chạy. Có hai cách, chọn theo trình duyệt:
       A) Chromium (Chrome / Edge / Samsung Internet, Android + máy tính): View Transitions API chụp trang cũ/mới thành texture GPU, mặt sóng tròn mềm
          (tâm ở góc xuất phát) chỉ là mặt nạ của texture "mới": mỗi khung chỉ ghép texture. Tối: từ góc TRÊN PHẢI; sáng: từ góc DƯỚI TRÁI (như bản cũ).
       B) Safari / iOS, Firefox và mọi trình duyệt khác: "mặt sóng tại chỗ" (Nightfall, như bản laptop gốc): KHÔNG có tấm che; một mặt sóng tròn lan từ góc xuất phát,
          đi tới đâu thì ảnh / nền / chữ / thẻ / bảng thời tiết đổi sang giao diện mới tại đó (lớp phủ nằm TRÊN ảnh, dưới chữ và thẻ).
          Vì sao iOS không dùng cách A: Safari chụp ảnh trang KHÔNG kèm backdrop-filter, nên 14 thẻ kính, viên thuốc/bảng thời tiết bị trong suốt
          và mất làm mờ suốt lúc chạy rồi "bật" lại khi kết thúc (thấy rõ trong video quay màn hình), thanh trạng thái/thanh công cụ của Safari đổi màu
          trước nội dung. Cách B luôn là trang thật nên kính nguyên vẹn. So với bản cũ, cách B nhẹ hơn: không đặt class lên <html> (class đó kích hoạt các bộ quan sát
          bố cục => khựng ở hai đầu), thẻ mobile đổi màu MỘT LẦN (transition 0,26s) đúng lúc sóng đi qua thay vì vẽ lại gradient + color-mix mỗi khung, và gạt thêm giữa chừng
          thì tăng tốc cho sóng đi hết (không cắt cụt, không nhảy).
       Gạt liên tục: chỉ có MỘT hiệu ứng chạy; gạt thêm giữa chừng thì hiệu ứng đang chạy được tăng tốc để kết thúc gọn, rồi mới chạy hiệu ứng tới
       trạng thái cuối cùng mà người dùng chọn (gạt lẻ lần => một lượt chạy; gạt chẵn lần => không cần chạy thêm). Không bao giờ có hai lớp chồng nhau.
     Quy tắc CSS: cuối css/theme-toggle.css (Phần 3).
     Gỡ lỗi / so sánh: thêm ?themefx=nf vào địa chỉ để ép dùng mặt sóng tại chỗ (Nightfall), ?themefx=vt để ép dùng View Transitions, ?themefx=none để đổi tức thì. Số đo của lần chạy gần nhất: RVThemeToggle.stats.
     ========================================================================================================== */
  var DUR_DARK=2600,DUR_LIGHT=2200,SOFT_K=.22;                       // View Transitions, như bản cũ: thời lượng (ms) và độ mềm của mép sóng (tỉ lệ đường chéo màn hình)
  var EASE='cubic-bezier(.455,.03,.515,.955)';                        // easeInOutQuad, đúng đường cong bản cũ
  var NIGHT='#0b1530',DAY='#ffffff';                                  // = --rvd-bg (site-dark.css) và nền trắng gốc (main.css)
  var FX={busy:false,queued:false,shown:'light',want:'light',run:null,stats:{}};
  var qs=(location.search.match(/[?&]themefx=(\w+)/)||[])[1]||'';
  var nav=navigator,lowEnd=!!((nav.deviceMemory&&nav.deviceMemory<=2)||(nav.hardwareConcurrency&&nav.hardwareConcurrency<=2));   // máy yếu: mép sóng cứng (clip-path, rẻ nhất) thay vì mép mềm (mặt nạ)
  var ua=nav.userAgent||'',isChromium=/Chrom(e|ium)\//.test(ua)&&!/(CriOS|FxiOS|EdgiOS|OPiOS)/.test(ua);   // Chrome/Edge/Samsung Internet (Blink). Chrome/Firefox/Edge trên iOS dùng WebKit nên KHÔNG tính
  var HAS_VT=typeof document.startViewTransition==='function'&&qs!=='nf'&&qs!=='none'&&(isChromium||qs==='vt');
  var HAS_MASK=!!(window.CSS&&CSS.supports&&(CSS.supports('mask-image','radial-gradient(circle,#000,transparent)')||CSS.supports('-webkit-mask-image','radial-gradient(circle,#000,transparent)'))&&CSS.registerProperty);
  function reduced(){return qs==='none'||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);}
  function geom(to){
    var W=innerWidth,H=innerHeight,dark=(to==='dark'),diag=Math.hypot(W,H),soft=Math.round(diag*SOFT_K);
    return {W:W,H:H,dark:dark,ox:dark?W:0,oy:dark?0:H,diag:diag,soft:soft,total:diag+soft,dur:dark?DUR_DARK:DUR_LIGHT};
  }
  function mark(k){FX.stats[k]=Math.round(performance.now()*10)/10;}
  /* Bảng thời tiết nằm trong iframe và tự đổi bộ icon (ngày/đêm) khi data-theme đổi; chờ icon mới nạp + giải mã xong để ảnh chụp "mới" không thiếu icon.
     (Icon đã được nạp sẵn bởi weather-board.js nên thường xong ngay; tối đa 350ms.) Bắt đầu bằng setTimeout để bộ quan sát trong iframe kịp chạy trước khi đo. */
  function iconsReady(){
    return new Promise(function(res){
      var fin=false,t0=performance.now();
      function done(){if(!fin){fin=true;res();}}
      setTimeout(function(){
        var jobs=[];
        try{[].forEach.call(host.querySelectorAll('iframe'),function(f){var d=f.contentDocument;if(!d)return;
          [].forEach.call(d.images,function(im){
            if(!im.getAttribute('src'))return;
            if(im.decode)jobs.push(im.decode().catch(function(){}));
            else if(!im.complete)jobs.push(new Promise(function(q){im.onload=im.onerror=q;}));
          });});}catch(e){}
        if(!jobs.length){done();return;}
        Promise.all(jobs).then(done,done);setTimeout(done,Math.max(0,350-(performance.now()-t0)));
      },0);
    });
  }
  /* Tăng tốc hiệu ứng đang chạy để kết thúc trong ~180ms (gạt thêm giữa chừng): updatePlaybackRate giữ nguyên vị trí hiện tại nên mặt sóng không nhảy. */
  function hurry(){
    var R=FX.run;if(!R)return;R.fast=true;
    if(R.nf){var now=performance.now(),p=R.t0?nfProgress(R,now):0;R.p0=p;R.t0=R.t0?now:0;R.rate=Math.max(1,(1-p)*R.dur/200);if(!R.t0)R.rate=8;return;}   // Nightfall: đổi tốc độ từ đúng vị trí hiện tại (mặt sóng không nhảy)
    R.anims.forEach(function(a){try{if(a.playState==='finished')return;var rem=Math.max(0,(a.effect.getComputedTiming().endTime||0)-(a.currentTime||0));a.updatePlaybackRate(Math.max(1,rem/180));}catch(e){}});
  }
  function track(R,a){R.anims.push(a);if(R.fast){try{a.updatePlaybackRate(8);}catch(e){}}return a;}

  /* ---- Cách 1: View Transitions (mặt nạ mềm, hoặc clip-path cứng trên máy yếu) ---- */
  function runVT(to){
    return new Promise(function(done){
      var g=geom(to),R=FX.run={anims:[],fast:FX.hurryNext===true};FX.hurryNext=false;
      var mode=(HAS_MASK&&!lowEnd)?'mask':'clip',fin=false,vt;
      root.style.setProperty('--rv-ox',g.ox+'px');root.style.setProperty('--rv-oy',g.oy+'px');root.style.setProperty('--rv-soft',g.soft+'px');
      root.setAttribute('data-rvfx',mode);        // chọn quy tắc ::view-transition-new(root) (không dùng class trên <html>: class đang được 3 bộ quan sát bố cục theo dõi)
      root.setAttribute('data-rvnt','');          // tắt mọi transition CSS trong lúc đổi data-theme: nền thẻ/khe giữa ảnh không được "trôi" sang màu mới sau mặt sóng
      el.style.viewTransitionName='rv-toggle';    // nút gạt là nhóm riêng: luôn hiện trạng thái thật (mặt trời <-> mặt trăng) ngay lập tức, không bị che bởi ảnh chụp cũ
      function cleanup(){
        if(fin)return;fin=true;
        root.removeAttribute('data-rvfx');root.removeAttribute('data-rvnt');
        ['--rv-ox','--rv-oy','--rv-soft'].forEach(function(k){root.style.removeProperty(k);});
        el.style.viewTransitionName='';FX.run=null;setMeta(to);mark('finished');done();
      }
      mark('start');
      try{
        vt=document.startViewTransition(function(){mark('commit');root.setAttribute('data-theme',to);return iconsReady();});
      }catch(e){apply(to);cleanup();return;}
      vt.ready.then(function(){
        mark('ready');
        var pe='::view-transition-new(root)',o={duration:g.dur,easing:EASE,fill:'forwards',pseudoElement:pe};
        if(mode==='mask')track(R,root.animate({'--rv-r':['2px',g.total+'px']},o));
        else track(R,root.animate({clipPath:['circle(0px at '+g.ox+'px '+g.oy+'px)','circle('+Math.ceil(g.diag+2)+'px at '+g.ox+'px '+g.oy+'px)']},o));
        requestAnimationFrame(function(){requestAnimationFrame(function(){root.removeAttribute('data-rvnt');});});   // ảnh chụp "mới" đã xong: bật lại transition CSS
      },function(){/* bị bỏ qua (tab ẩn...): data-theme vẫn đã được đổi trong callback */});
      vt.finished.then(cleanup,cleanup);
    });
  }

  /* ---- Cách B: Nightfall (mặt sóng tại chỗ) ----
     Không có tấm phủ. Một "mặt sóng" tròn (bán kính r) lan từ góc xuất phát; phía TRONG mặt sóng hiện giao diện "in", phía NGOÀI vẫn là giao diện "out":
       - nền trang + các đường trắng giữa ảnh: một lớp riêng, đĩa màu phóng bằng transform;
       - lớp phủ tối trên ảnh (.lyr-img / .mlayer): mặt nạ tròn mềm => ảnh tối/sáng theo mặt sóng, ảnh vẫn nằm dưới chữ/dải/icon;
       - tiêu đề: mobile = bản sao màu "in" che bằng mặt nạ; laptop = tô theo mặt sóng; thẻ mobile + chữ nút: đổi khi mặt sóng đi qua vị trí của chúng;
       - bảng thời tiết (iframe): quét theo đúng mặt sóng (xem __rvWipe trong js/weather-board.js).
     Ba bước tách riêng để dùng được cả cho hiệu ứng theo thời gian (laptop, trình duyệt khác) lẫn theo thao tác gạt (mobile):
       nfSetup(inTheme,fromTheme,ox,oy) dựng các lớp (một lần) | nfPaint(S,r) vẽ trạng thái ứng với bán kính r (gọi bao nhiêu lần cũng được, r tăng hay giảm đều đúng)
       | nfFinish(S,final,commit) chốt data-theme và gỡ mọi lớp. data-theme chỉ đổi Ở CUỐI. Quy tắc CSS: Phần 3 của css/theme-toggle.css. */
  var NF_TXT_DAY='#fff',NF_TXT_NIGHT='#fff8e1',NF_TITLE_NIGHT='#fff3c4';        // = màu chữ nút/tiêu đề: sáng (main.css) và tối (site-dark.css)
  var NF_CARD_NIGHT='rgba(30,43,80,.88)',NF_CARD_DAY='rgba(73,101,146,.78)';      // nền thẻ mobile: site-dark.css (--rvd-card) và weather-board.css
  var NF_MT_NIGHT='rgba(255,248,225,.7)',NF_MT_DAY='rgba(255,255,255,.7)',NF_MTX_NIGHT='rgb(31,45,84)',NF_MTX_DAY='rgb(73,101,146)';   // ô "Radar Vinh" mobile: nền + chữ
  var NF_BAND_NIGHT='rgba(15,28,60,.72)',NF_BAND_DAY='rgba(73,101,146,.6)';  // = --rvd-band x --band-opacity (site-dark.css) và --band x --band-opacity (main.css)
  var NF_VARS=['--nf-in','--nf-out','--nf-mi','--nf-mo','--nf-bin','--nf-bout','--nf-ti','--nf-to','--nf-tti','--nf-tto','--nf-cin','--nf-cout','--nf-mbin','--nf-mtin','--nf-mbout','--nf-mtout','--nf-canvas'];
  function nfShown(e){return e&&e.getClientRects().length>0&&getComputedStyle(e).display!=='none';}
  function nfFrame(e){var r=e.getBoundingClientRect(),w=e.offsetWidth||r.width||1;return {el:e,w:r.width,h:r.height,rl:r.left,rt:r.top,sc:(r.width/w||1)};}
  function nfEase(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
  function nfSetup(inTheme,fromTheme,ox,oy){
    var inDark=(inTheme==='dark'),W=innerWidth,H=innerHeight,diag=Math.hypot(W,H),soft=Math.round(diag*SOFT_K),total=diag+soft;
    var S={in:inTheme,from:fromTheme,ox:ox,oy:oy,soft:soft,total:total,regs:[],mts:[],flips:[],wx:[],done:false,ci:null,
           dTop:Math.hypot(W/2-ox,oy)+soft*.5,cIn:inDark?NIGHT:DAY,cOut:inDark?DAY:NIGHT};
    var pend=[],cards=[];
    mark('start');
    /* Gom ĐỌC / GHI thành từng pha để chỉ tính layout 1-2 lần */
    function want(e,cls,rot90){if(nfShown(e))pend.push({e:e,cls:cls,rot90:rot90});}     // pha 1 (chỉ ĐỌC): lọc phần tử đang hiện
    /* Nền + các đường trắng giữa ảnh: MỘT lớp riêng cố định nằm dưới nội dung, màu nền = màu "out"; trên đó là một đĩa màu "in" (mép mềm) tâm ở góc xuất phát,
       được phóng to bằng transform => chỉ ghép lớp trên GPU, không vẽ lại gradient (trước đây gradient trên <html> + #cards bắt trình duyệt vẽ lại cả lớp chứa ảnh, tiêu đề, 14 thẻ). */
    var bgEl=document.createElement('div'),bgDisc=document.createElement('i');
    bgEl.id='rv-nfbg';bgEl.setAttribute('aria-hidden','true');bgEl.style.backgroundColor=S.cOut;
    bgDisc.style.cssText='left:'+ox+'px;top:'+oy+'px;background:radial-gradient(circle closest-side,'+S.cIn+' 0,'+S.cIn+' 78%,rgba(0,0,0,0) 100%)';
    bgEl.appendChild(bgDisc);document.body.appendChild(bgEl);S.bgEl=bgEl;S.bgDisc=bgDisc;
    [].forEach.call(document.querySelectorAll('.stage'),function(e){want(e,'nf-bg');});
    [].forEach.call(document.querySelectorAll('.lyr-img,.mlayer'),function(e){want(e,'nf-ov');});
    [].forEach.call(document.querySelectorAll('.band'),function(e){want(e,'nf-band');});
    [].forEach.call(document.querySelectorAll('.item .txt'),function(e){want(e,'nf-tx');});      // chữ 15 nút (laptop)
    [].forEach.call(document.querySelectorAll('.title .txt'),function(e){want(e,'nf-tt');});     // tiêu đề (laptop)
    var mt=document.querySelector('.mpage .mtitle'),mta=mt&&mt.querySelector('a');               // tiêu đề (mobile, xoay 90 độ, cỡ chữ 241px)
    if(mta&&nfShown(mta)){
      /* Bản sao mang màu "in" nằm ngay trên bản gốc (màu "out"), được che bằng mặt nạ tròn mềm theo mặt sóng: nét chữ chỉ vẽ một lần, mỗi khung chỉ đổi mặt nạ
         (trước đây tô gradient bằng background-clip:text => vẽ lại toàn bộ nét chữ cỡ 241px mỗi khung: phần tốn nhất). */
      var tcl=mt.cloneNode(true);tcl.className=mt.className+' nf-tclone';tcl.setAttribute('aria-hidden','true');tcl.removeAttribute('aria-label');
      mt.parentNode.insertBefore(tcl,mt.nextSibling);S.tclone=tcl;S.tbase=mta;want(tcl.querySelector('a'),'nf-tm',true);
    }
    [].forEach.call(document.querySelectorAll('.mpage .m'),function(e){if(nfShown(e))cards.push(e);});     // thẻ mobile: đổi màu một lần khi sóng đi qua (không vẽ lại gradient mỗi khung)
    var sp=root.style.setProperty.bind(root.style);
    sp('--nf-in',S.cIn);sp('--nf-out',S.cOut);
    sp('--nf-mi',inDark?'#000':'transparent');sp('--nf-mo',inDark?'transparent':'#000');
    sp('--nf-bin',inDark?NF_BAND_NIGHT:NF_BAND_DAY);sp('--nf-bout',inDark?NF_BAND_DAY:NF_BAND_NIGHT);
    sp('--nf-cin',inDark?NF_CARD_NIGHT:NF_CARD_DAY);sp('--nf-cout',inDark?NF_CARD_DAY:NF_CARD_NIGHT);       // nền thẻ mobile: trong / ngoài mặt sóng
    sp('--nf-mbin',inDark?NF_MT_NIGHT:NF_MT_DAY);sp('--nf-mtin',inDark?NF_MTX_NIGHT:NF_MTX_DAY);             // ô "Radar Vinh" (mobile): nền + chữ, trong mặt sóng
    sp('--nf-mbout',inDark?NF_MT_DAY:NF_MT_NIGHT);sp('--nf-mtout',inDark?NF_MTX_DAY:NF_MTX_NIGHT);          // ... và ngoài mặt sóng
    sp('--nf-ti',inDark?NF_TXT_NIGHT:NF_TXT_DAY);sp('--nf-to',inDark?NF_TXT_DAY:NF_TXT_NIGHT);              // chữ các nút
    sp('--nf-tti',inDark?NF_TITLE_NIGHT:NF_TXT_DAY);sp('--nf-tto',inDark?NF_TXT_DAY:NF_TITLE_NIGHT);        // chữ tiêu đề
    sp('--nf-canvas',fromTheme==='dark'?NIGHT:DAY);                                                           // nền canvas <html> luôn đặc (thanh trạng thái/thanh công cụ Safari lấy màu từ đây)
    pend.forEach(function(q){q.e.classList.add(q.cls);});                                    // pha 2 (chỉ GHI)
    pend.forEach(function(q){q.f=nfFrame(q.e);if(q.rot90){q.ew=q.e.offsetWidth;q.eh=q.e.offsetHeight;}if(q.cls==='nf-tx')q.b=q.e.getBoundingClientRect();});   // pha 3 (chỉ ĐỌC)
    cards.forEach(function(e){var b=e.getBoundingClientRect();S.flips.push({el:e,c:null,d:Math.hypot(b.left+b.width/2-ox,b.top+b.height/2-oy)+soft*.3});});
    pend.forEach(function(q){var f=q.f,e=q.e;                                                // pha 4 (chỉ GHI)
      f.cx=(ox-f.rl)/f.sc;f.cy=(oy-f.rt)/f.sc;
      if(q.rot90){var ew=q.ew,eh=q.eh,sc=f.h/(ew||1)||1,mx=f.rl+f.w/2,my=f.rt+f.h/2;
        f.sc=sc;f.cx=ew/2+(oy-my)/sc;f.cy=eh/2-(ox-mx)/sc;}
      e.style.setProperty('--nf-cx',f.cx.toFixed(1));e.style.setProperty('--nf-cy',f.cy.toFixed(1));e.style.setProperty('--nf-sc',f.sc.toFixed(4));e.style.setProperty('--nf-soft',soft);e.style.setProperty('--nf-r',2);   // 2 chứ không phải 0: gradient có điểm dừng cuối = 0px là gradient suy biến, Safari/iPhone không vẽ gì
      var rr=f.rl+f.w,bb=f.rt+f.h,nx=Math.max(f.rl-ox,0,ox-rr),ny=Math.max(f.rt-oy,0,oy-bb),fx=Math.max(Math.abs(f.rl-ox),Math.abs(rr-ox)),fy=Math.max(Math.abs(f.rt-oy),Math.abs(bb-oy));
      f.d0=Math.hypot(nx,ny)-2;f.d1=Math.hypot(fx,fy)+2;   // gần nhất / xa nhất: r <= d0 thì phần tử hoàn toàn "out"; r - soft >= d1 thì hoàn toàn "in"
      f.st=-1;
      if(q.e===(S.tclone&&S.tclone.querySelector('a'))){f.onst=function(st){S.tclone.style.visibility=st===0?'hidden':'';S.tbase.style.visibility=st===2?'hidden':'';};}   // bản sao/bản gốc chỉ hiện khi cần: không có viền cũ lấp ló quanh nét chữ khi đã xong
      S.regs.push(f);
      if(q.cls==='nf-tx'){f.d=Math.hypot(q.b.left+q.b.width/2-ox,q.b.top+q.b.height/2-oy);e.style.setProperty('--nf-p',0);f.pst=-1;S.mts.push(f);}   // chữ 15 nút (laptop): đổi màu theo tiến trình (--nf-p)
    });
    // bảng thời tiết + viên thuốc (iframe): quét theo ĐÚNG mặt sóng của trang. Bản sao luôn mang giao diện ĐỐI DIỆN với giao diện hiện tại; inv = phía trong mặt sóng là giao diện HIỆN TẠI (quét ngược)
    var target=(fromTheme==='dark')?'light':'dark';S.inv=(target!==inTheme);
    [].forEach.call(host.querySelectorAll('iframe'),function(f){try{if(f.contentWindow&&f.contentWindow.__rvWipeStart&&f.contentWindow.__rvWipeStart(target,ox,oy,soft))S.wx.push(f);}catch(e){}});
    root.setAttribute('data-nf','');     // thuộc tính (KHÔNG phải class): class của <html> đang được 3 bộ quan sát bố cục theo dõi
    return S;
  }
  function nfPaint(S,r){
    if(!S||S.done)return;var soft=S.soft;
    S.bgDisc.style.transform='scale('+(Math.max(.02,r/100)).toFixed(3)+')';                                   // đĩa nền: bán kính = r (đĩa gốc 200px => bán kính 100px)
    var rs=Math.max(2,r).toFixed(1);
    S.regs.forEach(function(f){                                                                                // chỉ phần tử đang có mép sóng đi qua mới đổi mỗi khung
      var st=r<=f.d0?0:(r-soft>=f.d1?2:1);
      if(st!==1&&st===f.st)return;
      f.st=st;f.el.style.setProperty('--nf-r',st===0?'2':(st===2?(f.d1+soft+4).toFixed(1):rs));
      if(f.onst)f.onst(st);
    });
    S.mts.forEach(function(f){var pv=r<=f.d?0:Math.min(1,(r-f.d)/soft),st=pv===0?0:(pv===1?2:1);if(st!==1&&st===f.pst)return;f.pst=st;f.el.style.setProperty('--nf-p',pv.toFixed(3));});
    S.flips.forEach(function(f){var c=r>=f.d?'nf-in':'nf-out';if(f.c!==c){if(f.c)f.el.classList.remove(f.c);f.el.classList.add(c);f.c=c;}});   // thẻ mobile: đổi một lần (transition CSS 0,26s)
    var ci=(r>=S.dTop);if(ci!==S.ci){S.ci=ci;root.style.setProperty('--nf-canvas',ci?S.cIn:S.cOut);}        // dải sau thanh trạng thái đổi màu khi mặt sóng đã phủ mép trên
    S.wx.forEach(function(f){try{f.contentWindow.__rvWipe(r,S.inv);}catch(e){}});
  }
  function nfFinish(S,final,commit){
    if(!S||S.done)return;S.done=true;
    root.setAttribute('data-rvnt','');   // chốt giao diện KHÔNG kèm transition nào (màu cuối đã đúng từng điểm ảnh nhờ các lớp .nf-*)
    S.regs.forEach(function(f){var e=f.el;['--nf-r','--nf-cx','--nf-cy','--nf-sc','--nf-soft','--nf-p'].forEach(function(k){e.style.removeProperty(k);});e.classList.remove('nf-bg','nf-ov','nf-band','nf-tx','nf-tt','nf-tm');});
    S.flips.forEach(function(f){f.el.classList.remove('nf-in','nf-out');});
    if(S.bgEl&&S.bgEl.parentNode)S.bgEl.parentNode.removeChild(S.bgEl);
    if(S.tclone&&S.tclone.parentNode)S.tclone.parentNode.removeChild(S.tclone);
    if(S.tbase)S.tbase.style.visibility='';
    S.wx.forEach(function(f){try{f.contentWindow.__rvWipeEnd(final);}catch(e){}});   // bảng thời tiết: bỏ bản sao, chốt giao diện
    NF_VARS.forEach(function(k){root.style.removeProperty(k);});
    root.removeAttribute('data-nf');
    if(commit)apply(final);              // chốt giao diện MỚI (KHÔNG chạm vào trạng thái ô gạt: người dùng có thể đã gạt tiếp)
    mark('finished');
    requestAnimationFrame(function(){requestAnimationFrame(function(){root.removeAttribute('data-rvnt');});});
  }
  function nfProgress(R,now){return Math.min(1,R.p0+(now-R.t0)/R.dur*R.rate);}

  /* ---- Nightfall theo THỜI GIAN (laptop / trình duyệt khác; không thay đổi so với trước). Tối: từ góc TRÊN PHẢI; sáng: từ góc DƯỚI TRÁI ---- */
  function runNF(to){
    return new Promise(function(done){
      var dark=(to==='dark'),W=innerWidth,H=innerHeight,ox=dark?W:0,oy=dark?0:H,dur=dark?DUR_DARK:DUR_LIGHT;
      var S=nfSetup(to,cur(),ox,oy);
      var R=FX.run={anims:[],nf:true,done:false,raf:0,S:S,to:to,rate:FX.hurryNext===true?8:1,p0:0,t0:0,dur:dur};FX.hurryNext=false;
      function end(){if(R.done)return;R.done=true;cancelAnimationFrame(R.raf);nfFinish(S,to,true);FX.run=null;done();}
      function frame(){
        if(R.done)return;
        var p=nfProgress(R,performance.now());nfPaint(S,nfEase(p)*S.total);
        if(p<1)R.raf=requestAnimationFrame(frame);else end();
      }
      nfPaint(S,0);
      // chờ icon của bản sao bảng thời tiết nạp + giải mã xong (thường tức thì) rồi mới bắt đầu đếm thời gian
      Promise.all(S.wx.map(function(f){try{return f.contentWindow.__rvWipeReady();}catch(e){return null;}})).then(function(){
        if(R.done)return;R.t0=performance.now();mark('ready');R.raf=requestAnimationFrame(frame);
      });
    });
  }

  /* ==========================================================================================================
     MOBILE: CHUYỂN CẢNH THEO THAO TÁC GẠT (gesture-driven)
     Một tiến trình duy nhất q (0 = sáng hoàn toàn, 1 = tối hoàn toàn). Mặt sóng là hình tròn tâm ở góc TRÊN PHẢI, bán kính r = q x tổng; mọi lớp của trang vẽ theo r (nfPaint)
     nên: bên trong mặt sóng là giao diện TỐI, bên ngoài vẫn là giao diện SÁNG, cả hai hiện ĐỒNG THỜI và mỗi lớp (ảnh, nền, chữ, thẻ, bảng thời tiết) đổi cùng một nhịp.
       - Kéo con lăn: q theo đúng vị trí ngón tay (kéo tới đâu mặt sóng tới đó; kéo ngược thì mặt sóng thu lại: giao diện sáng thay lại giao diện tối).
       - Thả tay giữa chừng: q chạy tiếp tới 0 hoặc 1 (gần nhất; gạt nhanh thì theo hướng gạt) rồi mới chốt data-theme; q về 0 = huỷ, không đổi gì.
       - Chạm: q chạy từ trạng thái hiện tại tới trạng thái kia trong ~0,85s (cùng nhịp với con lăn). Chạm/gạt lại giữa chừng: q đổi hướng NGAY từ vị trí hiện tại (không nhảy, không chồng lớp).
     data-theme chỉ đổi Ở CUỐI: không bao giờ có chuyện "giao diện đổi trước rồi nền mới chuyển màu". Desktop không dùng phần này.
     ========================================================================================================== */
  var TAP_MS=850,DRAG_PX=5,FLING_PX_MS=.2;
  var G={S:null,q:0,base:'light',raf:0,anim:0,target:null,drag:null,geo:null,guard:0};
  function gMobile(){return root.classList.contains('mobile')&&qs!=='none'&&!reduced();}
  function gEnsure(){
    if(G.S)return;
    var base=cur();G.base=base;G.q=base==='dark'?1:0;
    G.S=nfSetup('dark',base,innerWidth,0);      // phía trong mặt sóng luôn là giao diện TỐI, tâm ở góc trên phải (đúng hướng bản cũ)
    nfPaint(G.S,G.q*G.S.total);
  }
  function gPaint(){if(G.S)nfPaint(G.S,G.q*G.S.total);}
  function gSchedule(){if(G.raf)return;G.raf=requestAnimationFrame(function(){G.raf=0;gPaint();});}
  function gStop(){if(G.anim){cancelAnimationFrame(G.anim);G.anim=0;}if(G.raf){cancelAnimationFrame(G.raf);G.raf=0;}}
  function gDone(final){
    gStop();var S=G.S,base=G.base;G.S=null;G.target=null;
    nfFinish(S,final,final!==base);
    FX.shown=FX.want=final;
  }
  function gEaseOut(x){return 1-Math.pow(1-x,3);}
  function gAnimate(target,ms,ease){
    gEnsure();gStop();
    var q0=G.q,q1=target==='dark'?1:0,t0=performance.now();G.target=target;mark('ready');
    if(q0===q1){gDone(target);return;}
    (function step(now){
      var p=Math.min(1,(now-t0)/ms);G.q=q0+(q1-q0)*ease(p);gPaint();
      if(p<1)G.anim=requestAnimationFrame(step);else{G.anim=0;gDone(target);}
    })(t0);
  }
  /* Chạm (hoặc bàn phím): chạy q tới trạng thái đích từ vị trí hiện tại; nếu đang chạy dở thì chỉ đổi hướng */
  function gTap(t){
    if(document.hidden){gStop();if(G.S)gDone(cur());go(t);return;}
    gEnsure();gAnimate(t,Math.max(220,TAP_MS*Math.abs((t==='dark'?1:0)-G.q)),nfEase);
  }
  /* ---- Gạt bằng ngón tay ---- */
  function gGeo(){   // hướng + quãng đường con lăn trên màn hình (tính từ vị trí con lăn khi đứng yên; lưu lại để dùng khi đang chạy dở)
    var sky=el.querySelector('.tg-switch__sky'),kn=el.querySelector('.tg-switch__knob');if(!sky||!kn)return G.geo;
    var vert=el.classList.contains('tg-switch--v'),sr=sky.getBoundingClientRect(),kr=kn.getBoundingClientRect();
    var settled=!(kn.getAnimations&&kn.getAnimations().length);
    if(settled||!G.geo){
      var kc=vert?kr.top+kr.height/2:kr.left+kr.width/2,sc=vert?sr.top+sr.height/2:sr.left+sr.width/2,d=kc-sc,dark=inp.checked;
      var dir=dark?(d>=0?1:-1):(d<0?1:-1);   // dir: chiều (+1/-1) trên trục màn hình dẫn tới phía TỐI
      G.geo={vert:vert,dir:dir,travel:Math.max(20,2*Math.abs(d))};
    }
    return G.geo;
  }
  function gKnob(q){   // con lăn + halo đi theo ngón tay (translate theo trục cục bộ của bầu trời; chiều dài giữ nguyên sau khi xoay 90 độ)
    var kn=el.querySelector('.tg-switch__knob'),ha=el.querySelector('.tg-switch__halo'),x=(q*G.geo.travel).toFixed(2)+'px';
    if(kn)kn.style.translate=x+' 0';if(ha)ha.style.translate='calc(-50% + '+x+') -50%';
  }
  function gKnobClear(){var kn=el.querySelector('.tg-switch__knob'),ha=el.querySelector('.tg-switch__halo');if(kn)kn.style.translate='';if(ha)ha.style.translate='';el.classList.remove('tg-drag');}
  el.addEventListener('pointerdown',function(e){
    if(!gMobile()||(e.pointerType==='mouse'&&e.button!==0))return;
    G.drag={id:e.pointerId,x0:e.clientX,y0:e.clientY,on:false,s:[],g:gGeo()};G.drag.s.push([e.timeStamp||performance.now(),G.drag.g&&G.drag.g.vert?e.clientY:e.clientX]);   // hình học đo MỘT lần lúc chạm (khi kéo, con lăn đã dời chỗ nên không đo lại)
    try{el.setPointerCapture(e.pointerId);}catch(_){}
  });
  el.addEventListener('pointermove',function(e){
    var D=G.drag;if(!D||e.pointerId!==D.id)return;
    var g=D.g;if(!g)return;
    var pos=g.vert?e.clientY:e.clientX;
    var tn=e.timeStamp||performance.now();D.s.push([tn,pos]);while(D.s.length>1&&tn-D.s[0][0]>120)D.s.shift();   // mẫu vận tốc ghi từ lúc chạm (kể cả trong ngưỡng 5px đầu: gạt nhanh thường kết thúc rất sớm)
    if(!D.on){
      if(Math.hypot(e.clientX-D.x0,e.clientY-D.y0)<DRAG_PX)return;
      D.on=true;gStop();gEnsure();                         // bắt lấy hiệu ứng đang chạy dở (nếu có): q giữ nguyên, ngón tay tiếp quản
      D.q0=G.q;D.pos0=g.vert?D.y0:D.x0;el.classList.add('tg-drag');G.target=null;   // tính từ chỗ chạm đầu tiên: con lăn đi theo ngón tay 1:1, không bị "hụt" quãng ngưỡng 5px
    }
    var q=Math.max(0,Math.min(1,D.q0+g.dir*(pos-D.pos0)/g.travel));
    G.q=q;gKnob(q);
    var chk=q>=.5;if(inp.checked!==chk){inp.checked=chk;inp.setAttribute('aria-checked',chk?'true':'false');}   // trang trí bầu trời (sao/mây) đổi ở giữa hành trình như công tắc thường
    gSchedule();
    e.preventDefault();
  });
  function gRelease(e,cancel){
    var D=G.drag;if(!D||(e&&e.pointerId!==D.id))return;G.drag=null;
    try{el.releasePointerCapture(D.id);}catch(_){}
    if(!D.on){                                             // chưa vượt ngưỡng 5px: là chạm -> để sự kiện click bình thường xử lý (gTap)
      return;
    }
    G.guard=performance.now();                             // chặn click sinh ra sau khi thả (nhãn sẽ tự đảo ô chọn)
    var g=D.g,v=0,s=D.s;if(s.length>1){var dt=s[s.length-1][0]-s[0][0];if(dt>0)v=g.dir*(s[s.length-1][1]-s[0][1])/dt;}   // vận tốc theo hướng "tối" (px/ms)
    FX.stats.v=Math.round(v*1000)/1000;   // vận tốc lúc thả (px/ms, dương = về phía tối)
    var target=(Math.abs(v)>=FLING_PX_MS&&!cancel)?(v>0?'dark':'light'):(G.q>=.5?'dark':'light');
    try{localStorage.setItem(KEY,target);}catch(_){}
    inp.checked=(target==='dark');inp.setAttribute('aria-checked',inp.checked?'true':'false');
    gKnobClear();                                          // con lăn về đúng đầu nút bằng transition của nút
    gAnimate(target,Math.max(150,Math.min(650,Math.abs((target==='dark'?1:0)-G.q)*700)),gEaseOut);
  }
  el.addEventListener('pointerup',function(e){gRelease(e,false);});
  el.addEventListener('pointercancel',function(e){gRelease(e,true);});
  el.addEventListener('click',function(e){if(G.guard&&performance.now()-G.guard<400){e.preventDefault();e.stopPropagation();}},true);

  function runWipe(to){return HAS_VT?runVT(to):runNF(to);}
  function pump(){
    if(FX.busy)return;FX.busy=true;
    (function next(){
      var to=FX.want;
      if(to===FX.shown){FX.busy=false;return;}
      if(reduced()||document.hidden){apply(to);FX.shown=to;next();return;}
      runWipe(to).then(function(){FX.shown=to;next();});
    })();
  }
  function request(t){
    FX.want=t;
    if(gMobile()){gTap(t);return;}                                   // mobile: chuyển cảnh theo tiến trình (xem phần GESTURE ở trên)
    if(FX.busy){if(FX.run)hurry();else FX.hurryNext=true;return;}   // đang chạy: tăng tốc cho xong gọn, vòng lặp trong pump() sẽ chạy tiếp tới trạng thái cuối
    if(FX.queued)return;FX.queued=true;
    // để nút gạt vẽ khung hình đầu tiên của nó (và nhận phản hồi ngay) rồi mới chụp trang: chụp trang là phần việc nặng nhất của lần đổi
    requestAnimationFrame(function(){requestAnimationFrame(function(){FX.queued=false;pump();});});
  }
  /* Trong lúc View Transition chạy, trình duyệt chuyển MỌI chạm vào <html> (trang thật nằm sau lớp ảnh chụp, pointer-events không xuyên xuống được).
     Để vẫn gạt liên tục được (và bấm được viên thuốc thời tiết / các ô), tự tìm phần tử nằm đúng vị trí chạm rồi kích hoạt nó. Thứ tự ưu tiên: nút gạt > viên thuốc > liên kết. */
  var FWD='.rv-weather-pill,.mpage a.m,.mpage .mtitle a span,a.item,.title-link';
  root.addEventListener('click',function(e){
    if(!FX.run||e.target!==root||e.button||/(^|\s)float-(on|in|out)(\s|$)/.test(root.className))return;
    var x=e.clientX,y=e.clientY,list=[el].concat([].slice.call(document.querySelectorAll(FWD))),i,n,r,pad,open=host.classList.contains('rv-weather-open');
    for(i=0;i<list.length;i++){
      n=list[i];if(open&&n.classList&&n.classList.contains('rv-weather-pill'))continue;
      r=n.getBoundingClientRect();if(!(r.width>0&&r.height>0))continue;pad=(n===el)?6:0;
      if(x>=r.left-pad&&x<=r.right+pad&&y>=r.top-pad&&y<=r.bottom+pad){e.preventDefault();(n===el?inp:n).click();return;}
    }
  });
  inp.addEventListener('change',function(){var t=inp.checked?'dark':'light';try{localStorage.setItem(KEY,t);}catch(e){}request(t);});   // chỉ đổi khi người dùng chủ động gạt
  addEventListener('storage',function(e){if(e.key!==KEY)return;var t=stored();sync(t);if(FX.busy||FX.queued||G.S){request(t);return;}if(t!==cur())go(t);});   // đổi ở tab khác -> tab này theo
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
    var dpr=window.devicePixelRatio||1;x=Math.round(x*dpr)/dpr;y=Math.round(y*dpr)/dpr;   // khớp đúng điểm ảnh thiết bị: nút nét khi được chụp lại trong lúc chuyển cảnh
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
  window.RVThemeToggle={place:sched,el:el,stats:FX.stats,q:function(){return G.S?G.q:(cur()==='dark'?1:0);}};
})();
