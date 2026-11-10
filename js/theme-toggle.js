/* NÚT GẠT NGÀY / ĐÊM (Cloud Shift) — tích hợp với hệ thống ngày/đêm sẵn có của bảng thời tiết (window.RVNeon).
   - Không có giao diện ngày/đêm riêng: gạt nút => RVNeon.setTheme('day'|'night') => mọi khung (bảng, viên thuốc, cả hai hướng) đổi theo, chuyển tiếp mượt.
   - Trạng thái nút luôn lấy từ RVNeon.onTheme (lựa chọn của người dùng hoặc ngày/đêm thật theo dữ liệu): trời tự đổi ngày<->đêm thì nút tự gạt theo.
   - Vị trí: Laptop = góc trên phải, mép trên thẳng với viên thuốc; Mobile dọc = bản dọc ở góc trên phải, mép phải thẳng với viên thuốc. */
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

  /* Gạt nút -> hệ thống ngày/đêm của bảng */
  inp.addEventListener('change',function(){if(window.RVNeon&&RVNeon.setTheme)RVNeon.setTheme(inp.checked?'night':'day');});
  /* Bảng -> nút (không phát lại sự kiện change) */
  function bind(){if(!window.RVNeon||!RVNeon.onTheme)return false;RVNeon.onTheme(function(t){inp.checked=(t==='night');inp.setAttribute('aria-checked',inp.checked?'true':'false');});return true;}
  if(!bind())addEventListener('load',bind);

  /* ---------- Vị trí ---------- */
  var probe=document.createElement('div');probe.style.cssText='position:fixed;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px)';document.body.appendChild(probe);
  var raf=0,lastKey='';
  function box(k){return host.querySelector('[data-box="'+k+'"]');}
  function place(){raf=0;
    if(!host.classList.contains('rv-weather-ready')){el.classList.remove('rvt-on');return;}   // chưa hiện widget: chưa cần đo bố cục (tránh ép dựng layout lúc hiệu ứng mở đầu)
    var mob=root.classList.contains('mobile'),sx=window.pageXOffset||0,sy=window.pageYOffset||0,vw=root.clientWidth;
    var x,y,r;
    if(mob){
      r=(box('m')||{getBoundingClientRect:function(){return {width:0};}}).getBoundingClientRect();
      var right=r.width>0?r.right:vw-10;                                   // mép phải thẳng với viên thuốc Mobile
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
    el.classList.toggle('rvt-on',host.classList.contains('rv-weather-ready'));
  }
  function sched(){if(!raf)raf=requestAnimationFrame(place);}
  addEventListener('resize',sched);addEventListener('orientationchange',sched);addEventListener('scroll',sched,{passive:true});
  if(window.ResizeObserver)new ResizeObserver(sched).observe(root);
  /* widget đổi vị trí/trạng thái (hiện, mở, thu gọn, xoay...) -> tính lại */
  if(window.MutationObserver){
    var mo=new MutationObserver(sched);mo.observe(host,{attributes:true,attributeFilter:['class']});
    [box('d'),box('m')].forEach(function(b){if(b)mo.observe(b,{attributes:true,attributeFilter:['style']});});
    mo.observe(root,{attributes:true,attributeFilter:['class']});
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sched);
  sched();setTimeout(sched,600);setTimeout(sched,2500);
  window.RVThemeToggle={place:sched,el:el};
})();
