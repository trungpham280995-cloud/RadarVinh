/* ===== Widget thời tiết Vinh, Nghệ An (rv-weather) =====
   Dữ liệu : Open-Meteo (https://open-meteo.com) — miễn phí, KHÔNG cần khoá API (không có bí mật nào trong mã). Cấu hình ở object CFG.
   Giờ     : giờ Việt Nam UTC+7 và giờ UTC (tính từ Date.now(), không phụ thuộc múi giờ máy).
   Âm lịch : thuật toán Hồ Ngọc Đức (múi giờ +7, có tháng nhuận).
   Không có dữ liệu thì hiện trạng thái tải/lỗi, KHÔNG bao giờ hiển thị số liệu mẫu như dữ liệu thật. */
(function(){
  'use strict';
  if(window.RVWeather) return;
  var CFG={place:'Vinh, Nghệ An',lat:18.6796,lon:105.6813,tz:'Asia/Ho_Chi_Minh',refreshMs:15*60e3,staleMs:3*3600e3,coldMax:15,openKey:'rvw-open',cacheKey:'rvw-cache-v1'};
  var API='https://api.open-meteo.com/v1/forecast?latitude='+CFG.lat+'&longitude='+CFG.lon+'&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone='+encodeURIComponent(CFG.tz)+'&forecast_days=6&wind_speed_unit=kmh';
  /* ---------- Cảnh nền minh hoạ (theo ảnh mẫu: gradient mượt, quầng sáng, mây mờ; KHÔNG có núi trừ cảnh trời lạnh) ---------- */
  function buildScenes(){
    function R(n){var x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
    var FILT='<linearGradient id="cgw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".62" stop-color="#eaf3ff"/><stop offset="1" stop-color="#bcd5f3"/></linearGradient><filter id="fb1" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.4"/></filter><filter id="fb3" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="3.2"/></filter><filter id="fb5" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="5.5"/></filter>';
    function lg(id,st){var h='<linearGradient id="'+id+'" x1="0" y1="0" x2="0.18" y2="1">';st.forEach(function(s){h+='<stop offset="'+s[0]+'" stop-color="'+s[1]+'"'+(s[2]!=null?' stop-opacity="'+s[2]+'"':'')+'/>';});return h+'</linearGradient>';}
    function rg(id,st){var h='<radialGradient id="'+id+'" cx="45%" cy="42%" r="55%">';st.forEach(function(s){h+='<stop offset="'+s[0]+'" stop-color="'+s[1]+'"'+(s[2]!=null?' stop-opacity="'+s[2]+'"':'')+'/>';});return h+'</radialGradient>';}
    function SK(a,m,b,x,y,z){function st(t,c,d){return [[0,t],[.14,t],[.52,c],[.87,d],[1,d]];}
      return lg('sky',st(a,m,b))+lg('skr',st(x,y,z))+'<linearGradient id="skg" x1="0" y1="0" x2="1" y2="0"><stop offset=".12" stop-color="#000"/><stop offset=".95" stop-color="#fff"/></linearGradient><mask id="skm"><rect width="456" height="180" fill="url(#skg)"/></mask>';}
    function mk(defs,body){return '<svg class="rvw-scene" viewBox="0 0 456 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>'+FILT+defs+'</defs><rect width="456" height="180" fill="url(#sky)"/><rect width="456" height="180" fill="url(#skr)" mask="url(#skm)"/>'+body+'</svg>';}
    function stars(n,seed,x0,y0,x1,y1,mo){var h='<g class="rvt">';for(var i=0;i<n;i++){var x=x0+R(seed+i)*(x1-x0),y=y0+R(seed+i*3+.5)*(y1-y0);h+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(.6+R(seed+i*7)*.9).toFixed(1)+'" fill="#fff" opacity="'+(.3+R(seed+i*5)*(mo||.55)).toFixed(2)+'"/>';}return h+'</g>';}
    function spark(x,y,s,o){return '<path d="M'+x+' '+(y-s)+'v'+2*s+'M'+(x-s)+' '+y+'h'+2*s+'" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="'+o+'"/>';}
    function cloud(c,x,y,sc,fill,o,f){fill=(fill==='#ffffff'||fill==='#f2f8ff')?'url(#cgw)':fill;return '<g class="rvd '+c+'"><g transform="translate('+x+' '+y+') scale('+sc+')" opacity="'+o+'" filter="url(#'+f+')"><ellipse cx="60" cy="34" rx="58" ry="14" fill="'+fill+'"/><circle cx="36" cy="27" r="17" fill="'+fill+'"/><circle cx="64" cy="20" r="22" fill="'+fill+'"/><circle cx="92" cy="28" r="15" fill="'+fill+'"/></g></g>';}
    function sun(cx,cy,r,rays){var h='<g class="body"><circle class="rvs" cx="'+cx+'" cy="'+cy+'" r="'+(r*2.5)+'" fill="url(#sg)"/>';for(var a=0;a<12;a++){var t=a*Math.PI/6,c=Math.cos(t),s=Math.sin(t);h+='<path d="M'+(cx+c*r*1.5).toFixed(1)+' '+(cy+s*r*1.5).toFixed(1)+'L'+(cx+c*r*(a%2?1.8:2.05)).toFixed(1)+' '+(cy+s*r*(a%2?1.8:2.05)).toFixed(1)+'" stroke="#fff3b8" stroke-width="1.3" stroke-linecap="round" opacity="'+(rays||.14)+'"/>';}return h+'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="url(#sc)"/></g>';}
    function moon(cx,cy,r){var k=r/14;return '<g class="body"><circle class="rvs" cx="'+cx+'" cy="'+cy+'" r="'+(r*3.2)+'" fill="url(#mg)"/><g transform="translate('+(cx-19.5*k).toFixed(1)+' '+(cy-20.5*k).toFixed(1)+') scale('+k.toFixed(3)+')"><path d="M34 30A14 14 0 1 1 18 11.2 11.5 11.5 0 0 0 34 30z" fill="url(#mc)"/></g></g>';}
    var SUNDEF=rg('sg',[[0,'#fff6c0',.8],[.4,'#ffe27a',.32],[1,'#ffd35a',0]])+rg('sc',[[0,'#fffbe6'],[.62,'#ffe47e'],[1,'#ffc93c']]);
    function MOONDEF(g,c0,c1){return rg('mg',[[0,g,.24],[.5,g,.07],[1,g,0]])+'<linearGradient id="mc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c0+'"/><stop offset="1" stop-color="'+c1+'"/></linearGradient>';}
    function rain(x0,x1,y0,y1,n,o,seed){var h='<g class="rvr" stroke="rgba(214,232,255,'+o+')" stroke-width="1.1" stroke-linecap="round">';for(var i=0;i<n;i++){var x=x0+R(seed+i)*(x1-x0),y=y0+R(seed+i*3)*(y1-y0),l=9+R(seed+i*5)*9;h+='<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+'l-'+(l*.3).toFixed(1)+' '+l.toFixed(1)+'"/>';}return h+'</g>';}
    function puff(x,y,sc,f,o,hi){return '<g transform="translate('+x+' '+y+') scale('+sc+')" opacity="'+o+'" filter="url(#fb1)"><circle cx="50" cy="22" r="20" fill="#7fa6e8" opacity=".55" filter="url(#fb3)"/><circle cx="60" cy="52" r="34" fill="'+f+'"/><circle cx="34" cy="62" r="26" fill="'+f+'"/><circle cx="92" cy="60" r="28" fill="'+f+'"/><circle cx="62" cy="30" r="26" fill="'+f+'"/><ellipse cx="62" cy="76" rx="62" ry="16" fill="'+f+'"/></g>';}
    var S={};
    S.dawn=mk(SK('#06256f','#03266e','#063780','#042d7d','#033387','#01378c')+MOONDEF('#cfd8ff','#f2f1fa','#c2c6e0'),stars(24,3,0,0,456,120,.5)+moon(207,112,25));
    S.night=mk(SK('#1a3198','#1c2f9e','#333bab','#1f32a7','#263baa','#3745ae')+MOONDEF('#ffc9a8','#ffe6d4','#f6bba2'),stars(22,11,0,0,456,150,.5)+spark(168,40,3,.7)+moon(257,100,24));
    S.morning=mk(SK('#1554a0','#0d59b2','#196fbc','#0e68c0','#1a79cc','#4493d3')+SUNDEF,sun(228,108,23,.14)+'<ellipse cx="250" cy="170" rx="210" ry="22" fill="#d6e8f6" opacity=".6" filter="url(#fb5)"/>'+cloud('a',200,134,1.6,'#e8f2ff',.5,'fb3')+cloud('b',330,128,1.3,'#dcecff',.45,'fb3'));
    S.day=mk(SK('#0f70ca','#177fce','#2d9adc','#067fd3','#1794e1','#189ae4')+SUNDEF,sun(226,98,23,.14)+cloud('a',170,128,.85,'#ffffff',.8,'fb1')+cloud('b',222,134,.5,'#ffffff',.7,'fb1')+'<ellipse cx="250" cy="170" rx="160" ry="14" fill="#d8ecfa" opacity=".5" filter="url(#fb5)"/>');
    S.partly=mk(SK('#1872be','#1c7cc6','#3091d2','#1677cf','#2997db','#32a2e1'),cloud('a',186,62,.6,'#f2f8ff',.92,'fb1')+cloud('b',214,92,.8,'#f2f8ff',.94,'fb1')+cloud('a',40,150,1.2,'#ffffff',.25,'fb5'));
    S.dusk=mk(SK('#5f4f9e','#775295','#9b5d8d','#72539c','#d6726b','#b7637b')+SUNDEF,'<ellipse cx="300" cy="108" rx="260" ry="90" fill="#ff8a5c" opacity=".7" filter="url(#fb5)"/><g class="body"><circle class="rvs" cx="237" cy="104" r="44" fill="#ffc070" opacity=".42" filter="url(#fb3)"/><circle cx="237" cy="104" r="23" fill="#ffd77a"/><circle cx="237" cy="102" r="16" fill="#ffe9a2" opacity=".8" filter="url(#fb1)"/></g>'+cloud('a',-30,80,2.4,'#a85a9c',.5,'fb3')+cloud('b',270,86,2.2,'#d97f90',.5,'fb3')+'<g filter="url(#fb3)"><ellipse cx="237" cy="118" rx="230" ry="9" fill="#7a4a8e" opacity=".68"/><ellipse cx="140" cy="140" rx="190" ry="9" fill="#8a4d9e" opacity=".55"/><ellipse cx="360" cy="132" rx="130" ry="7" fill="#7a4a8e" opacity=".5"/></g>');
    S.cloudy=mk(SK('#1e6aae','#2272b2','#3987c1','#266eb5','#217bc0','#1b75b5'),cloud('b',120,54,2.0,'#a8c8f0',.2,'fb3')+cloud('a',300,26,2.2,'#bcd4f4',.16,'fb5')+cloud('a',50,112,2.2,'#8fb4e8',.16,'fb5')+cloud('b',200,92,1.4,'#9cc0ee',.16,'fb3'));
    S.rain=mk(SK('#082f78','#09367e','#114a91','#104a98','#11519b','#17569e')+lg('pf',[[0,'#4a74c6'],[1,'#27529f']]),puff(176,16,1.2,'url(#pf)',.62,'none')+puff(222,52,.8,'url(#pf)',.5,'none')+rain(190,320,96,172,34,.2,5));
    S.nightrain=mk(SK('#06347a','#09377c','#0e4387','#043383','#0b398b','#11428f'),stars(8,21,0,0,456,60,.3)+'<ellipse cx="250" cy="40" rx="230" ry="26" fill="#0a3a86" opacity=".5" filter="url(#fb5)"/>'+rain(60,450,40,172,46,.24,9));
    S.nightcloudy=mk(SK('#162b8a','#182a8e','#293398','#1a2c95','#1f3398','#2c3a9a'),stars(18,31,0,0,456,100,.5)+cloud('b',30,40,2,'#3c60b4',.55,'fb3')+cloud('a',240,34,1.9,'#3c60b4',.55,'fb3')+cloud('b',130,102,1.5,'#4a70c0',.45,'fb3'));
    var MT=lg('m1',[[0,'#d3e6fb'],[.2,'#86afe0'],[1,'#2a5ca6']])+lg('m2',[[0,'#5b8dd2'],[1,'#234c92']]);
    S.cold=mk(SK('#1766b3','#2271b7','#3283c6','#358ed2','#6cabd9','#4997d1')+MT,spark(300,24,3,.85)+'<g filter="url(#fb1)"><path d="M236 172L288 120 310 132 330 108 372 152 412 172Z" fill="url(#m2)" opacity=".85"/><path d="M84 172L136 122 160 98 176 70 186 38 196 60 204 52 216 76 232 88 246 108 262 122 278 110 294 120 314 134 342 154 384 172Z" fill="url(#m1)"/><path d="M186 38L196 60 204 52 216 76 232 88 246 108 262 122 214 140 204 172 250 172Z" fill="#1f4c92" opacity=".4"/><path d="M186 38L176 70 184 66 190 82 198 62 196 60Z" fill="#fff" opacity=".88"/><path d="M216 76L208 92 216 88 222 98 230 86Z" fill="#fff" opacity=".5"/></g><ellipse cx="240" cy="172" rx="190" ry="14" fill="#7fb0e4" opacity=".4" filter="url(#fb5)"/>');
    S.coldnight=mk(SK('#092248','#0b2449','#0f284c','#0f2a4f','#1b3050','#142c4e')+MOONDEF('#cfe0ff','#eef3ff','#b9cbe8')+lg('m1',[[0,'#cfe3ff'],[.3,'#6f9ad2'],[1,'#27508f']])+lg('m2',[[0,'#8fb2e2'],[1,'#27508f']]),stars(34,41,0,0,456,110,.55)+moon(300,52,13)+'<g filter="url(#fb1)" opacity=".95"><path d="M122 162L186 60l14 18 14-8 50 92z" fill="url(#m1)"/><path d="M205 162l64-52 32 40 30 12z" fill="url(#m2)"/></g>');
    return S;}
  var SC=buildScenes(), IC={"sun": "<svg class=\"\" viewBox=\"0 0 48 48\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"24\" cy=\"24\" r=\"9\" fill=\"url(#gSun)\"/><g stroke=\"#ffcf4a\" stroke-width=\"2.6\" stroke-linecap=\"round\"><path d=\"M24 6v4M24 38v4M6 24h4M38 24h4M11.3 11.3l2.8 2.8M33.9 33.9l2.8 2.8M11.3 36.7l2.8-2.8M33.9 14.1l2.8-2.8\"/></g></svg>", "moon": "<svg class=\"\" viewBox=\"0 0 48 48\" fill=\"none\" aria-hidden=\"true\"><path d=\"M33 31a14 14 0 1 1-13-21 11 11 0 0 0 13 21z\" fill=\"url(#gMoon)\"/><path d=\"M38 12v4M36 14h4\" stroke=\"#fff3c4\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></svg>", "cloud": "<svg class=\"\" viewBox=\"0 0 48 48\" fill=\"none\" aria-hidden=\"true\"><path d=\"M14 36h20a8 8 0 0 0 1.5-15.9A11 11 0 0 0 14.2 18 9 9 0 0 0 14 36z\" fill=\"url(#gCloud)\" stroke=\"rgba(255,255,255,.7)\" stroke-width=\"1\"/></svg>", "cloudd": "<svg class=\"\" viewBox=\"0 0 48 48\" fill=\"none\" aria-hidden=\"true\"><path d=\"M14 36h20a8 8 0 0 0 1.5-15.9A11 11 0 0 0 14.2 18 9 9 0 0 0 14 36z\" fill=\"url(#gCloudD)\" stroke=\"rgba(255,255,255,.4)\" stroke-width=\"1\"/></svg>", "partly": "<svg class=\"\" viewBox=\"0 0 48 48\" fill=\"none\" aria-hidden=\"true\"><g transform=\"translate(-3 -4) scale(.72)\"><circle cx=\"24\" cy=\"24\" r=\"9\" fill=\"url(#gSun)\"/><g stroke=\"#ffcf4a\" stroke-width=\"2.6\" stroke-linecap=\"round\"><path d=\"M24 6v4M24 38v4M6 24h4M38 24h4M11.3 11.3l2.8 2.8M33.9 33.9l2.8 2.8M11.3 36.7l2.8-2.8M33.9 14.1l2.8-2.8\"/></g></g><path d=\"M14 36h20a8 8 0 0 0 1.5-15.9A11 11 0 0 0 14.2 18 9 9 0 0 0 14 36z\" transform=\"translate(4 4)\" fill=\"url(#gCloud)\" stroke=\"rgba(255,255,255,.7)\" stroke-width=\"1\"/></svg>", "partlyn": "<svg class=\"\" viewBox=\"0 0 48 48\" fill=\"none\" aria-hidden=\"true\"><g transform=\"translate(-2 -3) scale(.7)\"><path d=\"M33 31a14 14 0 1 1-13-21 11 11 0 0 0 13 21z\" fill=\"url(#gMoon)\"/><path d=\"M38 12v4M36 14h4\" stroke=\"#fff3c4\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></g><path d=\"M14 36h20a8 8 0 0 0 1.5-15.9A11 11 0 0 0 14.2 18 9 9 0 0 0 14 36z\" transform=\"translate(4 4)\" fill=\"url(#gCloud)\" stroke=\"rgba(255,255,255,.7)\" stroke-width=\"1\"/></svg>", "rain": "<svg class=\"\" viewBox=\"0 0 48 48\" fill=\"none\" aria-hidden=\"true\"><path d=\"M14 36h20a8 8 0 0 0 1.5-15.9A11 11 0 0 0 14.2 18 9 9 0 0 0 14 36z\" transform=\"translate(0 -4)\" fill=\"url(#gCloudD)\" stroke=\"rgba(255,255,255,.45)\" stroke-width=\"1\"/><g stroke=\"url(#gDrop)\" stroke-width=\"2.6\" stroke-linecap=\"round\"><path d=\"M17 36l-2 5M25 36l-2 5M33 36l-2 5\"/></g></svg>", "snow": "<svg class=\"\" viewBox=\"0 0 48 48\" fill=\"none\" aria-hidden=\"true\"><g stroke=\"#e8f6ff\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18\"/><path d=\"M19.5 9.5L24 13l4.5-3.5M19.5 38.5L24 35l4.5 3.5M9 21.5l5.6-.8-1.2-5.4M39 26.5l-5.6.8 1.2 5.4M9 26.5l5.6.8-1.2 5.4M39 21.5l-5.6-.8 1.2-5.4\"/></g></svg>"}, PC={"dawn": ["#2656c8", "#14388f"], "morning": ["#3a8fe6", "#1f62c4"], "day": ["#2a78e0", "#1750b8"], "dusk": ["#a0507c", "#4a3478"], "night": ["#2656c8", "#14388f"], "partly": ["#3a82df", "#1d58bd"], "cloudy": ["#5f82ac", "#3a5a85"], "rain": ["#3a5a92", "#1e3466"], "nightrain": ["#244a9e", "#12306f"], "nightcloudy": ["#2650b4", "#143a85"], "cold": ["#5a92c2", "#33638f"], "coldnight": ["#1e3c78", "#0e2250"]};
  var BG={"dawn":["#06256f","#063780","#022666","#042b6f"],"night":["#1a3198","#333bab","#19307c","#132f7b"],"morning":["#1554a0","#196fbc","#074d92","#084e94"],"day":["#0f70ca","#2d9adc","#0963ae","#085ba7"],"partly":["#1872be","#3091d2","#0b5ca5","#0d5ca5"],"dusk":["#5f4f9e","#9b5d8d","#4b3a6f","#333374"],"cloudy":["#1e6aae","#3987c1","#12528e","#084c8b"],"rain":["#082f78","#114a91","#033a75","#043574"],"nightrain":["#06347a","#0e4387","#043268","#04326f"],"nightcloudy":["#162b8a","#293398","#152a75","#112a74"],"cold":["#1766b3","#3283c6","#125797","#0d5395"],"coldnight":["#092248","#0f284c","#081e42","#071e42"]};
  function uniq(h,i){var ids=[];h.replace(/ id="([^"]+)"/g,function(m,a){ids.push(a);return m;});ids.forEach(function(a){h=h.replace(new RegExp('(id="|url\\(#)'+a+'(?=["\\)])','g'),'$1'+a+'_'+i);});return h;}   // id riêng cho từng bản (máy tính / điện thoại) để không trùng
  var PI=(function(){
    var CL=function(x,y,sc,f,o){return '<g transform="translate('+x+' '+y+') scale('+sc+')" opacity="'+o+'"><path d="M10 28h26a7.5 7.5 0 0 0 1.4-14.9A10.5 10.5 0 0 0 17.6 11 8.5 8.5 0 0 0 10 28z" fill="url(#'+f+')" stroke="rgba(255,255,255,.55)" stroke-width="1"/></g>';};
    var MOON='<g transform="translate(3.7 -4.4) scale(1.35)"><path d="M34 30A14 14 0 1 1 18 11.2 11.5 11.5 0 0 0 34 30z" fill="url(#gMoon)"/></g>';
    var SPK='<path d="M53 8.5v7M49.5 12h7" stroke="#fff3c4" stroke-width="1.6" stroke-linecap="round"/><path d="M8 26v5M5.5 28.5h5" stroke="#fff3c4" stroke-width="1.3" stroke-linecap="round" opacity=".85"/>';
    return{
      moon:'<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="28" cy="26" r="26" fill="url(#gGlowY)" opacity=".5"/>'+MOON+SPK+CL(-1,26,.95,'gCloudN',.98)+CL(22,29,.85,'gCloudN',1)+'</svg>',
      sun:'<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="28" cy="26" r="24" fill="url(#gGlowY)" opacity=".6"/><g transform="translate(3 -1) scale(1.15)"><circle cx="24" cy="22" r="9" fill="url(#gSun)"/><g stroke="#ffcf4a" stroke-width="2.6" stroke-linecap="round"><path d="M24 4v4M24 36v0M6 22h4M38 22h4M11.3 9.3l2.8 2.8M33.9 9.3l-2.8 2.8M11.3 34.7M33.9 34.7"/></g></g>'+CL(8,28,1,'gCloud',.98)+'</svg>'};
  })();
  /* biểu tượng kính xanh theo thiết kế: mây xanh cyan, trăng trắng-xanh có sao */
  var ICB={},BIGIC={};
  (function(){for(var k in IC)ICB[k]=IC[k].replace(/url\(#gCloud\)/g,'url(#gCloudB)');
    ICB.moon='<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="21" cy="24" r="19" fill="url(#gGlowB)" opacity=".7"/><path d="M34 30A14 14 0 1 1 18 11.2 11.5 11.5 0 0 0 34 30z" transform="translate(3 2)" fill="url(#gMoonB)"/><path d="M38 9v5M35.5 11.5h5" stroke="#d8f0ff" stroke-width="1.5" stroke-linecap="round"/><path d="M40 24v3M38.5 25.5h3" stroke="#d8f0ff" stroke-width="1.2" stroke-linecap="round"/></svg>';
    for(k in ICB)BIGIC[k]=ICB[k];
    BIGIC.moon=PI.moon.replace('url(#gMoon)','url(#gMoonB)').replace(/gCloudN/g,'gCloudB').replace('url(#gGlowY)','url(#gGlowB)').replace(/#fff3c4/g,'#d8f0ff');
    BIGIC.sun=PI.sun.replace(/url\(#gCloud\)/g,'url(#gCloudB)');})();
  var root=document.documentElement;
  function INT(d){return Math.floor(d);} function p2(n){return (n<10?'0':'')+n;}

  /* ---------- Âm lịch Việt Nam (Hồ Ngọc Đức), UTC+7 ---------- */
  function jdFromDate(dd,mm,yy){var a=INT((14-mm)/12),y=yy+4800-a,m=mm+12*a-3;var jd=dd+INT((153*m+2)/5)+365*y+INT(y/4)-INT(y/100)+INT(y/400)-32045;if(jd<2299161)jd=dd+INT((153*m+2)/5)+365*y+INT(y/4)-32083;return jd;}
  function newMoon(k){var PI=Math.PI,T=k/1236.85,T2=T*T,T3=T2*T,dr=PI/180;var Jd1=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;Jd1+=0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);
    var M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3,Mpr=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3,F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;
    var C1=(0.1734-0.000393*T)*Math.sin(M*dr)+0.0021*Math.sin(2*dr*M);C1-=0.4068*Math.sin(Mpr*dr);C1+=0.0161*Math.sin(dr*2*Mpr);C1-=0.0004*Math.sin(dr*3*Mpr);C1+=0.0104*Math.sin(dr*2*F);C1-=0.0051*Math.sin(dr*(M+Mpr));C1-=0.0074*Math.sin(dr*(M-Mpr));
    C1+=0.0004*Math.sin(dr*(2*F+M));C1-=0.0004*Math.sin(dr*(2*F-M));C1-=0.0006*Math.sin(dr*(2*F+Mpr));C1+=0.0010*Math.sin(dr*(2*F-Mpr));C1+=0.0005*Math.sin(dr*(2*Mpr+M));
    var dt=T<-11?0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3:-0.000278+0.000265*T+0.000262*T2;return Jd1+C1-dt;}
  function sunLongitude(jdn){var PI=Math.PI,T=(jdn-2451545.0)/36525,T2=T*T,dr=PI/180;var M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2,L0=280.46645+36000.76983*T+0.0003032*T2;
    var DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M)+(0.019993-0.000101*T)*Math.sin(dr*2*M)+0.000290*Math.sin(dr*3*M);var L=(L0+DL)*dr;return L-PI*2*INT(L/(PI*2));}
  function sunLong(day,tz){return INT(sunLongitude(day-0.5-tz/24)/Math.PI*6);}
  function newMoonDay(k,tz){return INT(newMoon(k)+0.5+tz/24);}
  function lunarMonth11(yy,tz){var off=jdFromDate(31,12,yy)-2415021,k=INT(off/29.530588853),nm=newMoonDay(k,tz);if(sunLong(nm,tz)>=9)nm=newMoonDay(k-1,tz);return nm;}
  function leapOffset(a11,tz){var k=INT((a11-2415021.076998695)/29.530588853+0.5),last=0,i=1,arc=sunLong(newMoonDay(k+i,tz),tz);do{last=arc;i++;arc=sunLong(newMoonDay(k+i,tz),tz);}while(arc!==last&&i<14);return i-1;}
  function solar2lunar(dd,mm,yy,tz){tz=tz==null?7:tz;var dayNumber=jdFromDate(dd,mm,yy),k=INT((dayNumber-2415021.076998695)/29.530588853),monthStart=newMoonDay(k+1,tz);if(monthStart>dayNumber)monthStart=newMoonDay(k,tz);
    var a11=lunarMonth11(yy,tz),b11=a11,lunarYear;if(a11>=monthStart){lunarYear=yy;a11=lunarMonth11(yy-1,tz);}else{lunarYear=yy+1;b11=lunarMonth11(yy+1,tz);}
    var lunarDay=dayNumber-monthStart+1,diff=INT((monthStart-a11)/29),leap=0,lunarMonth=diff+11;
    if(b11-a11>365){var ld=leapOffset(a11,tz);if(diff>=ld){lunarMonth=diff+10;if(diff===ld)leap=1;}}
    if(lunarMonth>12)lunarMonth-=12;if(lunarMonth>=11&&diff<4)lunarYear-=1;return{day:lunarDay,month:lunarMonth,year:lunarYear,leap:leap};}
  var CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'],CHI=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  function canChi(y){return CAN[(y+6)%10]+' '+CHI[(y+8)%12];}

  /* ---------- Giờ VN (UTC+7) / UTC ---------- */
  var WD=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'],WDS=['CN','T2','T3','T4','T5','T6','T7'];
  function nowParts(ms){ms=ms==null?Date.now():ms;var v=new Date(ms+7*3600e3),u=new Date(ms);
    return{vn:{y:v.getUTCFullYear(),mo:v.getUTCMonth()+1,d:v.getUTCDate(),h:v.getUTCHours(),mi:v.getUTCMinutes(),s:v.getUTCSeconds(),wd:v.getUTCDay()},utc:{y:u.getUTCFullYear(),mo:u.getUTCMonth()+1,d:u.getUTCDate(),h:u.getUTCHours(),mi:u.getUTCMinutes(),s:u.getUTCSeconds()}};}

  /* ---------- Mã thời tiết WMO ---------- */
  function describe(c,night){c=+c;
    if(c===0)return{g:'clear',t:night?'Trời quang':'Trời nắng'};if(c===1)return{g:'clear',t:'Ít mây'};if(c===2)return{g:'partly',t:'Mây rải rác'};if(c===3)return{g:'cloudy',t:'Nhiều mây'};
    if(c===45||c===48)return{g:'fog',t:'Sương mù'};
    if(c>=51&&c<=55)return{g:'drizzle',t:c===51?'Mưa phùn nhẹ':c===53?'Mưa phùn':'Mưa phùn dày'};if(c===56||c===57)return{g:'drizzle',t:'Mưa phùn lạnh'};
    if(c===61)return{g:'rain',t:'Mưa nhỏ'};if(c===63)return{g:'rain',t:'Mưa vừa'};if(c===65)return{g:'rain',t:'Mưa to'};if(c===66||c===67)return{g:'rain',t:'Mưa lạnh'};
    if(c>=71&&c<=77||c===85||c===86)return{g:'cloudy',t:'Tuyết'};
    if(c===80)return{g:'rain',t:'Mưa rào nhẹ'};if(c===81)return{g:'rain',t:'Mưa rào'};if(c===82)return{g:'rain',t:'Mưa rào rất to'};
    if(c===95)return{g:'storm',t:'Dông'};if(c===96||c===99)return{g:'storm',t:'Dông, mưa đá'};return{g:'cloudy',t:'Nhiều mây'};}
  /* buổi trong ngày: đêm 18:00–05:30 | bình minh 05:30–07:00 | sáng 07:00–10:30 | trưa–chiều 10:30–16:30 | hoàng hôn 16:30–18:00 */
  function todOf(vn){var m=vn.h*60+vn.mi;if(m>=1080||m<330)return'night';if(m<420)return'dawn';if(m<630)return'morning';if(m<990)return'day';return'dusk';}
  function themeFor(vn,d){
    var tod=todOf(vn),night=tod==='night'||tod==='dawn',g=d?describe(d.code,night).g:'clear',cold=!!d&&d.t<=CFG.coldMax;
    var r={tod:tod,night:night,theme:tod,ic:night?'moon':'sun',cold:false};
    if(!d)return r;
    if(g==='rain'||g==='drizzle'||g==='storm'){r.theme=night?'nightrain':'rain';r.ic='rain';return r;}
    if(cold){r.theme=night?'coldnight':'cold';r.ic='snow';r.cold=true;return r;}
    if(g==='cloudy'||g==='fog'){r.theme=night?'nightcloudy':'cloudy';r.ic='cloud';return r;}
    if(g==='partly'){r.ic=night?'partlyn':'partly';r.theme=night?(tod==='dawn'?'dawn':'night'):(tod==='morning'||tod==='day')?'partly':tod;return r;}
    return r;}
  var S='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var CHEV_U=S+'<path d="M6 15l6-6 6 6"/></svg>',CAL=S.replace('2.2','1.8')+'<rect x="4" y="5.5" width="16" height="14" rx="3"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/></svg>';
  var CHEV_D=S+'<path d="M6 9l6 6 6-6"/></svg>',CLK=S.replace('2.2','1.8')+'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
  var PIN=S.replace('2.2','1.8')+'<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',GLOBE=S.replace('2.2','1.6')+'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3 3.2 15 0 18M12 3c-3.2 3-3.2 15 0 18"/></svg>';
  var M_HUM=S.replace('2.2','1.9')+'<path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.7 12 3.5 12 3.5z"/></svg>',M_WIND=S.replace('2.2','1.9')+'<path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7"/></svg>',M_PRES=S.replace('2.2','1.9')+'<circle cx="12" cy="13" r="8"/><path d="M12 13l3.5-3.5M8 7.5l1 1.2M16 7.5l-1 1.2"/></svg>';

  /* ---------- DOM ---------- */
  var DEFS='<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><radialGradient id="gSun" cx="40%" cy="38%" r="70%"><stop offset="0" stop-color="#fff6b8"/><stop offset=".55" stop-color="#ffd24a"/><stop offset="1" stop-color="#ff9a1f"/></radialGradient><linearGradient id="gMoon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#f0b84a"/></linearGradient><linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfe0f6"/></linearGradient><linearGradient id="gCloudD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c8de"/><stop offset="1" stop-color="#7f93b3"/></linearGradient><linearGradient id="gDrop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd2ff"/><stop offset="1" stop-color="#3f8fe8"/></linearGradient><radialGradient id="gGlowY" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff2b0" stop-opacity=".95"/><stop offset=".4" stop-color="#ffd35a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd35a" stop-opacity="0"/></radialGradient><radialGradient id="gGlowO" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".95"/><stop offset=".4" stop-color="#ff9a5a" stop-opacity=".5"/><stop offset="1" stop-color="#ff7a4a" stop-opacity="0"/></radialGradient><linearGradient id="gCloudN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9db8f5"/><stop offset="1" stop-color="#4a66c8"/></linearGradient><radialGradient id="gGlowW" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#eaf2ff" stop-opacity=".85"/><stop offset=".45" stop-color="#9fbcff" stop-opacity=".35"/><stop offset="1" stop-color="#9fbcff" stop-opacity="0"/></radialGradient><linearGradient id="gCloudB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6e0ff"/><stop offset="1" stop-color="#2f84e8"/></linearGradient><linearGradient id="gMoonB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2fbff"/><stop offset="1" stop-color="#6bbcff"/></linearGradient><radialGradient id="gGlowB" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7fd0ff" stop-opacity=".8"/><stop offset=".5" stop-color="#4aa8ff" stop-opacity=".3"/><stop offset="1" stop-color="#4aa8ff" stop-opacity="0"/></radialGradient></defs></svg>';
  var host=document.createElement('div');host.id='rv-weather';host.className='rv-weather';host.setAttribute('data-state','loading');host.setAttribute('data-theme','day');
  var NAME=CFG.place, SCN='<div class="rv-weather-scene" data-scene aria-hidden="true"></div><div class="rv-weather-scrim"></div>';
  host.innerHTML=DEFS+
   '<div class="rv-weather-box rv-weather-d" data-box="d">'+
    '<div class="rvx-glow"></div><section class="rv-weather-card rv-weather-d" id="rvw-card-d" role="region" aria-label="Thời tiết, giờ và lịch tại '+NAME+'">'+SCN+'<div class="rvx-glass"></div><div class="rvx-body">'+
      '<div class="rvx-head"><div class="rvx-loc"><span class="rvx-pin">'+PIN+'</span><span class="rvx-lt"><b>'+NAME+'</b><small>Việt Nam (UTC+7)</small></span></div><div class="rvx-clock"><span class="rvx-t" data-f="time">--:--</span><span class="rvx-s" data-f="sec">00</span></div><button class="rv-weather-close" type="button" aria-label="Thu gọn thời tiết" title="Thu gọn (Esc)">'+CHEV_U+'</button></div>'+
      '<div class="rvx-main"><div class="rvx-now"><span class="rvx-ic" data-f="ci"></span><span class="rvx-tx"><span class="rvx-temp" data-f="tempc">--<small>°C</small></span><span class="rvx-cond" data-f="cond"></span><span class="rvx-feel" data-f="feel"></span></span></div>'+
      '<div class="rvx-when"><div class="rvx-date" data-f="date"></div><div class="rvx-lunar" data-f="lunar"></div><div class="rvx-zones"><span class="rvx-zone">'+GLOBE+'<span><small>Giờ VN (UTC+7)</small><b data-f="time">--:--</b></span></span><span class="rvx-zone">'+GLOBE+'<span><small>Giờ UTC</small><b data-f="utc">--:--</b></span></span></div></div></div>'+
      '<div class="rvx-chips" data-f="met"></div><div class="rvx-days" data-f="fc5"></div><div class="rv-weather-err" role="status" data-f="err"></div></div></section>'+
    '<button class="rv-weather-pill rv-weather-d" type="button" aria-expanded="false" aria-controls="rvw-card-d" title="Xem dự báo thời tiết"><span class="pi" data-f="pi"></span><span class="pb"><span class="pt" data-f="ptemp">--°</span><span class="pcd" data-f="pcond">…</span></span><span class="sep"></span><span class="pb"><span class="pm" data-f="time">--:--</span><span class="pdt" data-f="pfull"></span></span><span class="sep"></span><span class="pcal">'+CAL+'<span class="pb"><span class="pl">Ngày mai</span><span class="pc" data-f="ptmr">--°/--°</span></span></span><span class="pv">'+CHEV_D+'</span></button>'+
   '</div>'+
   '<div class="rv-weather-box rv-weather-m" data-box="m">'+
    '<div class="rvx-glow"></div><section class="rv-weather-card rv-weather-m" id="rvw-card-m" role="region" aria-label="Thời tiết, giờ và lịch tại '+NAME+'">'+SCN+'<div class="rvx-glass"></div><div class="rvx-body">'+
      '<div class="rvx-head"><div class="rvx-loc"><span class="rvx-pin">'+PIN+'</span><span class="rvx-lt"><b>'+NAME+'</b><small>Việt Nam (UTC+7)</small></span></div><button class="rv-weather-close" type="button" aria-label="Thu gọn thời tiết" title="Thu gọn (Esc)">'+CHEV_U+'</button></div>'+
      '<div class="rvx-now"><span class="rvx-ic" data-f="ci"></span><span class="rvx-tx"><span class="rvx-temp" data-f="tempc">--<small>°C</small></span><span class="rvx-cond" data-f="cond"></span><span class="rvx-feel" data-f="feel"></span></span></div>'+
      '<div class="rvx-when"><div class="rvx-clock"><span class="rvx-t" data-f="time">--:--</span><span class="rvx-s" data-f="sec">00</span></div><div class="rvx-date" data-f="date"></div><div class="rvx-lunar" data-f="lunar"></div><div class="rvx-zones"><span class="rvx-zone"><span><small>Giờ VN</small><b data-f="time">--:--</b></span></span><span class="rvx-zone"><span><small>Giờ UTC</small><b data-f="utc">--:--</b></span></span></div></div>'+
      '<div class="rvx-chips" data-f="met"></div><div class="rvx-days" data-f="fc3"></div><div class="rv-weather-err" role="status" data-f="err"></div></div></section>'+
    '<button class="rv-weather-pill rv-weather-m" type="button" aria-expanded="false" aria-controls="rvw-card-m" title="Xem dự báo thời tiết"><span class="pi" data-f="pi"></span><span class="pt" data-f="ptemp">--°</span><span class="pm" data-f="time">--:--</span><span class="pdt" data-f="pdm"></span><span class="pv">'+CHEV_D+'</span></button>'+
   '</div>';
  document.body.appendChild(host);
  var F={};[].forEach.call(host.querySelectorAll('[data-f]'),function(n){(F[n.getAttribute('data-f')]=F[n.getAttribute('data-f')]||[]).push(n);});
  function setF(k,v,html){(F[k]||[]).forEach(function(n){if(html){if(n._h!==v){n.innerHTML=v;n._h=v;}}else if(n.textContent!==v)n.textContent=v;});}
  var boxD=host.querySelector('[data-box="d"]'),boxM=host.querySelector('[data-box="m"]');
  var pills=[].slice.call(host.querySelectorAll('.rv-weather-pill')),cards=[].slice.call(host.querySelectorAll('.rv-weather-card')),closes=[].slice.call(host.querySelectorAll('.rv-weather-close')),scenes=[].slice.call(host.querySelectorAll('[data-scene]'));
  host.addEventListener('pointerdown',function(e){e.stopPropagation();});   // nhấn giữ trên widget không kích hoạt chế độ nổi ảnh của trang

  /* ---------- Mở / thu gọn ---------- */
  var open=false;
  function isMob(){return root.classList.contains('mobile');}
  function setOpen(o,save,focus){
    if(o&&!open&&!isMob()&&window.RVNeon&&RVNeon.prewarm){try{RVNeon.prewarm();}catch(e){}}   // cập nhật nội dung/kích thước bảng trước, để việc nặng không rơi vào giữa chuyển động mở
    open=!!o;host.classList.toggle('rv-weather-open',open);
    pills.forEach(function(p){p.setAttribute('aria-expanded',String(open));p.setAttribute('aria-label',pillLabel()+(open?'':' — bấm để mở'));if('inert' in p)p.inert=open;});
    cards.forEach(function(c){c.setAttribute('aria-hidden',String(!open));if('inert' in c)c.inert=!open;});
    if(save){try{localStorage.setItem(CFG.openKey,open?'1':'0');}catch(e){}}
    if(focus){setTimeout(function(){var el=open?host.querySelector((isMob()?'.rv-weather-m ':'.rv-weather-d ')+'.rv-weather-close'):host.querySelector('.rv-weather-pill'+(isMob()?'.rv-weather-m':'.rv-weather-d'));if(el&&el.offsetParent!==null)el.focus({preventScroll:true});},open?120:380);}
    if(open)tick(true);}
  pills.forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();setOpen(true,true,true);});});
  closes.forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();setOpen(false,true,true);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open){var inside=host.contains(document.activeElement);setOpen(false,true,inside);}});
  var pref=null;try{pref=localStorage.getItem(CFG.openKey);}catch(e){}
  setOpen(pref==null?!isMob():pref==='1',false,false);                       // lần đầu: máy tính mở sẵn; điện thoại thu gọn (không che nút) — nhớ lựa chọn của người dùng

  /* ---------- Dữ liệu thời tiết ---------- */
  var data=null,errState=false,attempts=0,loadTimer=0,inflight=false,theme='day',themeKey='';
  function num(v){return typeof v==='number'&&isFinite(v);}
  function validate(j){
    var c=j&&j.current,dl=j&&j.daily;if(!c||!dl||!dl.time||dl.time.length<6)return null;
    if(!num(c.temperature_2m)||!num(c.weather_code))return null;
    for(var i=0;i<6;i++){if(!num(dl.temperature_2m_max[i])||!num(dl.temperature_2m_min[i])||!num(dl.weather_code[i]))return null;}
    var fc=[];for(i=0;i<=5;i++){var m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(dl.time[i]);if(!m)return null;var y=+m[1],mo=+m[2],d=+m[3],l=solar2lunar(d,mo,y,7);
      fc.push({d:d,mo:mo,wd:new Date(Date.UTC(y,mo-1,d)).getUTCDay(),lunar:l.day+'/'+l.month,leap:!!l.leap,code:dl.weather_code[i],hi:Math.round(dl.temperature_2m_max[i]),lo:Math.round(dl.temperature_2m_min[i])});}
    return{t:Math.round(c.temperature_2m),hum:num(c.relative_humidity_2m)?Math.round(c.relative_humidity_2m):null,wind:num(c.wind_speed_10m)?Math.round(c.wind_speed_10m):null,pres:num(c.pressure_msl)?Math.round(c.pressure_msl):null,
      code:c.weather_code,obs:c.time,hi:Math.round(dl.temperature_2m_max[0]),lo:Math.round(dl.temperature_2m_min[0]),days:fc,fc:fc.slice(1),feel:num(c.apparent_temperature)?Math.round(c.apparent_temperature):null,wdir:num(c.wind_direction_10m)?compass(c.wind_direction_10m):null,at:Date.now(),stale:false};}
  function compass(d){var n=['Bắc','Đông Bắc','Đông','Đông Nam','Nam','Tây Nam','Tây','Tây Bắc'];return n[Math.round(((d%360)+360)%360/45)%8];}   // hướng gió = hướng gió THỔI TỚI TỪ (quy ước khí tượng)
  function tc(t){return String(t).toLowerCase().replace(/(^|\s)\S/g,function(m){return m.toUpperCase();});}
  function loadCache(){try{var o=JSON.parse(localStorage.getItem(CFG.cacheKey)||'null');if(o&&num(o.t)&&o.fc&&o.fc.length===5&&o.days&&o.days.length===6&&Date.now()-o.at<CFG.staleMs){o.stale=true;return o;}}catch(e){}return null;}
  function schedule(ms){clearTimeout(loadTimer);loadTimer=setTimeout(load,ms);}
  function load(){
    if(inflight)return;inflight=true;var ctl=('AbortController' in window)?new AbortController():null,to=setTimeout(function(){if(ctl)ctl.abort();},12000);
    fetch(API,{cache:'no-store',signal:ctl?ctl.signal:undefined}).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json();})
    .then(function(j){var v=validate(j);if(!v)throw new Error('bad data');data=v;attempts=0;errState=false;try{localStorage.setItem(CFG.cacheKey,JSON.stringify(v));}catch(e){}render();schedule(CFG.refreshMs);})
    .catch(function(){attempts++;var c=data?null:loadCache();if(c){data=c;errState=false;}else if(data){data.stale=true;}else errState=true;render();schedule(Math.min(300e3,30e3*Math.pow(2,attempts-1)));})
    .then(function(){clearTimeout(to);inflight=false;});}

  /* ---------- Hiển thị ---------- */
  function pillLabel(){var n=nowParts().vn;return 'Thời tiết '+NAME+(data?': '+data.t+' độ, '+describe(data.code,todOf(n)==='night'||todOf(n)==='dawn').t:'')+', '+p2(n.h)+':'+p2(n.mi)+' '+WD[n.wd]+' '+p2(n.d)+'/'+p2(n.mo);}
  function metrics(){var h='';if(data&&data.hum!=null)h+='<span class="rvx-chip" title="Độ ẩm">'+M_HUM+'<span><small>Độ ẩm</small><b>'+data.hum+'%</b></span></span>';if(data&&data.wind!=null)h+='<span class="rvx-chip" title="Sức gió">'+M_WIND+'<span><small>Gió'+(data.wdir?' · Hướng '+data.wdir:'')+'</small><b>'+data.wind+' km/h</b></span></span>';if(data&&data.pres!=null)h+='<span class="rvx-chip" title="Áp suất">'+M_PRES+'<span><small>Áp suất</small><b>'+data.pres+' hPa</b></span></span>';return h;}
  function fcHtml(n,mobile){var h='';
    if(!data)return '<div class="rvx-empty">Chưa có dữ liệu dự báo</div>';
    var tn=todOf(nowParts().vn),nightNow=tn==='night'||tn==='dawn';
    for(var i=0;i<n;i++){var f=data.days[i],d=describe(f.code,false),isN=i===0&&nightNow,
        key=d.g==='clear'?(isN?'moon':'sun'):d.g==='partly'?(isN?'partlyn':'partly'):(d.g==='rain'||d.g==='drizzle'||d.g==='storm')?'rain':'cloud',ic=ICB[key]||ICB.cloud,
        aria=WD[f.wd]+' '+p2(f.d)+'/'+p2(f.mo)+', âm lịch '+f.lunar+(f.leap?' nhuận':'')+', '+d.t+', thấp '+f.lo+' độ, cao '+f.hi+' độ';
      h+='<div class="rvx-day'+(i===0?' today':'')+'" role="group" aria-label="'+aria+'"><b>'+WD[f.wd]+'</b><span>'+p2(f.d)+'/'+p2(f.mo)+'</span><div class="rvx-di">'+ic+'</div><u>'+f.lo+'° / '+f.hi+'°</u></div>';}
    return h;}
  function render(){
    var n=nowParts(),vn=n.vn,th=themeFor(vn,data),night=th.night;
    host.setAttribute('data-state',data?'ok':(errState?'error':'loading'));
    var d=data?describe(data.code,night):null,cond=d?(th.cold?'Trời lạnh':d.t):(errState?'Không có dữ liệu':'Đang tải');
    setF('temp',data?data.t+'°':'--°');setF('cond',cond);setF('hilo',data?data.hi+'°/'+data.lo+'°':'--°/--°');setF('ptemp',data?data.t+'°':'--°');setF('pcond',shortCond(d,th,cond));setF('ptmr',data?data.fc[0].hi+'°/'+data.fc[0].lo+'°':'--°/--°');setF('pwlab',windLabel(data&&data.wind));setF('pwv',data&&data.wind!=null?data.wind+' km/h':'-- km/h');
    setF('ci',BIGIC[th.ic]||ICB[th.ic]||IC[th.ic]||'',true);setF('tempc',(data?data.t:'--')+'<small>°C</small>',true);setF('feel',data&&data.feel!=null?'Cảm giác như '+data.feel+'°C':'');setF('pi',PI[th.ic]||IC[th.ic]||'',true);
    setF('met',metrics(),true);setF('fc5',fcHtml(5,false),true);setF('fc3',fcHtml(3,true),true);
    var err=host.getAttribute('data-state')==='error'?'Không tải được dữ liệu thời tiết. <button type="button" data-retry>Thử lại</button>':host.getAttribute('data-state')==='loading'?'Đang tải thời tiết…':(data&&data.stale?'Dữ liệu cũ lúc '+((/T(\d\d:\d\d)/.exec(data.obs||'')||[])[1]||'')+' (giờ VN)':'');
    (F.err||[]).forEach(function(e){if(e._h!==err){e.innerHTML=err;e._h=err;e.style.display=err?'block':'none';}});
    if(themeKey!==th.theme){themeKey=th.theme;host.setAttribute('data-theme',th.theme);scenes.forEach(function(s,i){s.innerHTML=uniq(SC[th.theme]||SC.day,i);});var pc=PC[th.theme]||PC.day,bg=BG[th.theme]||BG.day;host.style.setProperty('--rvw-p1',pc[0]);host.style.setProperty('--rvw-p2',pc[1]);host.style.setProperty('--rvw-g1',bg[0]);host.style.setProperty('--rvw-g2',bg[1]);host.style.setProperty('--rvw-d1',bg[2]);host.style.setProperty('--rvw-d2',bg[3]);}
    pills.forEach(function(p){p.setAttribute('aria-label',pillLabel()+(open?'':' — bấm để mở'));});
    tickText(n);}
  function windLabel(w){return w==null?'Gió':w<=5?'Lặng gió':w<=19?'Gió nhẹ':w<=38?'Gió vừa':w<=61?'Gió mạnh':'Gió rất mạnh';}
  function shortCond(d,th,cond){if(!d)return cond.length>9?'Lỗi mạng':cond;if(th.cold)return 'Lạnh';var g=d.g;return g==='clear'?(th.night?'Quang':'Nắng'):g==='partly'?'Có mây':g==='cloudy'?(d.t==='Tuyết'?'Tuyết':'Nhiều mây'):g==='rain'?'Mưa':g==='drizzle'?'Mưa phùn':g==='storm'?'Dông':g==='fog'?'Sương mù':d.t;}
  function tickText(n){n=n||nowParts();var v=n.vn,u=n.utc;
    setF('time',p2(v.h)+':'+p2(v.mi));setF('utc',p2(u.h)+':'+p2(u.mi)+((u.d!==v.d)?'<small>'+p2(u.d)+'/'+p2(u.mo)+'</small>':''),true);
    setF('pwd',WD[v.wd]);setF('pdm',p2(v.d)+'/'+p2(v.mo));setF('pfull',WD[v.wd]+' '+p2(v.d)+'/'+p2(v.mo));setF('pshort',WDS[v.wd]+' '+p2(v.d)+'/'+p2(v.mo));
    setF('date',WD[v.wd]+', '+p2(v.d)+'/'+p2(v.mo)+'/'+v.y);
    var l=solar2lunar(v.d,v.mo,v.y,7);setF('lunar','Âm lịch: '+l.day+'/'+l.month+(l.leap?' (nhuận)':'')+' - '+tc(canChi(l.year)));setF('sec',p2(v.s));}
  var lastMin='';
  var lastDayLoad=0;
  function dayCheck(n){if(!data||!data.obs||inflight||Date.now()-lastDayLoad<60e3)return;var today=n.vn.y+'-'+p2(n.vn.mo)+'-'+p2(n.vn.d);if(String(data.obs).slice(0,10)!==today){lastDayLoad=Date.now();load();}}   // sang ngày mới (giờ VN) -> dữ liệu "ngày mai" và 5 ngày dự báo phải được tải lại ngay, không đợi chu kỳ 15 phút
  function tick(force){if(document.hidden&&!force)return;var n=nowParts();setF('sec',p2(n.vn.s));var k=p2(n.vn.h)+p2(n.vn.mi)+n.vn.d;if(force||k!==lastMin){lastMin=k;render();dayCheck(n);}}
  host.addEventListener('click',function(e){if(e.target&&e.target.hasAttribute&&e.target.hasAttribute('data-retry')){e.stopPropagation();errState=false;data=null;render();load();}});
  addEventListener('online',function(){attempts=0;load();});
  document.addEventListener('visibilitychange',function(){if(!document.hidden){tick(true);if(!data||Date.now()-data.at>CFG.refreshMs)load();}});

  /* ---------- Vị trí: bám theo bố cục THẬT của trang ---------- */
  var ready=false,B=0.5693;   // B = tỉ lệ u của trang di động ở 390 px (kích thước gốc của viên thuốc/panel được thiết kế ở đây)
  function pad(){var p=document.createElement('div');p.style.cssText='position:fixed;visibility:hidden;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) 0 env(safe-area-inset-left,0px)';document.body.appendChild(p);var cs=getComputedStyle(p),r={t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0,l:parseFloat(cs.paddingLeft)||0};document.body.removeChild(p);return r;}
  function deskMetrics(){var tl=document.querySelector('.title-link'),minTop=Infinity;[].forEach.call(document.querySelectorAll('.item'),function(a){var r=a.getBoundingClientRect();if(r.width>0&&r.height>0&&r.top>40)minTop=Math.min(minTop,r.top);});
    return{left:tl?tl.getBoundingClientRect().left:NaN,top:minTop};}
  function layout(){
    var sx=window.pageXOffset||0,sy=window.pageYOffset||0,ins=pad();
    if(isMob()){
      var pg=document.querySelector('#cards .mpage');if(!pg)return false;var r=pg.getBoundingClientRect();if(r.width<50)return false;var u=r.width/685,k=u/B;
      /* khe trống thật của tiêu đề: bên phải đỉnh chữ "Đ" (x = 618,3), phía trên dấu mũ của chữ "Ộ" (y = 125,6), tới mép phải trang (x = 685) — đơn vị thiết kế của trang */
      /* viên thuốc dọc kiểu M1: đầu ngang đỉnh chữ "I" (y=235u), chạy dọc xuống qua chữ "R"; chừa lề phải để không chạm mép */
      var PH=window.RVNeonPH||200,pillR=r.left+676*u,pillT=r.top+235*u,MW=172.5,NG=window.RVNeonMobile&&window.RVNeonMobile(k,pillR);   /* NG: hình học điện thoại theo mép nút xanh (xem script rv-neon-js) */
      if(NG){pillR=NG.pillR;MW=NG.mw;}
      pillT=Math.max(r.top+4*u,Math.min(pillT,r.top+1386*u-PH*k-4*u));
      boxM.style.cssText='left:'+(pillR+sx-MW)+'px;top:'+(pillT+sy)+'px;transform:scale('+k+');transform-origin:100% 0';
      var vh=window.innerHeight;host.style.setProperty('--rvw-maxh',Math.max(240,(vh-(pillT)-8)/k)+'px');
      return true;}
    if(/(^|\s)(float-(on|in|out)|leaving)(\s|$)/.test(root.className))return true;   // đang vào/ở/thoát chế độ nổi ảnh: lớp chữ bị dịch 3D nên số đo lúc này sai bố cục thật -> giữ nguyên vị trí bảng, không tính lại
    var m=deskMetrics();if(!isFinite(m.left)||!isFinite(m.top))return false;
    var margin=14,safeW=m.left-margin-margin,safeH=m.top-margin-9,k2=Math.max(.5,Math.min(1,safeW/456,safeH/304));
    var GD=window.RVNeonDesk&&window.RVNeonDesk(m,ins,sx,sy);   /* GD: bảng neon lấp đầy vùng trống (xem script rv-neon-js) */
    boxD.style.cssText=GD||('left:'+(margin+ins.l+sx)+'px;top:'+(margin+sy)+'px;transform:scale('+k2+')');
    var cv=document.getElementById('canvas');if(cv){var cr=cv.getBoundingClientRect();if(cr.width>0){host.style.setProperty('--rvw-ox',(cr.left+cr.width/2+sx)+'px');host.style.setProperty('--rvw-oy',(cr.top+cr.height/2+sy)+'px');}}   // tâm khung = điểm tụ của hiệu ứng lùi ra sau
    return true;}
  /* Chỉ hiện bảng khi khung bảng đã dựng xong (phông + dữ liệu), tối đa chờ 7 giây: bảng hiện một lần với đúng số liệu/kích thước thay vì hiện rồi nhảy/giật khi nội dung nạp xong */
  var showT=0,gate0=0;
  function show(){
    if(!gate0)gate0=Date.now();
    try{if(window.RVNeonStart)RVNeonStart();}catch(e){}   // hiệu ứng mở đầu đã xong: bắt đầu dựng khung bảng
    if(window.RVNeonReady&&Date.now()-gate0<7000){var ok=true;try{ok=RVNeonReady();}catch(e){}if(!ok){clearTimeout(showT);showT=setTimeout(show,150);return;}}
    if(layout()){ready=true;host.classList.add('rv-weather-ready');setTimeout(function(){host.classList.add('rv-weather-smooth');},900);}}
  function whenStable(){
    if(isMob()){var t0=Date.now();(function poll(){var done=!window.playMobileIntro||playMobileIntro.active===false||Date.now()-t0>45000;if(done)show();else setTimeout(poll,250);})();return;}
    var last='',same=0,t1=Date.now();
    function animating(){try{return document.getAnimations().some(function(an){var t=an.effect&&an.effect.target;return an.playState==='running'&&t&&t.closest&&t.closest('.stage')&&!t.closest('#rv-weather');});}catch(e){return false;}}
    (function poll(){var m=deskMetrics(),sig=Math.round(m.left)+','+Math.round(m.top);same=(sig===last&&isFinite(m.left))?same+1:0;last=sig;
      if((same>=2&&!animating())||Date.now()-t1>12000){show();setTimeout(function(){layout();},2500);}else setTimeout(poll,250);})();}
  var rt=0;function relayout(){clearTimeout(rt);rt=setTimeout(function(){if(ready)layout();else whenStable();},120);}
  addEventListener('resize',relayout);addEventListener('orientationchange',relayout);
  if(window.ResizeObserver){try{new ResizeObserver(relayout).observe(document.documentElement);}catch(e){}}
  new MutationObserver(function(){relayout();}).observe(root,{attributes:true,attributeFilter:['class']});   // bố cục máy tính <-> điện thoại đổi

  var c0=loadCache();if(c0)data=c0;render();setInterval(function(){tick(false);},1000);load();
  if(document.readyState==='complete')whenStable();else addEventListener('load',whenStable);
  window.RVWeather={cfg:CFG,solar2lunar:solar2lunar,canChi:canChi,describe:describe,themeFor:themeFor,todOf:todOf,nowParts:nowParts,setOpen:function(o){setOpen(o,false,false);},layout:layout,api:API};
})();
