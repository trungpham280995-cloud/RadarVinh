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

  /* ---------- Hiệu ứng chuyển cảnh "NIGHTFALL" ----------
     Sang TỐI: màn đêm buông xuống từ góc TRÊN PHẢI lan xuống góc dưới trái. Về SÁNG: ánh sáng trở lại từ góc DƯỚI TRÁI lan lên góc trên phải. Không màn che, trang vẫn bấm được.
     MỘT đồng hồ duy nhất (requestAnimationFrame) điều khiển TẤT CẢ: mỗi khung hình tính tiến trình f của mặt trận rồi
       (1) dịch mặt nạ của lớp nền thật (.nf-sky, sau ảnh) và lớp tối phủ ảnh (--nf-mx/--nf-my, xem css/theme-toggle.css phần 3);
       (2) nội suy màu của từng thành phần (chữ, thanh ngang, thẻ chữ mobile) theo ĐÚNG hàm mà mặt nạ dùng tại vị trí của thành phần đó;
       (3) đổi bộ màu bảng thời tiết khi mặt trận đi qua tâm bảng (data-nf-wx, khung bảng đọc trong js/weather-board.js).
     Màu đầu/cuối của mỗi thành phần được ĐO từ chính CSS sáng và CSS tối (không viết cứng) -> kết thúc khớp hệt giao diện thật, không nhảy hình. "Giảm chuyển động": đổi ngay. */
  var runRaf=0,nfSky=null,preloaded=false,run=null;
  var NF_SPEC=[['.title',['color']],['.item',['color']],['.mpage .mtitle a',['color']],['.band',['backgroundColor','opacity']],['.mpage .m',['backgroundColor','color']]];
  var NF_CSS={color:'color',backgroundColor:'background-color',opacity:'opacity'};
  function reduced(){return window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;}
  /* nạp sẵn bộ icon thời tiết của giao diện sắp chuyển tới để lúc bảng đổi màu không bị trống icon */
  function preload(dark){
    try{var IC=window.__rvIC||{},k,kk,u;for(k in IC)for(kk in IC[k]){u=IC[k][kk];if(typeof u!=='string')continue;new Image().src=dark?u.replace('weather/','weather/dark/'):u;}}catch(e){}
  }
  function nums(s){var m=String(s).match(/-?\d*\.?\d+(?:e-?\d+)?/g);return m?m.map(parseFloat):[];}
  function readProp(cs,p){
    if(p==='opacity'){var o=parseFloat(cs.opacity);return isNaN(o)?[1]:[o];}
    var a=nums(cs[p]);if(a.length<3)return null;if(a.length===3)a.push(1);return a.slice(0,4);
  }
  function lerpArr(a,b,t){var r=[],i;for(i=0;i<a.length;i++)r.push(a[i]+(b[i]-a[i])*t);return r;}
  function fmt(p,v){return p==='opacity'?String(Math.max(0,Math.min(1,v[0]))):'rgba('+Math.round(v[0])+','+Math.round(v[1])+','+Math.round(v[2])+','+Math.max(0,Math.min(1,v[3])).toFixed(3)+')';}
  function endRun(){
    if(runRaf){cancelAnimationFrame(runRaf);runRaf=0;}
    if(run){var i,j,t;for(i=0;i<run.targets.length;i++){t=run.targets[i];for(j=0;j<t.props.length;j++)t.el.style.removeProperty(NF_CSS[t.props[j]]);if(t.band){t.el.style.removeProperty('background-image');}}}
    run=null;
    root.classList.remove('nf-run','nf-night','nf-day');root.style.removeProperty('--nf-mx');root.style.removeProperty('--nf-my');root.removeAttribute('data-nf-wx');
    if(nfSky){nfSky.remove();nfSky=null;}
  }
  function nightfall(theme){
    endRun();
    var dark=theme==='dark',startTheme=dark?'light':'dark',W=window.innerWidth,H=window.innerHeight,D=dark?2600:2300,i,j,r,els,t;
    /* thời điểm f (0..1) mặt trận (tâm dải mềm) đi qua điểm (x,y): cùng hình học với mặt nạ chéo trong CSS */
    function arrive(x,y){var f=.5+(dark?-1:1)*(x/W-y/H)/3;return Math.max(-.2,Math.min(1.2,f));}
    /* mức chuyển (0..1) tại điểm (x,y) khi tiến trình là f: chính là độ đục cục bộ của mặt nạ (dải mềm rộng 1/3 tiến trình) */
    function local(f,x,y){return Math.max(0,Math.min(1,(f-(arrive(x,y)-1/6))*3));}
    var targets=[];
    root.classList.add('nf-run');   // tắt chuyển màu CSS ngay (để đọc được màu đích tức thời)
    for(i=0;i<NF_SPEC.length;i++){
      els=document.querySelectorAll(NF_SPEC[i][0]);
      for(j=0;j<els.length;j++){r=els[j].getBoundingClientRect();if(r.width<=0||r.height<=0)continue;
        targets.push({el:els[j],props:NF_SPEC[i][1],s:{},e:{},cx:r.left+r.width/2,cy:r.top+r.height/2,band:NF_SPEC[i][0]==='.band',rect:r});}
    }
    root.setAttribute('data-nf-wx',startTheme);   // bảng thời tiết giữ bộ màu cũ cho tới khi mặt trận tới nó
    /* đo màu ĐẦU (giao diện cũ) và ĐÍCH (giao diện mới) từ chính CSS, trong cùng một nhịp (không vẽ ở giữa nên không nháy) */
    root.setAttribute('data-theme',startTheme);void root.offsetWidth;
    for(i=0;i<targets.length;i++){t=targets[i];var cs=getComputedStyle(t.el);for(j=0;j<t.props.length;j++)t.s[t.props[j]]=readProp(cs,t.props[j]);}
    root.setAttribute('data-theme',theme);void root.offsetWidth;
    for(i=0;i<targets.length;i++){t=targets[i];var cs2=getComputedStyle(t.el);for(j=0;j<t.props.length;j++)t.e[t.props[j]]=readProp(cs2,t.props[j]);}
    targets=targets.filter(function(x){for(var k=0;k<x.props.length;k++){if(!x.s[x.props[k]]||!x.e[x.props[k]])return false;}return true;});
    for(i=0;i<targets.length;i++)targets[i].fa=arrive(targets[i].cx,targets[i].cy);
    var fr=host.querySelectorAll('iframe'),wx=0,wy=0;   // tâm bảng/viên thuốc thời tiết đang hiện
    for(i=0;i<fr.length;i++){r=fr[i].getBoundingClientRect();if(r.width>0){wx=r.left+r.width/2;wy=r.top+r.height/2;break;}}
    var wf=arrive(wx,wy),wDone=false;
    nfSky=document.createElement('div');nfSky.className='nf-sky';nfSky.setAttribute('aria-hidden','true');document.body.appendChild(nfSky);
    root.classList.add(dark?'nf-night':'nf-day');
    inp.checked=dark;inp.setAttribute('aria-checked',dark?'true':'false');
    try{if(meta)meta.setAttribute('content',dark?'#0b1530':lightMeta);}catch(e){}
    var N=12;   // số điểm màu dọc ba thanh ngang (thanh rộng nên màu đổi dần ngay TRONG thanh theo mặt trận)
    function paint(f){
      var k,m,q,p,v,x,stops,bt,lp;
      root.style.setProperty('--nf-mx',((dark?f:1-f)*100).toFixed(3)+'%');root.style.setProperty('--nf-my',((dark?1-f:f)*100).toFixed(3)+'%');
      for(k=0;k<targets.length;k++){
        t=targets[k];
        if(t.band){
          var bg0=t.s.backgroundColor,bg1=t.e.backgroundColor,o0=t.s.opacity[0],o1=t.e.opacity[0],y=t.cy;stops=[];
          for(m=0;m<=N;m++){x=t.rect.left+t.rect.width*m/N;lp=local(f,x,y);v=lerpArr(bg0,bg1,lp);v[3]=v[3]*(o0+(o1-o0)*lp);stops.push('rgba('+Math.round(v[0])+','+Math.round(v[1])+','+Math.round(v[2])+','+Math.max(0,Math.min(1,v[3])).toFixed(3)+') '+(m/N*100).toFixed(2)+'%');}
          t.el.style.setProperty('background-image','linear-gradient(90deg,'+stops.join(',')+')','important');
          t.el.style.setProperty('background-color','transparent','important');
          t.el.style.setProperty('opacity','1','important');
        }else{
          lp=local(f,t.cx,t.cy);
          for(q=0;q<t.props.length;q++){p=t.props[q];t.el.style.setProperty(NF_CSS[p],fmt(p,lerpArr(t.s[p],t.e[p],lp)),'important');}
        }
      }
      if(!wDone&&f>=wf){wDone=true;root.setAttribute('data-nf-wx',theme);}
    }
    var t0=performance.now();
    run={targets:targets};
    paint(0);
    (function frame(now){
      var u=Math.min(1,(now-t0)/D),f=u<.5?2*u*u:1-2*(1-u)*(1-u);   // đồng hồ chung (nhanh dần rồi chậm dần mềm)
      paint(f);
      if(u<1){runRaf=requestAnimationFrame(frame);}
      else{runRaf=0;endRun();}
    })(t0);
  }
  function spread(theme){
    if(reduced()){endRun();go(theme);return;}
    nightfall(theme);
  }
  inp.addEventListener('change',function(){var t=inp.checked?'dark':'light';try{localStorage.setItem(KEY,t);}catch(e){}spread(t);});   // chỉ đổi khi người dùng chủ động gạt
  ['pointerenter','touchstart','focusin'].forEach(function(ev){el.addEventListener(ev,function(){if(!preloaded){preloaded=true;preload(!inp.checked);}},{passive:true});});   // lần đầu chạm/rê tới nút: nạp sẵn bộ icon của giao diện kia
  addEventListener('storage',function(e){if(e.key===KEY){endRun();go(stored());}});   // đổi ở tab khác -> tab này theo
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
