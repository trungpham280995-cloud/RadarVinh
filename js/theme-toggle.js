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
  function apply(t,animate){
    if(animate){root.classList.add('rvt-anim');clearTimeout(animT);animT=setTimeout(function(){root.classList.remove('rvt-anim');},1000);}
    root.setAttribute('data-theme',t);
    inp.checked=(t==='dark');inp.setAttribute('aria-checked',inp.checked?'true':'false');
    if(meta)meta.setAttribute('content',t==='dark'?'#0b1530':lightMeta);
  }
  inp.addEventListener('change',function(){var t=inp.checked?'dark':'light';try{localStorage.setItem(KEY,t);}catch(e){}apply(t,true);});
  addEventListener('storage',function(e){if(e.key===KEY)apply(stored(),true);});   // đổi ở tab khác -> tab này theo
  apply(stored(),false);

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
    var ready=host.classList.contains('rv-weather-ready')||Date.now()-t0>8000;if(!ready){el.classList.remove('rvt-on');return;}   // chưa hiện widget: chưa cần đo bố cục (tránh ép dựng layout lúc hiệu ứng mở đầu)
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
    var ox=parseFloat(host.style.getPropertyValue('--rvw-ox')),oy=parseFloat(host.style.getPropertyValue('--rvw-oy'));   // chế độ nổi ảnh: nút lùi ra sau quanh đúng tâm khung như bảng thời tiết
    el.style.transformOrigin=(isNaN(ox)||isNaN(oy))?'':(ox-x)+'px '+(oy-y)+'px';
    var key=(mob?'m':'d')+Math.round(x*10)+','+Math.round(y*10);
    el.classList.toggle('rvt--v',mob);
    if(key!==lastKey){lastKey=key;el.style.left=x+'px';el.style.top=y+'px';}
    el.classList.add('rvt-on');
    if(!slideT)slideT=setTimeout(function(){el.classList.add('rvt-slide');},700);   // từ lần đặt đầu tiên mới cho nút trượt êm khi bảng mở/thu (tránh trượt lúc vừa hiện)
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
