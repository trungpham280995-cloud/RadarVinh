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

     Bản mới: KHÔNG vẽ lại trang trong lúc chạy.
       1) View Transitions API chụp trang ở trạng thái cũ, đổi data-theme MỘT LẦN, chụp trạng thái mới; hai ảnh chụp là hai texture trên GPU.
       2) Mặt sóng tròn (tâm ở góc xuất phát, cạnh mềm) chỉ là mặt nạ của texture "mới": mỗi khung chỉ ghép texture, không vẽ lại DOM.
          Hướng, độ mềm của mép, thời lượng và đường cong giữ như bản cũ (tối: từ góc TRÊN PHẢI; sáng: từ góc DƯỚI TRÁI).
       3) Trình duyệt chưa có View Transitions: dùng "màn phủ" (một phần tử, chỉ transform + opacity, hoàn toàn trên GPU).
       4) Gạt liên tục: chỉ có MỘT hiệu ứng chạy; gạt thêm giữa chừng thì hiệu ứng đang chạy được tăng tốc để kết thúc gọn, rồi mới chạy hiệu ứng tới
          trạng thái cuối cùng mà người dùng chọn (gạt lẻ lần => một lượt chạy; gạt chẵn lần => không cần chạy thêm). Không bao giờ có hai lớp chồng nhau.
     Quy tắc CSS: cuối css/theme-toggle.css (Phần 3).
     Gỡ lỗi / so sánh: thêm ?themefx=fade vào địa chỉ để ép dùng màn phủ, ?themefx=none để đổi tức thì. Số đo của lần chạy gần nhất: RVThemeToggle.stats.
     ========================================================================================================== */
  var DUR_DARK=2600,DUR_LIGHT=2200,SOFT_K=.22;                       // như bản cũ: thời lượng (ms) và độ mềm của mép sóng (tỉ lệ đường chéo màn hình)
  var EASE='cubic-bezier(.455,.03,.515,.955)';                        // easeInOutQuad, đúng đường cong bản cũ
  var NIGHT='#0b1530',DAY='#ffffff';                                  // = --rvd-bg (site-dark.css) và nền trắng gốc (main.css)
  var FX={busy:false,queued:false,shown:'light',want:'light',run:null,stats:{}};
  var qs=(location.search.match(/[?&]themefx=(\w+)/)||[])[1]||'';
  var nav=navigator,lowEnd=!!((nav.deviceMemory&&nav.deviceMemory<=2)||(nav.hardwareConcurrency&&nav.hardwareConcurrency<=2));   // máy yếu: mép sóng cứng (clip-path, rẻ nhất) thay vì mép mềm (mặt nạ)
  var HAS_VT=typeof document.startViewTransition==='function'&&qs!=='fade'&&qs!=='none';
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
        vt=document.startViewTransition(function(){mark('commit');apply(to);return iconsReady();});
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

  /* ---- Cách 2 (trình duyệt chưa có View Transitions): màn phủ, chỉ transform + opacity ---- */
  function runCurtain(to){
    return new Promise(function(done){
      var g=geom(to),R=FX.run={anims:[],fast:FX.hurryNext===true};FX.hurryNext=false;
      var col=g.dark?NIGHT:DAY,S=Math.ceil(g.total*2),op=Math.min(100,(g.diag+2)/g.total*100).toFixed(2);
      var c=document.createElement('div');c.id='rv-curtain';c.setAttribute('aria-hidden','true');
      c.style.cssText='width:'+S+'px;height:'+S+'px;margin:'+(-S/2)+'px 0 0 '+(-S/2)+'px;background:radial-gradient(circle closest-side,'+col+' 0,'+col+' '+op+'%,rgba(0,0,0,0) 100%);transform:translate('+g.ox+'px,'+g.oy+'px) scale(.001)';
      document.body.appendChild(c);
      var d1=g.dur*.55,d2=g.dur*.45;
      mark('start');
      var a1=track(R,c.animate([{transform:'translate('+g.ox+'px,'+g.oy+'px) scale(.001)'},{transform:'translate('+g.ox+'px,'+g.oy+'px) scale(1)'}],{duration:d1,easing:EASE,fill:'forwards'}));
      a1.onfinish=function(){
        apply(to);mark('commit');                                   // trang đã bị phủ kín: đổi giao diện phía dưới, không ai nhìn thấy
        iconsReady().then(function(){requestAnimationFrame(function(){requestAnimationFrame(function(){
          var a2=track(R,c.animate([{opacity:1},{opacity:0}],{duration:d2,easing:'ease-out',fill:'forwards'}));
          a2.onfinish=function(){if(c.parentNode)c.parentNode.removeChild(c);FX.run=null;setMeta(to);mark('finished');done();};
        });});});
      };
    });
  }

  function runWipe(to){return HAS_VT?runVT(to):runCurtain(to);}
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
  addEventListener('storage',function(e){if(e.key!==KEY)return;var t=stored();sync(t);if(FX.busy||FX.queued){request(t);return;}if(t!==cur())go(t);});   // đổi ở tab khác -> tab này theo
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
  window.RVThemeToggle={place:sched,el:el,stats:FX.stats};
})();
