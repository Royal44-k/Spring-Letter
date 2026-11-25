// Original, local SVG scenery. The loading view has no WebGL context or animation loop.
const LETTERS = [
  {place:'雨留庭',title:'晨雾里的第一封信',line:'雨停以后，花瓣上还留着故乡的光。',tip:'左岸的雨庭留着一封旧信。靠近信台，按 E 读信。'},
  {place:'风廊',title:'把一阵风，寄给远方',line:'种子在等一阵风，也在等愿意同行的人。',tip:'折翼起航，拖动或按方向键控制纸翼。错过风门，会回到上一段安全的风。'},
  {place:'花帆渡口',title:'写给尚未相遇的人',line:'信的最后一页，留给还没有相遇的人。',tip:'在花庭里慢慢走。停下来，也能听见新的故事。'},
];
const STAGES = {
  assets:{index:0,label:'正在读入花庭'},
  garden:{index:1,label:'正在铺开花、石与水'},
  light:{index:2,label:'正在点亮晨光与倒影'},
  ready:{index:3,label:'花庭已醒，等你走近'},
};

function random(seed) {
  return () => {seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
}
function specks(prefix,seed,{count=55,x=0,y=0,width=1600,height=800,color='#e7edda',opacity=.5}={}){
  const rand=random(seed);
  return `<g class="spring-load-specks" fill="${color}" opacity="${opacity}">${Array.from({length:count},(_,i)=>{
    const px=x+rand()*width,py=y+rand()*height,r=.6+rand()*1.9;
    return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" style="--twinkle-delay:${(i*.19).toFixed(2)}s"/>`;
  }).join('')}</g>`;
}
function reeds(seed,x,y,color,count=24,scale=1){
  const rand=random(seed);
  return `<g fill="none" stroke="${color}" stroke-linecap="round" opacity=".75">${Array.from({length:count},()=>{
    const px=x+rand()*170*scale,py=y+rand()*34*scale,h=(35+rand()*100)*scale,bend=(rand()-.3)*70*scale;
    return `<path d="M${px.toFixed(1)} ${py.toFixed(1)} Q${(px+bend).toFixed(1)} ${(py-h*.6).toFixed(1)} ${(px+bend*.72).toFixed(1)} ${(py-h).toFixed(1)}" stroke-width="${(1+rand()*2).toFixed(1)}"/>`;
  }).join('')}</g>`;
}
function islands(color,opacity=1){
  return `<g fill="${color}" opacity="${opacity}"><path d="M0 603Q130 570 225 601L300 626 0 661Z"/><path d="M260 575Q330 557 412 573L459 596 224 601Z"/><path d="M1130 553Q1210 529 1342 554L1435 581 1100 583Z"/><path d="M1355 615Q1490 567 1600 604V696L1331 671Z"/></g>`;
}
function courier(x,y,scale=1,color='#243c43'){
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${color}"><ellipse cx="0" cy="8" rx="12" ry="2" opacity=".2"/><path d="M-8-26Q-3-39 2-36L9-16 6 4-11 4-6-15Z"/><circle cx="-1" cy="-42" r="6"/><path d="M-6-35Q-20-34-32-28L-18-25 1-32Z" fill="#e3c5a7"/><path d="M-8 3L-10 11H-6L-2 3M3 3L5 11H9L7 1"/><path d="M9-26 18-12" fill="none" stroke="${color}" stroke-width="2"/><path d="M18-28 18 10" fill="none" stroke="#b9b69b" stroke-width="2"/></g>`;
}
function rainScene(){
  return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="sl-r-sky" x2=".1" y2="1"><stop stop-color="#47616c"/><stop offset=".43" stop-color="#b3c3bb"/><stop offset=".72" stop-color="#e4d9bd"/><stop offset="1" stop-color="#829d9a"/></linearGradient>
    <linearGradient id="sl-r-water" x2="0" y2="1"><stop stop-color="#a7bbb2"/><stop offset=".35" stop-color="#567e81"/><stop offset="1" stop-color="#172f3e"/></linearGradient>
    <radialGradient id="sl-r-light"><stop stop-color="#fff3cc" stop-opacity=".95"/><stop offset=".3" stop-color="#fff1cd" stop-opacity=".25"/><stop offset="1" stop-color="#eae6d6" stop-opacity="0"/></radialGradient>
    <linearGradient id="sl-r-petal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff9df"/><stop offset=".38" stop-color="#e4e6dc"/><stop offset=".7" stop-color="#a5bcc1"/><stop offset="1" stop-color="#618996"/></linearGradient>
    <linearGradient id="sl-r-petalback" x1="1" x2="0" y2="1"><stop stop-color="#bdd1d1"/><stop offset=".5" stop-color="#6d939e"/><stop offset="1" stop-color="#335965"/></linearGradient>
    <linearGradient id="sl-r-veil" x2="0" y2="1"><stop stop-color="#e4e9db" stop-opacity="0"/><stop offset=".5" stop-color="#e4e9db" stop-opacity=".52"/><stop offset="1" stop-color="#e4e9db" stop-opacity="0"/></linearGradient>
    <path id="sl-r-pollen" d="M0 0C-7-9-3-20 4-25 9-12 9-5 0 0Z"/>
  </defs>
  <rect width="1600" height="1000" fill="url(#sl-r-sky)"/>
  <circle cx="1070" cy="300" r="520" fill="url(#sl-r-light)"/>
  <g fill="#5c7a7e" opacity=".19"><path d="M0 450Q130 270 300 443 420 345 567 450 680 300 820 445 1040 325 1250 440 1450 270 1600 438V650H0Z"/><path d="M0 435Q80 320 240 412L369 504 92 572Z"/></g>
  <g class="spring-load-far" fill="none" stroke="#74908e" opacity=".3"><path d="M472 573V440Q472 348 558 348T644 440V573" stroke-width="13"/><path d="M450 574H667M480 440H638" stroke-width="4"/><path d="M1285 573V437Q1285 383 1335 383T1385 437V573" stroke-width="9"/></g>
  <path d="M0 570Q380 544 800 565T1600 559V1000H0Z" fill="url(#sl-r-water)"/>
  <g fill="none" stroke="#c9ded1" opacity=".23" stroke-width="2"><path d="M0 603Q130 582 315 601M970 591Q1230 571 1600 606M0 687Q230 652 476 679M1040 665Q1320 638 1600 676M280 749Q740 711 1283 747M0 838Q400 779 801 816"/><ellipse cx="971" cy="705" rx="220" ry="27"/><ellipse cx="971" cy="705" rx="295" ry="39" opacity=".5"/></g>
  ${islands('#6c8b84',.6)}
  <path d="M0 1000 480 854Q554 827 650 830L793 809 891 791 947 777 1001 765 1018 775 968 788 912 811 849 833 717 874 604 901 398 1000Z" fill="#748d87"/>
  <g fill="none" stroke="#bbcac0" stroke-width="2" opacity=".65"><path d="M484 854 604 901M653 830 714 874M790 810 848 833M895 790 912 811M944 776 969 787"/><path d="M0 1000 480 854Q554 827 650 830L793 809 891 791 947 777 1001 765"/></g>
  <g class="spring-load-mist"><path d="M-100 420Q380 360 900 430T1720 438V615H-100Z" fill="url(#sl-r-veil)"/><path d="M-200 570Q450 515 1100 582T1750 560V704H-200Z" fill="url(#sl-r-veil)" opacity=".65"/></g>
  <g class="spring-load-flower">
    <path d="M974 733Q1000 609 970 466" fill="none" stroke="#506e6c" stroke-width="8"/>
    <path d="M981 644Q910 577 862 605 897 661 981 663M984 605Q1041 544 1089 568 1051 628 984 627" fill="#688d86" stroke="#8ca99e" stroke-width="2"/>
    <path d="M970 481C930 403 920 270 980 208 1043 310 1033 414 970 481Z" fill="url(#sl-r-petalback)" stroke="#d5e7df" stroke-width="1.5"/>
    <path d="M973 489C882 434 834 326 851 252 948 292 981 378 973 489Z" fill="url(#sl-r-petalback)" stroke="#c6dbd7" stroke-width="1.5"/>
    <path d="M973 486C1015 374 1097 289 1176 298 1154 397 1068 464 973 486Z" fill="url(#sl-r-petalback)" stroke="#cfdfd6" stroke-width="1.5"/>
    <path d="M972 491C890 496 770 415 751 332 872 339 944 399 972 491Z" fill="url(#sl-r-petal)" stroke="#dce9da" stroke-width="1.8"/>
    <path d="M974 491C1029 396 1140 362 1221 389 1168 469 1062 514 974 491Z" fill="url(#sl-r-petal)" stroke="#ebefda" stroke-width="1.5"/>
    <path d="M972 488C900 419 920 311 976 263 1031 354 1019 432 972 488Z" fill="url(#sl-r-petal)" stroke="#e5ece0" stroke-width="2"/>
    <g fill="none" stroke="#d5dfcc" stroke-width="1" opacity=".75"><path d="M970 481Q897 396 763 344M977 487Q1066 458 1209 397M974 474 977 279M974 479Q1002 352 981 223"/><path d="M965 462Q917 419 875 417M983 472Q1043 434 1102 436"/></g>
    <g stroke="#d9be73" stroke-width="2.5"><path d="M973 491 959 446M973 491 979 435M974 491 1001 448M972 491 941 454"/></g>
    <g fill="#f4d99a"><ellipse cx="958" cy="443" rx="4" ry="7" transform="rotate(-20 958 443)"/><ellipse cx="980" cy="433" rx="4" ry="7"/><ellipse cx="1003" cy="446" rx="4" ry="7" transform="rotate(25 1003 446)"/><circle cx="940" cy="452" r="4"/></g>
  </g>
  <g fill="#b7cec1" opacity=".15" transform="translate(0 1410) scale(1 -1)"><path d="M974 733Q1000 609 970 466L977 478 982 733Z"/><path d="M972 491C890 496 770 415 751 332 872 339 944 399 972 491Z"/><path d="M974 491C1029 396 1140 362 1221 389 1168 469 1062 514 974 491Z"/></g>
  ${courier(765,847,1.3)}
  <g fill="#395a60"><path d="M0 1000V909Q63 807 148 851 161 924 281 946L330 1000Z"/><path d="M1600 1000V837Q1509 821 1446 902L1349 1000Z"/></g>
  ${reeds(4,45,935,'#426d6d',27,1.6)}${reeds(7,1430,935,'#365c64',22,1.3)}
  <g class="spring-load-petal-drift" fill="#e4ead6" opacity=".8"><use href="#sl-r-pollen" transform="translate(701 383) rotate(-63) scale(.55)"/><use href="#sl-r-pollen" transform="translate(1200 591) rotate(28) scale(.45)"/><use href="#sl-r-pollen" transform="translate(1291 452) rotate(72) scale(.7)"/><use href="#sl-r-pollen" transform="translate(571 506) rotate(108) scale(.3)"/></g>
  ${specks('r',17,{x:420,y:230,width:1100,height:500,color:'#f5edc9',count:48,opacity:.5})}
  </svg>`;
}
function windScene(){
  const columns=[{x:560,y:305,s:.62},{x:710,y:235,s:.8},{x:1280,y:197,s:1.05},{x:1460,y:287,s:.72}].map(({x,y,s})=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-31 0H31L23 437H-25Z" fill="url(#sl-w-stone)"/><path d="M-36-12H38V10H-36ZM-41 425H38V441H-41Z" fill="#bd9e73"/><path d="M-16 19-18 416M10 22 9 415" stroke="#ead0a0" stroke-width="2" opacity=".5"/><path d="M-31 0Q-9-69 6-79L31 0Z" fill="#a18160"/></g>`).join('');
  return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="sl-w-sky" x2="0" y2="1"><stop stop-color="#7d7470"/><stop offset=".44" stop-color="#d2b18a"/><stop offset=".8" stop-color="#efd4a1"/><stop offset="1" stop-color="#6d8c87"/></linearGradient>
    <linearGradient id="sl-w-ground" x2=".2" y2="1"><stop stop-color="#8e9d83"/><stop offset="1" stop-color="#273b3c"/></linearGradient>
    <linearGradient id="sl-w-stone"><stop stop-color="#715d50"/><stop offset=".35" stop-color="#a38966"/><stop offset=".6" stop-color="#d5bc8b"/><stop offset="1" stop-color="#806b56"/></linearGradient>
    <radialGradient id="sl-w-sun"><stop stop-color="#ffe1a2" stop-opacity=".9"/><stop offset=".25" stop-color="#ffd18c" stop-opacity=".35"/><stop offset="1" stop-color="#ffcb8c" stop-opacity="0"/></radialGradient>
    <linearGradient id="sl-w-arch" x2="1" y2="1"><stop stop-color="#f5db9b"/><stop offset=".45" stop-color="#bd9865"/><stop offset="1" stop-color="#705e4e"/></linearGradient>
    <linearGradient id="sl-w-stream"><stop stop-color="#729e95" stop-opacity="0"/><stop offset=".5" stop-color="#d4e0b0" stop-opacity=".7"/><stop offset="1" stop-color="#f9d893" stop-opacity=".1"/></linearGradient>
    <path id="sl-w-leaf" d="M0 0Q-15-24 1-44 22-25 0 0Z"/>
  </defs>
  <rect width="1600" height="1000" fill="url(#sl-w-sky)"/>
  <circle cx="1080" cy="405" r="600" fill="url(#sl-w-sun)"/>
  <g fill="#b19475" opacity=".25"><path d="M0 468 175 380 269 466 410 352 555 478 692 381 842 460 1010 384 1200 465 1405 341 1600 468V650H0Z"/></g>
  <g fill="none" stroke="#a28e70" opacity=".33" stroke-width="8"><path d="M200 633V480Q200 400 288 400T376 480V633M1340 620V430Q1340 349 1425 349T1510 430V620"/><path d="M230 480H348M1370 430H1480" stroke-width="3"/></g>
  <path d="M0 623Q400 570 789 597T1600 576V1000H0Z" fill="url(#sl-w-ground)"/>
  <path d="M0 704Q350 666 720 706T1600 639V833Q1130 758 759 782T0 821Z" fill="#7b9d92" opacity=".48"/>
  <path d="M700 1000Q900 901 1089 823 1244 760 1065 691 978 658 1059 593L1100 583Q1000 654 1139 689 1351 765 1161 844 1001 909 903 1000Z" fill="#a5ad90"/>
  <path d="M707 1000Q904 907 1087 824 1264 754 1063 691 984 658 1059 593" fill="none" stroke="#d3c399" stroke-width="4" opacity=".8"/>
  <g fill="none" stroke="#6e8779" stroke-width="3" opacity=".5"><path d="M918 913 1054 926M1055 845 1184 868M1129 791 1235 811M1124 724 1214 718M1045 679 1114 658"/></g>
  <g class="spring-load-far">${columns}</g>
  <g fill="none" stroke="url(#sl-w-arch)" stroke-linecap="round"><path d="M667 727C623 596 645 353 835 257 1050 148 1274 364 1309 714" stroke-width="18"/><path d="M683 719C647 588 677 370 846 282 1033 186 1249 386 1291 706" stroke-width="3"/><path d="M842 706C801 574 833 414 944 359 1075 299 1197 466 1209 700" stroke-width="11"/><path d="M849 700C819 572 851 427 950 375 1066 320 1181 473 1198 696" stroke-width="2"/></g>
  <g stroke="#7d7658" fill="#afba8a" stroke-width="2"><path d="M821 277Q842 331 821 381M847 268Q868 313 850 360M1149 303Q1162 345 1144 383" fill="none"/><ellipse cx="821" cy="387" rx="8" ry="16"/><ellipse cx="850" cy="366" rx="6" ry="13"/><ellipse cx="1144" cy="389" rx="9" ry="18"/></g>
  <g class="spring-load-wind-ribbon" fill="none" stroke-linecap="round"><path d="M273 674C495 768 747 583 994 582S1351 699 1580 550" stroke="url(#sl-w-stream)" stroke-width="13"/><path d="M256 657C515 725 741 566 1001 566S1335 683 1587 536" stroke="#f8d89a" stroke-width="1.6" opacity=".65"/><path d="M264 681C527 754 781 604 1012 607S1390 703 1616 574" stroke="#f2dfad" stroke-width="1" opacity=".35"/></g>
  <g class="spring-load-seed" transform="translate(1002 578)"><circle r="36" fill="url(#sl-w-sun)"/><path d="M-6 8Q-14-8 1-21 16-5 7 12Z" fill="#edc47d"/><path d="M2-18 1 8" stroke="#fff0ba" stroke-width="1.6"/><path d="M-1-19Q-14-37-25-29M2-20Q17-36 29-27" fill="none" stroke="#f2dcb4" stroke-width="1"/></g>
  ${courier(1048,866,1.7,'#31433d')}
  <path d="M0 1000V860Q162 794 318 869L504 1000M1600 1000V799Q1513 846 1445 895L1361 1000" fill="#263c3b"/>
  ${reeds(33,83,920,'#647966',25,1.7)}${reeds(47,1389,935,'#516b5e',20,1.55)}
  <g class="spring-load-petal-drift" fill="#edc17a" opacity=".8"><use href="#sl-w-leaf" transform="translate(572 560) rotate(70) scale(.35)"/><use href="#sl-w-leaf" transform="translate(696 626) rotate(85) scale(.23)"/><use href="#sl-w-leaf" transform="translate(1262 614) rotate(60) scale(.38)"/><use href="#sl-w-leaf" transform="translate(1407 580) rotate(90) scale(.4)"/></g>
  ${specks('w',64,{x:240,y:360,width:1300,height:440,color:'#f3d6a2',count:58,opacity:.65})}
  </svg>`;
}
function nightScene(){
  return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="sl-n-sky" x2=".25" y2="1"><stop stop-color="#141c37"/><stop offset=".44" stop-color="#334565"/><stop offset=".8" stop-color="#8c8e97"/><stop offset="1" stop-color="#4c6c7c"/></linearGradient>
    <linearGradient id="sl-n-water" x2=".1" y2="1"><stop stop-color="#556e84"/><stop offset="1" stop-color="#131f36"/></linearGradient>
    <radialGradient id="sl-n-glow"><stop stop-color="#f0dab5" stop-opacity=".42"/><stop offset=".3" stop-color="#a6bcce" stop-opacity=".14"/><stop offset="1" stop-color="#a7b9c6" stop-opacity="0"/></radialGradient>
    <linearGradient id="sl-n-sail" x1="0" x2="1" y2="1"><stop stop-color="#edf1df"/><stop offset=".35" stop-color="#b4ced1"/><stop offset=".7" stop-color="#7d9db4"/><stop offset="1" stop-color="#45647e"/></linearGradient>
    <linearGradient id="sl-n-rose" x1="0" x2="1" y2="1"><stop stop-color="#e7c9d4"/><stop offset="1" stop-color="#77618f"/></linearGradient>
    <linearGradient id="sl-n-stream"><stop stop-color="#7da9b5" stop-opacity="0"/><stop offset=".55" stop-color="#c9bfd7" stop-opacity=".7"/><stop offset="1" stop-color="#e8cbb6" stop-opacity="0"/></linearGradient>
    <path id="sl-n-petal" d="M0 0Q-18-17 0-38 18-17 0 0Z"/>
  </defs>
  <rect width="1600" height="1000" fill="url(#sl-n-sky)"/>
  <circle cx="1045" cy="301" r="470" fill="url(#sl-n-glow)"/>
  <path d="M1165 173A46 46 0 1 0 1211 238A39 39 0 0 1 1165 173Z" fill="#e1d9c1" opacity=".88"/>
  ${specks('n',91,{x:80,y:40,width:1420,height:470,color:'#d4dbdc',count:70,opacity:.6})}
  <g fill="none" stroke="#9eafbd" opacity=".18"><path d="M0 425Q300 255 607 365T1100 293 1600 335" stroke-width="42"/><path d="M0 433Q300 263 607 373T1100 301 1600 343" stroke-width="2"/></g>
  <g class="spring-load-far" fill="#304962"><path d="M0 544 168 462 252 538 351 468 430 535 611 465 729 544 901 489 1060 545 1248 446 1411 535 1600 460V660H0Z"/><path d="M474 559V402L493 383 513 405V552M542 550V427H562V550M1341 562V391L1356 379 1374 397V558"/></g>
  <path d="M0 584Q430 566 800 582T1600 569V1000H0Z" fill="url(#sl-n-water)"/>
  <g fill="none" stroke="#a3b6c5" stroke-width="1.5" opacity=".25"><path d="M0 631Q400 599 746 629M1014 618Q1300 583 1600 615M0 728Q402 667 745 712M1210 689 1600 680M152 827Q675 742 1280 784M0 908Q436 828 1021 870"/></g>
  <path d="M0 1000 325 888 496 844 611 798 706 758 764 725 810 708 866 681 891 686 843 717 797 742 755 777 684 822 558 881 435 933 274 1000Z" fill="#344655"/>
  <g stroke="#8f9da6" opacity=".5" fill="none"><path d="M329 887 435 933M498 845 558 881M610 799 684 822M706 758 755 777M764 725 797 742M813 708 845 717" stroke-width="2"/><path d="M0 1000 325 888 496 844 611 798 706 758 764 725 810 708 866 681" stroke-width="3"/></g>
  <g class="spring-load-boat">
    <path d="M832 690Q1012 741 1198 670L1157 710Q1015 779 886 730Z" fill="#526e80" stroke="#b6b5aa" stroke-width="2"/>
    <path d="M855 701Q1020 739 1175 685" fill="none" stroke="#dfd0af" stroke-width="4"/>
    <path d="M1011 720Q1032 497 1002 257" fill="none" stroke="#d6c5a4" stroke-width="5"/>
    <path d="M1015 650C883 595 842 443 1002 257 961 425 1152 519 1015 650Z" fill="url(#sl-n-sail)" stroke="#d4e1dd" stroke-width="2"/>
    <path d="M1007 612C1098 575 1191 435 1094 329 1092 452 991 492 1007 612Z" fill="url(#sl-n-rose)" stroke="#c6c7d3" stroke-width="1.5" opacity=".9"/>
    <g fill="none" stroke="#e2e5d5" stroke-width="1" opacity=".7"><path d="M1002 257Q903 490 1015 650M960 375Q943 473 1028 531M929 458Q948 532 1039 583M1094 329Q1130 503 1007 612"/></g>
    <path d="M1007 262Q979 238 942 248L960 264 943 274Q986 278 1007 270Z" fill="#c5a5b5"/>
    <g fill="#e8cc8d"><circle cx="886" cy="700" r="4"/><circle cx="1132" cy="710" r="4"/><circle cx="1037" cy="727" r="3"/></g>
  </g>
  <g class="spring-load-wind-ribbon" fill="none"><path d="M527 649C664 487 910 458 1202 535S1568 416 1680 303" stroke="url(#sl-n-stream)" stroke-width="11"/><path d="M536 651C679 506 912 475 1201 551S1585 437 1669 323" stroke="#b4bfd3" stroke-width="1" opacity=".45"/></g>
  <g class="spring-load-petal-drift" opacity=".8"><use href="#sl-n-petal" fill="#e0c8d9" transform="translate(701 538) rotate(75) scale(.28)"/><use href="#sl-n-petal" fill="#b9d6de" transform="translate(798 519) rotate(65) scale(.3)"/><use href="#sl-n-petal" fill="#e8cebd" transform="translate(1218 551) rotate(92) scale(.35)"/><use href="#sl-n-petal" fill="#b7cbe5" transform="translate(1337 520) rotate(48) scale(.4)"/></g>
  <g fill="#142d40"><path d="M0 1000V891Q87 808 201 877L302 1000Z"/><path d="M1600 1000V850Q1493 798 1376 894L1291 1000Z"/></g>
  ${reeds(53,46,953,'#2e4b5f',25,1.8)}${reeds(13,1430,943,'#29495c',18,1.6)}
  ${courier(686,822,1.4,'#1b2b3e')}
  <g fill="#d4c192" opacity=".8"><circle cx="756" cy="737" r="3"/><circle cx="802" cy="704" r="2.5"/><circle cx="842" cy="681" r="2"/></g>
  </svg>`;
}

export function mountLoadingScene(element,{reducedMotion=false}={}){
  if(!element) return {setStage(){},complete:()=>Promise.resolve(),dispose(){}};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const effectiveReduced=()=>reduced.matches||reducedMotion===true;
  let current=0,cycleTimer=null,finishTimer=null,disposed=false,finishing=false,finishResolve=null;
  element.classList.add('spring-loading');
  element.setAttribute('aria-busy','true');
  element.innerHTML=`<div class="spring-load-art" aria-hidden="true">${[rainScene(),windScene(),nightScene()].map((svg,index)=>`<div class="spring-load-scene ${index===0?'is-current':''}" data-letter="${index}">${svg}</div>`).join('')}</div>
    <div class="spring-load-grain" aria-hidden="true"></div><div class="spring-load-shade" aria-hidden="true"></div>
    <div class="spring-load-masthead"><span class="spring-load-title">花漾年华</span><span class="spring-load-subtitle">待寄出的春信</span></div>
    <div class="spring-load-letter"><span class="spring-load-postmark">寄往 <b data-load-place>${LETTERS[0].place}</b></span><h2 data-load-title>${LETTERS[0].title}</h2><p data-load-line>${LETTERS[0].line}</p></div>
    <div class="spring-load-bottom"><div class="spring-load-note"><p data-load-tip>${LETTERS[0].tip}</p><nav class="spring-load-pages" aria-label="加载中的三封来信">${LETTERS.map((letter,index)=>`<button type="button" data-load-page="${index}" aria-label="看${letter.place}的来信" aria-pressed="${index===0}"><span aria-hidden="true"></span>${letter.place}</button>`).join('')}</nav></div><div class="spring-load-status"><div class="spring-load-steps" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span id="load-status" role="status" aria-live="polite">${STAGES.assets.label}</span><small>花、光与水，正在准备</small></div></div>`;
  const sceneNodes=[...element.querySelectorAll('.spring-load-scene')], buttons=[...element.querySelectorAll('[data-load-page]')];
  const place=element.querySelector('[data-load-place]'),title=element.querySelector('[data-load-title]'),line=element.querySelector('[data-load-line]'),tip=element.querySelector('[data-load-tip]'),status=element.querySelector('#load-status'),steps=[...element.querySelectorAll('.spring-load-steps i')];
  function show(index){
    if(disposed||finishing)return;
    current=(index+LETTERS.length)%LETTERS.length;
    sceneNodes.forEach((node,i)=>node.classList.toggle('is-current',i===current));
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
    const letter=LETTERS[current];place.textContent=letter.place;title.textContent=letter.title;line.textContent=letter.line;tip.textContent=letter.tip;
  }
  function stopCycle(){if(cycleTimer!==null){clearTimeout(cycleTimer);cycleTimer=null;}}
  function schedule(){
    stopCycle();if(disposed||finishing||effectiveReduced()||document.hidden)return;
    cycleTimer=setTimeout(()=>{show(current+1);schedule();},6500);
  }
  function pageClick(event){const button=event.target.closest('[data-load-page]');if(!button||!element.contains(button))return;show(Number(button.dataset.loadPage));schedule();}
  function pause(){element.classList.toggle('is-paused',document.hidden||effectiveReduced());element.classList.toggle('is-reduced',effectiveReduced());schedule();}
  function resize(){element.style.setProperty('--loading-height',`${window.innerHeight}px`);const portrait=window.innerWidth<760&&window.innerHeight>window.innerWidth;sceneNodes.forEach(node=>node.querySelector('svg').setAttribute('viewBox',portrait?'200 0 1600 1000':'0 0 1600 1000'));}
  function detach(){
    stopCycle();element.removeEventListener('click',pageClick);document.removeEventListener('visibilitychange',pause);window.removeEventListener('resize',resize);reduced.removeEventListener('change',pause);
  }
  function setStage(key,message){
    if(disposed||finishing)return;
    const stage=STAGES[key]||STAGES.assets;status.textContent=message||stage.label;
    steps.forEach((step,index)=>{step.classList.toggle('is-done',index<stage.index);step.classList.toggle('is-active',index===stage.index);});
  }
  function dispose(){
    if(disposed)return;disposed=true;detach();if(finishTimer!==null)clearTimeout(finishTimer);
    element.classList.add('is-paused');element.setAttribute('aria-busy','false');
    if(finishResolve){finishResolve();finishResolve=null;}
  }
  function complete(){
    if(disposed)return Promise.resolve();
    if(finishing)return new Promise(resolve=>{const previous=finishResolve;finishResolve=()=>{previous?.();resolve();};});
    setStage('ready');finishing=true;detach();element.setAttribute('aria-busy','false');element.classList.add('is-complete');
    return new Promise(resolve=>{finishResolve=resolve;finishTimer=setTimeout(()=>{element.hidden=true;dispose();},effectiveReduced()?100:650);});
  }
  element.addEventListener('click',pageClick);document.addEventListener('visibilitychange',pause);window.addEventListener('resize',resize);reduced.addEventListener('change',pause);resize();setStage('assets');pause();
  return {setStage,complete,dispose};
}
