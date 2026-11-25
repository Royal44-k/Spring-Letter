(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{place:`雨留庭`,title:`晨雾里的第一封信`,line:`雨停以后，花瓣上还留着故乡的光。`,tip:`行走时，视线会跟随你。拖动可以暂时环看。`},{place:`风廊`,title:`把一阵风，寄给远方`,line:`种子在等一阵风，也在等愿意同行的人。`,tip:`花尘会记住花的颜色。扬起以后，试着带它流动。`},{place:`花帆渡口`,title:`写给尚未相遇的人`,line:`信的最后一页，留给还没有相遇的人。`,tip:`在花庭里慢慢走。停下来，也能听见新的故事。`}],t={assets:{index:0,label:`正在读入花庭`},garden:{index:1,label:`正在铺开花、石与水`},light:{index:2,label:`正在点亮晨光与倒影`},ready:{index:3,label:`花庭已醒，等你走近`}};function n(e){return()=>(e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296)}function r(e,t,{count:r=55,x:i=0,y:a=0,width:o=1600,height:s=800,color:c=`#e7edda`,opacity:l=.5}={}){let u=n(t);return`<g class="spring-load-specks" fill="${c}" opacity="${l}">${Array.from({length:r},(e,t)=>{let n=i+u()*o,r=a+u()*s,c=.6+u()*1.9;return`<circle cx="${n.toFixed(1)}" cy="${r.toFixed(1)}" r="${c.toFixed(1)}" style="--twinkle-delay:${(t*.19).toFixed(2)}s"/>`}).join(``)}</g>`}function i(e,t,r,i,a=24,o=1){let s=n(e);return`<g fill="none" stroke="${i}" stroke-linecap="round" opacity=".75">${Array.from({length:a},()=>{let e=t+s()*170*o,n=r+s()*34*o,i=(35+s()*100)*o,a=(s()-.3)*70*o;return`<path d="M${e.toFixed(1)} ${n.toFixed(1)} Q${(e+a).toFixed(1)} ${(n-i*.6).toFixed(1)} ${(e+a*.72).toFixed(1)} ${(n-i).toFixed(1)}" stroke-width="${(1+s()*2).toFixed(1)}"/>`}).join(``)}</g>`}function a(e,t=1){return`<g fill="${e}" opacity="${t}"><path d="M0 603Q130 570 225 601L300 626 0 661Z"/><path d="M260 575Q330 557 412 573L459 596 224 601Z"/><path d="M1130 553Q1210 529 1342 554L1435 581 1100 583Z"/><path d="M1355 615Q1490 567 1600 604V696L1331 671Z"/></g>`}function o(e,t,n=1,r=`#243c43`){return`<g transform="translate(${e} ${t}) scale(${n})" fill="${r}"><ellipse cx="0" cy="8" rx="12" ry="2" opacity=".2"/><path d="M-8-26Q-3-39 2-36L9-16 6 4-11 4-6-15Z"/><circle cx="-1" cy="-42" r="6"/><path d="M-6-35Q-20-34-32-28L-18-25 1-32Z" fill="#e3c5a7"/><path d="M-8 3L-10 11H-6L-2 3M3 3L5 11H9L7 1"/><path d="M9-26 18-12" fill="none" stroke="${r}" stroke-width="2"/><path d="M18-28 18 10" fill="none" stroke="#b9b69b" stroke-width="2"/></g>`}function s(){return`<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
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
  ${a(`#6c8b84`,.6)}
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
  ${o(765,847,1.3)}
  <g fill="#395a60"><path d="M0 1000V909Q63 807 148 851 161 924 281 946L330 1000Z"/><path d="M1600 1000V837Q1509 821 1446 902L1349 1000Z"/></g>
  ${i(4,45,935,`#426d6d`,27,1.6)}${i(7,1430,935,`#365c64`,22,1.3)}
  <g class="spring-load-petal-drift" fill="#e4ead6" opacity=".8"><use href="#sl-r-pollen" transform="translate(701 383) rotate(-63) scale(.55)"/><use href="#sl-r-pollen" transform="translate(1200 591) rotate(28) scale(.45)"/><use href="#sl-r-pollen" transform="translate(1291 452) rotate(72) scale(.7)"/><use href="#sl-r-pollen" transform="translate(571 506) rotate(108) scale(.3)"/></g>
  ${r(`r`,17,{x:420,y:230,width:1100,height:500,color:`#f5edc9`,count:48,opacity:.5})}
  </svg>`}function c(){return`<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
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
  <g class="spring-load-far">${[{x:560,y:305,s:.62},{x:710,y:235,s:.8},{x:1280,y:197,s:1.05},{x:1460,y:287,s:.72}].map(({x:e,y:t,s:n})=>`<g transform="translate(${e} ${t}) scale(${n})"><path d="M-31 0H31L23 437H-25Z" fill="url(#sl-w-stone)"/><path d="M-36-12H38V10H-36ZM-41 425H38V441H-41Z" fill="#bd9e73"/><path d="M-16 19-18 416M10 22 9 415" stroke="#ead0a0" stroke-width="2" opacity=".5"/><path d="M-31 0Q-9-69 6-79L31 0Z" fill="#a18160"/></g>`).join(``)}</g>
  <g fill="none" stroke="url(#sl-w-arch)" stroke-linecap="round"><path d="M667 727C623 596 645 353 835 257 1050 148 1274 364 1309 714" stroke-width="18"/><path d="M683 719C647 588 677 370 846 282 1033 186 1249 386 1291 706" stroke-width="3"/><path d="M842 706C801 574 833 414 944 359 1075 299 1197 466 1209 700" stroke-width="11"/><path d="M849 700C819 572 851 427 950 375 1066 320 1181 473 1198 696" stroke-width="2"/></g>
  <g stroke="#7d7658" fill="#afba8a" stroke-width="2"><path d="M821 277Q842 331 821 381M847 268Q868 313 850 360M1149 303Q1162 345 1144 383" fill="none"/><ellipse cx="821" cy="387" rx="8" ry="16"/><ellipse cx="850" cy="366" rx="6" ry="13"/><ellipse cx="1144" cy="389" rx="9" ry="18"/></g>
  <g class="spring-load-wind-ribbon" fill="none" stroke-linecap="round"><path d="M273 674C495 768 747 583 994 582S1351 699 1580 550" stroke="url(#sl-w-stream)" stroke-width="13"/><path d="M256 657C515 725 741 566 1001 566S1335 683 1587 536" stroke="#f8d89a" stroke-width="1.6" opacity=".65"/><path d="M264 681C527 754 781 604 1012 607S1390 703 1616 574" stroke="#f2dfad" stroke-width="1" opacity=".35"/></g>
  <g class="spring-load-seed" transform="translate(1002 578)"><circle r="36" fill="url(#sl-w-sun)"/><path d="M-6 8Q-14-8 1-21 16-5 7 12Z" fill="#edc47d"/><path d="M2-18 1 8" stroke="#fff0ba" stroke-width="1.6"/><path d="M-1-19Q-14-37-25-29M2-20Q17-36 29-27" fill="none" stroke="#f2dcb4" stroke-width="1"/></g>
  ${o(1048,866,1.7,`#31433d`)}
  <path d="M0 1000V860Q162 794 318 869L504 1000M1600 1000V799Q1513 846 1445 895L1361 1000" fill="#263c3b"/>
  ${i(33,83,920,`#647966`,25,1.7)}${i(47,1389,935,`#516b5e`,20,1.55)}
  <g class="spring-load-petal-drift" fill="#edc17a" opacity=".8"><use href="#sl-w-leaf" transform="translate(572 560) rotate(70) scale(.35)"/><use href="#sl-w-leaf" transform="translate(696 626) rotate(85) scale(.23)"/><use href="#sl-w-leaf" transform="translate(1262 614) rotate(60) scale(.38)"/><use href="#sl-w-leaf" transform="translate(1407 580) rotate(90) scale(.4)"/></g>
  ${r(`w`,64,{x:240,y:360,width:1300,height:440,color:`#f3d6a2`,count:58,opacity:.65})}
  </svg>`}function l(){return`<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
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
  ${r(`n`,91,{x:80,y:40,width:1420,height:470,color:`#d4dbdc`,count:70,opacity:.6})}
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
  ${i(53,46,953,`#2e4b5f`,25,1.8)}${i(13,1430,943,`#29495c`,18,1.6)}
  ${o(686,822,1.4,`#1b2b3e`)}
  <g fill="#d4c192" opacity=".8"><circle cx="756" cy="737" r="3"/><circle cx="802" cy="704" r="2.5"/><circle cx="842" cy="681" r="2"/></g>
  </svg>`}function u(n,{reducedMotion:r=!1}={}){if(!n)return{setStage(){},complete:()=>Promise.resolve(),dispose(){}};let i=matchMedia(`(prefers-reduced-motion: reduce)`),a=()=>i.matches||r===!0,o=0,u=null,d=null,f=!1,p=!1,m=null;n.classList.add(`spring-loading`),n.setAttribute(`aria-busy`,`true`),n.innerHTML=`<div class="spring-load-art" aria-hidden="true">${[s(),c(),l()].map((e,t)=>`<div class="spring-load-scene ${t===0?`is-current`:``}" data-letter="${t}">${e}</div>`).join(``)}</div>
    <div class="spring-load-grain" aria-hidden="true"></div><div class="spring-load-shade" aria-hidden="true"></div>
    <div class="spring-load-masthead"><span class="spring-load-title">花漾年华</span><span class="spring-load-subtitle">待寄出的春信</span></div>
    <div class="spring-load-letter"><span class="spring-load-postmark">寄往 <b data-load-place>${e[0].place}</b></span><h2 data-load-title>${e[0].title}</h2><p data-load-line>${e[0].line}</p></div>
    <div class="spring-load-bottom"><div class="spring-load-note"><p data-load-tip>${e[0].tip}</p><nav class="spring-load-pages" aria-label="加载中的三封来信">${e.map((e,t)=>`<button type="button" data-load-page="${t}" aria-label="看${e.place}的来信" aria-pressed="${t===0}"><span aria-hidden="true"></span>${e.place}</button>`).join(``)}</nav></div><div class="spring-load-status"><div class="spring-load-steps" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span id="load-status" role="status" aria-live="polite">${t.assets.label}</span><small>花、光与水，正在准备</small></div></div>`;let h=[...n.querySelectorAll(`.spring-load-scene`)],g=[...n.querySelectorAll(`[data-load-page]`)],_=n.querySelector(`[data-load-place]`),v=n.querySelector(`[data-load-title]`),y=n.querySelector(`[data-load-line]`),b=n.querySelector(`[data-load-tip]`),x=n.querySelector(`#load-status`),S=[...n.querySelectorAll(`.spring-load-steps i`)];function C(t){if(f||p)return;o=(t+e.length)%e.length,h.forEach((e,t)=>e.classList.toggle(`is-current`,t===o)),g.forEach((e,t)=>e.setAttribute(`aria-pressed`,String(t===o)));let n=e[o];_.textContent=n.place,v.textContent=n.title,y.textContent=n.line,b.textContent=n.tip}function w(){u!==null&&(clearTimeout(u),u=null)}function T(){w(),f||p||a()||document.hidden||(u=setTimeout(()=>{C(o+1),T()},6500))}function E(e){let t=e.target.closest(`[data-load-page]`);t&&n.contains(t)&&(C(Number(t.dataset.loadPage)),T())}function D(){n.classList.toggle(`is-paused`,document.hidden||a()),n.classList.toggle(`is-reduced`,a()),T()}function O(){n.style.setProperty(`--loading-height`,`${window.innerHeight}px`);let e=window.innerWidth<760&&window.innerHeight>window.innerWidth;h.forEach(t=>t.querySelector(`svg`).setAttribute(`viewBox`,e?`200 0 1600 1000`:`0 0 1600 1000`))}function k(){w(),n.removeEventListener(`click`,E),document.removeEventListener(`visibilitychange`,D),window.removeEventListener(`resize`,O),i.removeEventListener(`change`,D)}function A(e,n){if(f||p)return;let r=t[e]||t.assets;x.textContent=n||r.label,S.forEach((e,t)=>{e.classList.toggle(`is-done`,t<r.index),e.classList.toggle(`is-active`,t===r.index)})}function j(){f||(f=!0,k(),d!==null&&clearTimeout(d),n.classList.add(`is-paused`),n.setAttribute(`aria-busy`,`false`),m&&=(m(),null))}function M(){return f?Promise.resolve():p?new Promise(e=>{let t=m;m=()=>{t?.(),e()}}):(A(`ready`),p=!0,k(),n.setAttribute(`aria-busy`,`false`),n.classList.add(`is-complete`),new Promise(e=>{m=e,d=setTimeout(()=>{n.hidden=!0,j()},a()?100:650)}))}return n.addEventListener(`click`,E),document.addEventListener(`visibilitychange`,D),window.addEventListener(`resize`,O),i.addEventListener(`change`,D),O(),A(`assets`),D(),{setStage:A,complete:M,dispose:j}}var d=`spring-letter:preferences:v1`,f={muted:!1,quality:`balanced`,reducedMotion:!1,autoCamera:!0,flowerForm:`lily`,flowerSeries:`silver`};function p(e={},t={}){let n={...f,...t};for(let t of[`muted`,`reducedMotion`,`autoCamera`])typeof e?.[t]==`boolean`&&(n[t]=e[t]);for(let[t,r]of Object.entries({quality:[`light`,`balanced`,`delicate`],flowerForm:[`lily`,`lotus`,`iris`,`dahlia`],flowerSeries:[`silver`,`crystal`,`lily`,`amber`,`celadon`]}))r.includes(e?.[t])&&(n[t]=e[t]);return n}function m(e,t={}){try{let n=e.getItem(d);return p(n?JSON.parse(n):JSON.parse(e.getItem(`spring-letter:journey:v1`)||`null`)?.settings,t)}catch{return p({},t)}}function h(e,t){try{return e.setItem(d,JSON.stringify(p(t))),!0}catch{return!1}}var g={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},_={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},v=1e3,y=1001,b=1002,x=1003,S=1004,C=1005,w=1006,T=1007,E=1008,D=1009,O=1010,k=1011,A=1012,j=1013,M=1014,N=1015,P=1016,F=1017,ee=1018,te=1020,ne=35902,I=35899,re=1021,L=1022,ie=1023,ae=1026,R=1027,oe=1028,se=1029,ce=1030,le=1031,ue=1033,de=33776,fe=33777,pe=33778,me=33779,he=35840,ge=35841,_e=35842,ve=35843,ye=36196,be=37492,xe=37496,Se=37488,Ce=37489,we=37490,Te=37491,Ee=37808,De=37809,Oe=37810,ke=37811,z=37812,Ae=37813,je=37814,Me=37815,B=37816,Ne=37817,V=37818,Pe=37819,Fe=37820,Ie=37821,Le=36492,Re=36494,ze=36495,Be=36283,Ve=36284,He=36285,Ue=36286,We=2300,Ge=2301,Ke=2302,qe=2303,Je=2400,Ye=2401,Xe=2402,Ze=3200,Qe=3201,$e=`srgb`,et=`srgb-linear`,tt=`linear`,nt=`srgb`,rt=7680,it=35044,at=35048,ot=2e3;function st(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ct(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function lt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function ut(){let e=lt(`canvas`);return e.style.display=`block`,e}var dt={};function ft(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function pt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function H(...e){e=pt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function U(...e){e=pt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function mt(...e){let t=e.join(` `);t in dt||(dt[t]=!0,H(...e))}function ht(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var gt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},_t=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},vt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),yt=1234567,bt=Math.PI/180,xt=180/Math.PI;function St(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(vt[e&255]+vt[e>>8&255]+vt[e>>16&255]+vt[e>>24&255]+`-`+vt[t&255]+vt[t>>8&255]+`-`+vt[t>>16&15|64]+vt[t>>24&255]+`-`+vt[n&63|128]+vt[n>>8&255]+`-`+vt[n>>16&255]+vt[n>>24&255]+vt[r&255]+vt[r>>8&255]+vt[r>>16&255]+vt[r>>24&255]).toLowerCase()}function Ct(e,t,n){return Math.max(t,Math.min(n,e))}function wt(e,t){return(e%t+t)%t}function Tt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function Et(e,t,n){return e===t?0:(n-e)/(t-e)}function Dt(e,t,n){return(1-n)*e+n*t}function Ot(e,t,n,r){return Dt(e,t,1-Math.exp(-n*r))}function kt(e,t=1){return t-Math.abs(wt(e,t*2)-t)}function At(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function jt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function Mt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Nt(e,t){return e+Math.random()*(t-e)}function Pt(e){return e*(.5-Math.random())}function Ft(e){e!==void 0&&(yt=e);let t=yt+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function It(e){return e*bt}function Lt(e){return e*xt}function Rt(e){return!(e&e-1)&&e!==0}function zt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Bt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Vt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:H(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Ht(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Ut(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Wt={DEG2RAD:bt,RAD2DEG:xt,generateUUID:St,clamp:Ct,euclideanModulo:wt,mapLinear:Tt,inverseLerp:Et,lerp:Dt,damp:Ot,pingpong:kt,smoothstep:At,smootherstep:jt,randInt:Mt,randFloat:Nt,randFloatSpread:Pt,seededRandom:Ft,degToRad:It,radToDeg:Lt,isPowerOfTwo:Rt,ceilPowerOfTwo:zt,floorPowerOfTwo:Bt,setQuaternionFromProperEuler:Vt,normalize:Ut,denormalize:Ht},W=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ct(this.x,e.x,t.x),this.y=Ct(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ct(this.x,e,t),this.y=Ct(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Gt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:H(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},G=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(qt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(qt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ct(this.x,e.x,t.x),this.y=Ct(this.y,e.y,t.y),this.z=Ct(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ct(this.x,e,t),this.y=Ct(this.y,e,t),this.z=Ct(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Kt.copy(this).projectOnVector(e),this.sub(Kt)}reflect(e){return this.sub(Kt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Kt=new G,qt=new Gt,Jt=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return mt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Yt.makeScale(e,t)),this}rotate(e){return mt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Yt.makeRotation(-e)),this}translate(e,t){return mt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Yt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Yt=new Jt,Xt=new Jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zt=new Jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Qt(){let e={enabled:!0,workingColorSpace:et,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=en(e.r),e.g=en(e.g),e.b=en(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=tn(e.r),e.g=tn(e.g),e.b=tn(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?tt:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return mt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return mt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[et]:{primaries:t,whitePoint:r,transfer:tt,toXYZ:Xt,fromXYZ:Zt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:$e},outputColorSpaceConfig:{drawingBufferColorSpace:$e}},[$e]:{primaries:t,whitePoint:r,transfer:nt,toXYZ:Xt,fromXYZ:Zt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:$e}}}),e}var $t=Qt();function en(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function tn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var nn,rn=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{nn===void 0&&(nn=lt(`canvas`)),nn.width=e.width,nn.height=e.height;let t=nn.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=nn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=lt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=en(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(en(t[e]/255)*255):t[e]=en(t[e]);return{data:t,width:e.width,height:e.height}}return H(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},an=0,on=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:an++}),this.uuid=St(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(sn(r[t].image)):e.push(sn(r[t]))}else e=sn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function sn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?rn.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(H(`Texture: Unable to serialize Texture.`),{})}var cn=0,ln=new G,un=class e extends _t{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=y,i=y,a=w,o=E,s=ie,c=D,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cn++}),this.uuid=St(),this.name=``,this.source=new on(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new W(0,0),this.repeat=new W(1,1),this.center=new W(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ln).x}get height(){return this.source.getSize(ln).y}get depth(){return this.source.getSize(ln).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){H(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case v:e.x-=Math.floor(e.x);break;case y:e.x=e.x<0?0:1;break;case b:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case v:e.y-=Math.floor(e.y);break;case y:e.y=e.y<0?0:1;break;case b:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};un.DEFAULT_IMAGE=null,un.DEFAULT_MAPPING=300,un.DEFAULT_ANISOTROPY=1;var dn=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ct(this.x,e.x,t.x),this.y=Ct(this.y,e.y,t.y),this.z=Ct(this.z,e.z,t.z),this.w=Ct(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ct(this.x,e,t),this.y=Ct(this.y,e,t),this.z=Ct(this.z,e,t),this.w=Ct(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},fn=class extends _t{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:w,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new dn(0,0,e,t),this.scissorTest=!1,this.viewport=new dn(0,0,e,t),this.textures=[];let r=new un({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:w,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new on(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},pn=class extends fn{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},mn=class extends un{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=x,this.minFilter=x,this.wrapR=y,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},hn=class extends un{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=x,this.minFilter=x,this.wrapR=y,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},gn=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/_n.setFromMatrixColumn(e,0).length(),i=1/_n.setFromMatrixColumn(e,1).length(),a=1/_n.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(yn,e,bn)}lookAt(e,t,n){let r=this.elements;return Cn.subVectors(e,t),Cn.lengthSq()===0&&(Cn.z=1),Cn.normalize(),xn.crossVectors(n,Cn),xn.lengthSq()===0&&(Math.abs(n.z)===1?Cn.x+=1e-4:Cn.z+=1e-4,Cn.normalize(),xn.crossVectors(n,Cn)),xn.normalize(),Sn.crossVectors(Cn,xn),r[0]=xn.x,r[4]=Sn.x,r[8]=Cn.x,r[1]=xn.y,r[5]=Sn.y,r[9]=Cn.y,r[2]=xn.z,r[6]=Sn.z,r[10]=Cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],ee=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*ee,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*ee,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*ee,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=_n.set(r[0],r[1],r[2]).length(),o=_n.set(r[4],r[5],r[6]).length(),s=_n.set(r[8],r[9],r[10]).length();i<0&&(a=-a),vn.copy(this);let c=1/a,l=1/o,u=1/s;return vn.elements[0]*=c,vn.elements[1]*=c,vn.elements[2]*=c,vn.elements[4]*=l,vn.elements[5]*=l,vn.elements[6]*=l,vn.elements[8]*=u,vn.elements[9]*=u,vn.elements[10]*=u,t.setFromRotationMatrix(vn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=ot,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=ot,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},_n=new G,vn=new gn,yn=new G(0,0,0),bn=new G(1,1,1),xn=new G,Sn=new G,Cn=new G,wn=new gn,Tn=new Gt,En=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-Ct(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(Ct(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-Ct(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(Ct(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-Ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:H(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return wn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(wn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Tn.setFromEuler(this),this.setFromQuaternion(Tn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};En.DEFAULT_ORDER=`XYZ`;var Dn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},On=0,kn=new G,An=new Gt,jn=new gn,Mn=new G,Nn=new G,Pn=new G,Fn=new Gt,In=new G(1,0,0),Ln=new G(0,1,0),Rn=new G(0,0,1),zn={type:`added`},Bn={type:`removed`},Vn={type:`childadded`,child:null},Hn={type:`childremoved`,child:null},Un=class e extends _t{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:On++}),this.uuid=St(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new G,n=new En,r=new Gt,i=new G(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new gn},normalMatrix:{value:new Jt}}),this.matrix=new gn,this.matrixWorld=new gn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return An.setFromAxisAngle(e,t),this.quaternion.multiply(An),this}rotateOnWorldAxis(e,t){return An.setFromAxisAngle(e,t),this.quaternion.premultiply(An),this}rotateX(e){return this.rotateOnAxis(In,e)}rotateY(e){return this.rotateOnAxis(Ln,e)}rotateZ(e){return this.rotateOnAxis(Rn,e)}translateOnAxis(e,t){return kn.copy(e).applyQuaternion(this.quaternion),this.position.add(kn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(In,e)}translateY(e){return this.translateOnAxis(Ln,e)}translateZ(e){return this.translateOnAxis(Rn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Mn.copy(e):Mn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Nn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(Nn,Mn,this.up):jn.lookAt(Mn,Nn,this.up),this.quaternion.setFromRotationMatrix(jn),r&&(jn.extractRotation(r.matrixWorld),An.setFromRotationMatrix(jn),this.quaternion.premultiply(An.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(U(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zn),Vn.child=e,this.dispatchEvent(Vn),Vn.child=null):U(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Bn),Hn.child=e,this.dispatchEvent(Hn),Hn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),jn.multiply(e.parent.matrixWorld)),e.applyMatrix4(jn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zn),Vn.child=e,this.dispatchEvent(Vn),Vn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nn,e,Pn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nn,Fn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Un.DEFAULT_UP=new G(0,1,0),Un.DEFAULT_MATRIX_AUTO_UPDATE=!0,Un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var K=class extends Un{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Wn={type:`move`},Gn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new K,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new K,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new K,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new K;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Kn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qn={h:0,s:0,l:0},Jn={h:0,s:0,l:0};function Yn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var q=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$t.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=$t.workingColorSpace){return this.r=e,this.g=t,this.b=n,$t.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=$t.workingColorSpace){if(e=wt(e,1),t=Ct(t,0,1),n=Ct(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Yn(i,r,e+1/3),this.g=Yn(i,r,e),this.b=Yn(i,r,e-1/3)}return $t.colorSpaceToWorking(this,r),this}setStyle(e,t=$e){function n(t){t!==void 0&&parseFloat(t)<1&&H(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:H(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);H(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$e){let n=Kn[e.toLowerCase()];return n===void 0?H(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=en(e.r),this.g=en(e.g),this.b=en(e.b),this}copyLinearToSRGB(e){return this.r=tn(e.r),this.g=tn(e.g),this.b=tn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$e){return $t.workingToColorSpace(Xn.copy(this),e),Math.round(Ct(Xn.r*255,0,255))*65536+Math.round(Ct(Xn.g*255,0,255))*256+Math.round(Ct(Xn.b*255,0,255))}getHexString(e=$e){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$t.workingColorSpace){$t.workingToColorSpace(Xn.copy(this),t);let n=Xn.r,r=Xn.g,i=Xn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=$t.workingColorSpace){return $t.workingToColorSpace(Xn.copy(this),t),e.r=Xn.r,e.g=Xn.g,e.b=Xn.b,e}getStyle(e=$e){$t.workingToColorSpace(Xn.copy(this),e);let t=Xn.r,n=Xn.g,r=Xn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(qn),this.setHSL(qn.h+e,qn.s+t,qn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(qn),e.getHSL(Jn);let n=Dt(qn.h,Jn.h,t),r=Dt(qn.s,Jn.s,t),i=Dt(qn.l,Jn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Xn=new q;q.NAMES=Kn;var Zn=class e{constructor(e,t=25e-5){this.isFogExp2=!0,this.name=``,this.color=new q(e),this.density=t}clone(){return new e(this.color,this.density)}toJSON(){return{type:`FogExp2`,name:this.name,color:this.color.getHex(),density:this.density}}},Qn=class extends Un{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},$n=new G,er=new G,tr=new G,nr=new G,rr=new G,ir=new G,ar=new G,or=new G,sr=new G,cr=new G,lr=new dn,ur=new dn,dr=new dn,fr=class e{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),$n.subVectors(e,t),r.cross($n);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){$n.subVectors(r,t),er.subVectors(n,t),tr.subVectors(e,t);let a=$n.dot($n),o=$n.dot(er),s=$n.dot(tr),c=er.dot(er),l=er.dot(tr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,nr)!==null&&nr.x>=0&&nr.y>=0&&nr.x+nr.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,nr)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,nr.x),s.addScaledVector(a,nr.y),s.addScaledVector(o,nr.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return lr.setScalar(0),ur.setScalar(0),dr.setScalar(0),lr.fromBufferAttribute(e,t),ur.fromBufferAttribute(e,n),dr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(lr,i.x),a.addScaledVector(ur,i.y),a.addScaledVector(dr,i.z),a}static isFrontFacing(e,t,n,r){return $n.subVectors(n,t),er.subVectors(e,t),$n.cross(er).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $n.subVectors(this.c,this.b),er.subVectors(this.a,this.b),$n.cross(er).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;rr.subVectors(r,n),ir.subVectors(i,n),or.subVectors(e,n);let s=rr.dot(or),c=ir.dot(or);if(s<=0&&c<=0)return t.copy(n);sr.subVectors(e,r);let l=rr.dot(sr),u=ir.dot(sr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(rr,a);cr.subVectors(e,i);let f=rr.dot(cr),p=ir.dot(cr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ir,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return ar.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(ar,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(rr,a).addScaledVector(ir,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},pr=class{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(hr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(hr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=hr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,hr):hr.fromBufferAttribute(r,t),hr.applyMatrix4(e.matrixWorld),this.expandByPoint(hr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),gr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),gr.copy(e.boundingBox)),gr.applyMatrix4(e.matrixWorld),this.union(gr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,hr),hr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Cr),wr.subVectors(this.max,Cr),_r.subVectors(e.a,Cr),vr.subVectors(e.b,Cr),yr.subVectors(e.c,Cr),br.subVectors(vr,_r),xr.subVectors(yr,vr),Sr.subVectors(_r,yr);let t=[0,-br.z,br.y,0,-xr.z,xr.y,0,-Sr.z,Sr.y,br.z,0,-br.x,xr.z,0,-xr.x,Sr.z,0,-Sr.x,-br.y,br.x,0,-xr.y,xr.x,0,-Sr.y,Sr.x,0];return!Dr(t,_r,vr,yr,wr)||(t=[1,0,0,0,1,0,0,0,1],!Dr(t,_r,vr,yr,wr))?!1:(Tr.crossVectors(br,xr),t=[Tr.x,Tr.y,Tr.z],Dr(t,_r,vr,yr,wr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,hr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(hr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(mr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mr)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},mr=[new G,new G,new G,new G,new G,new G,new G,new G],hr=new G,gr=new pr,_r=new G,vr=new G,yr=new G,br=new G,xr=new G,Sr=new G,Cr=new G,wr=new G,Tr=new G,Er=new G;function Dr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Er.fromArray(e,a);let o=i.x*Math.abs(Er.x)+i.y*Math.abs(Er.y)+i.z*Math.abs(Er.z),s=t.dot(Er),c=n.dot(Er),l=r.dot(Er);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Or=kr();function kr(){let e=new ArrayBuffer(4),t=new Float32Array(e),n=new Uint32Array(e),r=new Uint32Array(512),i=new Uint32Array(512);for(let e=0;e<256;++e){let t=e-127;t<-27?(r[e]=0,r[e|256]=32768,i[e]=24,i[e|256]=24):t<-14?(r[e]=1024>>-t-14,r[e|256]=1024>>-t-14|32768,i[e]=-t-1,i[e|256]=-t-1):t<=15?(r[e]=t+15<<10,r[e|256]=t+15<<10|32768,i[e]=13,i[e|256]=13):t<128?(r[e]=31744,r[e|256]=64512,i[e]=24,i[e|256]=24):(r[e]=31744,r[e|256]=64512,i[e]=13,i[e|256]=13)}let a=new Uint32Array(2048),o=new Uint32Array(64),s=new Uint32Array(64);for(let e=1;e<1024;++e){let t=e<<13,n=0;for(;!(t&8388608);)t<<=1,n-=8388608;t&=-8388609,n+=947912704,a[e]=t|n}for(let e=1024;e<2048;++e)a[e]=939524096+(e-1024<<13);for(let e=1;e<31;++e)o[e]=e<<23;o[31]=1199570944,o[32]=2147483648;for(let e=33;e<63;++e)o[e]=2147483648+(e-32<<23);o[63]=3347054592;for(let e=1;e<64;++e)e!==32&&(s[e]=1024);return{floatView:t,uint32View:n,baseTable:r,shiftTable:i,mantissaTable:a,exponentTable:o,offsetTable:s}}function Ar(e){Math.abs(e)>65504&&H(`DataUtils.toHalfFloat(): Value out of range.`),e=Ct(e,-65504,65504),Or.floatView[0]=e;let t=Or.uint32View[0],n=t>>23&511;return Or.baseTable[n]+((t&8388607)>>Or.shiftTable[n])}function jr(e){let t=e>>10;return Or.uint32View[0]=Or.mantissaTable[Or.offsetTable[t]+(e&1023)]+Or.exponentTable[t],Or.floatView[0]}var Mr=class{static toHalfFloat(e){return Ar(e)}static fromHalfFloat(e){return jr(e)}},Nr=new G,Pr=new W,Fr=0,Ir=class extends _t{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Fr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=it,this.updateRanges=[],this.gpuType=N,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.applyMatrix3(e),this.setXY(t,Pr.x,Pr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.applyMatrix3(e),this.setXYZ(t,Nr.x,Nr.y,Nr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.applyMatrix4(e),this.setXYZ(t,Nr.x,Nr.y,Nr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.applyNormalMatrix(e),this.setXYZ(t,Nr.x,Nr.y,Nr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.transformDirection(e),this.setXYZ(t,Nr.x,Nr.y,Nr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ht(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ht(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ht(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ht(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ht(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),n=Ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),n=Ut(n,this.array),r=Ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),n=Ut(n,this.array),r=Ut(r,this.array),i=Ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},Lr=class extends Ir{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Rr=class extends Ir{constructor(e,t,n){super(new Uint32Array(e),t,n)}},J=class extends Ir{constructor(e,t,n){super(new Float32Array(e),t,n)}},zr=new pr,Br=new G,Vr=new G,Hr=class{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?zr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Br.subVectors(e,this.center);let t=Br.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Br,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Vr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Br.copy(e.center).add(Vr)),this.expandByPoint(Br.copy(e.center).sub(Vr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Ur=0,Wr=new gn,Gr=new Un,Kr=new G,qr=new pr,Jr=new pr,Yr=new G,Xr=class e extends _t{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ur++}),this.uuid=St(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(st(e)?Rr:Lr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Jt().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Wr.makeRotationFromQuaternion(e),this.applyMatrix4(Wr),this}rotateX(e){return Wr.makeRotationX(e),this.applyMatrix4(Wr),this}rotateY(e){return Wr.makeRotationY(e),this.applyMatrix4(Wr),this}rotateZ(e){return Wr.makeRotationZ(e),this.applyMatrix4(Wr),this}translate(e,t,n){return Wr.makeTranslation(e,t,n),this.applyMatrix4(Wr),this}scale(e,t,n){return Wr.makeScale(e,t,n),this.applyMatrix4(Wr),this}lookAt(e){return Gr.lookAt(e),Gr.updateMatrix(),this.applyMatrix4(Gr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Kr).negate(),this.translate(Kr.x,Kr.y,Kr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new J(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&H(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];qr.setFromBufferAttribute(n),this.morphTargetsRelative?(Yr.addVectors(this.boundingBox.min,qr.min),this.boundingBox.expandByPoint(Yr),Yr.addVectors(this.boundingBox.max,qr.max),this.boundingBox.expandByPoint(Yr)):(this.boundingBox.expandByPoint(qr.min),this.boundingBox.expandByPoint(qr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&U(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new G,1/0);else if(e){let n=this.boundingSphere.center;if(qr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Jr.setFromBufferAttribute(n),this.morphTargetsRelative?(Yr.addVectors(qr.min,Jr.min),qr.expandByPoint(Yr),Yr.addVectors(qr.max,Jr.max),qr.expandByPoint(Yr)):(qr.expandByPoint(Jr.min),qr.expandByPoint(Jr.max))}qr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Yr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Yr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Yr.fromBufferAttribute(a,t),o&&(Kr.fromBufferAttribute(e,t),Yr.add(Kr)),r=Math.max(r,n.distanceToSquared(Yr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&U(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){U(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Ir(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new G,s[e]=new G;let c=new G,l=new G,u=new G,d=new W,f=new W,p=new W,m=new G,h=new G;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new G,y=new G,b=new G,x=new G;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Ir(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new G,i=new G,a=new G,o=new G,s=new G,c=new G,l=new G,u=new G;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Yr.fromBufferAttribute(e,t),Yr.normalize(),e.setXYZ(t,Yr.x,Yr.y,Yr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Ir(a,r,i)}if(this.index===null)return H(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Zr=0,Qr=class extends _t{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zr++}),this.uuid=St(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new q(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rt,this.stencilZFail=rt,this.stencilZPass=rt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){H(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new q().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new W().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new W().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},$r=new G,ei=new G,ti=new G,ni=new G,ri=new G,ii=new G,ai=new G,oi=class{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$r)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=$r.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($r.copy(this.origin).addScaledVector(this.direction,t),$r.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ei.copy(e).add(t).multiplyScalar(.5),ti.copy(t).sub(e).normalize(),ni.copy(this.origin).sub(ei);let i=e.distanceTo(t)*.5,a=-this.direction.dot(ti),o=ni.dot(this.direction),s=-ni.dot(ti),c=ni.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ei).addScaledVector(ti,d),f}intersectSphere(e,t){$r.subVectors(e.center,this.origin);let n=$r.dot(this.direction),r=$r.dot($r)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,$r)!==null}intersectTriangle(e,t,n,r,i){ri.subVectors(t,e),ii.subVectors(n,e),ai.crossVectors(ri,ii);let a=this.direction.dot(ai),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ni.subVectors(this.origin,e);let s=o*this.direction.dot(ii.crossVectors(ni,ii));if(s<0)return null;let c=o*this.direction.dot(ri.cross(ni));if(c<0||s+c>a)return null;let l=-o*ni.dot(ai);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},si=class extends Qr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ci=new gn,li=new oi,ui=new Hr,di=new G,fi=new G,pi=new G,mi=new G,hi=new G,gi=new G,_i=new G,vi=new G,yi=class extends Un{constructor(e=new Xr,t=new si){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){gi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(hi.fromBufferAttribute(s,e),a?gi.addScaledVector(hi,r):gi.addScaledVector(hi.sub(t),r))}t.add(gi)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ui.copy(n.boundingSphere),ui.applyMatrix4(i),li.copy(e.ray).recast(e.near),ui.containsPoint(li.origin)===!1&&(li.intersectSphere(ui,di)===null||li.origin.distanceToSquared(di)>(e.far-e.near)**2)||(ci.copy(i).invert(),li.copy(e.ray).applyMatrix4(ci),(n.boundingBox===null||li.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,li)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=xi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=xi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=xi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=xi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function bi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;vi.copy(s),vi.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(vi);return l<n.near||l>n.far?null:{distance:l,point:vi.clone(),object:e}}function xi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,fi),e.getVertexPosition(c,pi),e.getVertexPosition(l,mi);let u=bi(e,t,n,r,fi,pi,mi,_i);if(u){let e=new G;fr.getBarycoord(_i,fi,pi,mi,e),i&&(u.uv=fr.getInterpolatedAttribute(i,s,c,l,e,new W)),a&&(u.uv1=fr.getInterpolatedAttribute(a,s,c,l,e,new W)),o&&(u.normal=fr.getInterpolatedAttribute(o,s,c,l,e,new G),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new G,materialIndex:0};fr.getNormal(fi,pi,mi,t.normal),u.face=t,u.barycoord=e}return u}var Si=class extends un{constructor(e=null,t=1,n=1,r,i,a,o,s,c=x,l=x,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ci=class extends Ir{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},wi=new gn,Ti=new gn,Ei=[],Di=new pr,Oi=new gn,ki=new yi,Ai=new Hr,ji=class extends yi{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ci(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Oi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new pr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,wi),Di.copy(e.boundingBox).applyMatrix4(wi),this.boundingBox.union(Di)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Hr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,wi),Ai.copy(e.boundingSphere).applyMatrix4(wi),this.boundingSphere.union(Ai)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(ki.geometry=this.geometry,ki.material=this.material,ki.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ai.copy(this.boundingSphere),Ai.applyMatrix4(n),e.ray.intersectsSphere(Ai)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,wi),Ti.multiplyMatrices(n,wi),ki.matrixWorld=Ti,ki.raycast(e,Ei);for(let e=0,n=Ei.length;e<n;e++){let n=Ei[e];n.instanceId=i,n.object=this,t.push(n)}Ei.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ci(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Si(new Float32Array(r*this.count),r,this.count,oe,N));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Mi=new G,Ni=new G,Pi=new Jt,Fi=class{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Mi.subVectors(n,t).cross(Ni.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Mi),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Pi.getNormalMatrix(e),r=this.coplanarPoint(Mi).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ii=new Hr,Li=new W(.5,.5),Ri=new G,zi=class{constructor(e=new Fi,t=new Fi,n=new Fi,r=new Fi,i=new Fi,a=new Fi){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ot,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ii)}intersectsSprite(e){return Ii.center.set(0,0,0),Ii.radius=.7071067811865476+Li.distanceTo(e.center),Ii.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ii)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ri.x=r.normal.x>0?e.max.x:e.min.x,Ri.y=r.normal.y>0?e.max.y:e.min.y,Ri.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ri)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Bi=class extends Qr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new q(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Vi=new G,Hi=new G,Ui=new gn,Wi=new oi,Gi=new Hr,Ki=new G,qi=new G,Ji=class extends Un{constructor(e=new Xr,t=new Bi){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)Vi.fromBufferAttribute(t,e-1),Hi.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=Vi.distanceTo(Hi);e.setAttribute(`lineDistance`,new J(n,1))}else H(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Gi.copy(n.boundingSphere),Gi.applyMatrix4(r),Gi.radius+=i,e.ray.intersectsSphere(Gi)===!1)return;Ui.copy(r).invert(),Wi.copy(e.ray).applyMatrix4(Ui);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=Yi(this,e,Wi,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=Yi(this,e,Wi,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=Yi(this,e,Wi,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=Yi(this,e,Wi,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Yi(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(Vi.fromBufferAttribute(s,i),Hi.fromBufferAttribute(s,a),n.distanceSqToSegment(Vi,Hi,Ki,qi)>r)return;Ki.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(Ki);if(!(c<t.near||c>t.far))return{distance:c,point:qi.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var Xi=new G,Zi=new G,Qi=class extends Ji{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)Xi.fromBufferAttribute(t,e),Zi.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+Xi.distanceTo(Zi);e.setAttribute(`lineDistance`,new J(n,1))}else H(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},$i=class extends Qr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new q(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ea=new gn,ta=new oi,na=new Hr,ra=new G,ia=class extends Un{constructor(e=new Xr,t=new $i){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),na.copy(n.boundingSphere),na.applyMatrix4(r),na.radius+=i,e.ray.intersectsSphere(na)===!1)return;ea.copy(r).invert(),ta.copy(e.ray).applyMatrix4(ea);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);ra.fromBufferAttribute(l,n),aa(ra,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)ra.fromBufferAttribute(l,a),aa(ra,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function aa(e,t,n,r,i,a,o){let s=ta.distanceSqToPoint(e);if(s<n){let n=new G;ta.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var oa=class extends un{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},sa=class extends un{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},ca=class extends un{constructor(e,t,n=M,r,i,a,o=x,s=x,c,l=ae,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new on(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},la=class extends ca{constructor(e,t=M,n=301,r,i,a=x,o=x,s,c=ae){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ua=class extends un{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},da=class e extends Xr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new J(c,3)),this.setAttribute(`normal`,new J(l,3)),this.setAttribute(`uv`,new J(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new G;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},fa=class e extends Xr{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new G,g=new G;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new J(o,3)),this.setAttribute(`normal`,new J(s,3)),this.setAttribute(`uv`,new J(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},pa=class e extends Xr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new J(u,3)),this.setAttribute(`normal`,new J(d,3)),this.setAttribute(`uv`,new J(f,2));function _(){let a=new G,_=new G,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new W,m=new G,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ma=class e extends pa{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ha=class e extends Xr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new J(i,3)),this.setAttribute(`normal`,new J(i.slice(),3)),this.setAttribute(`uv`,new J(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new G,r=new G,i=new G;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new G;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new G;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new G,t=new G,n=new G,r=new G,o=new W,s=new W,c=new W;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},ga=class e extends ha{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},_a=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){H(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new W:new G);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new G,r=[],i=[],a=[],o=new G,s=new gn;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new G)}i[0]=new G,a[0]=new G;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(Ct(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(Ct(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},va=class extends _a{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new W){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ya=class extends va{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function ba(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var xa=new G,Sa=new G,Ca=new ba,wa=new ba,Ta=new ba,Ea=class extends _a{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new G){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Sa.subVectors(r[0],r[1]).add(r[0]),c=Sa);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(xa.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=xa),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Ca.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),wa.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Ta.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Ca.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),wa.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Ta.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Ca.calc(s),wa.calc(s),Ta.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new G().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Da(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Oa(e,t){let n=1-e;return n*n*t}function ka(e,t){return 2*(1-e)*e*t}function Aa(e,t){return e*e*t}function ja(e,t,n,r){return Oa(e,t)+ka(e,n)+Aa(e,r)}function Ma(e,t){let n=1-e;return n*n*n*t}function Na(e,t){let n=1-e;return 3*n*n*e*t}function Pa(e,t){return 3*(1-e)*e*e*t}function Fa(e,t){return e*e*e*t}function Ia(e,t,n,r,i){return Ma(e,t)+Na(e,n)+Pa(e,r)+Fa(e,i)}var La=class extends _a{constructor(e=new W,t=new W,n=new W,r=new W){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new W){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ia(e,r.x,i.x,a.x,o.x),Ia(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ra=class extends _a{constructor(e=new G,t=new G,n=new G,r=new G){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ia(e,r.x,i.x,a.x,o.x),Ia(e,r.y,i.y,a.y,o.y),Ia(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},za=class extends _a{constructor(e=new W,t=new W){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new W){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new W){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ba=class extends _a{constructor(e=new G,t=new G){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new G){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new G){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Va=class extends _a{constructor(e=new W,t=new W,n=new W){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new W){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ja(e,r.x,i.x,a.x),ja(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ha=class extends _a{constructor(e=new G,t=new G,n=new G){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ja(e,r.x,i.x,a.x),ja(e,r.y,i.y,a.y),ja(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ua=class extends _a{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new W){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Da(o,s.x,c.x,l.x,u.x),Da(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new W().fromArray(n))}return this}},Wa=Object.freeze({__proto__:null,ArcCurve:ya,CatmullRomCurve3:Ea,CubicBezierCurve:La,CubicBezierCurve3:Ra,EllipseCurve:va,LineCurve:za,LineCurve3:Ba,QuadraticBezierCurve:Va,QuadraticBezierCurve3:Ha,SplineCurve:Ua}),Ga=class extends _a{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new Wa[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new Wa[n.type]().fromJSON(n))}return this}},Ka=class extends Ga{constructor(e){super(),this.type=`Path`,this.currentPoint=new W,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new za(this.currentPoint.clone(),new W(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new Va(this.currentPoint.clone(),new W(e,t),new W(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new La(this.currentPoint.clone(),new W(e,t),new W(n,r),new W(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new Ua([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new va(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},qa=class extends Ka{constructor(e){super(e),this.uuid=St(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new Ka().fromJSON(n))}return this}};function Ja(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=Ya(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=no(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Za(a,o,n,s,c,l,0),o}function Ya(e,t,n,r,i){let a;if(i===Do(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=wo(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=wo(i/r|0,e[i],e[i+1],a);return a&&go(a,a.next)&&(To(a),a=a.next),a}function Xa(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(go(n,n.next)||ho(n.prev,n,n.next)===0)){if(To(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Za(e,t,n,r,i,a,o){if(!e)return;!o&&a&&so(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?$a(e,r,i,a):Qa(e))t.push(c.i,e.i,l.i),To(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=eo(Xa(e),t),Za(e,t,n,r,i,a,2)):o===2&&to(e,t,n,r,i,a):Za(Xa(e),t,n,r,i,a,1);break}}}function Qa(e){let t=e.prev,n=e,r=e.next;if(ho(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&po(i,s,a,c,o,l,m.x,m.y)&&ho(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function $a(e,t,n,r){let i=e.prev,a=e,o=e.next;if(ho(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=lo(p,m,t,n,r),v=lo(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&po(s,u,c,d,l,f,y.x,y.y)&&ho(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&po(s,u,c,d,l,f,b.x,b.y)&&ho(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&po(s,u,c,d,l,f,y.x,y.y)&&ho(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&po(s,u,c,d,l,f,b.x,b.y)&&ho(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function eo(e,t){let n=e;do{let r=n.prev,i=n.next.next;!go(r,i)&&_o(r,n,n.next,i)&&xo(r,i)&&xo(i,r)&&(t.push(r.i,n.i,i.i),To(n),To(n.next),n=e=i),n=n.next}while(n!==e);return Xa(n)}function to(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&mo(o,e)){let s=Co(o,e);o=Xa(o,o.next),s=Xa(s,s.next),Za(o,t,n,r,i,a,0),Za(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function no(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=Ya(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(uo(o))}i.sort(ro);for(let e=0;e<i.length;e++)n=io(i[e],n);return n}function ro(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function io(e,t){let n=ao(e,t);if(!n)return t;let r=Co(n,e);return Xa(r,r.next),Xa(n,n.next)}function ao(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(go(e,n))return n;do{if(go(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&fo(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);xo(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&oo(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function oo(e,t){return ho(e.prev,e,t.prev)<0&&ho(t.next,e,e.next)<0}function so(e,t,n,r){let i=e;do i.z===0&&(i.z=lo(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,co(i)}function co(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function lo(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function uo(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function fo(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function po(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&fo(e,t,n,r,i,a,o,s)}function mo(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!bo(e,t)&&(xo(e,t)&&xo(t,e)&&So(e,t)&&(ho(e.prev,e,t.prev)||ho(e,t.prev,t))||go(e,t)&&ho(e.prev,e,e.next)>0&&ho(t.prev,t,t.next)>0)}function ho(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function go(e,t){return e.x===t.x&&e.y===t.y}function _o(e,t,n,r){let i=yo(ho(e,t,n)),a=yo(ho(e,t,r)),o=yo(ho(n,r,e)),s=yo(ho(n,r,t));return!!(i!==a&&o!==s||i===0&&vo(e,n,t)||a===0&&vo(e,r,t)||o===0&&vo(n,e,r)||s===0&&vo(n,t,r))}function vo(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function yo(e){return e>0?1:e<0?-1:0}function bo(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&_o(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function xo(e,t){return ho(e.prev,e,e.next)<0?ho(e,t,e.next)>=0&&ho(e,e.prev,t)>=0:ho(e,t,e.prev)<0||ho(e,e.next,t)<0}function So(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Co(e,t){let n=Eo(e.i,e.x,e.y),r=Eo(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function wo(e,t,n,r){let i=Eo(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function To(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Eo(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Do(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Oo=class{static triangulate(e,t,n=2){return Ja(e,t,n)}},ko=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Ao(e),jo(n,e);let a=e.length;t.forEach(Ao);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,jo(n,t[e]);let o=Oo.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Ao(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function jo(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Mo=class e extends Xr{constructor(e=new qa([new W(.5,.5),new W(-.5,.5),new W(-.5,-.5),new W(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new J(r,3)),this.setAttribute(`uv`,new J(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?No:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new G,b=new G,x=new G}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!ko.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];ko.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||U(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new W(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new W(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let M=[],N,P=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];N=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),N[e]=A(t[e],t[r],t[i]);M.push(N),P=P.concat(N)}let F;if(p===0)F=ko.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);L(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];N=M[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],N[e],a);L(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}F=ko.triangulateShape(e,t)}let ee=F.length,te=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],P[e],te):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),L(x.x,x.y,x.z)):L(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],P[t],te):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),L(x.x,x.y,x.z)):L(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);L(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];N=M[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],N[e],r);_?L(i.x,i.y+g[s-1].y,g[s-1].x+n):L(i.x,i.y,c+n)}}}ne(),I();function ne(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<ee;e++){let n=F[e];ie(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<ee;e++){let n=F[e];ie(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<ee;e++){let t=F[e];ie(t[2],t[1],t[0])}for(let e=0;e<ee;e++){let t=F[e];ie(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function I(){let e=r.length/3,t=0;re(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];re(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function re(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);ae(t+r+n,t+i+n,t+i+a,t+r+a)}}}function L(e,t,n){a.push(e),a.push(t),a.push(n)}function ie(e,t,i){R(e),R(t),R(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);oe(o[0]),oe(o[1]),oe(o[2])}function ae(e,t,i,a){R(e),R(t),R(a),R(t),R(i),R(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);oe(s[0]),oe(s[1]),oe(s[3]),oe(s[1]),oe(s[2]),oe(s[3])}function R(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function oe(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Po(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Wa[i.type]().fromJSON(i)),new e(r,t.options)}},No={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new W(a,o),new W(s,c),new W(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new W(o,1-c),new W(l,1-d),new W(f,1-m),new W(h,1-_)]:[new W(s,1-c),new W(u,1-d),new W(p,1-m),new W(g,1-_)]}};function Po(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var Fo=class e extends ha{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Io=class e extends Xr{constructor(e=[new W(0,-.5),new W(.5,0),new W(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=Ct(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new G,d=new W,f=new G,p=new G,m=new G,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new J(a,3)),this.setAttribute(`uv`,new J(o,2)),this.setAttribute(`normal`,new J(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},Lo=class e extends ha{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Ro=class e extends Xr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new J(p,3)),this.setAttribute(`normal`,new J(m,3)),this.setAttribute(`uv`,new J(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},zo=class e extends Xr{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new G,p=new W;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new J(s,3)),this.setAttribute(`normal`,new J(c,3)),this.setAttribute(`uv`,new J(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Bo=class e extends Xr{constructor(e=new qa([new W(0,.5),new W(-.5,-.5),new W(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new J(r,3)),this.setAttribute(`normal`,new J(i,3)),this.setAttribute(`uv`,new J(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;ko.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];ko.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=ko.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Vo(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function Vo(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var Ho=class e extends Xr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new G,d=new G,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new J(p,3)),this.setAttribute(`normal`,new J(m,3)),this.setAttribute(`uv`,new J(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Uo=class e extends Xr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new G,f=new G,p=new G;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new J(c,3)),this.setAttribute(`normal`,new J(l,3)),this.setAttribute(`uv`,new J(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},Wo=class e extends Xr{constructor(e=new Ha(new G(-1,-1,0),new G(-1,1,0),new G(1,1,0)),t=64,n=1,r=8,i=!1){super(),this.type=`TubeGeometry`,this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:i};let a=e.computeFrenetFrames(t,i);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new G,s=new G,c=new W,l=new G,u=[],d=[],f=[],p=[];m(),this.setIndex(p),this.setAttribute(`position`,new J(u,3)),this.setAttribute(`normal`,new J(d,3)),this.setAttribute(`uv`,new J(f,2));function m(){for(let e=0;e<t;e++)h(e);h(i===!1?t:0),_(),g()}function h(i){l=e.getPointAt(i/t,l);let c=a.normals[i],f=a.binormals[i];for(let e=0;e<=r;e++){let t=e/r*Math.PI*2,i=Math.sin(t),a=-Math.cos(t);s.x=a*c.x+i*f.x,s.y=a*c.y+i*f.y,s.z=a*c.z+i*f.z,s.normalize(),d.push(s.x,s.y,s.z),o.x=l.x+n*s.x,o.y=l.y+n*s.y,o.z=l.z+n*s.z,u.push(o.x,o.y,o.z)}}function g(){for(let e=1;e<=t;e++)for(let t=1;t<=r;t++){let n=(r+1)*(e-1)+(t-1),i=(r+1)*e+(t-1),a=(r+1)*e+t,o=(r+1)*(e-1)+t;p.push(n,i,o),p.push(i,a,o)}}function _(){for(let e=0;e<=t;e++)for(let n=0;n<=r;n++)c.x=e/t,c.y=n/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(t){return new e(new Wa[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function Go(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(qo(i))i.isRenderTargetTexture?(H(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(qo(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Ko(e){let t={};for(let n=0;n<e.length;n++){let r=Go(e[n]);for(let e in r)t[e]=r[e]}return t}function qo(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Jo(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Yo(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}var Xo={clone:Go,merge:Ko},Zo=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qo=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,$o=class extends Qr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zo,this.fragmentShader=Qo,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Go(e.uniforms),this.uniformsGroups=Jo(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new q().setHex(r.value);break;case`v2`:this.uniforms[n].value=new W().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new dn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Jt().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new gn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},es=class extends $o{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},ts=class extends Qr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new q(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ns=class extends ts{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new W(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ct(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new q(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new q(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new q(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},rs=class extends Qr{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type=`MeshNormalMaterial`,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},is=class extends Qr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Ze,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},as=class extends Qr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function os(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var ss=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},cs=class extends ss{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Je,endingEnd:Je}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ye:i=e,o=2*t-n;break;case Xe:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Ye:a=e,s=2*n-t;break;case Xe:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},ls=class extends ss{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},us=class extends ss{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},ds=class extends ss{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},fs=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=os(t,this.TimeBufferType),this.values=os(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:os(e.times,Array),values:os(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new us(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ls(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new cs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ds(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case We:t=this.InterpolantFactoryMethodDiscrete;break;case Ge:t=this.InterpolantFactoryMethodLinear;break;case Ke:t=this.InterpolantFactoryMethodSmooth;break;case qe:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return H(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return We;case this.InterpolantFactoryMethodLinear:return Ge;case this.InterpolantFactoryMethodSmooth:return Ke;case this.InterpolantFactoryMethodBezier:return qe}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(U(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(U(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){U(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){U(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ct(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){U(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ke,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};fs.prototype.ValueTypeName=``,fs.prototype.TimeBufferType=Float32Array,fs.prototype.ValueBufferType=Float32Array,fs.prototype.DefaultInterpolation=Ge;var ps=class extends fs{constructor(e,t,n){super(e,t,n)}};ps.prototype.ValueTypeName=`bool`,ps.prototype.ValueBufferType=Array,ps.prototype.DefaultInterpolation=We,ps.prototype.InterpolantFactoryMethodLinear=void 0,ps.prototype.InterpolantFactoryMethodSmooth=void 0;var ms=class extends fs{constructor(e,t,n,r){super(e,t,n,r)}};ms.prototype.ValueTypeName=`color`;var hs=class extends fs{constructor(e,t,n,r){super(e,t,n,r)}};hs.prototype.ValueTypeName=`number`;var gs=class extends ss{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Gt.slerpFlat(i,0,a,c-o,a,c,s);return i}},_s=class extends fs{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new gs(this.times,this.values,this.getValueSize(),e)}};_s.prototype.ValueTypeName=`quaternion`,_s.prototype.InterpolantFactoryMethodSmooth=void 0;var vs=class extends fs{constructor(e,t,n){super(e,t,n)}};vs.prototype.ValueTypeName=`string`,vs.prototype.ValueBufferType=Array,vs.prototype.DefaultInterpolation=We,vs.prototype.InterpolantFactoryMethodLinear=void 0,vs.prototype.InterpolantFactoryMethodSmooth=void 0;var ys=class extends fs{constructor(e,t,n,r){super(e,t,n,r)}};ys.prototype.ValueTypeName=`vector`;var bs={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(xs(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!xs(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function xs(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var Ss=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Cs=class{constructor(e){this.manager=e===void 0?Ss:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Cs.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var ws={},Ts=class extends Error{constructor(e,t){super(e),this.response=t}},Es=class extends Cs{constructor(e){super(e),this.mimeType=``,this.responseType=``,this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=bs.get(`file:${e}`);if(i!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(i),this.manager.itemEnd(e)},0);return}if(ws[e]!==void 0){ws[e].push({onLoad:t,onProgress:n,onError:r});return}ws[e]=[],ws[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?`include`:`same-origin`,signal:typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,s=this.responseType;fetch(a).then(t=>{if(t.status===200||t.status===0){if(t.status===0&&H(`FileLoader: HTTP Status 0 received.`),typeof ReadableStream>`u`||t.body===void 0||t.body.getReader===void 0)return t;let n=ws[e],r=t.body.getReader(),i=t.headers.get(`X-File-Size`)||t.headers.get(`Content-Length`),a=i?parseInt(i):0,o=a!==0,s=0,c=new ReadableStream({start(e){t();function t(){r.read().then(({done:r,value:i})=>{if(r)e.close();else{s+=i.byteLength;let r=new ProgressEvent(`progress`,{lengthComputable:o,loaded:s,total:a});for(let e=0,t=n.length;e<t;e++){let t=n[e];t.onProgress&&t.onProgress(r)}e.enqueue(i),t()}},t=>{e.error(t)})}}});return new Response(c)}throw new Ts(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,t)}).then(e=>{switch(s){case`arraybuffer`:return e.arrayBuffer();case`blob`:return e.blob();case`document`:return e.text().then(e=>new DOMParser().parseFromString(e,o));case`json`:return e.json();default:if(o===``)return e.text();{let t=/charset="?([^;"\s]*)"?/i.exec(o),n=t&&t[1]?t[1].toLowerCase():void 0,r=new TextDecoder(n);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(t=>{bs.add(`file:${e}`,t);let n=ws[e];delete ws[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onLoad&&r.onLoad(t)}}).catch(t=>{let n=ws[e];if(n===void 0)throw this.manager.itemError(e),t;delete ws[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Ds=new WeakMap,Os=class extends Cs{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=bs.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Ds.get(a);e===void 0&&(e=[],Ds.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=lt(`img`);function s(){l(),t&&t(this);let n=Ds.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Ds.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),bs.remove(`image:${e}`);let n=Ds.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Ds.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),bs.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},ks=class extends Cs{constructor(e){super(e)}load(e,t,n,r){let i=this,a=new Si,o=new Es(this.manager);return o.setResponseType(`arraybuffer`),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(i.withCredentials),o.load(e,function(e){let n;try{n=i.parse(e)}catch(e){r===void 0?U(e):r(e);return}i._applyTexData(a,n),t&&t(a,n)},n,r),a}createDataTexture(e){let t=new Si;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image===void 0?t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data):e.image=t.image,e.wrapS=t.wrapS===void 0?y:t.wrapS,e.wrapT=t.wrapT===void 0?y:t.wrapT,e.magFilter=t.magFilter===void 0?w:t.magFilter,e.minFilter=t.minFilter===void 0?w:t.minFilter,e.anisotropy=t.anisotropy===void 0?1:t.anisotropy,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=E),t.mipmapCount===1&&(e.minFilter=w),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}},As=class extends Cs{constructor(e){super(e)}load(e,t,n,r){let i=new un,a=new Os(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},js=class extends Un{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new q(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Ms=class extends js{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Un.DEFAULT_UP),this.updateMatrix(),this.groundColor=new q(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ns=new gn,Ps=new G,Fs=new G,Is=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new W(512,512),this.mapType=D,this.map=null,this.mapPass=null,this.matrix=new gn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zi,this._frameExtents=new W(1,1),this._viewportCount=1,this._viewports=[new dn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Ps.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ps),Fs.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Fs),t.updateMatrixWorld(),Ns.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ns,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ns)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ls=new G,Rs=new Gt,zs=new G,Bs=class extends Un{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new gn,this.projectionMatrix=new gn,this.projectionMatrixInverse=new gn,this.coordinateSystem=ot,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ls,Rs,zs),zs.x===1&&zs.y===1&&zs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ls,Rs,zs.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ls,Rs,zs),zs.x===1&&zs.y===1&&zs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ls,Rs,zs.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Vs=new G,Hs=new W,Us=new W,Ws=class extends Bs{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=xt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(bt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return xt*2*Math.atan(Math.tan(bt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Vs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Vs.x,Vs.y).multiplyScalar(-e/Vs.z),Vs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vs.x,Vs.y).multiplyScalar(-e/Vs.z)}getViewSize(e,t){return this.getViewBounds(e,Hs,Us),t.subVectors(Us,Hs)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(bt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Gs=class extends Is{constructor(){super(new Ws(90,1,.5,500)),this.isPointLightShadow=!0}},Ks=class extends js{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Gs}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},qs=class extends Bs{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Js=class extends Is{constructor(){super(new qs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ys=class extends js{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Un.DEFAULT_UP),this.updateMatrix(),this.target=new Un,this.shadow=new Js}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Xs=-90,Zs=1,Qs=class extends Un{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Ws(Xs,Zs,e,t);r.layers=this.layers,this.add(r);let i=new Ws(Xs,Zs,e,t);i.layers=this.layers,this.add(i);let a=new Ws(Xs,Zs,e,t);a.layers=this.layers,this.add(a);let o=new Ws(Xs,Zs,e,t);o.layers=this.layers,this.add(o);let s=new Ws(Xs,Zs,e,t);s.layers=this.layers,this.add(s);let c=new Ws(Xs,Zs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},$s=class extends Ws{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ec=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=tc.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function tc(){this._document.hidden===!1&&this.reset()}var nc=`\\[\\]\\.:\\/`,rc=RegExp(`[\\[\\]\\.:\\/]`,`g`),ic=`[^\\[\\]\\.:\\/]`,ac=`[^`+nc.replace(`\\.`,``)+`]`,oc=`((?:WC+[\\/:])*)`.replace(`WC`,ic),sc=`(WCOD+)?`.replace(`WCOD`,ac),cc=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,ic),lc=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,ic),uc=RegExp(`^`+oc+sc+cc+lc+`$`),dc=[`material`,`materials`,`bones`,`map`],fc=class{constructor(e,t,n){let r=n||pc.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},pc=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(rc,``)}static parseTrackName(e){let t=uc.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);dc.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){H(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){U(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){U(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){U(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){U(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){U(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;U(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};pc.Composite=fc,pc.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},pc.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},pc.prototype.GetterByBindingType=[pc.prototype._getValue_direct,pc.prototype._getValue_array,pc.prototype._getValue_arrayElement,pc.prototype._getValue_toArray],pc.prototype.SetterByBindingTypeAndVersioning=[[pc.prototype._setValue_direct,pc.prototype._setValue_direct_setNeedsUpdate,pc.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[pc.prototype._setValue_array,pc.prototype._setValue_array_setNeedsUpdate,pc.prototype._setValue_array_setMatrixWorldNeedsUpdate],[pc.prototype._setValue_arrayElement,pc.prototype._setValue_arrayElement_setNeedsUpdate,pc.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[pc.prototype._setValue_fromArray,pc.prototype._setValue_fromArray_setNeedsUpdate,pc.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var mc=new gn,hc=class{constructor(e,t,n=0,r=1/0){this.ray=new oi(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Dn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):U(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return mc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(mc),this}intersectObject(e,t=!0,n=[]){return _c(e,this,n,t),n.sort(gc),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)_c(e[r],this,n,t);return n.sort(gc),n}};function gc(e,t){return e.distance-t.distance}function _c(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)_c(r[e],t,n,!0)}}var vc=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){let e=1e-6;return this.phi=Ct(this.phi,e,Math.PI-e),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ct(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});var yc=class extends _t{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){e===void 0?H(`Controls: connect() now requires an element.`):(this.domElement!==null&&this.disconnect(),this.domElement=e)}disconnect(){}dispose(){}update(){}};function bc(e,t,n,r){let i=xc(r);switch(n){case re:return e*t;case oe:return e*t/i.components*i.byteLength;case se:return e*t/i.components*i.byteLength;case ce:return e*t*2/i.components*i.byteLength;case le:return e*t*2/i.components*i.byteLength;case L:return e*t*3/i.components*i.byteLength;case ie:return e*t*4/i.components*i.byteLength;case ue:return e*t*4/i.components*i.byteLength;case de:case fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case pe:case me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ge:case ve:return Math.max(e,16)*Math.max(t,8)/4;case he:case _e:return Math.max(e,8)*Math.max(t,8)/2;case ye:case be:case Se:case Ce:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case xe:case we:case Te:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ee:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case De:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Oe:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ke:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case z:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Ae:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case je:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Me:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case B:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ne:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case V:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Pe:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Fe:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ie:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Le:case Re:case ze:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Be:case Ve:return Math.ceil(e/4)*Math.ceil(t/4)*8;case He:case Ue:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function xc(e){switch(e){case D:case O:return{byteLength:1,components:1};case A:case k:case P:return{byteLength:2,components:1};case F:case ee:return{byteLength:2,components:4};case M:case j:case N:return{byteLength:4,components:1};case ne:case I:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?H(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function Sc(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Cc(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var wc={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Y={common:{diffuse:{value:new q(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},envMapRotation:{value:new Jt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new W(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new q(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new q(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new q(16777215)},opacity:{value:1},center:{value:new W(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Tc={basic:{uniforms:Ko([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.fog]),vertexShader:wc.meshbasic_vert,fragmentShader:wc.meshbasic_frag},lambert:{uniforms:Ko([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,Y.lights,{emissive:{value:new q(0)},envMapIntensity:{value:1}}]),vertexShader:wc.meshlambert_vert,fragmentShader:wc.meshlambert_frag},phong:{uniforms:Ko([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,Y.lights,{emissive:{value:new q(0)},specular:{value:new q(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:wc.meshphong_vert,fragmentShader:wc.meshphong_frag},standard:{uniforms:Ko([Y.common,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.roughnessmap,Y.metalnessmap,Y.fog,Y.lights,{emissive:{value:new q(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:wc.meshphysical_vert,fragmentShader:wc.meshphysical_frag},toon:{uniforms:Ko([Y.common,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.gradientmap,Y.fog,Y.lights,{emissive:{value:new q(0)}}]),vertexShader:wc.meshtoon_vert,fragmentShader:wc.meshtoon_frag},matcap:{uniforms:Ko([Y.common,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,{matcap:{value:null}}]),vertexShader:wc.meshmatcap_vert,fragmentShader:wc.meshmatcap_frag},points:{uniforms:Ko([Y.points,Y.fog]),vertexShader:wc.points_vert,fragmentShader:wc.points_frag},dashed:{uniforms:Ko([Y.common,Y.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:wc.linedashed_vert,fragmentShader:wc.linedashed_frag},depth:{uniforms:Ko([Y.common,Y.displacementmap]),vertexShader:wc.depth_vert,fragmentShader:wc.depth_frag},normal:{uniforms:Ko([Y.common,Y.bumpmap,Y.normalmap,Y.displacementmap,{opacity:{value:1}}]),vertexShader:wc.meshnormal_vert,fragmentShader:wc.meshnormal_frag},sprite:{uniforms:Ko([Y.sprite,Y.fog]),vertexShader:wc.sprite_vert,fragmentShader:wc.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:wc.background_vert,fragmentShader:wc.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Jt}},vertexShader:wc.backgroundCube_vert,fragmentShader:wc.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:wc.cube_vert,fragmentShader:wc.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:wc.equirect_vert,fragmentShader:wc.equirect_frag},distance:{uniforms:Ko([Y.common,Y.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:wc.distance_vert,fragmentShader:wc.distance_frag},shadow:{uniforms:Ko([Y.lights,Y.fog,{color:{value:new q(0)},opacity:{value:1}}]),vertexShader:wc.shadow_vert,fragmentShader:wc.shadow_frag}};Tc.physical={uniforms:Ko([Tc.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new W(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new q(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new W},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new q(0)},specularColor:{value:new q(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new W},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:wc.meshphysical_vert,fragmentShader:wc.meshphysical_frag};var Ec={r:0,b:0,g:0},Dc=new gn,Oc=new Jt;Oc.set(-1,0,0,0,1,0,0,0,1);function kc(e,t,n,r,i,a){let o=new q(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new yi(new da(1,1,1),new $o({name:`BackgroundCubeMaterial`,uniforms:Go(Tc.backgroundCube.uniforms),vertexShader:Tc.backgroundCube.vertexShader,fragmentShader:Tc.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Dc.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Oc),l.material.toneMapped=$t.getTransfer(i.colorSpace)!==nt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new yi(new Ro(2,2),new $o({name:`BackgroundMaterial`,uniforms:Go(Tc.background.uniforms),vertexShader:Tc.background.vertexShader,fragmentShader:Tc.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=$t.getTransfer(i.colorSpace)!==nt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Ec,Yo(e)),n.buffers.color.setClear(Ec.r,Ec.g,Ec.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ac(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function jc(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Mc(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(H(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&H(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Nc(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Fi,s=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Pc=4,Fc=[.125,.215,.35,.446,.526,.582],Ic=20,Lc=256,Rc=new qs,zc=new q,Bc=null,Vc=0,Hc=0,Uc=!1,Wc=new G,Gc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Wc}=i;Bc=this._renderer.getRenderTarget(),Vc=this._renderer.getActiveCubeFace(),Hc=this._renderer.getActiveMipmapLevel(),Uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Bc,Vc,Hc),this._renderer.xr.enabled=Uc,e.scissorTest=!1,Jc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bc=this._renderer.getRenderTarget(),Vc=this._renderer.getActiveCubeFace(),Hc=this._renderer.getActiveMipmapLevel(),Uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:w,minFilter:w,generateMipmaps:!1,type:P,format:ie,colorSpace:et,depthBuffer:!1},r=qc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qc(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Kc(r)),this._blurMaterial=Xc(r,e,t),this._ggxMaterial=Yc(r,e,t)}return r}_compileMaterial(e){let t=new yi(new Xr,e);this._renderer.compile(t,Rc)}_sceneToCubeUV(e,t,n,r,i){let a=new Ws(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(zc),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new yi(new da,new si({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(zc),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Jc(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zc());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Jc(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Rc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Pc?n-d+Pc:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Jc(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Rc),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Jc(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Rc)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&U(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):Ic;m>Ic&&H(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ic}`);let h=[],g=0;for(let e=0;e<Ic;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];Jc(t,3*v*(r>_-Pc?r-_+Pc:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,Rc)}};function Kc(e){let t=[],n=[],r=[],i=e,a=e-Pc+1+Fc.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-Pc?s=Fc[o-e+Pc-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Xr;h.setAttribute(`position`,new Ir(f,3)),h.setAttribute(`uv`,new Ir(p,2)),h.setAttribute(`faceIndex`,new Ir(m,1)),r.push(new yi(h,null)),i>Pc&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function qc(e,t,n){let r=new pn(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Jc(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Yc(e,t,n){return new $o({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Lc,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:$c(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Xc(e,t,n){let r=new Float32Array(Ic),i=new G(0,1,0);return new $o({name:`SphericalGaussianBlur`,defines:{n:Ic,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:$c(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Zc(){return new $o({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:$c(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Qc(){return new $o({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:$c(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function $c(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var el=class extends pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new oa(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new da(5,5,5),i=new $o({name:`CubemapFromEquirect`,uniforms:Go(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new yi(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=w),new Qs(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function tl(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new el(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Gc(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Gc(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function nl(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&mt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function rl(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Rr:Lr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function il(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function al(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:U(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function ol(e,t,n){let r=new WeakMap,i=new dn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new mn(h,p,m,u);g.type=N,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new W(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function sl(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var cl={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function ll(e,t,n,r,i,a){let o=new pn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new ca(t,n):void 0}),s=new pn(t,n,{type:P,depthBuffer:!1,stencilBuffer:!1}),c=new Xr;c.setAttribute(`position`,new J([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new J([0,2,0,0,2,0],2));let l=new es({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new yi(c,l),d=new qs(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],v=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},$t.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=cl[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var ul=new un,dl=new ca(1,1),fl=new mn,pl=new hn,ml=new oa,hl=[],gl=[],_l=new Float32Array(16),vl=new Float32Array(9),yl=new Float32Array(4);function bl(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=hl[i];if(a===void 0&&(a=new Float32Array(i),hl[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function xl(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Sl(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Cl(e,t){let n=gl[t];n===void 0&&(n=new Int32Array(t),gl[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function wl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Tl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(xl(n,t))return;e.uniform2fv(this.addr,t),Sl(n,t)}}function El(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(xl(n,t))return;e.uniform3fv(this.addr,t),Sl(n,t)}}function Dl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(xl(n,t))return;e.uniform4fv(this.addr,t),Sl(n,t)}}function Ol(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(xl(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Sl(n,t)}else{if(xl(n,r))return;yl.set(r),e.uniformMatrix2fv(this.addr,!1,yl),Sl(n,r)}}function kl(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(xl(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Sl(n,t)}else{if(xl(n,r))return;vl.set(r),e.uniformMatrix3fv(this.addr,!1,vl),Sl(n,r)}}function Al(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(xl(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Sl(n,t)}else{if(xl(n,r))return;_l.set(r),e.uniformMatrix4fv(this.addr,!1,_l),Sl(n,r)}}function jl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Ml(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(xl(n,t))return;e.uniform2iv(this.addr,t),Sl(n,t)}}function Nl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(xl(n,t))return;e.uniform3iv(this.addr,t),Sl(n,t)}}function Pl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(xl(n,t))return;e.uniform4iv(this.addr,t),Sl(n,t)}}function Fl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Il(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(xl(n,t))return;e.uniform2uiv(this.addr,t),Sl(n,t)}}function Ll(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(xl(n,t))return;e.uniform3uiv(this.addr,t),Sl(n,t)}}function Rl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(xl(n,t))return;e.uniform4uiv(this.addr,t),Sl(n,t)}}function zl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(dl.compareFunction=n.isReversedDepthBuffer()?518:515,a=dl):a=ul,n.setTexture2D(t||a,i)}function Bl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||pl,i)}function Vl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||ml,i)}function Hl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||fl,i)}function Ul(e){switch(e){case 5126:return wl;case 35664:return Tl;case 35665:return El;case 35666:return Dl;case 35674:return Ol;case 35675:return kl;case 35676:return Al;case 5124:case 35670:return jl;case 35667:case 35671:return Ml;case 35668:case 35672:return Nl;case 35669:case 35673:return Pl;case 5125:return Fl;case 36294:return Il;case 36295:return Ll;case 36296:return Rl;case 35678:case 36198:case 36298:case 36306:case 35682:return zl;case 35679:case 36299:case 36307:return Bl;case 35680:case 36300:case 36308:case 36293:return Vl;case 36289:case 36303:case 36311:case 36292:return Hl}}function Wl(e,t){e.uniform1fv(this.addr,t)}function Gl(e,t){let n=bl(t,this.size,2);e.uniform2fv(this.addr,n)}function Kl(e,t){let n=bl(t,this.size,3);e.uniform3fv(this.addr,n)}function ql(e,t){let n=bl(t,this.size,4);e.uniform4fv(this.addr,n)}function Jl(e,t){let n=bl(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Yl(e,t){let n=bl(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Xl(e,t){let n=bl(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Zl(e,t){e.uniform1iv(this.addr,t)}function Ql(e,t){e.uniform2iv(this.addr,t)}function $l(e,t){e.uniform3iv(this.addr,t)}function eu(e,t){e.uniform4iv(this.addr,t)}function tu(e,t){e.uniform1uiv(this.addr,t)}function nu(e,t){e.uniform2uiv(this.addr,t)}function ru(e,t){e.uniform3uiv(this.addr,t)}function iu(e,t){e.uniform4uiv(this.addr,t)}function au(e,t,n){let r=this.cache,i=t.length,a=Cl(n,i);xl(r,a)||(e.uniform1iv(this.addr,a),Sl(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?dl:ul;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ou(e,t,n){let r=this.cache,i=t.length,a=Cl(n,i);xl(r,a)||(e.uniform1iv(this.addr,a),Sl(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||pl,a[e])}function su(e,t,n){let r=this.cache,i=t.length,a=Cl(n,i);xl(r,a)||(e.uniform1iv(this.addr,a),Sl(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||ml,a[e])}function cu(e,t,n){let r=this.cache,i=t.length,a=Cl(n,i);xl(r,a)||(e.uniform1iv(this.addr,a),Sl(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||fl,a[e])}function lu(e){switch(e){case 5126:return Wl;case 35664:return Gl;case 35665:return Kl;case 35666:return ql;case 35674:return Jl;case 35675:return Yl;case 35676:return Xl;case 5124:case 35670:return Zl;case 35667:case 35671:return Ql;case 35668:case 35672:return $l;case 35669:case 35673:return eu;case 5125:return tu;case 36294:return nu;case 36295:return ru;case 36296:return iu;case 35678:case 36198:case 36298:case 36306:case 35682:return au;case 35679:case 36299:case 36307:return ou;case 35680:case 36300:case 36308:case 36293:return su;case 36289:case 36303:case 36311:case 36292:return cu}}var uu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ul(t.type)}},du=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lu(t.type)}},fu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},pu=/(\w+)(\])?(\[|\.)?/g;function mu(e,t){e.seq.push(t),e.map[t.id]=t}function hu(e,t,n){let r=e.name,i=r.length;for(pu.lastIndex=0;;){let a=pu.exec(r),o=pu.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){mu(n,l===void 0?new uu(s,e,t):new du(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new fu(s),mu(n,e)),n=e}}}var gu=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);hu(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function _u(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var vu=37297,yu=0;function bu(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var xu=new Jt;function Su(e){$t._getMatrix(xu,$t.workingColorSpace,e);let t=`mat3( ${xu.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(e)){case tt:return[t,`LinearTransferOETF`];case nt:return[t,`sRGBTransferOETF`];default:return H(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Cu(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+bu(e.getShaderSource(t),r)}return i}function wu(e,t){let n=Su(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Tu={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Eu(e,t){let n=Tu[t];return n===void 0?(H(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Du=new G;function Ou(){return $t.getLuminanceCoefficients(Du),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Du.x.toFixed(4)}, ${Du.y.toFixed(4)}, ${Du.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function ku(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Mu).join(`
`)}function Au(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function ju(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Mu(e){return e!==``}function Nu(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Pu(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Fu=/^[ \t]*#include +<([\w\d./]+)>/gm;function Iu(e){return e.replace(Fu,Ru)}var Lu=new Map;function Ru(e,t){let n=wc[t];if(n===void 0){let e=Lu.get(t);if(e!==void 0)n=wc[e],H(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Iu(n)}var zu=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bu(e){return e.replace(zu,Vu)}function Vu(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Hu(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Uu={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Wu(e){return Uu[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Gu={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Ku(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Gu[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var qu={302:`ENVMAP_MODE_REFRACTION`};function Ju(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:qu[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Yu={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Xu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Yu[e.combine]||`ENVMAP_BLENDING_NONE`}function Zu(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Qu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Wu(n),l=Ku(n),u=Ju(n),d=Xu(n),f=Zu(n),p=ku(n),m=Au(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Mu).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Mu).join(`
`),_.length>0&&(_+=`
`)):(g=[Hu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Mu).join(`
`),_=[Hu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:wc.tonemapping_pars_fragment,n.toneMapping===0?``:Eu(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,wc.colorspace_pars_fragment,wu(`linearToOutputTexel`,n.outputColorSpace),Ou(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Mu).join(`
`)),o=Iu(o),o=Nu(o,n),o=Pu(o,n),s=Iu(s),s=Nu(s,n),s=Pu(s,n),o=Bu(o),s=Bu(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=_u(i,i.VERTEX_SHADER,y),S=_u(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Cu(i,x,`vertex`),n=Cu(i,S,`fragment`);U(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):H(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new gu(i,h),T=ju(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,vu)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=yu++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var $u=0,ed=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new td(e),t.set(e,n)),n}},td=class{constructor(e){this.id=$u++,this.code=e,this.usedTimes=0}};function nd(e){return e===1030||e===37490||e===36285}function rd(e,t,n,r,i,a){let o=new Dn,s=new ed,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&H(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Tc[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,F=!!i.map,ee=!!i.matcap,te=!!x,ne=!!i.aoMap,I=!!i.lightMap,re=!!i.bumpMap&&i.wireframe===!1,L=!!i.normalMap,ie=!!i.displacementMap,ae=!!i.emissiveMap,R=!!i.metalnessMap,oe=!!i.roughnessMap,se=i.anisotropy>0,ce=i.clearcoat>0,le=i.dispersion>0,ue=i.iridescence>0,de=i.sheen>0,fe=i.transmission>0,pe=se&&!!i.anisotropyMap,me=ce&&!!i.clearcoatMap,he=ce&&!!i.clearcoatNormalMap,ge=ce&&!!i.clearcoatRoughnessMap,_e=ue&&!!i.iridescenceMap,ve=ue&&!!i.iridescenceThicknessMap,ye=de&&!!i.sheenColorMap,be=de&&!!i.sheenRoughnessMap,xe=!!i.specularMap,Se=!!i.specularColorMap,Ce=!!i.specularIntensityMap,we=fe&&!!i.transmissionMap,Te=fe&&!!i.thicknessMap,Ee=!!i.gradientMap,De=!!i.alphaMap,Oe=i.alphaTest>0,ke=!!i.alphaHash,z=!!i.extensions,Ae=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ae=e.toneMapping);let je={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:$t.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:F,matcap:ee,envMap:te,envMapMode:te&&x.mapping,envMapCubeUVHeight:S,aoMap:ne,lightMap:I,bumpMap:re,normalMap:L,displacementMap:ie,emissiveMap:ae,normalMapObjectSpace:L&&i.normalMapType===1,normalMapTangentSpace:L&&i.normalMapType===0,packedNormalMap:L&&i.normalMapType===0&&nd(i.normalMap.format),metalnessMap:R,roughnessMap:oe,anisotropy:se,anisotropyMap:pe,clearcoat:ce,clearcoatMap:me,clearcoatNormalMap:he,clearcoatRoughnessMap:ge,dispersion:le,iridescence:ue,iridescenceMap:_e,iridescenceThicknessMap:ve,sheen:de,sheenColorMap:ye,sheenRoughnessMap:be,specularMap:xe,specularColorMap:Se,specularIntensityMap:Ce,transmission:fe,transmissionMap:we,thicknessMap:Te,gradientMap:Ee,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:De,alphaTest:Oe,alphaHash:ke,combine:i.combine,mapUv:F&&m(i.map.channel),aoMapUv:ne&&m(i.aoMap.channel),lightMapUv:I&&m(i.lightMap.channel),bumpMapUv:re&&m(i.bumpMap.channel),normalMapUv:L&&m(i.normalMap.channel),displacementMapUv:ie&&m(i.displacementMap.channel),emissiveMapUv:ae&&m(i.emissiveMap.channel),metalnessMapUv:R&&m(i.metalnessMap.channel),roughnessMapUv:oe&&m(i.roughnessMap.channel),anisotropyMapUv:pe&&m(i.anisotropyMap.channel),clearcoatMapUv:me&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:he&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:be&&m(i.sheenRoughnessMap.channel),specularMapUv:xe&&m(i.specularMap.channel),specularColorMapUv:Se&&m(i.specularColorMap.channel),specularIntensityMapUv:Ce&&m(i.specularIntensityMap.channel),transmissionMapUv:we&&m(i.transmissionMap.channel),thicknessMapUv:Te&&m(i.thicknessMap.channel),alphaMapUv:De&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(L||se),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(F||De),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&L===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ae,decodeVideoTexture:F&&i.map.isVideoTexture===!0&&$t.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ae&&i.emissiveMap.isVideoTexture===!0&&$t.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:z&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(z&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return je.vertexUv1s=c.has(1),je.vertexUv2s=c.has(2),je.vertexUv3s=c.has(3),c.clear(),je}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Tc[t];n=Xo.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Qu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function id(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function ad(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function od(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function sd(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||ad),r.length>1&&r.sort(t||od),i.length>1&&i.sort(t||od),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function cd(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new sd,e.set(t,[i])):n>=r.length?(i=new sd,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function ld(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new G,color:new q};break;case`SpotLight`:n={position:new G,direction:new G,color:new q,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new G,color:new q,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new G,skyColor:new q,groundColor:new q};break;case`RectAreaLight`:n={color:new q,position:new G,halfWidth:new G,halfHeight:new G}}return e[t.id]=n,n}}}function ud(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var dd=0;function fd(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function pd(e){let t=new ld,n=ud(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new G);let i=new G,a=new gn,o=new gn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(fd);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Y.LTC_FLOAT_1,r.rectAreaLTC2=Y.LTC_FLOAT_2):(r.rectAreaLTC1=Y.LTC_HALF_1,r.rectAreaLTC2=Y.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=dd++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function md(e){let t=new pd(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function hd(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new md(e),t.set(n,[a])):r>=i.length?(a=new md(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var gd=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_d=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,vd=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],yd=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],bd=new gn,xd=new G,Sd=new G;function Cd(e,t,n){let r=new zi,i=new W,a=new W,o=new dn,s=new is,c=new as,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new $o({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new W},radius:{value:4}},vertexShader:gd,fragmentShader:_d}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Xr;m.setAttribute(`position`,new Ir(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new yi(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(H(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){H(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){H(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new pn(i.x,i.y,{format:ce,type:P,minFilter:w,magFilter:w,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new ca(i.x,i.y,N),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=ae,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=x,d.map.depthTexture.magFilter=x}else l.isPointLight?(d.map=new el(i.x),d.map.depthTexture=new la(i.x,M)):(d.map=new pn(i.x,i.y),d.map.depthTexture=new ca(i.x,i.y,M)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=ae,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=w,d.map.depthTexture.magFilter=w):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=x,d.map.depthTexture.magFilter=x);d.camera.updateProjectionMatrix()}let g=d.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<g;t++){if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),xd.setFromMatrixPosition(l.matrixWorld),e.position.copy(xd),Sd.copy(e.position),Sd.add(vd[t]),e.up.copy(yd[t]),e.lookAt(Sd),e.updateMatrixWorld(),n.makeTranslation(-xd.x,-xd.y,-xd.z),bd.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(bd,e.coordinateSystem,e.reversedDepth)}else d.updateMatrices(l);r=d.getFrustum(),b(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new pn(i.x,i.y,{format:ce,type:P})),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,S)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function S(e){e.target.removeEventListener(`dispose`,S);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function wd(e,t){function n(){let t=!1,n=new dn,r=null,i=new dn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?R(e.DEPTH_TEST):oe(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=gt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?R(e.STENCIL_TEST):oe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,F=e.getParameter(e.VERSION);F.indexOf(`WebGL`)===-1?F.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(F)[1]),N=P>=1);let ee=null,te={},ne=e.getParameter(e.SCISSOR_BOX),I=e.getParameter(e.VIEWPORT),re=new dn().fromArray(ne),L=new dn().fromArray(I);function ie(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ae={};ae[e.TEXTURE_2D]=ie(e.TEXTURE_2D,e.TEXTURE_2D,1),ae[e.TEXTURE_CUBE_MAP]=ie(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[e.TEXTURE_2D_ARRAY]=ie(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ae[e.TEXTURE_3D]=ie(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),R(e.DEPTH_TEST),o.setFunc(3),me(!1),he(1),R(e.CULL_FACE),fe(0);function R(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function oe(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function se(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ce(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function le(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ue={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ue[103]=e.MIN,ue[104]=e.MAX;let de={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function fe(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(oe(e.BLEND),g=!1);else if(g===!1&&(R(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:U(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:U(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:U(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:U(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ue[n],ue[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(de[r],de[i],de[o],de[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function pe(t,n){t.side===2?oe(e.CULL_FACE):R(e.CULL_FACE);let r=t.side===1;n&&(r=!r),me(r),t.blending===1&&t.transparent===!1?fe(0):fe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),_e(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?R(e.SAMPLE_ALPHA_TO_COVERAGE):oe(e.SAMPLE_ALPHA_TO_COVERAGE)}function me(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function he(t){t===0?oe(e.CULL_FACE):(R(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ge(t){t!==k&&(N&&e.lineWidth(t),k=t)}function _e(t,n,r){t?(R(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):oe(e.POLYGON_OFFSET_FILL)}function ve(t){t?R(e.SCISSOR_TEST):oe(e.SCISSOR_TEST)}function ye(t){t===void 0&&(t=e.TEXTURE0+M-1),ee!==t&&(e.activeTexture(t),ee=t)}function be(t,n,r){r===void 0&&(r=ee===null?e.TEXTURE0+M-1:ee);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(ee!==r&&(e.activeTexture(r),ee=r),e.bindTexture(t,n||ae[t]),i.type=t,i.texture=n)}function xe(){let t=te[ee];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Se(){try{e.compressedTexImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ce(){try{e.compressedTexImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function we(){try{e.texSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Te(){try{e.texSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ee(){try{e.compressedTexSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Oe(){try{e.texStorage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function ke(){try{e.texStorage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function z(){try{e.texImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ae(){try{e.texImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function je(t){return d[t]===void 0?e.getParameter(t):d[t]}function Me(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function B(t){re.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),re.copy(t))}function Ne(t){L.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),L.copy(t))}function V(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Pe(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Fe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ee=null,te={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,re.set(0,0,e.canvas.width,e.canvas.height),L.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:R,disable:oe,bindFramebuffer:se,drawBuffers:ce,useProgram:le,setBlending:fe,setMaterial:pe,setFlipSided:me,setCullFace:he,setLineWidth:ge,setPolygonOffset:_e,setScissorTest:ve,activeTexture:ye,bindTexture:be,unbindTexture:xe,compressedTexImage2D:Se,compressedTexImage3D:Ce,texImage2D:z,texImage3D:Ae,pixelStorei:Me,getParameter:je,updateUBOMapping:V,uniformBlockBinding:Pe,texStorage2D:Oe,texStorage3D:ke,texSubImage2D:we,texSubImage3D:Te,compressedTexSubImage2D:Ee,compressedTexSubImage3D:De,scissor:B,viewport:Ne,reset:Fe}}function Td(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new W,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):lt(`canvas`)}function g(e,t,n){let r=1,i=je(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),H(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&H(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];H(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||H(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?tt:$t.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function A(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,H(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function j(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),P(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function N(e){let t=e.target;t.removeEventListener(`dispose`,N),ee(t)}function P(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&F(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function F(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function ee(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let te=0;function ne(){te=0}function I(){return te}function re(e){te=e}function L(){let e=te;return e>=i.maxTextures&&H(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),te+=1,e}function ie(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ae(t,i){let a=r.get(t);if(t.isVideoTexture&&z(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)H(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)H(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ge(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function oe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ge(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function se(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ge(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?_e(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let le={[v]:e.REPEAT,[y]:e.CLAMP_TO_EDGE,[b]:e.MIRRORED_REPEAT},ue={[x]:e.NEAREST,[S]:e.NEAREST_MIPMAP_NEAREST,[C]:e.NEAREST_MIPMAP_LINEAR,[w]:e.LINEAR,[T]:e.LINEAR_MIPMAP_NEAREST,[E]:e.LINEAR_MIPMAP_LINEAR},de={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function fe(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&H(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,le[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,le[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,le[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ue[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ue[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,de[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function pe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,M));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ie(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&F(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function me(e,t,n){return Math.floor(Math.floor(e/n)/t)}function he(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=me(n.start,r.width,4),c=me(t.start,r.width,4);n.start<=i+1&&a===c&&me(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ge(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=pe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=$t.getPrimaries($t.workingColorSpace),r=o.colorSpace===``?null:$t.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Ae(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=k(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);fe(c,o);let h,v=o.mipmaps,y=o.isVideoTexture!==!0,b=f.__version===void 0||l===!0,x=u.dataReady,S=j(o,t);if(o.isDepthTexture)m=A(o.format===R,o.type),b&&(y?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(v.length>0){y&&b&&n.texStorage2D(e.TEXTURE_2D,S,m,v[0].width,v[0].height);for(let t=0,i=v.length;t<i;t++)h=v[t],y?x&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else y?(b&&n.texStorage2D(e.TEXTURE_2D,S,m,t.width,t.height),x&&he(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){y&&b&&n.texStorage3D(e.TEXTURE_2D_ARRAY,S,m,v[0].width,v[0].height,t.depth);for(let i=0,a=v.length;i<a;i++)if(h=v[i],o.format!==1023){if(r!==null){if(y){if(x){if(o.layerUpdates.size>0){let t=bc(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else y?x&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data)}else{y&&b&&n.texStorage2D(e.TEXTURE_2D,S,m,v[0].width,v[0].height);for(let t=0,i=v.length;t<i;t++)h=v[t],o.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(y){if(b&&n.texStorage3D(e.TEXTURE_2D_ARRAY,S,m,t.width,t.height,t.depth),x){if(o.layerUpdates.size>0){let i=bc(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)y?(b&&n.texStorage3D(e.TEXTURE_3D,S,m,t.width,t.height,t.depth),x&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(b){if(y)n.texStorage2D(e.TEXTURE_2D,S,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<S;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(v.length>0){if(y&&b){let t=je(v[0]);n.texStorage2D(e.TEXTURE_2D,S,m,t.width,t.height)}for(let t=0,i=v.length;t<i;t++)h=v[t],y?x&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(y){if(b){let r=je(t);n.texStorage2D(e.TEXTURE_2D,S,m,r.width,r.height)}x&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&D(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function _e(t,o,s){if(o.image.length!==6)return;let c=pe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=$t.getPrimaries($t.workingColorSpace),r=o.colorSpace===``?null:$t.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Ae(o,m[e]);let h=m[0],v=a.convert(o.format,o.colorSpace),y=a.convert(o.type),b=k(o.internalFormat,v,y,o.normalized,o.colorSpace),x=o.isVideoTexture!==!0,S=u.__version===void 0||c===!0,C=l.dataReady,w=j(o,h);fe(e.TEXTURE_CUBE_MAP,o);let T;if(f){x&&S&&n.texStorage2D(e.TEXTURE_CUBE_MAP,w,b,h.width,h.height);for(let t=0;t<6;t++){T=m[t].mipmaps;for(let r=0;r<T.length;r++){let i=T[r];o.format===1023?x?C&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,v,y,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,b,i.width,i.height,0,v,y,i.data):v===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):x?C&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,v,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,b,i.width,i.height,0,i.data)}}}else{if(T=o.mipmaps,x&&S){T.length>0&&w++;let t=je(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,w,b,t.width,t.height)}for(let t=0;t<6;t++)if(p){x?C&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,v,y,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,b,m[t].width,m[t].height,0,v,y,m[t].data);for(let r=0;r<T.length;r++){let i=T[r].image[t].image;x?C&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,v,y,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,b,i.width,i.height,0,v,y,i.data)}}else{x?C&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,v,y,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,b,v,y,m[t]);for(let r=0;r<T.length;r++){let i=T[r];x?C&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,v,y,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,b,v,y,i.image[t])}}}_(o)&&D(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ve(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=k(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),ke(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Oe(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ye(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=A(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;ke(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Oe(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Oe(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=k(o.internalFormat,c,l,o.normalized,o.colorSpace);ke(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Oe(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Oe(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function be(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,l.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,M)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),fe(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else ae(i.depthTexture,0);let u=l.__webglTexture,d=Oe(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)ke(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)ke(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function xe(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)be(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?be(i.__webglFramebuffer[0],t,0):be(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ye(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ye(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Se(t,n,i){let a=r.get(t);n!==void 0&&ve(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&xe(t)}function Ce(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,N);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&ke(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=k(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Oe(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ye(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),fe(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ve(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ve(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&D(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),fe(c,a),ve(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&D(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),fe(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ve(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ve(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&D(r),n.unbindTexture()}t.depthBuffer&&xe(t)}function we(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=O(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),D(t),n.unbindTexture()}}}let Te=[],Ee=[];function De(t){if(t.samples>0){if(ke(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Te.length=0,Ee.length=0,Te.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(Te.push(l),Ee.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ee)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Te))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Oe(e){return Math.min(i.maxSamples,e.samples)}function ke(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function z(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Ae(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&($t.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&H(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):U(`WebGLTextures: Unsupported texture color space:`,n)),t}function je(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=ne,this.getTextureUnits=I,this.setTextureUnits=re,this.setTexture2D=ae,this.setTexture2DArray=oe,this.setTexture3D=se,this.setTextureCube=ce,this.rebindTextures=Se,this.setupRenderTarget=Ce,this.updateRenderTargetMipmap=we,this.updateMultisampleRenderTarget=De,this.setupDepthRenderbuffer=xe,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=ke,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Ed(e,t){function n(n,r=``){let i,a=$t.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Dd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Od=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,kd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ua(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new $o({vertexShader:Dd,fragmentShader:Od,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new yi(new Ro(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ad=class extends _t{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new kd,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new W,C=null,w=new Ws;w.viewport=new dn;let T=new Ws;T.viewport=new dn;let E=[w,T],O=new $s,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Gn,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Gn,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Gn,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function N(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,N),r.removeEventListener(`inputsourceschange`,P);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,se.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,N),r.addEventListener(`inputsourceschange`,P),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?R:ae,a=_.stencil?te:M);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new pn(d.textureWidth,d.textureHeight,{format:ie,type:D,depthTexture:new ca(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new pn(f.framebufferWidth,f.framebufferHeight,{format:ie,type:D,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),se.setContext(r),se.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function P(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let F=new G,ee=new G;function ne(e,t,n){F.setFromMatrixPosition(t.matrixWorld),ee.setFromMatrixPosition(n.matrixWorld);let r=F.distanceTo(ee),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function I(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=T.near=w.near=t,O.far=T.far=w.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,w.layers.mask=O.layers.mask&-5,T.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;I(O,i);for(let e=0;e<a.length;e++)I(a[e],i);a.length===2?ne(O,w,T):O.projectionMatrix.copy(w.projectionMatrix),re(e,O,i)};function re(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=xt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let L=null;function oe(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=E[n];o===void 0&&(o=new Ws,o.layers.enable(n),o.viewport=new dn,E[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new ua,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}L&&L(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let se=new Sc;se.setAnimationLoop(oe),this.setAnimationLoop=function(e){L=e},this.dispose=function(){}}},jd=new gn,Md=new Jt;Md.set(-1,0,0,0,1,0,0,0,1);function Nd(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Yo(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(jd.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Md),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Pd(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return U(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?H(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):H(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Fd=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Id=null;function Ld(){return Id===null&&(Id=new Si(Fd,16,16,ce,P),Id.name=`DFG_LUT`,Id.minFilter=w,Id.magFilter=w,Id.wrapS=y,Id.wrapT=y,Id.generateMipmaps=!1,Id.needsUpdate=!0),Id}var Rd=class{constructor(e={}){let{canvas:t=ut(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=D}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([ue,le,se]),g=new Set([D,M,A,te,F,ee]),_=new Uint32Array(4),v=new Int32Array(4),y=new G,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,O=!1,k=null,j=null,N=null,ne=null;this._outputColorSpace=$e;let I=0,re=0,L=null,ie=-1,ae=null,R=new dn,oe=new dn,ce=null,de=new q(0),fe=0,pe=t.width,me=t.height,he=1,ge=null,_e=null,ve=new dn(0,0,pe,me),ye=new dn(0,0,pe,me),be=!1,xe=new zi,Se=!1,Ce=!1,we=new gn,Te=new G,Ee=new dn,De={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Oe=!1;function ke(){return L===null?he:1}let z=n;function Ae(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,tt,!1),t.addEventListener(`webglcontextrestored`,nt,!1),t.addEventListener(`webglcontextcreationerror`,rt,!1),z===null){let t=`webgl2`;if(z=Ae(t,e),z===null)throw Ae(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw U(`WebGLRenderer: `+e.message),e}let je,Me,B,Ne,V,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze;function Qe(){je=new nl(z),je.init(),Ye=new Ed(z,je),Me=new Mc(z,je,e,Ye),B=new wd(z,je),Me.reversedDepthBuffer&&d&&B.buffers.depth.setReversed(!0),j=z.createFramebuffer(),N=z.createFramebuffer(),ne=z.createFramebuffer(),Ne=new al(z),V=new id,Pe=new Td(z,je,B,V,Me,Ye,Ne),Fe=new tl(T),Ie=new Cc(z),Xe=new Ac(z,Ie),Le=new rl(z,Ie,Ne,Xe),Re=new sl(z,Le,Ie,Xe,Ne),Ke=new ol(z,Me,Pe),Ue=new Nc(V),ze=new rd(T,Fe,je,Me,Xe,Ue),Be=new Nd(T,V),Ve=new cd,He=new hd(je),Ge=new kc(T,Fe,B,Re,p,s),We=new Cd(T,Re,Me),Ze=new Pd(z,Ne,Me,B),qe=new jc(z,je,Ne),Je=new il(z,je,Ne),Ne.programs=ze.programs,T.capabilities=Me,T.extensions=je,T.properties=V,T.renderLists=Ve,T.shadowMap=We,T.state=B,T.info=Ne}Qe(),m!==1009&&(w=new ll(m,t.width,t.height,o,r,i));let et=new Ad(T,z);this.xr=et,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let e=je.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=je.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(e){e!==void 0&&(he=e,this.setSize(pe,me,!1))},this.getSize=function(e){return e.set(pe,me)},this.setSize=function(e,n,r=!0){et.isPresenting?H(`WebGLRenderer: Can't change size while VR device is presenting.`):(pe=e,me=n,t.width=Math.floor(e*he),t.height=Math.floor(n*he),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(pe*he,me*he).floor()},this.setDrawingBufferSize=function(e,n,r){pe=e,me=n,he=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)U(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){H(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(R)},this.getViewport=function(e){return e.copy(ve)},this.setViewport=function(e,t,n,r){e.isVector4?ve.set(e.x,e.y,e.z,e.w):ve.set(e,t,n,r),B.viewport(R.copy(ve).multiplyScalar(he).round())},this.getScissor=function(e){return e.copy(ye)},this.setScissor=function(e,t,n,r){e.isVector4?ye.set(e.x,e.y,e.z,e.w):ye.set(e,t,n,r),B.scissor(oe.copy(ye).multiplyScalar(he).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(e){B.setScissorTest(be=e)},this.setOpaqueSort=function(e){ge=e},this.setTransparentSort=function(e){_e=e},this.getClearColor=function(e){return e.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(L!==null){let t=L.texture.format;e=h.has(t)}if(e){let e=L.texture.type,t=g.has(e),n=Ge.getClearColor(),r=Ge.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,z.clearBufferuiv(z.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,z.clearBufferiv(z.COLOR,0,v))}else r|=z.COLOR_BUFFER_BIT}t&&(r|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&z.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),k=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,tt,!1),t.removeEventListener(`webglcontextrestored`,nt,!1),t.removeEventListener(`webglcontextcreationerror`,rt,!1),Ge.dispose(),Ve.dispose(),He.dispose(),V.dispose(),Fe.dispose(),Re.dispose(),Xe.dispose(),Ze.dispose(),ze.dispose(),et.dispose(),et.removeEventListener(`sessionstart`,pt),et.removeEventListener(`sessionend`,mt),gt.stop()};function tt(e){e.preventDefault(),ft(`WebGLRenderer: Context Lost.`),O=!0}function nt(){ft(`WebGLRenderer: Context Restored.`),O=!1;let e=Ne.autoReset,t=We.enabled,n=We.autoUpdate,r=We.needsUpdate,i=We.type;Qe(),Ne.autoReset=e,We.enabled=t,We.autoUpdate=n,We.needsUpdate=r,We.type=i}function rt(e){U(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function it(e){let t=e.target;t.removeEventListener(`dispose`,it),at(t)}function at(e){st(e),V.remove(e)}function st(e){let t=V.get(e).programs;t!==void 0&&(t.forEach(function(e){ze.releaseProgram(e)}),e.isShaderMaterial&&ze.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=De);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Et(e,t,n,r,i);B.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Le.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Xe.setup(i,r,s,n,c);let h,g=qe;if(c!==null&&(h=Ie.get(c),g=Je,g.setIndex(h)),i.isMesh)r.wireframe===!0?(B.setLineWidth(r.wireframeLinewidth*ke()),g.setMode(z.LINES)):g.setMode(z.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),B.setLineWidth(e*ke()),i.isLineSegments?g.setMode(z.LINES):i.isLineLoop?g.setMode(z.LINE_LOOP):g.setMode(z.LINE_STRIP)}else i.isPoints?g.setMode(z.POINTS):i.isSprite&&g.setMode(z.TRIANGLES);if(i.isBatchedMesh){if(je.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ie.get(c).bytesPerElement:1,o=V.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(z,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ct(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,St(e,t,n),e.side=0,e.needsUpdate=!0,St(e,t,n),e.side=2):St(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),x=He.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];ct(a,n,e),r.add(a)}else ct(t,n,e),r.add(t)}}),x=C.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){V.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}je.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let lt=null;function dt(e){lt&&lt(e)}function pt(){gt.stop()}function mt(){gt.start()}let gt=new Sc;gt.setAnimationLoop(dt),typeof self<`u`&&gt.setContext(self),this.setAnimationLoop=function(e){lt=e,et.setAnimationLoop(e),e===null?gt.stop():gt.start()},et.addEventListener(`sessionstart`,pt),et.addEventListener(`sessionend`,mt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){U(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(O===!0)return;k!==null&&k.renderStart(e,t);let n=et.enabled===!0&&et.isPresenting===!0,r=w!==null&&(L===null||n)&&w.begin(T,L);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(et.cameraAutoUpdate===!0&&et.updateCamera(t),t=et.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,L),x=He.get(e,C.length),x.init(t),x.state.textureUnits=Pe.getTextureUnits(),C.push(x),we.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),xe.setFromProjectionMatrix(we,ot,t.reversedDepth),Ce=this.localClippingEnabled,Se=Ue.init(this.clippingPlanes,Ce),b=Ve.get(e,S.length),b.init(),S.push(b),et.enabled===!0&&et.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&_t(e,t,-1/0,T.sortObjects)}_t(e,t,0,T.sortObjects),b.finish(),T.sortObjects===!0&&b.sort(ge,_e,t.reversedDepth),Oe=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,Oe&&Ge.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Se===!0&&Ue.beginShadows();let i=x.state.shadowsArray;if(We.render(i,e,t),Se===!0&&Ue.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];yt(n,r,e,a)}Oe&&Ge.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];vt(b,e,n,n.viewport)}}else r.length>0&&yt(n,r,e,t),Oe&&Ge.render(e),vt(b,e,t)}L!==null&&re===0&&(Pe.updateMultisampleRenderTarget(L),Pe.updateRenderTargetMipmap(L)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Xe.resetDefaultState(),ie=-1,ae=null,C.pop(),C.length>0?(x=C[C.length-1],Pe.setTextureUnits(x.state.textureUnits),Se===!0&&Ue.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,k!==null&&k.renderEnd()};function _t(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||xe.intersectsSprite(e)){r&&Ee.setFromMatrixPosition(e.matrixWorld).applyMatrix4(we);let t=Re.update(e),i=e.material;i.visible&&b.push(e,t,i,n,Ee.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||xe.intersectsObject(e))){let t=Re.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Ee.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ee.copy(e.boundingSphere.center)),Ee.applyMatrix4(e.matrixWorld).applyMatrix4(we)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&b.push(e,t,s,n,Ee.z,o)}}else i.visible&&b.push(e,t,i,n,Ee.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)_t(i[e],t,n,r)}function vt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),Se===!0&&Ue.setGlobalState(T.clippingPlanes,n),r&&B.viewport(R.copy(r)),i.length>0&&bt(i,t,n),a.length>0&&bt(a,t,n),o.length>0&&bt(o,t,n),B.buffers.depth.setTest(!0),B.buffers.depth.setMask(!0),B.buffers.color.setMask(!0),B.setPolygonOffset(!1)}function yt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=je.has(`EXT_color_buffer_half_float`)||je.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new pn(1,1,{generateMipmaps:!0,type:e?P:D,minFilter:E,samples:Math.max(4,Me.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||R;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(de),fe=T.getClearAlpha(),fe<1&&T.setClearColor(16777215,.5),T.clear(),Oe&&Ge.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),Se===!0&&Ue.setGlobalState(T.clippingPlanes,r),bt(e,n,r),Pe.updateMultisampleRenderTarget(a),Pe.updateRenderTargetMipmap(a),je.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,xt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Pe.updateMultisampleRenderTarget(a),Pe.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(de,fe),d!==void 0&&(r.viewport=d),T.toneMapping=u}function bt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&xt(o,t,n,s,l,c)}}function xt(e,t,n,r,i,a){e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function St(e,t,n){t.isScene!==!0&&(t=De);let r=V.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=ze.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=ze.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Fe.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,it),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return wt(e,s),d}else s.uniforms=ze.getUniforms(e),k!==null&&e.isNodeMaterial&&k.build(e,n,s),e.onBeforeCompile(s,T),d=ze.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ue.uniform),wt(e,s),r.needsLights=Ot(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Ct(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=gu.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function wt(e,t){let n=V.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Tt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function Et(e,t,n,r,i){t.isScene!==!0&&(t=De),Pe.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=L===null?T.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:$t.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Fe.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=V.get(r),y=x.state.lights;if(Se===!0&&(Ce===!0||e!==ae)){let t=e===ae&&r.id===ie;Ue.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ue.numPlanes||v.numIntersection!==Ue.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=St(r,t,i),k&&r.isNodeMaterial&&k.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,D=S.getUniforms(),O=v.uniforms;if(B.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==ie&&(ie=r.id,w=!0),v.needsLights){let e=Tt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||ae!==e){B.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),D.setValue(z,`projectionMatrix`,e.projectionMatrix),D.setValue(z,`viewMatrix`,e.matrixWorldInverse);let t=D.map.cameraPosition;t!==void 0&&t.setValue(z,Te.setFromMatrixPosition(e.matrixWorld)),Me.logarithmicDepthBuffer&&D.setValue(z,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&D.setValue(z,`isOrthographic`,e.isOrthographicCamera===!0),ae!==e&&(ae=e,w=!0,E=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&D.setValue(z,`directionalShadowMap`,y.state.directionalShadowMap,Pe),y.state.spotShadowMap.length>0&&D.setValue(z,`spotShadowMap`,y.state.spotShadowMap,Pe),y.state.pointShadowMap.length>0&&D.setValue(z,`pointShadowMap`,y.state.pointShadowMap,Pe)),i.isSkinnedMesh){D.setOptional(z,i,`bindMatrix`),D.setOptional(z,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),D.setValue(z,`boneTexture`,e.boneTexture,Pe))}i.isBatchedMesh&&(D.setOptional(z,i,`batchingTexture`),D.setValue(z,`batchingTexture`,i._matricesTexture,Pe),D.setOptional(z,i,`batchingIdTexture`),D.setValue(z,`batchingIdTexture`,i._indirectTexture,Pe),D.setOptional(z,i,`batchingColorTexture`),i._colorsTexture!==null&&D.setValue(z,`batchingColorTexture`,i._colorsTexture,Pe));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Ke.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,D.setValue(z,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(O.envMapIntensity.value=t.environmentIntensity),O.dfgLUT!==void 0&&(O.dfgLUT.value=Ld()),w){if(D.setValue(z,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&Dt(O,E),a&&r.fog===!0&&Be.refreshFogUniforms(O,a),Be.refreshMaterialUniforms(O,r,he,me,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;O.probesSH.value=e.texture,O.probesMin.value.copy(e.boundingBox.min),O.probesMax.value.copy(e.boundingBox.max),O.probesResolution.value.copy(e.resolution)}gu.upload(z,Ct(v),O,Pe)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(gu.upload(z,Ct(v),O,Pe),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&D.setValue(z,`center`,i.center),D.setValue(z,`modelViewMatrix`,i.modelViewMatrix),D.setValue(z,`normalMatrix`,i.normalMatrix),D.setValue(z,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ze.update(n,S),Ze.bind(n,S)}}return S}function Dt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Ot(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return re},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(e,t,n){let r=V.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),V.get(e.texture).__webglTexture=t,V.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=V.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){L=e,I=t,re=n;let r=null,i=!1,a=!1;if(e){let o=V.get(e);if(o.__useDefaultFramebuffer!==void 0){B.bindFramebuffer(z.FRAMEBUFFER,o.__webglFramebuffer),R.copy(e.viewport),oe.copy(e.scissor),ce=e.scissorTest,B.viewport(R),B.scissor(oe),B.setScissorTest(ce),ie=-1;return}if(o.__webglFramebuffer===void 0)Pe.setupRenderTarget(e);else if(o.__hasExternalTextures)Pe.rebindTextures(e,V.get(e.texture).__webglTexture,V.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&V.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Pe.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=V.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Pe.useMultisampledRTT(e)===!1?V.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,R.copy(e.viewport),oe.copy(e.scissor),ce=e.scissorTest}else R.copy(ve).multiplyScalar(he).floor(),oe.copy(ye).multiplyScalar(he).floor(),ce=be;if(n!==0&&(r=j),B.bindFramebuffer(z.FRAMEBUFFER,r)&&B.drawBuffers(e,r),B.viewport(R),B.scissor(oe),B.setScissorTest(ce),i){let r=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=V.get(e.textures[t]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,t.__webglTexture,n)}ie=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){B.bindFramebuffer(z.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s),!Me.textureFormatReadable(c)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Me.textureTypeReadable(l)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&z.readPixels(t,n,r,i,Ye.convert(c),Ye.convert(l),a)}finally{let e=L===null?null:V.get(L).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){B.bindFramebuffer(z.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s),!Me.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Me.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,d),z.bufferData(z.PIXEL_PACK_BUFFER,a.byteLength,z.STREAM_READ),z.readPixels(t,n,r,i,Ye.convert(l),Ye.convert(u),0);let f=L===null?null:V.get(L).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,f);let p=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await ht(z,p,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,d),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,a),z.deleteBuffer(d),z.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Pe.setTexture2D(e,0),z.copyTexSubImage2D(z.TEXTURE_2D,n,0,0,o,s,i,a),B.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ye.convert(t.format),_=Ye.convert(t.type),v;t.isData3DTexture?(Pe.setTexture3D(t,0),v=z.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Pe.setTexture2DArray(t,0),v=z.TEXTURE_2D_ARRAY):(Pe.setTexture2D(t,0),v=z.TEXTURE_2D),B.activeTexture(z.TEXTURE0),B.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,t.flipY),B.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),B.pixelStorei(z.UNPACK_ALIGNMENT,t.unpackAlignment);let y=B.getParameter(z.UNPACK_ROW_LENGTH),b=B.getParameter(z.UNPACK_IMAGE_HEIGHT),x=B.getParameter(z.UNPACK_SKIP_PIXELS),S=B.getParameter(z.UNPACK_SKIP_ROWS),C=B.getParameter(z.UNPACK_SKIP_IMAGES);B.pixelStorei(z.UNPACK_ROW_LENGTH,h.width),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,h.height),B.pixelStorei(z.UNPACK_SKIP_PIXELS,l),B.pixelStorei(z.UNPACK_SKIP_ROWS,u),B.pixelStorei(z.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=V.get(e),r=V.get(t),h=V.get(n.__renderTarget),g=V.get(r.__renderTarget);B.bindFramebuffer(z.READ_FRAMEBUFFER,h.__webglFramebuffer),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(e).__webglTexture,i,d+n),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(t).__webglTexture,a,m+n)),z.blitFramebuffer(l,u,o,s,f,p,o,s,z.DEPTH_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||V.has(e)){let n=V.get(e),r=V.get(t);B.bindFramebuffer(z.READ_FRAMEBUFFER,N),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,ne);for(let e=0;e<c;e++)w?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,n.__webglTexture,i),T?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,r.__webglTexture,a),i===0?T?z.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):z.copyTexSubImage2D(v,a,f,p,l,u,o,s):z.blitFramebuffer(l,u,o,s,f,p,o,s,z.COLOR_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?z.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h);B.pixelStorei(z.UNPACK_ROW_LENGTH,y),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,b),B.pixelStorei(z.UNPACK_SKIP_PIXELS,x),B.pixelStorei(z.UNPACK_SKIP_ROWS,S),B.pixelStorei(z.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&z.generateMipmap(v),B.unbindTexture()},this.initRenderTarget=function(e){V.get(e).__webglFramebuffer===void 0&&Pe.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Pe.setTextureCube(e,0):e.isData3DTexture?Pe.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Pe.setTexture2DArray(e,0):Pe.setTexture2D(e,0),B.unbindTexture()},this.resetState=function(){I=0,re=0,L=null,B.reset(),Xe.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return ot}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=$t._getDrawingBufferColorSpace(e),t.unpackColorSpace=$t._getUnpackColorSpace()}},zd={type:`change`},Bd={type:`start`},Vd={type:`end`},Hd=new oi,Ud=new Fi,Wd=Math.cos(70*Wt.DEG2RAD),Gd=new G,Kd=2*Math.PI,qd={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Jd=1e-6,Yd=class extends yc{constructor(e,t=null){super(e,t),this.state=qd.NONE,this.target=new G,this.cursor=new G,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:g.ROTATE,MIDDLE:g.DOLLY,RIGHT:g.PAN},this.touches={ONE:_.ROTATE,TWO:_.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new G,this._lastQuaternion=new Gt,this._lastTargetPosition=new G,this._quat=new Gt().setFromUnitVectors(e.up,new G(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new vc,this._sphericalDelta=new vc,this._scale=1,this._panOffset=new G,this._rotateStart=new W,this._rotateEnd=new W,this._rotateDelta=new W,this._panStart=new W,this._panEnd=new W,this._panDelta=new W,this._dollyStart=new W,this._dollyEnd=new W,this._dollyDelta=new W,this._dollyDirection=new G,this._mouse=new W,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Zd.bind(this),this._onPointerDown=Xd.bind(this),this._onPointerUp=Qd.bind(this),this._onContextMenu=of.bind(this),this._onMouseWheel=tf.bind(this),this._onKeyDown=nf.bind(this),this._onTouchStart=rf.bind(this),this._onTouchMove=af.bind(this),this._onMouseDown=$d.bind(this),this._onMouseMove=ef.bind(this),this._interceptControlDown=sf.bind(this),this._interceptControlUp=cf.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=``}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(zd),this.update(),this.state=qd.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;Gd.copy(t).sub(this.target),Gd.applyQuaternion(this._quat),this._spherical.setFromVector3(Gd),this.autoRotate&&this.state===qd.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=Kd:n>Math.PI&&(n-=Kd),r<-Math.PI?r+=Kd:r>Math.PI&&(r-=Kd),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(Gd.setFromSpherical(this._spherical),Gd.applyQuaternion(this._quatInverse),t.copy(this.target).add(Gd),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=Gd.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new G(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new G(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=Gd.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(Hd.origin.copy(this.object.position),Hd.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Hd.direction))<Wd?this.object.lookAt(this.target):(Ud.setFromNormalAndCoplanarPoint(this.object.up,this.target),Hd.intersectPlane(Ud,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>Jd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Jd||this._lastTargetPosition.distanceToSquared(this.target)>Jd?(this.dispatchEvent(zd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?Kd/60/60*this.autoRotateSpeed:Kd/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Gd.setFromMatrixColumn(t,0),Gd.multiplyScalar(-e),this._panOffset.add(Gd)}_panUp(e,t){this.screenSpacePanning===!0?Gd.setFromMatrixColumn(t,1):(Gd.setFromMatrixColumn(t,0),Gd.crossVectors(this.object.up,Gd)),Gd.multiplyScalar(e),this._panOffset.add(Gd)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;Gd.copy(r).sub(this.target);let i=Gd.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Kd*this._rotateDelta.x/t.clientHeight),this._rotateUp(Kd*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Kd*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Kd*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Kd*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Kd*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Kd*this._rotateDelta.x/t.clientHeight),this._rotateUp(Kd*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new W,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Xd(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),this._isTrackingPointer(e)||(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function Zd(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function Qd(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(Vd),this.state=qd.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y})}}function $d(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case g.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=qd.DOLLY;break;case g.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=qd.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=qd.ROTATE}break;case g.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=qd.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=qd.PAN}break;default:this.state=qd.NONE}this.state!==qd.NONE&&this.dispatchEvent(Bd)}function ef(e){switch(this.state){case qd.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case qd.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case qd.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e)}}function tf(e){this.enabled!==!1&&this.enableZoom!==!1&&this.state===qd.NONE&&(e.preventDefault(),this.dispatchEvent(Bd),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(Vd))}function nf(e){this.enabled!==!1&&this._handleKeyDown(e)}function rf(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case _.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=qd.TOUCH_ROTATE;break;case _.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=qd.TOUCH_PAN;break;default:this.state=qd.NONE}break;case 2:switch(this.touches.TWO){case _.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=qd.TOUCH_DOLLY_PAN;break;case _.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=qd.TOUCH_DOLLY_ROTATE;break;default:this.state=qd.NONE}break;default:this.state=qd.NONE}this.state!==qd.NONE&&this.dispatchEvent(Bd)}function af(e){switch(this._trackPointer(e),this.state){case qd.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case qd.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case qd.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case qd.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=qd.NONE}}function of(e){this.enabled!==!1&&e.preventDefault()}function sf(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function cf(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}var lf=(e,t,n)=>Math.max(t,Math.min(n,e));function uf(e,t,n){let r=Math.hypot(e,t);return r?(e/=r,t/=r,{x:e*Math.cos(n)-t*Math.sin(n),z:-e*Math.sin(n)-t*Math.cos(n)}):{x:0,z:0}}function df(){let e=new Map,t=null,n=null;return{select(r,i){let a=n;if(n=r,!e.has(r)){let n=Math.hypot(i.x,i.y,i.z),o=r.startsWith(`roam`)&&a?.startsWith(`roam`)&&t?t.azimuth:Math.atan2(i.x,i.z);e.set(r,{azimuth:o,elevation:Math.asin(i.y/n),radius:n})}return t=e.get(r),t},drag(e,n){t&&(t.azimuth-=e*.005,t.elevation=lf(t.elevation+n*.004,.09,1.36))},zoom(e){t&&(t.radius=lf(t.radius*Math.exp(e*8e-4),t.fittedRadius?t.fittedRadius*.45:3.2,t.fittedRadius?t.fittedRadius*2.4:n===`roam`?18:24))},rotate(e){t&&(t.azimuth+=e)},orient(e){t&&Number.isFinite(e)&&(t.azimuth=e)},fit(e){!t||!Number.isFinite(e)||e<=0||(t.radius=e*(t.fittedRadius?t.radius/t.fittedRadius:1),t.fittedRadius=e)},offset(){let e=t||{radius:10,azimuth:.495,elevation:.5},n=e.radius*Math.cos(e.elevation);return{x:Math.sin(e.azimuth)*n,y:Math.sin(e.elevation)*e.radius,z:Math.cos(e.azimuth)*n}},get state(){return{...t,key:n}},reset(){e.clear(),t=null,n=null}}}function ff(){let e=``,t=0,n=!1,r=0,i=0,a=0,o=!1,s=e=>Math.atan2(Math.sin(e),Math.cos(e));return{movement(r,i,a){let o=r+`:`+i;return!r&&!i?(e=``,{x:0,z:0}):((o!==e||n)&&(t=Number.isFinite(a)?a:0,e=o,n=!1),uf(r,i,t))},observe(e,t,n){Number.isFinite(e+t+n)&&n>0&&Math.hypot(e,t)>3e-5?(r=Math.atan2(-e,-t),i+=Math.min(n,.1)):i=0},orbit(){a=1.8,n=!0,o=!1},recenter(){a=0,o=!0},turn(e,{azimuth:t,enabled:n=!0,blocked:c=!1,reducedMotion:l=!1}={}){let u=Number.isFinite(e)?lf(e,0,.1):0;if(a=Math.max(0,a-u),!Number.isFinite(t))return 0;if(c||!u||!o&&(!n||a>0||i<.3))return t;let d=s(r-t),f=l?.65:o?1.4:1.05,p=lf(d*(1-Math.exp(-u*2.7)),-f*u,f*u);return Math.abs(d)<.008&&(o=!1),t+p},reset(){e=``,t=r=i=a=0,n=!1,o=!1},get state(){return{basis:t,heading:r,movingTime:i,manualRemaining:a,recentering:o}}}}function pf(e,{direction:t,fov:n,width:r,height:i,rect:a,distance:o}={}){let s=new G(...e.min),c=new G(...e.max),l=s.clone().add(c).multiplyScalar(.5),u=new G(t.x,t.y,t.z).normalize(),d=new G(0,1,0).cross(u).normalize(),f=u.clone().cross(d).normalize(),p=Math.tan(n*Math.PI/360),m=p*r/i,h=2*a.left/r-1,g=2*a.right/r-1,_=1-2*a.bottom/i,v=1-2*a.top/i,y=(h+g)/2,b=(_+v)/2,x=2;for(let e of[s.x,c.x])for(let t of[s.y,c.y])for(let n of[s.z,c.z]){let r=new G(e,t,n).sub(l),i=r.dot(d),a=r.dot(f),o=r.dot(u);x=Math.max(x,o+.5,(i/m+g*o)/(g-y),(-i/m-h*o)/(y-h),(a/p+v*o)/(v-b),(-a/p-_*o)/(b-_))}let S=o??x,C=l.addScaledVector(d,-y*S*m).addScaledVector(f,-b*S*p);return{radius:x,target:C,offset:u.multiplyScalar(S)}}function mf(e){let t=[1/0,1/0,1/0],n=[-1/0,-1/0,-1/0];for(let r of[e.closed,e.open])for(let e=0;e<r.length;e+=3)for(let i=0;i<3;i++)t[i]=Math.min(t[i],r[e+i]),n[i]=Math.max(n[i],r[e+i]);return{min:t,max:n}}var hf=(e,t,n)=>Math.max(t,Math.min(n,Number.isFinite(e)?e:t)),gf=e=>(e=hf(e,0,1),e*e*(3-2*e));function _f(){let e=`solid`,t=0,n=0,r=7,i=0,a=0,o=!0,s=!1,c=0,l=()=>({phase:e,dispersion:i,flow:e===`solid`?0:(e===`breaking`?gf(t/.7)*.22:e===`drifting`?.22+.78*gf(t/4):1)*i,age:t,remaining:e===`drifting`?Math.max(0,r-t):e===`returning`?Math.max(0,5-t):0,cycles:a});function u(){e=`solid`,t=0,n=0,r=7,i=0,o=!0,s=!1,c=0}function d(u,{active:d=!1,energy:f=0,burst:p=!1,paused:m=!1,reducedMotion:h=!1}={}){if(m)return l();let g=hf(u,0,.25),_=d&&Number.isFinite(f)&&f>=8.5,v=!!p&&!s;return s=!!p,_?c=0:(c+=g,c>=.35&&(o=!0)),e===`solid`&&(v||_&&o)&&(e=`breaking`,t=0,n=0,r=7,a++,o=!1),e!==`solid`&&(t+=g,n+=g),e===`breaking`&&(i=gf(t/.7),t>=.7&&(e=`drifting`,t-=.7,i=1)),e===`drifting`&&(d&&f>.15&&(r=Math.min(15,Math.max(r,t+2.5))),i=1,t>=r&&(e=`returning`,t-=r)),e===`returning`&&(i=1-gf(t/5),t>=5&&(e=`solid`,t=0,i=0,o=!1,c=0)),l()}return{update:d,reset:u,get state(){return l()}}}var vf=Object.freeze([{id:`lily`,label:`风中百合`,description:`三朵反卷花与两枚未开的花苞`},{id:`lotus`,label:`水上重莲`,description:`三层叠瓣，低伏花杯与圆叶`},{id:`iris`,label:`晴空鸢尾`,description:`三面高旗与三片垂瓣，基部剑叶`},{id:`dahlia`,label:`星瓣大丽`,description:`四圈卷瓣向外放射，花盘如星`}]),yf=Object.freeze([{id:`silver`,label:`月银`,description:`冷银底色，视角流转的薄膜虹彩`},{id:`crystal`,label:`流晶`,description:`冰蓝晶体，清透内层与明亮折射边缘`},{id:`lily`,label:`粉瓷`,description:`粉白花面与梅粉花心，柔缎质感`},{id:`amber`,label:`琥珀`,description:`蜜金半透，花缘向朱橙过渡`},{id:`celadon`,label:`青釉`,description:`玉青釉面、浅金花心，温润反光`}]),bf={silver:{low:`#618de8`,high:`#dd74b6`,accent:`#e4d1ef`,stem:`#618de8`,pollen:`#ead6ba`},crystal:{low:`#8277dc`,high:`#97dbea`,accent:`#f0c7ff`,stem:`#587eb7`,pollen:`#d7c2f4`},lily:{low:`#dc719c`,high:`#f5d2db`,accent:`#fff0db`,stem:`#71ac86`,pollen:`#d8a368`},golden:{low:`#df743b`,high:`#f2ce6b`,accent:`#fff0b7`,stem:`#80a85a`,pollen:`#d6a84d`},amber:{low:`#db6538`,high:`#f2c46c`,accent:`#ffe7ab`,stem:`#b99358`,pollen:`#f7d783`},celadon:{low:`#328f96`,high:`#8ed3bc`,accent:`#d4eed4`,stem:`#4f9a8d`,pollen:`#e3cc77`}};function xf(e=`silver`,t=`blush`){return{...bf[e===`lily`&&t===`golden`?`golden`:Object.hasOwn(bf,e)?e:`silver`]}}function Sf(e,{phase:t=`solid`,active:n=!1,energy:r=0}={},i=0){let a=e.p1;return!a.solved&&(a.ink=Number.isFinite(a.ink)?Math.max(0,Math.min(1.2,a.ink)):0,t===`breaking`&&(a.broken=!0),a.broken&&t===`drifting`&&n&&Number.isFinite(r)&&Number.isFinite(i)&&i>0&&(a.ink=Math.min(1.2,a.ink+Math.min(r,5)*Math.min(i,.05))),a.hold=a.broken?Math.min(.75,.24+a.ink*.4):0,a.broken&&a.ink>=1.2&&t===`solid`?(a.solved=!0,a.hold=.8,!0):!1)}function Cf(e,t=`solid`){return e.p1.solved?`水下的路醒了。还想玩一会儿，也不必急着离开。`:t===`solid`&&e.p1.broken&&(e.p1.ink||0)<1.2?`花已归来。再触碰花心，随后按住拖动，给花尘留下一笔风。`:!e.p1.broken||t===`solid`?`轻触花心，让花瓣化作一阵光。也可以按 F。`:t===`breaking`?`花没有消失。它正换一种方式，留在你身边。`:(e.p1.ink||0)<1.2?`在花尘里按住拖动，让这一阵风留下你的笔迹。`:t===`returning`?`花瓣正在归位。你留下的风，已经被水面记住。`:`可以继续拨动花尘，也可以松手，看它慢慢回到花里。`}var wf=Object.freeze([Object.freeze({purpose:`memory`,x:-3,z:-46,title:`旧日的灯`,detail:`让故乡的声音继续被听见`,color:`#a8ceef`}),Object.freeze({purpose:`season`,x:0,z:-48,title:`眼前的四季`,detail:`让这里的花重新生长、更替`,color:`#edb0be`}),Object.freeze({purpose:`voyage`,x:3,z:-46,title:`远方的新庭`,detail:`让花帆带种子去往新的土地`,color:`#e9bd77`})]),Tf=Object.freeze({id:`source`,x:0,z:-43,title:`种核花杯`}),Ef=Object.freeze({id:`dock`,x:0,z:-50.25,title:`启程台`}),Df=(e,t)=>Math.hypot(e.x-t.x,e.z-t.z),Of=(e,t)=>e.bridge.solved&&!e.ending&&[0,1].includes(t)&&e.cores[t]===null?t:null;function kf(e,t){return!e.bridge.solved||e.ending||Of(e,t)!==null?null:e.cores.every(Boolean)?Ef:Tf}function Af(e,t,n){if(!e.bridge.solved||e.ending||t.z>-40)return null;n=Of(e,n);let r=e.cores.filter(Boolean).length,i={stage:n===null?r===2?`send`:r===1?`second`:`first`:`choose`,carried:n,placed:r,total:2},a=wf.find(e=>Df(t,e)<1.6);if(a){let t=e.cores.indexOf(a.purpose);return n===null?t>=0?{...i,kind:`lift`,id:t,purpose:null,title:a.title,detail:a.detail+`。启程前可以换个去处。`,actionLabel:`重新带走`,target:a}:{...i,kind:`empty`,title:a.title,detail:a.detail+`。先从入口花杯带来一枚种核。`,actionLabel:`先去拿种核`,target:Tf}:t<0?{...i,kind:`plant`,id:n,purpose:a.purpose,title:a.title,detail:a.detail+`。放下后，还可以取回。`,actionLabel:`种在这里`,target:a}:{...i,kind:`full`,title:a.title,detail:`这里已经种下一枚。另一座空花庭还在等你。`,actionLabel:`这里已有种核`,target:a}}if(Df(t,Tf)<1.6){if(n!==null)return{...i,kind:`carry`,title:`种核已在你手中`,detail:`带它走向旧灯、四季或远方；靠近时可以看到它会带来什么。`,actionLabel:`走向一座花庭`,target:null};let t=e.cores.findIndex(e=>e===null);if(t>=0)return{...i,kind:`take`,id:t,title:r?`还有一枚种核`:`两枚种核，三座花庭`,detail:r?`带上这一枚，再去看看另一座花庭。`:`先带上一枚。哪座花庭会让你想留下它？`,actionLabel:`拿起种核`,target:Tf}}if(n===null&&r===2&&Df(t,Ef)<1.75)return{...i,kind:`send`,title:`春信已备好`,detail:`寄出前，看看这两枚种核会带来什么。你仍可以回来更改。`,actionLabel:`看看这封春信`,target:Ef};let o=n===null?r===2?Ef:Tf:null;return{...i,kind:`walk`,title:n===null?r===2?`两座花庭已经醒来`:`还有一枚春天在等你`:`把种核带去你想照料的地方`,detail:n===null?r===2?`沿着花粉，走到前方的启程台。`:`沿着花粉，回到入口的种核花杯。`:`找一找蓝色听声环、粉色新芽与金色花帆。走近听听它们的愿望。`,actionLabel:n===null?r===2?`走向启程台`:`回到种核花杯`:`走近一座花庭`,target:o}}function jf(){let e=new K;e.name=`a-spring-carried-by-hand`;let t=new ts({color:`#e1ba7a`,metalness:.32,roughness:.35,emissive:`#b67b43`,emissiveIntensity:.18}),n=new si({color:`#ffe5aa`}),r=new si({color:`#ebbfcb`,transparent:!0,opacity:.6,depthWrite:!1}),i=new ts({color:`#9b879b`,roughness:.6}),a=(t,n,r,i,a)=>{let o=new yi(t,n);return o.position.set(r,i,a),e.add(o),o};a(new pa(.64,.78,.22,36),i,0,.1,-43);let o=[-.25,.25].map(e=>{let n=a(new Ho(.16,16,12),t,e,.6,-43);return n.scale.set(.8,1.55,.8),n}),s=a(new Ho(.14,16,12),n,0,0,0);s.scale.set(.8,1.45,.8);let c=a(new Uo(.77,.012,5,60),r,0,.36,-43);c.rotation.x=-Math.PI/2;let l=a(new Uo(.85,.035,6,70),t,0,.12,-50.25);l.rotation.x=-Math.PI/2;let u=a(new pa(.018,.025,1.3,8),t,0,.72,-50.25),d=a(new Ro(.52,.38),r,.25,1.16,-50.25);d.rotation.y=.45;let f=new Xr;f.setAttribute(`position`,new J(new Float32Array(144),3));let p=new $i({color:`#f4cf96`,size:.065,transparent:!0,opacity:.7,depthWrite:!1}),m=new ia(f,p);m.frustumCulled=!1,e.add(m);let h=null,g=!1,_=null,v=null;return{group:e,targets:[Tf,...wf.map(e=>({...e,id:e.purpose})),Ef],get context(){return _},get carried(){return h},persistCarried(){return h},restoreCarried(e,t){return h=Of(t,e),g=!1,h},reset(){h=null,g=!1,_=null,v=null},update(t,n,{state:r,player:i,trigger:a=!1,active:p=!0}){e.visible=!!r.bridge.solved;let y=[];h=Of(r,h);let b=p?Af(r,i,h):null,x=p&&a&&!g;if(g=!!a,x&&b&&(b.kind===`take`?(h=b.id,y.push({type:`carry`,id:h})):b.kind===`plant`?(v={at:t,from:new G(i.x+.25,(i.y??.35)+.75,i.z),to:new G(b.target.x,.7,b.target.z)},y.push({type:`allocate`,id:h,purpose:b.purpose}),h=null):b.kind===`lift`?(h=b.id,y.push({type:`allocate`,id:h,purpose:null})):b.kind===`send`?y.push({type:`preview-send`}):y.push({type:`guide`,text:b.detail})),_=b?{...b,progress:0,carried:h}:null,o.forEach((e,n)=>{e.visible=r.cores[n]===null&&h!==n,e.position.y=.65+Math.sin(t*1.4+n)*.06,e.rotation.y=t*.45+n}),s.visible=h!==null&&p,s.position.set(i.x+.3,(i.y??.35)+.78,i.z+.05),s.rotation.y=t*.6,v){let e=Math.min(1,(t-v.at)/.6);s.visible=!0,s.position.lerpVectors(v.from,v.to,e),s.position.y+=Math.sin(e*Math.PI)*.5,e>=1&&(v=null)}c.rotation.z=t*.1,c.material.opacity=.35+Math.sin(t*1.3)*.12,d.rotation.y=.45+Math.sin(t*.7)*.12,l.visible=r.cores.every(Boolean),u.visible=d.visible=l.visible;let S=kf(r,h);if(m.visible=p&&!!S&&!r.ending&&Df(i,S)>1.7,m.visible){let e=f.getAttribute(`position`);for(let n=0;n<48;n++){let r=(n/48+t*.1)%1;e.setXYZ(n,Wt.lerp(i.x,S.x,r),.19+Math.sin(r*Math.PI)*.2,Wt.lerp(i.z,S.z,r))}e.needsUpdate=!0}return y},dispose(){e.traverse(e=>e.geometry?.dispose());for(let e of[t,n,r,i,p])e.dispose()}}}function Mf(e){let t=new K;t.name=`first-spring-remembers-the-wind`;let n=[`#b9d9ea`,`#efb7ce`,`#e8cd93`].map((e,n)=>{let r=new K,i=-Math.PI/2+n*Math.PI*2/3;r.position.set(Math.cos(i)*2.3,.04,Math.sin(i)*2.3);let a=new ts({color:e,emissive:e,emissiveIntensity:.06,roughness:.5,metalness:.15});for(let e=0;e<7;e++){let t=new yi(new Ho(.19,12,8),a),n=e*Math.PI*2/7;t.position.set(Math.sin(n)*.22,.02,Math.cos(n)*.22),t.scale.set(.6,.12,1.45),t.rotation.y=n,r.add(t)}let o=new yi(new Uo(.48,.009,5,64),new si({color:e,transparent:!0,opacity:.08,depthWrite:!1}));return o.rotation.x=-Math.PI/2,r.add(o),t.add(r),{node:r,material:a,ring:o,value:0}}),r=[{id:`flower`,x:0,y:2.8,z:0,title:`沉睡的花`},{id:`wind`,x:3,y:.9,z:-18,title:`避风的花杯`},{id:`source`,x:0,y:1.05,z:-43,title:`种核花杯`},...wf.map(e=>({...e,id:e.purpose,y:1.35})),{id:`dock`,x:0,y:1.7,z:-50.25,title:`启程台`}].map(t=>{let n=document.createElement(`div`);n.className=`place-name`,n.hidden=!0;let r=document.createElement(`b`),i=document.createElement(`span`);return r.textContent=t.title,n.append(r,i),e.append(n),{...t,node:n,note:i}}),i=document.createElement(`div`);i.className=`journey-compass`,i.hidden=!0,e.append(i);let a=new G,o=new G,s=new G;return{group:t,update(e,c,{state:l,mode:u,focus:d,camera:f,delivery:p,phase:m=`solid`}){let h=u===`play`,g=l.player,_=l.cores.every(Boolean),v=Math.hypot(g.x,g.z+50.25);t.visible=u!==`gallery`;let y=[+!!l.p1.broken,(l.p1.ink||0)/1.2,+!!l.p1.solved];n.forEach((t,n)=>{t.value=Wt.damp(t.value,y[n],3,c),t.material.emissiveIntensity=.06+t.value*.7,t.ring.material.opacity=.08+t.value*.48,t.ring.scale.setScalar(1+Math.sin(e*.7+n)*.04*t.value),t.node.position.y=.04+t.value*.045}),f.getWorldDirection(o);for(let e of r){let t=h&&!l.ending;e.id===`flower`?t&&=!l.p1.solved&&!d&&Math.hypot(g.x,g.z)<10:e.id===`wind`?t&&=d===`wind`&&!l.wind.solved:t&&=l.bridge.solved&&g.z<-39&&!d,e.purpose&&_&&v<3.1&&(t=!1),e.id===`dock`&&(t&&=_&&v<3.1),e.id===`source`&&(t&&=p.carried===null&&l.cores.some(e=>!e)),s.set(e.x,e.y,e.z).sub(f.position);let n=s.dot(o)>0;a.set(e.x,e.y,e.z).project(f);let r=(a.x*.5+.5)*innerWidth,i=(-a.y*.5+.5)*innerHeight,c=n&&r>45&&r<innerWidth-45&&i>115&&i<innerHeight-160,u=t&&!!e.purpose&&!c;if(t&&=c||u,e.node.classList.toggle(`offscreen`,u),u&&(r=s.x*f.matrixWorld.elements[0]+s.y*f.matrixWorld.elements[1]+s.z*f.matrixWorld.elements[2]<0?55:innerWidth-55,i=165+wf.findIndex(t=>t.purpose===e.id)*48),e.node.hidden=!t,!t)continue;e.node.style.transform=`translate(${r}px,${i}px) translate(-50%,-100%)`;let m=l.cores.includes(e.id);e.node.classList.toggle(`planted`,m),e.note.textContent=u?`镜头外 · 拖动环看`:e.purpose?m?`已种下 · 可以取回`:e.detail:e.id===`source`?`点按 E 拿起`:e.id===`flower`?`靠近 · E 细看`:e.id===`wind`?`把光引到这里`:`点按 E 查看春信`}if(i.hidden=!h||!!d||!!l.ending,!i.hidden){let e=l.p1.solved?l.wind.solved?l.bridge.solved?kf(l,p.carried):{x:0,z:l.bridge.platform===`M`?-38:-26,title:l.bridge.platform===`M`?`彼岸`:`借桥的石台`}:{x:0,z:-16,title:`风廊`}:{x:0,z:0,title:`沉睡的花`};if(l.bridge.solved&&p.carried!==null&&(e=null),e){let t=Math.hypot(e.x-g.x,e.z-g.z);i.textContent=e.title+(t>2?` · `+Math.round(t)+`步`:` · 就在身边`)}else i.textContent=p.carried===null?`花庭可以慢慢走`:`一枚种核，正在你手中`}},dispose(){r.forEach(e=>e.node.remove()),i.remove();let e=new Set;t.traverse(t=>{t.geometry?.dispose(),t.material&&e.add(t.material)}),e.forEach(e=>e.dispose())}}}function Nf(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Xr,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Pf(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Pf(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Pf(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new Ir(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}function Ff(e,t=1e-4){t=Math.max(t,2**-52);let n={},r=e.getIndex(),i=e.getAttribute(`position`),a=r?r.count:i.count,o=0,s=Object.keys(e.attributes),c={},l={},u=[],d=[`getX`,`getY`,`getZ`,`getW`],f=[`setX`,`setY`,`setZ`,`setW`];for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.attributes[n];c[n]=new r.constructor(new r.array.constructor(r.count*r.itemSize),r.itemSize,r.normalized);let i=e.morphAttributes[n];i&&(l[n]||(l[n]=[]),i.forEach((e,t)=>{let r=new e.array.constructor(e.count*e.itemSize);l[n][t]=new e.constructor(r,e.itemSize,e.normalized)}))}let p=t*.5,m=10**Math.log10(1/t),h=p*m;for(let t=0;t<a;t++){let i=r?r.getX(t):t,a=``;for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),o=r.itemSize;for(let e=0;e<o;e++)a+=`${~~(r[d[e]](i)*m+h)},`}if(a in n)u.push(n[a]);else{for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),a=e.morphAttributes[n],u=r.itemSize,p=c[n],m=l[n];for(let e=0;e<u;e++){let t=d[e],n=f[e];if(p[n](o,r[t](i)),a)for(let e=0,r=a.length;e<r;e++)m[e][n](o,a[e][t](i))}}n[a]=o,u.push(o),o++}}let g=e.clone();for(let t in e.attributes){let e=c[t];if(g.setAttribute(t,new e.constructor(e.array.slice(0,o*e.itemSize),e.itemSize,e.normalized)),t in l)for(let e=0;e<l[t].length;e++){let n=l[t][e];g.morphAttributes[t][e]=new n.constructor(n.array.slice(0,o*n.itemSize),n.itemSize,n.normalized)}}return g.setIndex(u),g}function If(e,t=Math.PI/3){let n=e.index?e.toNonIndexed():e,r=n.attributes.position,i=r.count,a;if(r.isBufferAttribute===!0&&r.itemSize===3&&r.normalized===!1)a=r.array;else{a=new Float64Array(i*3);for(let e=0;e<i;e++)a[3*e+0]=r.getX(e),a[3*e+1]=r.getY(e),a[3*e+2]=r.getZ(e)}let o=Math.cos(t),s=(1+1e-10)*100,c=i/3,l=new Float64Array(c*3);for(let e=0;e<c;e++){let t=9*e,n=a[t+0],r=a[t+1],i=a[t+2],o=a[t+3],s=a[t+4],c=a[t+5],u=a[t+6],d=a[t+7],f=a[t+8],p=u-o,m=d-s,h=f-c,g=n-o,_=r-s,v=i-c,y=m*v-h*_,b=h*g-p*v,x=p*_-m*g,S=1/(Math.sqrt(y*y+b*b+x*x)||1);l[3*e+0]=y*S,l[3*e+1]=b*S,l[3*e+2]=x*S}let u=new Int32Array(i),d=new Int32Array(i*3),f=1;for(;f<i*2;)f<<=1;let p=f-1,m=new Int32Array(f),h=0;for(let e=0;e<i;e++){let t=3*e,n=~~(a[t+0]*s),r=~~(a[t+1]*s),i=~~(a[t+2]*s),o=(Math.imul(n,73856093)^Math.imul(r,19349663)^Math.imul(i,83492791))&p;for(;;){let t=m[o];if(t===0){let t=3*h;d[t+0]=n,d[t+1]=r,d[t+2]=i,m[o]=h+1,u[e]=h++;break}let a=3*(t-1);if(d[a+0]===n&&d[a+1]===r&&d[a+2]===i){u[e]=t-1;break}o=o+1&p}}let g=new Int32Array(h+1);for(let e=0;e<i;e++)g[u[e]+1]++;for(let e=0;e<h;e++)g[e+1]+=g[e];let _=new Int32Array(i),v=g.slice(0,h);for(let e=0;e<c;e++){let t=3*e;_[v[u[t+0]]++]=e,_[v[u[t+1]]++]=e,_[v[u[t+2]]++]=e}let y=new Float32Array(i*3);for(let e=0;e<c;e++){let t=3*e,n=l[t+0],r=l[t+1],i=l[t+2];for(let e=0;e<3;e++){let a=t+e,s=u[a],c=0,d=0,f=0;for(let e=g[s],t=g[s+1];e<t;e++){let t=3*_[e],a=l[t+0],s=l[t+1],u=l[t+2];n*a+r*s+i*u>o&&(c+=a,d+=s,f+=u)}let p=1/(Math.sqrt(c*c+d*d+f*f)||1);y[3*a+0]=c*p,y[3*a+1]=d*p,y[3*a+2]=f*p}}return n.setAttribute(`normal`,new Ir(y,3,!1)),n}var Lf=Math.PI*2,Rf=.25,zf=Wt.clamp,Bf=e=>{let t=zf(e,0,1);return t*t*(3-2*t)},Vf=[[-14.7,.1,4.8,.25],[-13.9,-3.6,3.7,-1.1],[-8.7,-4.1,2.55,1.2]],Hf=Object.freeze([Object.freeze({id:`rain-grove`,key:`rain`,title:`听雨春庭`,x:-12,z:-1,height:1.6,radius:2.1,need:0}),Object.freeze({id:`wind-terrace`,key:`wind`,title:`逆风春庭`,x:12,z:-16,height:2.5,radius:2.1,need:1}),Object.freeze({id:`tide-vault`,key:`tide`,title:`回声春庭`,x:-12,z:-29,height:1.1,radius:2.1,need:2})]),Uf=(e,t,n)=>Object.freeze({x:e,z:t,height:n}),Wf=Object.freeze([Object.freeze({id:`rain-out`,target:`rain-grove`,points:Object.freeze([Uf(-5,1,.12),Uf(-7.5,2,.25),Uf(-10,2.2,1.2),Uf(-12,-1,1.6)])}),Object.freeze({id:`rain-back`,target:`rain-grove`,points:Object.freeze([Uf(-12,-1,1.6),Uf(-10.3,-4,1.3),Uf(-7,-3,.28),Uf(-5,-2.5,.12)])}),Object.freeze({id:`wind-out`,target:`wind-terrace`,points:Object.freeze([Uf(4.5,-15,.12),Uf(7,-12,.45),Uf(10,-12.7,1.8),Uf(12,-16,2.5)])}),Object.freeze({id:`wind-back`,target:`wind-terrace`,points:Object.freeze([Uf(12,-16,2.5),Uf(10.2,-19,1.8),Uf(7,-20,.4),Uf(4.5,-18,.12)])}),Object.freeze({id:`tide-out`,target:`tide-vault`,points:Object.freeze([Uf(-5,-29,.12),Uf(-7,-29,.3),Uf(-8.6,-31,.7),Uf(-12,-29,1.1)])})]),Gf=[{...Hf[0],rx:4.1,rz:3.8,width:1.22,safe:`garden`,bounds:[-17,-3,-6.5,4.8],color:4418653},{...Hf[1],rx:4.15,rz:4,width:1.28,safe:`wind`,bounds:[3,17.5,-22,-10.2],color:5994078},{...Hf[2],rx:3.8,rz:3.3,width:1.2,safe:`pool`,bounds:[-17,-3.5,-34,-25],color:4746355}].map(e=>({...e,routes:Wf.filter(t=>t.target===e.id)}));function Kf(e=76193){return()=>(e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296)}function qf(e,t,n){let r={distance:1/0,height:.12,direction:0};for(let i of n)for(let n=1;n<i.points.length;n++){let a=i.points[n-1],o=i.points[n],s=o.x-a.x,c=o.z-a.z,l=zf(((e-a.x)*s+(t-a.z)*c)/(s*s+c*c),0,1),u=Math.hypot(e-a.x-s*l,t-a.z-c*l);u<r.distance&&(r={distance:u,height:a.height+(o.height-a.height)*Bf(l),direction:Math.atan2(s,c)})}return r}function Jf(e,t,n){let r=e-n.x,i=t-n.z,a=Math.hypot(r,i),o=Math.atan2(i,r),s=1/Math.hypot(Math.cos(o)/n.rx,Math.sin(o)/n.rz)*(1+.055*Math.sin(o*3+.7)+.025*Math.sin(o*7)),c=s-a,l=qf(e,t,n.routes),u=n.width-l.distance,d=Math.max(c,u),f=n.height*(1-Bf((a-n.radius-.28)/(s-n.radius-.28)))-.14*Bf((a-s+.5)/.5),p=l.height*(1-Bf((l.distance-n.width*.61)/(n.width*.39)))-.14*Bf((l.distance-n.width+.3)/.3),m=Math.max(f,p);return a<=n.radius+.18&&(m=n.height),{x:e,z:t,height:m,field:d,routeDistance:l.distance,r:a}}function Yf(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n],i=e[(n+1)%e.length];if(r.field>=0&&t.push(r),r.field>=0!=i.field>=0){let e=r.field/(r.field-i.field);t.push({x:r.x+(i.x-r.x)*e,z:r.z+(i.z-r.z)*e,height:r.height+(i.height-r.height)*e,field:0,routeDistance:r.routeDistance+(i.routeDistance-r.routeDistance)*e,r:r.r+(i.r-r.r)*e})}}return t}function Xf(e,t,n,r,i){let a=(r.z-i.z)*(n.x-i.x)+(i.x-r.x)*(n.z-i.z);if(Math.abs(a)<1e-10)return null;let o=((r.z-i.z)*(e-i.x)+(i.x-r.x)*(t-i.z))/a,s=((i.z-n.z)*(e-i.x)+(n.x-i.x)*(t-i.z))/a;return o<-1e-7||s<-1e-7||o+s>1+1e-7?null:n.height*o+r.height*s+i.height*(1-o-s)}function Zf(e,t){let[n,r,i,a]=e.bounds,o=Math.ceil((r-n)/Rf),s=Math.ceil((a-i)/Rf),c=[],l=[],u=[],d=[],f=[],p=new Map,m=new Map,h=new Map,g=new q(e.color),_=new q(13416859),v=new q(4151397),y=new q(3426901);function b(t){let n=`${t.x.toFixed(6)}:${t.z.toFixed(6)}`;if(p.has(n))return p.get(n);let r=f.length;p.set(n,r),f.push(t),c.push(t.x,t.height,t.z),u.push(t.x*.25,t.z*.25);let i=(1-Bf(t.routeDistance/.85))*(1-Bf((2.5-t.r)/.5)),a=g.clone().lerp(_,i*.8).lerp(v,1-Bf(t.field/.65)),o=Math.sin(t.x*.71+t.z*.34)*Math.cos(t.z*.83-t.x*.27)*.065,s=e.need===0?Math.max(...Vf.map(([e,n])=>Math.exp(-((t.x-e)**2+(t.z-n)**2)/2.7)))*.22:0;return a.multiplyScalar(.94+o+Math.sin(t.x*4.1+t.z*3.7)*Math.cos(t.z*5.3)*.035-s),l.push(a.r,a.g,a.b),r}for(let t=0;t<s;t++)for(let r=0;r<o;r++){let a=n+r*Rf,s=i+t*Rf,c=[Jf(a,s,e),Jf(a+Rf,s,e),Jf(a+Rf,s+Rf,e),Jf(a,s+Rf,e)],l=[];for(let e of[[c[0],c[3],c[1]],[c[1],c[3],c[2]]]){let t=Yf(e);for(let e=1;e<t.length-1;e++){let n=[t[0],t[e],t[e+1]];if(Math.abs((n[1].x-n[0].x)*(n[2].z-n[0].z)-(n[2].x-n[0].x)*(n[1].z-n[0].z))<1e-8)continue;let r=n.map(b);d.push(...r),l.push(n);for(let e=0;e<3;e++){let t=r[e],n=r[(e+1)%3],i=t<n?`${t}:${n}`:`${n}:${t}`;h.has(i)?h.delete(i):h.set(i,[t,n])}}}l.length&&m.set(t*o+r,l)}let x=d.length;for(let[e,t]of h.values()){let n=f[e],r=f[t],i=c.length/3,a=-.64;c.push(n.x,n.height,n.z,r.x,r.height,r.z,n.x,a,n.z,r.x,a,r.z),u.push(n.x*.25,n.height*.25,r.x*.25,r.height*.25,n.x*.25,a*.25,r.x*.25,a*.25);for(let e=0;e<4;e++){let t=e<2?v:y;l.push(t.r,t.g,t.b)}d.push(i,i+1,i+2,i+1,i+3,i+2)}let S=new Xr;S.setAttribute(`position`,new J(c,3)),S.setAttribute(`color`,new J(l,3)),S.setAttribute(`uv`,new J(u,2)),S.setIndex(d),S.computeVertexNormals(),S.computeBoundingSphere();let C=new yi(S,t);C.name=`${e.id}-ground`,C.receiveShadow=!0,C.userData.walkableTerrain=!0,C.userData.topIndexCount=x;function w(e,t){let r=Math.floor((e-n)/Rf),a=Math.floor((t-i)/Rf);if(r<0||r>=o||a<0||a>=s)return null;let c=m.get(a*o+r);if(!c)return null;for(let n of c){let r=Xf(e,t,...n);if(r!==null)return r}return null}return{mesh:C,heightAt:w,patch:e}}function Qf(e=.4,t=.07,n=6){let r=[],i=[],a=[];for(let o=0;o<=n;o++){let s=o/n,c=Math.sin(Math.PI*s)*t;for(let t of[-1,1])r.push(t*c,s*e,Math.sin(s*Math.PI)*e*.13+t*c*s*.35),i.push(t<0?0:1,s);if(o<n){let e=o*2;a.push(e,e+1,e+2,e+1,e+3,e+2)}}let o=new Xr;return o.setAttribute(`position`,new J(r,3)),o.setAttribute(`uv`,new J(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function $f(e,t,n,r,i,a){let o=[],s=[],c=Math.max(8,Math.ceil((a-i)*18));for(let r=0;r<=c;r++){let l=i+(a-i)*r/c;o.push(new W(Math.cos(l)*e,Math.sin(l)*t)),s.push(new W(Math.cos(l)*(e-n),Math.sin(l)*(t-n)))}let l=new qa;l.moveTo(o[0].x,o[0].y);for(let e=1;e<o.length;e++)l.lineTo(o[e].x,o[e].y);for(let e=s.length-1;e>=0;e--)l.lineTo(s[e].x,s[e].y);l.closePath();let u=new Mo(l,{depth:r,bevelEnabled:!0,bevelSegments:1,steps:1,bevelSize:.055,bevelThickness:.05,curveSegments:20});return u.translate(0,0,-r/2),u}function ep(e){let t=[],n=[],r=[];for(let i=0;i<=28;i++)for(let a=0;a<=12;a++){let o=i/28,s=a/12*2-1,c=Math.sin(o*Math.PI)**.75*e*.16,l=(Math.abs(o-.5)*2)**3*e*.075;if(t.push((o-.5)*e,-.25+l+s*s*c*.33,s*c),n.push(o,a/12),i<28&&a<12){let e=i*13+a;r.push(e,e+1,e+12+1,e+1,e+12+2,e+12+1)}}let i=new Xr;return i.setAttribute(`position`,new J(t,3)),i.setAttribute(`uv`,new J(n,2)),i.setIndex(r),i.computeVertexNormals(),i}function tp(){let e=[];for(let t=0;t<6;t++){let n=Qf(.31+t%3*.04,.012+t%2*.003,3),r=t*2.39996;n.rotateZ(Math.sin(r)*.24),n.rotateY(r),n.translate(Math.cos(r)*.05,0,Math.sin(r)*.05),e.push(n)}let t=Nf(e,!1);for(let t of e)t.dispose();return t}function np(){let e=new Fo(1,2),t=e.getAttribute(`position`);for(let e=0;e<t.count;e++){let n=t.getX(e),r=t.getY(e),i=t.getZ(e),a=1+.06*Math.sin(r*15+n*2)+.08*Math.sin(n*4+i*3);t.setXYZ(e,n*a,r*(1+.06*Math.cos(n*3-i*7)),i*a)}let n=Ff(e,1e-5);return e.dispose(),n.computeVertexNormals(),n}function rp(){let e=new K;e.name=`walkable-spring-landscape`;let t=[],n=new Map,r=new Set,i=Kf(),a={value:0},o={value:1},s=(e,n={})=>{let r=new ts({color:e,roughness:.84,metalness:.035,...n});return t.push(r),r},c=s(16777215,{vertexColors:!0}),l=s(11771520,{roughness:.76,vertexColors:!0}),u=s(2967124,{roughness:.92,vertexColors:!0}),d=s(8491660,{roughness:.96}),f=s(5858910,{roughness:.94,vertexColors:!0}),p=s(11109725,{metalness:.65,roughness:.38,vertexColors:!0}),m=s(7970443,{side:2,roughness:.52,metalness:.12}),h=s(7838082,{side:2,roughness:.8}),g=s(13220764,{side:2,roughness:.68,transparent:!0,opacity:.83});g.forceSinglePass=!0;let _=s(14269571,{emissive:12093508,emissiveIntensity:.23,roughness:.4,metalness:.4}),v=s(14995117,{emissive:14264181,emissiveIntensity:.65,roughness:.42,metalness:.22,side:2});for(let e of[m,h,g])e.onBeforeCompile=e=>{e.uniforms.landTime=a,e.uniforms.landWind=o,e.vertexShader=`uniform float landTime; uniform float landWind;\n${e.vertexShader}`,e.vertexShader=e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
        float plantHeight = max(0.0, position.y);
        vec3 landAnchor = vec3(0.0);
        #ifdef USE_INSTANCING
          landAnchor = instanceMatrix[3].xyz;
        #endif
        float landPhase = landAnchor.x * .73 + landAnchor.z * .41;
        transformed.x += sin(landTime * 1.1 + landPhase + plantHeight * 1.5) * plantHeight * .08 * landWind;
        transformed.z += sin(landTime * .7 + landPhase * 1.7) * plantHeight * .045 * landWind;
      `)},e.customProgramCacheKey=()=>`spring-landscape-sway-1`;let y=Gf.map(e=>Zf(e,c));for(let t of y)e.add(t.mesh),r.add(t.mesh.geometry);let b=(e,t)=>{for(let n of y){let r=n.heightAt(e,t);if(r!==null)return r}return-.12},x=new gn,S=new Gt,C=new G,w=new G;function T(e,t,r=[0,0,0],i=[0,0,0],a=[1,1,1],o=16777215){S.setFromEuler(new En(...i)),w.set(...r),C.set(...a),x.compose(w,S,C);let s=e.index?e.toNonIndexed():e.clone();s.applyMatrix4(x),e.dispose();let c=new q(o),l=new Float32Array(s.getAttribute(`position`).count*3);for(let e=0;e<l.length;e+=3)l[e]=c.r,l[e+1]=c.g,l[e+2]=c.b;s.setAttribute(`color`,new Ir(l,3)),n.has(t)||n.set(t,[]),n.get(t).push(s)}let E=(e,t,n,r=18,i=16777215)=>{T(new Wo(new Ea(e.map(e=>new G(...e))),r,t,5,!1),n,[0,0,0],[0,0,0],[1,1,1],i)},D=(e,t,n,r=24,i=16777215,a=7)=>{let o=new Ea(e.map(e=>new G(...e))),s=new Wo(o,r,t,a,!1),c=s.getAttribute(`position`);for(let e=0;e<=r;e++){let i=e/r,s=o.getPointAt(i),l=1-Bf(i)*(1-n/t);for(let t=0;t<=a;t++){let n=e*(a+1)+t;c.setXYZ(n,s.x+(c.getX(n)-s.x)*l,s.y+(c.getY(n)-s.y)*l,s.z+(c.getZ(n)-s.z)*l)}}return s.computeVertexNormals(),T(s,f,[0,0,0],[0,0,0],[1,1,1],i),o};function O(t,n,i,a){let o=new ji(n,i,a.length);o.name=t;let s=new Un;for(let e=0;e<a.length;e++){let t=a[e];s.position.set(...t.position),s.rotation.set(...t.rotation||[0,0,0]),s.scale.set(...t.scale||[1,1,1]),s.updateMatrix(),o.setMatrixAt(e,s.matrix),t.color&&o.setColorAt(e,new q(t.color))}return o.instanceMatrix.needsUpdate=!0,o.computeBoundingSphere(),o.castShadow=!1,e.add(o),r.add(n),o}let k=[],A=[];for(let[e,t,n,r]of Vf){let a=b(e,t),o=Math.cos(r)*.8,s=Math.sin(r)*.5;D([[e,a,t],[e+.1,a+n*.28,t],[e+o*.5,a+n*.7,t+s],[e+o,a+n,t+s]],.12+n*.018,.018,32);for(let c=0;c<8;c++){let l=c/8*Lf+r+i()*.35,u=1.1+i()*1.4,d=e+o+Math.cos(l)*u,f=t+s+Math.sin(l)*u,p=a+n*(.65+i()*.24),m=.47+c/8*.26,h=a+n*(.82+i()*.19),g=D([[e+o*.5,a+n*m,t+s*.5],[e+o+Math.cos(l)*u*.46,h,t+s+Math.sin(l)*u*.55],[d,p,f]],.055+n*.006,.004,24,12174517);for(let e=0;e<15;e++){let t=g.getPointAt(.3+e/22),n=e%2?1:-1;k.push({position:[t.x+n*.11,t.y-.02,t.z+Math.sin(e)*.09],rotation:[2,l+n*.8,n*.4],scale:[.7,.8,.7],color:new q(11323309)})}for(let n=0;n<5;n++){let r=.5+n/8,a=e+o+Math.cos(l)*u*r+(i()-.5)*.65,d=t+s+Math.sin(l)*u*r+(i()-.5)*.65,f=h+(p-h)*r,m=.65+i()*1.5;D([[a-.14,f,d],[a+.1,f-m*.45,d],[a,f-m,d+.07]],.012,.002,10,12698793,4);for(let e=0;e<9;e++){let t=e/9;k.push({position:[a+Math.sin(t*Math.PI)*.13,f-t*m,d+t*.07],rotation:[Math.PI*(.74+i()*.15),i()*Lf,(e%2?1:-1)*.5],scale:[.75+i()*.5,.8+i()*.5,.7],color:new q().setHSL(.39+i()*.05,.13+i()*.13,.55+i()*.22)})}n===0&&c%3==0&&A.push({position:[a,f-m-.05,d],scale:[.045,.08,.045]})}}for(let n=0;n<4;n++){let r=n*Lf/4;E([[e+Math.cos(r)*.65,a-.035,t+Math.sin(r)*.5],[e+Math.cos(r)*.25,a+.1,t+Math.sin(r)*.2],[e,a+.35,t]],.07,f,8)}}let j=O(`rain-willow-leaves`,Qf(.42,.055),m,k);j.castShadow=!0;let M=new is({depthPacking:Qe,side:2});M.onBeforeCompile=m.onBeforeCompile,M.customProgramCacheKey=m.customProgramCacheKey,t.push(M),j.customDepthMaterial=M,O(`hanging-dew`,new Ho(1,6,4),_,A);let N=b(13,-19);T($f(2.65,4.2,.38,.48,.1,1.17),l,[12.9,N+.1,-19.05],[0,.2,0],[1,1,1],12762539),T($f(2.65,4.2,.38,.48,1.42,Math.PI-.02),l,[12.9,N+.1,-19.05],[0,.2,0]);let P=12.9+Math.cos(.2)*2.46*Math.cos(.1),F=-19.05-Math.sin(.2)*2.46*Math.cos(.1),ee=N+.1+Math.sin(.1)*4.01,te=Math.min(-.28,b(P,F));T(new da(.78,ee-te+.09,.72),u,[P,(ee+te)/2,F],[0,.2,0],[1,1,1],12306106),T(new da(1.08,.18,1.05),l,[P,-.17,F],[0,.27,.015],[1,1,1],10268585),T(new da(.7,.22,.85),u,[10.3,b(10.3,-18.5)+.12,-18.5],[0,.3,-.06]),T(new da(.52,.85,.7),l,[14.6,b(14.6,-18.4)+.3,-18.4],[0,.4,.18],[1,1,1],11121062);let ne=[];for(let[e,t,n,r]of[[14.8,-15.1,3.7,-.3],[14.4,-13.8,2.7,.2],[10.7,-12.1,2,-.6]]){let i=b(e,t);E([[e,i,t],[e+.15,i+n*.5,t],[e+.5,i+n,t+.1]],.026,p,13),ne.push({position:[e+.18,i+n*.34,t],rotation:[0,r,-.15],scale:[5.8,n*.55/.4,1]})}O(`wind-court-sails`,Qf(.4,.09),g,ne);for(let e=0;e<3;e++){let t=-13.4-e*.22,n=-30.9+e*.64,r=1.8+e*.12,i=.8+e*.07,a=t-Math.cos(i)*(r-.12),o=n+Math.sin(i)*(r-.12),s=b(a,o);T($f(r,2.7-e*.25,.24,.26,.24+e*.12,Math.PI),l,[t,s+.02,n],[0,i,0],[1,1,1],e%2?10793903:13092275),T(new da(.46,.22,.5),l,[a,s+.025,o],[0,i,.02],[1,1,1],10268585)}for(let e=0;e<9;e++){let e=-14.1+i()*1.3,t=-27.5+i()*.7,n=b(e,t);T(new da(.58,.13+i()*.14,.32),u,[e,n+.06,t],[0,-.3+i()*.6,.02],[1,1,1],11912124)}let I=[],re=[];for(let e of y){let{patch:t}=e,[n,r,a,o]=t.bounds,s=0;for(let c=0;c<6e3&&s<390;c++){let c=n+i()*(r-n),l=a+i()*(o-a),u=e.heightAt(c,l);if(u===null||u<-.04)continue;let d=Jf(c,l,t);if(d.r<t.radius+.2||d.routeDistance<.72||d.field<.18)continue;let f=t.need===1?.75:.45,p=.19+i()*f;I.push({position:[c,u+.015,l],rotation:[(i()-.5)*.25,i()*Lf,(i()-.5)*.2],scale:[.8+i()*.9,p/.5,1],color:new q().setHSL(t.need===1?.15:.38,.12+i()*.16,.33+i()*.25)}),s++,s%8==0&&re.push({position:[c,u+.01,l],rotation:[i()*.8,i()*Lf,i()*.5],scale:[.12+i()*.18,.06+i()*.08,.12+i()*.2],color:new q().setHSL(.49,.04,.45+i()*.2)})}}O(`shore-reeds`,tp(),h,I),O(`eroded-shore-stones`,new Fo(1,1),d,re);for(let[e,t,n,r,i,a]of[[9.8,2.2,1.7,1.25,2.2,-.3],[-17.9,5.8,1.4,1.8,2,.5],[-17.8,-24.8,1.6,.9,1.15,-.2]])T(np(),u,[e,-.3,t],[0,a,.13],[n,r,i],10268587),T(np(),u,[e+.8,-.55,t+.55],[0,a+.8,-.18],[n*.6,r*.75,i*.7],8164753);function L(e,t,n,r){T(ep(n),l,[e,0,t],[0,r,0],[1,1,1],7179145);for(let i=1;i<6;i++){let a=i/6,o=(a-.5)*n,s=Math.sin(a*Math.PI)**.75*n*.16,c=[];for(let i=0;i<=10;i++){let l=i/5-1,u=new G(o,-.23+(Math.abs(a-.5)*2)**3*n*.075+l*l*s*.33,l*s);u.applyAxisAngle(new G(0,1,0),r),c.push([e+u.x,u.y,t+u.z])}E(c,.035,p,14,9678244)}let i=[];for(let a=0;a<=12;a++){let o=a/12,s=new G((o-.5)*n,-.22+(Math.abs(o-.5)*2)**2*.8,0);s.applyAxisAngle(new G(0,1,0),r),i.push([e+s.x,s.y,t+s.z])}E(i,.1,f,22,8824221);for(let i=0;i<3;i++){let a=new G(n*.1-i*.36,.12,i*.18).applyAxisAngle(new G(0,1,0),r);T(Qf(n*.36,n*.065),l,[e+a.x,a.y,t+a.z],[.1+i*.18,r+.2,-.23+i*.28],[1,1,1],9414560)}}L(23,-30,13,-.5),L(-23,-39,7.5,.2),L(20,-49,5.5,.6);let ie={};for(let e of y){let t=[];for(let n=0;n<36;n++){let r=n*2.39996,a=2.5+i()*.68,o=e.patch.x+Math.cos(r)*a,s=e.patch.z+Math.sin(r)*a,c=e.heightAt(o,s);if(c!==null)for(let e=0;e<3;e++)t.push({position:[o,c+.13,s],rotation:[.95,e*Lf/3,0],scale:[.6,.6,.6]})}let n=O(`${e.patch.key}-restored-flowers`,Qf(.27,.085),v,t);n.visible=!1,ie[e.patch.key]=n}for(let[t,i]of n){let n=Nf(i,!1);for(let e of i)e.dispose();if(!n)throw Error(`Landscape static geometry could not be merged.`);let a=new yi(n,t);a.name=`landscape-architecture`,a.castShadow=!0,a.receiveShadow=!0,e.add(a),r.add(n)}e.userData.expectedDrawCalls=11+n.size,e.userData.targets=Hf;let ae=!1,R=0;function oe(e,t,n={}){if(ae||!Number.isFinite(e)||!Number.isFinite(t))return null;for(let r of y){if(r.patch.need===1&&!n.p1?.solved||r.patch.need===2&&!n.wind?.solved)continue;let i=r.heightAt(e,t);if(i!==null)return{height:i,support:null,safe:r.patch.safe,...r.patch.safe===`pool`?{platform:`R`}:{},landmark:r.patch.id}}return null}function se(e=0,t=0,n={}){if(!ae){Number.isFinite(e)&&(R=e),a.value=R,o.value=n.settings?.reducedMotion?.2:1;for(let[e,t]of Object.entries(ie))t.visible=n.exploration?.[e]?.done===!0}}function ce(e,t){if(!ae)for(let[n,r]of[[c,.22],[d,.28],[u,.26],[f,.12]])n.normalMap=e||null,n.roughnessMap=t||null,n.normalScale.set(r,r),n.needsUpdate=!0}function le(){if(!ae){ae=!0;for(let e of r)e.dispose();for(let e of t)e.dispose();e.removeFromParent(),e.clear()}}return{group:e,update:se,supportAt:oe,targets:Hf,routes:Wf,setSurfaceTextures:ce,dispose:le}}var ip=Object.freeze({rain:Object.freeze({id:`rain-grove`,title:`雨留庭`,x:-12,y:1.6,z:-1,need:0}),wind:Object.freeze({id:`wind-terrace`,title:`风过庭`,x:12,y:2.5,z:-16,need:1}),tide:Object.freeze({id:`tide-vault`,title:`潮生庭`,x:-12,y:1.1,z:-29,need:2})}),ap=Object.freeze({x:-1.18,z:1.05}),op=Object.freeze([Object.freeze({x:-1.28,z:-.42}),Object.freeze({x:-.22,z:-1.3}),Object.freeze({x:1.12,z:-.83})]),sp=Object.freeze([Object.freeze({x:-1.08,z:.7,text:`岑的旧记录：风暴里，合拢的花替我们保住了雨声。`}),Object.freeze({x:.98,z:.65,text:`无名回信：我想在这里，等一场新的雨。`}),Object.freeze({x:.03,z:-1.22,text:`给后来者：种核只有两枚。那第三个愿望，也请记得。`})]),cp=Math.PI*2,lp=(e,t=0)=>Number.isFinite(e)?e:t,up=(e,t,n)=>Math.max(t,Math.min(n,lp(e,t))),dp=(e,t=1e6)=>Math.floor(up(e,0,t)),fp=(e,t)=>Math.hypot(e.x-t.x,e.z-t.z),pp=e=>{let t=0;for(let n=0;n<12;n++)t+=e>>n&1;return t},mp=e=>pp(e.mask)>=11&&e.travel>=5.15,hp=(e=ap)=>({x:e.x,z:e.z,vx:0,vz:0}),gp=()=>({done:!1,rounds:0,mask:0,travel:0,lastAngle:null,gap:0,clock:0,best:0,flash:0}),_p=()=>({done:!1,rounds:0,stage:0,seed:hp(),touched:!1,catching:!1,hold:0,rest:0,bumps:0,clock:0,best:0,flash:0}),vp=()=>({done:!1,rounds:0,index:0,hold:0,lastX:null,lastZ:null,pulse:0,clock:0,flash:0});function yp(){return{version:1,rain:gp(),wind:_p(),tide:vp(),seen:[]}}function bp(e){let t=yp();if(!e||typeof e!=`object`)return t;for(let n of[`rain`,`wind`,`tide`]){let r=e[n];if(!r||typeof r!=`object`)continue;let i=t[n];i.done=r.done===!0,i.rounds=Math.max(+!!i.done,dp(r.rounds)),i.clock=up(r.clock,0,86400),i.flash=0,`best`in i&&(i.best=up(r.best,0,86400))}return t.rain.mask=dp(e.rain?.mask,4095),t.rain.travel=up(e.rain?.travel,0,cp),mp(t.rain)&&(t.rain.mask=0,t.rain.travel=0,t.rain.clock=0),t.wind.stage=dp(e.wind?.stage,3),t.wind.bumps=dp(e.wind?.bumps),t.wind.touched=t.wind.stage>0,t.wind.seed=hp(t.wind.stage?op[t.wind.stage-1]:ap),t.wind.stage===3&&t.wind.done&&(t.wind.hold=1),t.tide.index=dp(e.tide?.index,3),t.tide.index===3&&!t.tide.done&&(t.tide.index=2),t.seen=[...new Set(Array.isArray(e.seen)?e.seen.filter(e=>[`rain`,`wind`,`tide`].includes(e)):[])],t}function xp(e){return{...e,rain:{...e.rain},wind:{...e.wind,seed:{...e.wind.seed}},tide:{...e.tide},seen:[...e.seen]}}function Sp(e){let t=xp(e);return t.wind.catching=!1,t.wind.hold<1&&(t.wind.hold=0),t.wind.seed.vx=t.wind.seed.vz=0,t}function Cp(e,t){let n=Object.keys(ip).find(e=>e===t||ip[e].id===t),r=xp(e);return n&&(r[n]={rain:gp,wind:_p,tide:vp}[n](),r[n].done=e[n].done,r[n].rounds=e[n].rounds,`best`in r[n]&&(r[n].best=e[n].best)),r}function wp(e,t){return e===`rain`||(e===`wind`?t?.p1?.solved===!0:t?.wind?.solved===!0)}function Tp(e,t={},n=ip){let r=t.player||{x:0,z:0},i=[`rain`,`wind`,`tide`].find(e=>wp(e,t.progress)&&fp(r,n[e])<4.1),a=[`rain`,`wind`,`tide`].filter(t=>e[t].done).length,o={nearTarget:i?n[i].id:null,key:i||null,title:i?n[i].title:``,completed:a,total:3,progress:0,objective:`为三座失联春庭递出春信`,hint:`岔路上的悬花与风铃，正等一位愿意绕远的送信人。`,touchHint:`用屏幕方向键走向岔路，关闭风笔时可单指环看。`};return i===`rain`?{...o,progress:e.rain.done&&!e.rain.mask?1:Math.min(1,pp(e.rain.mask)/11,e.rain.travel/5.15),objective:`用一圈风，缝回雨留庭的春天`,hint:e.rain.done?`花庭已醒。沿悬花继续画圈，听不同方向的风如何和鸣。`:`按住空格＋拖动风笔，沿悬花缓缓画一圈；短暂停笔，可以接着画。`,touchHint:e.rain.done?`花庭已醒。开启「风笔」，可再写一圈春风。`:`开启底部「风笔」，沿悬花缓缓画一圈。抬手后可以接着画。`}:i===`wind`?{...o,progress:e.wind.stage/3*.8+Math.min(1,e.wind.hold)*.2,objective:e.wind.hold>=1?`种子已经在花巢扎根`:`牵着种子，走过三道亮门`,hint:e.wind.hold>=1?`沿途的花为这封信开了。想再试一次，可以选择「再送一程」。`:e.wind.stage===3?`花巢已经打开。松开风笔，让种子落下。`:`按住空格拖动风笔，把种子牵到笔尖。沿花粉走向下一道亮门；停笔时，它也会慢下来。`,touchHint:e.wind.hold>=1?`种子已经扎根。想再试一次，可以选择「再送一程」。`:e.wind.stage===3?`花巢已经打开。抬起手指，让种子落下。`:`开启「风笔」，按住拖动，把种子牵到笔尖。沿花粉穿过亮门。`}:i===`tide`?{...o,progress:Math.min(1,(e.tide.index+e.tide.hold)/3),objective:`循着花铃，听完三段无名来信`,hint:e.tide.index===3?`来信已经完整。离庭再回来，潮声仍会讲给你听。`:`走近正在发光的回声花，松开风笔，停步静听；下一句藏在另一朵花里。`,touchHint:e.tide.index===3?`来信已经完整。离庭再回来，潮声仍会讲给你听。`:`用方向键走近发光的回声花，抬起手指，停步静听。`}:o}function Ep(e,t,n,r,i){let a=!n.done;n.done=!0,n.rounds++,n.flash=1,`best`in n&&(!n.best||n.clock<n.best)&&(n.best=n.clock),e.push({type:`complete`,key:t,id:ip[t].id,title:r,text:i,first:a,rounds:n.rounds})}function Dp(e,t={},n=0,r=ip){let i=t.interactive===!1||t.cancelled===!0?Sp(e):xp(e),a=[],o=up(n,0,.05);t.time;let s={x:lp(t.player?.x),z:lp(t.player?.z)},c=t.gesture||{},l=c.position,u=!!l&&Number.isFinite(l.x)&&Number.isFinite(l.z),d=c.active===!0&&u,f=t.interactive!==!1&&t.cancelled!==!0;for(let e of[`rain`,`wind`,`tide`]){if(i[e].flash=Math.max(0,i[e].flash-o*.6),!f||!wp(e,t.progress)||fp(s,r[e])>4.1||o===0)continue;i.seen.includes(e)||(i.seen.push(e),a.push({type:`discover`,key:e,id:r[e].id,title:r[e].title}));let n=r[e],p=u?{x:l.x-n.x,z:l.z-n.z}:null;if(i[e].clock+=o,e===`rain`){let t=i.rain,r=p?Math.hypot(p.x,p.z):1/0;if(d&&r>.9&&r<1.65){let r=Math.atan2(p.z,p.x),i=t.lastAngle===null?0:Math.atan2(Math.sin(r-t.lastAngle),Math.cos(r-t.lastAngle));if(Math.abs(i)>.7&&(i=0),Math.abs(i)>.002){let o=Math.floor((r+cp)%cp/cp*12),s=t.mask;t.mask|=1<<o,t.travel+=Math.abs(i),t.mask!==s&&a.push({type:`checkpoint`,key:e,id:n.id,step:pp(t.mask),total:12})}t.lastAngle=r,t.gap=0}else t.lastAngle=null,t.gap+=o,t.gap>2.5&&(t.travel=Math.max(0,t.travel-o*1.6),t.travel<=.01&&(t.mask=0));mp(t)&&(Ep(a,e,t,`雨留庭 · 写给旧日`,`岑在花环背面留了一行小字：记住故乡，不必让每朵花都重复同一个春天。`),t.mask=0,t.travel=0,t.lastAngle=null,t.clock=0)}if(e===`wind`){let t=i.wind;if(t.hold>=1)continue;let r=t.seed,s=op[2],l=d?fp(p,r):1/0,u=d&&l<2.65;if(u&&(t.touched=!0),d&&(t.catching=!1,t.hold=0),t.stage===3&&t.touched&&!d&&c.released===!0&&fp(r,s)<.7&&(t.catching=!0),t.catching&&!d){let n=1-Math.exp(-o*5);r.x+=(s.x-r.x)*n,r.z+=(s.z-r.z)*n,r.vx*=Math.exp(-o*8),r.vz*=Math.exp(-o*8),t.hold=Math.min(1,t.hold+o/.7),t.hold>=1&&Ep(a,e,t,`风过庭 · 写给远方`,`船舷旧便笺：把种子送到避风处。余下的路，让它自己长。`);continue}t.hold=0;let f=0,m=0;if(u&&l>.015){let e=Math.min(1.35,l*3.5);f=(p.x-r.x)/l*e,m=(p.z-r.z)/l*e}let h=1-Math.exp(-o*(u?7:8));r.vx+=(f-r.vx)*h,r.vz+=(m-r.vz)*h,r.x+=r.vx*o,r.z+=r.vz*o;let g=Math.hypot(r.x,r.z);if(g<.43){let i=g>.001?r.x/g:-1,o=g>.001?r.z/g:0;r.x=i*.44,r.z=o*.44;let s=Math.min(0,r.vx*i+r.vz*o);r.vx-=i*s,r.vz-=o*s,t.flash<.1&&(t.bumps++,t.flash=.7,a.push({type:`soft-return`,key:e,id:n.id,reason:`eddy`,text:`石心挡住了种子。沿花粉绕过去，亮起的风门会保留。`}))}Math.hypot(r.x,r.z)>2.05&&(t.seed=hp(t.stage?op[t.stage-1]:ap),t.bumps++,t.flash=.8,a.push({type:`soft-return`,key:e,id:n.id,reason:`boundary`,text:`种子回到上一道风门。把风笔靠近，再牵着它向亮门走。`})),t.touched&&t.stage<3&&fp(t.seed,op[t.stage])<.43&&(t.stage++,a.push({type:`checkpoint`,key:e,id:n.id,step:t.stage,total:3}))}if(e===`tide`){let t=i.tide;if(t.index>=3){fp(s,n)>3.3&&(t.index=0,t.hold=0,t.clock=0);continue}let r=sp[t.index],c=fp({x:s.x-n.x,z:s.z-n.z},r),l=t.lastX===null?0:Math.hypot(s.x-t.lastX,s.z-t.lastZ)/o;t.lastX=s.x,t.lastZ=s.z,t.pulse-=o,t.pulse<=0&&(t.pulse=.8+Math.min(c,3)*.45,a.push({type:`echo`,key:e,id:n.id,step:t.index,proximity:up(1-c/4,0,1),x:n.x+r.x,z:n.z+r.z})),t.hold=!d&&c<.72&&l<.35?Math.min(1,t.hold+o/1.25):Math.max(0,t.hold-o*1.5),t.hold>=1&&(a.push({type:`memory`,key:e,id:n.id,step:t.index+1,total:3,text:r.text}),t.index++,t.hold=0,t.flash=1,t.index>=3&&Ep(a,e,t,`潮生庭 · 写给眼前`,sp[2].text))}}return{state:i,signals:a,context:Tp(i,t,r)}}var Op=Math.PI*2,kp=(e,t=0)=>Number.isFinite(e)?e:t,Ap=(e,t,n)=>Math.max(t,Math.min(n,kp(e,t)));function jp(){let e=[],t=[],n=[];for(let r=0;r<=10;r++){let i=r/10;for(let a=0;a<=6;a++){let o=a/6*2-1,s=Math.sin(i*Math.PI)**.7*.32;if(e.push(o*s,Math.sin(i*Math.PI*.8)*.12+o*o*i*.09,i),n.push((o+1)/2,i),r<10&&a<6){let e=r*7+a;t.push(e,e+6+1,e+1,e+1,e+6+1,e+6+2)}}}let r=new Xr;return r.setAttribute(`position`,new J(e,3)),r.setAttribute(`uv`,new J(n,2)),r.setIndex(t),r.computeVertexNormals(),r}function Mp(){let e=new Uint8Array(4096);for(let t=0;t<32;t++)for(let n=0;n<32;n++){let r=Math.hypot(n/31*2-1,t/31*2-1),i=(t*32+n)*4;e[i]=e[i+1]=e[i+2]=255,e[i+3]=Math.round(Math.max(0,1-r)**2*255)}let t=new Si(e,32,32,ie);return t.needsUpdate=!0,t}function Np({anchors:e=ip}={}){let t=new K;t.name=`three-lost-spring-gardens`;let n=Object.fromEntries(Object.entries(e).map(([e,t])=>[e,{...t,radius:2.1,y:t.y??t.height??0}])),r=Object.fromEntries(Object.entries(n).map(([e,t])=>[e,t])),i=Mp(),a=new q(`#f5dbbd`),o=new q(`#81bdcf`),s=new q(`#f2aa9e`),c=new q(`#a3a5bc`),l=new ts({color:`#746e81`,roughness:.7,metalness:.12}),u=new ts({color:`#c2a282`,roughness:.44,metalness:.6}),d=new ns({color:`#f2d8c5`,roughness:.28,metalness:.05,side:2,clearcoat:.6,iridescence:.3,transparent:!0,opacity:.95}),f=new ts({color:`#d3d6ee`,emissive:`#b6b9f2`,emissiveIntensity:1.4,roughness:.25}),p=new ns({color:`#1c3457`,roughness:.2,metalness:.55,clearcoat:1}),m=new $i({color:`#edcda8`,size:.075,map:i,transparent:!0,opacity:.55,depthWrite:!1,blending:2}),h=jp(),g=new Un,_=new q,v=!1,y=0,b=yp(),x=[],S=Tp(b),C=new Float32Array(12).fill(.18),w=new Float32Array(3).fill(.2),T=.35,E={},D=new Set([i,m]);function O(e,t,n,r,i=[0,0,0],a=[0,0,0]){let o=new yi(n,r);return o.name=t,o.position.set(...i),o.rotation.set(...a),e.add(o),o}function k(e,t,n,r){let i=n.map(({geometry:e,position:t=[0,0,0],rotation:n=[0,0,0]})=>{if(e.index){let t=e;e=e.toNonIndexed(),t.dispose()}return g.position.set(...t),g.rotation.set(...n),g.scale.setScalar(1),g.updateMatrix(),e.applyMatrix4(g.matrix),e}),a=Nf(i,!1);return i.forEach(e=>e.dispose()),O(e,t,a,r)}function A(e,t=.012,n=Op){return new Uo(e,t,5,48,n)}function j(e,t,n,r=m){let i=new Xr;i.setAttribute(`position`,new J(n,3));let a=new ia(i,r);return a.name=t,e.add(a),a}function M(e,t,n){let r=new ji(h,d,n*5);return r.name=t,r.instanceMatrix.setUsage(at),r.frustumCulled=!1,e.add(r),r}function N(e,t,n,r,i,a,o,s,c=0){for(let l=0;l<5;l++)g.position.set(n,r,i),g.rotation.set((1-o)*-1.2,l*Op/5+c,0,`YXZ`),g.scale.set(a*.95,a,a),g.updateMatrix(),e.setMatrixAt(t*5+l,g.matrix),e.setColorAt(t*5+l,s)}function P(e){e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}for(let[e,n]of Object.entries(r)){let r=new K;r.name=`${n.id}-interaction`,r.position.set(n.x,n.y,n.z),t.add(r),E[e]={site:r,awake:0};let i=O(r,`${e}-garden-rim`,A(1.83,.016),u,[0,.035,0],[-Math.PI/2,0,0]);i.material=u,i.visible=e===`wind`;let c=[];for(let e=0;e<48;e++){let t=e*2.39996,n=.5+Math.sqrt(e/48)*1.1;c.push(Math.cos(t)*n,.2+e%7*.11,Math.sin(t)*n)}let l=m.clone();l.color.copy(e===`rain`?s:e===`wind`?a:o),E[e].motes=j(r,`${e}-reward-motes`,c,l),E[e].motes.visible=!1;let d=M(r,`${e}-reward-bloom`,18);d.visible=!1,E[e].reward=d}let F=E.rain.site,ee=[];for(let e=0;e<12;e++){let t=(e+.5)/12*Op,n=Math.cos(t)*1.28,r=Math.sin(t)*1.28;ee.push({geometry:new pa(.008,.015,.35,5),position:[n,.175,r],rotation:[.08*Math.cos(t),0,-.1*Math.sin(t)]})}k(F,`rain-twelve-letter-stems`,ee,u),E.rain.petals=M(F,`rain-trace-petals`,12);let te=[];for(let e=0;e<120;e++){let t=e/120*Op;te.push(Math.cos(t)*1.28,.36,Math.sin(t)*1.28)}E.rain.trace=j(F,`rain-trace-guide`,te,m.clone());let ne=O(F,`rain-empty-envelope`,new Lo(.14,0),f,[0,.42,0],[0,Math.PI/4,Math.PI/4]);E.rain.center=ne;let I=E.wind.site;k(I,`wind-eddy-and-postmark`,[{geometry:new ga(.37,0),position:[0,.18,0],rotation:[0,.4,.3]},{geometry:new pa(.34,.42,.06,24),position:[ap.x,.035,ap.z]}],l);let re=O(I,`wind-eddy`,A(.47,.018,Op*.8),p,[0,.31,0],[-Math.PI/2,.1,0]);E.wind.eddy=re,E.wind.seed=O(I,`wind-living-seed`,new Fo(.14,1),f.clone(),[ap.x,.31,ap.z]),E.wind.seed.scale.set(.8,1.4,.8);let L=new $i({color:`#fff0c9`,size:.5,map:i,transparent:!0,opacity:.85,depthWrite:!1,depthTest:!1,blending:2});E.wind.halo=j(I,`wind-seed-halo`,[0,0,0],L),E.wind.halo.renderOrder=3,E.wind.history=Array.from({length:28},()=>({x:ap.x,z:ap.z}));let ie=new $i({color:`#fce5a9`,size:.07,map:i,transparent:!0,opacity:.7,depthWrite:!1,blending:2,vertexColors:!0});E.wind.trail=j(I,`wind-seed-wake`,Array(84).fill(0),ie),E.wind.trail.frustumCulled=!1;let ae=[];for(let e=0;e<28;e++){let t=(1-e/28)**.8;ae.push(t,t,t)}E.wind.trail.geometry.setAttribute(`color`,new J(ae,3)),E.wind.gates=op.map((e,t)=>{let n=u.clone();return O(I,`wind-gate-${t+1}`,A(.43,.024,Math.PI),n,[e.x,.1,e.z],[0,t*.7+.4,0])});let R=new Ea([ap,...op].map(e=>new G(e.x,.075,e.z)));E.wind.path=j(I,`wind-current-path`,R.getPoints(60).flatMap(e=>e.toArray()),m.clone()),E.wind.nest=M(I,`wind-receiving-flower`,1),E.wind.pointer=O(I,`wind-next-gate`,new Lo(.06),f.clone(),[op[0].x,.7,op[0].z]);let oe=new Xr;oe.setAttribute(`position`,new J(new Float32Array(27),3)),E.wind.tether=new Ji(oe,new Bi({color:`#f5ddb5`,transparent:!0,opacity:.65,depthWrite:!1})),E.wind.tether.name=`wind-held-connection`,E.wind.tether.frustumCulled=!1,I.add(E.wind.tether),E.wind.catchRing=O(I,`wind-release-catch`,A(.7,.013),m.clone(),[op[2].x,.07,op[2].z],[-Math.PI/2,0,0]);let se=E.tide.site,ce=[];sp.forEach((e,t)=>{ce.push({geometry:new pa(.012,.018,.65+t*.08,6),position:[e.x,.32+t*.04,e.z],rotation:[0,0,(t-1)*.1]}),ce.push({geometry:A(.22,.016),position:[e.x,.66+t*.08,e.z],rotation:[-Math.PI/2,0,0]})}),k(se,`tide-letter-chimes`,ce,u),E.tide.petals=M(se,`tide-echo-flowers`,3),E.tide.ripples=sp.map((e,t)=>{let n=new si({color:`#9bd0d9`,transparent:!0,opacity:.4,depthWrite:!1,blending:2});return O(se,`tide-echo-ripple-${t}`,A(.35,.009),n,[e.x,.05,e.z],[-Math.PI/2,0,0])});function le(e,i,l={}){if(v)return[];e=kp(e,y),y=e;let u=Ap(i,0,.05),d=Dp(l.exploration||b,{...l,time:e},u,r);b=d.state,l.exploration&&Object.assign(l.exploration,b),x=d.signals,S=d.context;let f=l.reducedMotion?.15:1,p=l.reducedMotion||u===0?1:1-Math.exp(-u*7),m=l.reducedMotion||u===0?1:1-Math.exp(-u*3.5);for(let t of[`rain`,`wind`,`tide`]){let n=E[t],r=b[t];n.awake+=(+!!r.done-n.awake)*m;let i=t===`rain`||(t===`wind`?l.progress?.p1?.solved:l.progress?.wind?.solved);if(n.site.visible=!!i,n.motes.visible=r.done,n.motes.rotation.y=e*.08*f,n.motes.position.y=Math.sin(e*.4)*.06*f,n.motes.material.opacity=.3+r.flash*.45,n.reward.visible=r.done,r.done){for(let r=0;r<18;r++){let i=r/18*Op,c=1.63+Math.sin(r*6.4)*.12,l=Math.cos(i)*c,u=Math.sin(i)*c;if(t===`wind`){let e=R.getPoint(r/17);l=e.x+Math.sin(r*2.4)*.2,u=e.z+Math.cos(r*2.4)*.2}else if(t===`tide`){let e=sp[Math.floor(r/6)];l=e.x+Math.cos(r/6*Op)*.43,u=e.z+Math.sin(r/6*Op)*.43}let d=.05+.95*n.awake;N(n.reward,r,l,.09+Math.sin(e*.5+r)*.018*f,u,(.2+r%3*.025)*d,.15+.75*n.awake,t===`tide`?o:r%2?a:s,i)}P(n.reward)}}let h=b.rain;for(let t=0;t<12;t++){let n=(t+.5)/12*Op,r=!!(h.mask&1<<t);_.copy(r?a:h.done?s:c);let i=r?.95:h.done?.7:.18;C[t]+=(i-C[t])*p,N(E.rain.petals,t,Math.cos(n)*1.28,.36+Math.sin(e*.8+t)*.022*f,Math.sin(n)*1.28,.31,C[t],_,n)}P(E.rain.petals),E.rain.trace.material.opacity=S.key===`rain`?.6:.25,E.rain.center.rotation.y=e*.3*f,E.rain.center.position.y=.42+Math.sin(e)*.035*f,E.rain.center.scale.setScalar(1+h.flash*.6);let g=b.wind;E.wind.seed.position.set(g.seed.x,.31+Math.sin(e*2.4)*.024*f,g.seed.z),E.wind.halo.position.copy(E.wind.seed.position),E.wind.halo.material.opacity=.6+Math.sin(e*2.4)*.12*f+g.flash*.2,u>0&&(E.wind.history.pop(),E.wind.history.unshift({x:g.seed.x,z:g.seed.z}));let D=E.wind.trail.geometry.getAttribute(`position`);E.wind.history.forEach((e,t)=>D.setXYZ(t,e.x,.3,e.z)),D.needsUpdate=!0,E.wind.trail.visible=!l.reducedMotion,E.wind.seed.rotation.y=e*.9*f;let O=l.gesture?.position,k=n.wind,A=O?O.x-k.x:0,j=O?O.z-k.z:0,M=l.interactive!==!1&&l.gesture?.active&&O&&g.hold<1&&Math.hypot(A-g.seed.x,j-g.seed.z)<2.65&&Math.hypot((l.player?.x??99)-k.x,(l.player?.z??99)-k.z)<4.1;if(E.wind.tether.visible=!!M,M){let e=E.wind.tether.geometry.getAttribute(`position`);for(let t=0;t<9;t++){let n=t/8;e.setXYZ(t,g.seed.x+(A-g.seed.x)*n,.32+Math.sin(n*Math.PI)*.13,g.seed.z+(j-g.seed.z)*n)}e.needsUpdate=!0}E.wind.catchRing.visible=g.stage===3&&g.hold<1,E.wind.catchRing.material.opacity=.4+Math.sin(e*2)*.1*f,E.wind.seed.material.emissiveIntensity=g.hold>=1?2.2:1.4,E.wind.eddy.rotation.z=e*.45*f,E.wind.gates.forEach((t,n)=>{t.material.color.copy(n<g.stage?o:n===g.stage?a:c),t.material.emissive.copy(n<g.stage?o:n===g.stage?a:c),t.material.emissiveIntensity=n===g.stage?.55+.15*Math.sin(e*2)*f:n<g.stage?.3:.04}),E.wind.pointer.visible=g.stage<3,g.stage<3&&E.wind.pointer.position.set(op[g.stage].x,.63+Math.sin(e*2)*.06*f,op[g.stage].z),E.wind.pointer.rotation.y=e*f,T+=((g.hold>=1?1:.35)-T)*p,N(E.wind.nest,0,op[2].x,.06,op[2].z,.44,T,g.done?a:o),P(E.wind.nest);let F=b.tide;return sp.forEach((t,n)=>{let r=F.index===n,i=n<F.index,s=i?1:r?.72+Math.sin(e)*.08*f:.2;w[n]+=(s-w[n])*p,N(E.tide.petals,n,t.x,.65+n*.08,t.z,.31,w[n],i?a:r?o:c,n*1.7);let u=E.tide.ripples[n],d=(e*.6+n*.21)%1;u.visible=r||F.done,u.scale.setScalar(l.reducedMotion?1.6:.8+d*2.8),u.material.opacity=l.reducedMotion?r?.55:.16:r?(1-d)*(.4+F.hold*.3):.12}),P(E.tide.petals),t.updateMatrixWorld(!0),x}function ue(){if(v)return;v=!0;let e=new Set(D);t.traverse(t=>{t.geometry&&e.add(t.geometry);for(let n of t.material?[t.material].flat():[]){e.add(n);for(let t of Object.values(n))t?.isTexture&&e.add(t)}}),e.forEach(e=>e.dispose()),t.clear()}return le(0,0,{interactive:!1}),{group:t,targets:n,update:le,dispose:ue,get signals(){return x},get context(){return S},get state(){return b}}}var Pp=(e,t=0)=>Number.isFinite(e)?e:t,Fp=(e,t,n)=>Math.max(t,Math.min(n,e)),Ip=Object.freeze({start:Object.freeze({x:-3,z:2}),goal:Object.freeze({x:3,z:-2}),catchRadius:1.05,contactRadius:2.65});function Lp(e){let t=e?.wind;t&&!t.solved&&(t.catching=!1,t.hold=0,t.vx=t.vz=0)}function Rp(e,t={},n=0){let r=Fp(Pp(n),0,.05),i=e.wind;if(t.cancelled===!0){Lp(e);return}if(!e.p1.solved||i.solved||!r)return;i.time=Pp(i.time)+r;let a=()=>Object.assign(i,{x:-3,z:2,vx:0,vz:0,touched:!1,catching:!1,hold:0,returns:Pp(i.returns)+1});if(!Number.isFinite(i.x+i.z+i.vx+i.vz)||Math.abs(i.x)>4.8||Math.abs(i.z)>3.8){a();return}let o=t.pointer,s=!!o&&Number.isFinite(o.x)&&Number.isFinite(o.z),c=s&&Math.hypot(o.x-i.x,o.z-i.z)<Ip.contactRadius;c&&(i.touched=!0);let l=Math.hypot(i.x-3,i.z+2);if(s&&(i.catching=!1,i.hold=0),i.touched&&!s&&t.released===!0&&l<Ip.catchRadius&&(i.catching=!0),i.catching&&!s){let e=1-Math.exp(-r*5);i.x+=(3-i.x)*e,i.z+=(-2-i.z)*e,i.vx*=Math.exp(-r*8),i.vz*=Math.exp(-r*8),i.hold=Math.min(.7,i.hold+r),i.hold>=.7&&Object.assign(i,{x:3,z:-2,vx:0,vz:0,solved:!0});return}i.hold=0;let u=0,d=0;if(c){let e=o.x-i.x,t=o.z-i.z,n=Math.hypot(e,t),r=Math.min(1.85,n*3.5);n>.015&&(u=e/n*r,d=t/n*r)}let f=1-Math.exp(-r*(c?7:8));i.vx+=(u-i.vx)*f,i.vz+=(d-i.vz)*f,i.x+=i.vx*r,i.z+=i.vz*r;let p=Math.hypot(i.x,i.z);if(p<.88){let e=p>.001?i.x/p:-1,t=p>.001?i.z/p:0;i.x=e*.89,i.z=t*.89;let n=Math.min(0,i.vx*e+i.vz*t);i.vx-=e*n,i.vz-=t*n}(Math.abs(i.x)>4.8||Math.abs(i.z)>3.8)&&a()}var zp=e=>e&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.z),Bp=(e,t,n)=>Math.max(t,Math.min(n,e)),Vp=[0,1,2,2,1,3],Hp=`
attribute float aBirth;
attribute float aEdge;
uniform float uClock;
uniform float uLifetime;
varying float vAge;
varying float vEdge;
void main() {
  vAge = clamp((uClock - aBirth) / uLifetime, 0.0, 1.0);
  vEdge = aEdge;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Up=`
uniform vec3 uColor;
uniform float uOpacity;
varying float vAge;
varying float vEdge;
void main() {
  float fade = (1.0 - vAge) * (1.0 - vAge);
  float core = exp(-vEdge * vEdge * 6.0);
  vec3 color = mix(uColor * 1.1, vec3(1.7, 1.38, 1.18), core * 0.52);
  gl_FragColor = vec4(color, fade * (0.13 + core * 0.62) * uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,Wp=`
attribute float aBirth;
attribute float aSeed;
uniform float uClock;
uniform float uLifetime;
uniform float uWidth;
uniform float uReducedMotion;
varying float vAge;
void main() {
  float age = max(0.0, uClock - aBirth);
  vAge = clamp(age / uLifetime, 0.0, 1.0);
  vec3 drift = vec3(sin(aSeed * 41.7), 0.55 + aSeed, cos(aSeed * 29.3));
  vec3 point = position + drift * age * age * uWidth * 1.6 * (1.0 - uReducedMotion);
  vec4 mv = modelViewMatrix * vec4(point, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uWidth * 1500.0 / max(-mv.z, 0.2), 1.2, 5.0) * (1.0 - vAge * 0.65);
}
`,Gp=`
uniform vec3 uColor;
uniform float uOpacity;
varying float vAge;
void main() {
  float radius = length(gl_PointCoord - 0.5) * 2.0;
  if (radius > 1.0) discard;
  float alpha = exp(-radius * radius * 4.0) * pow(1.0 - vAge, 1.5) * uOpacity * 0.7;
  gl_FragColor = vec4(mix(uColor, vec3(1.6, 1.35, 1.1), 0.52), alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;function Kp({maxPoints:e=96,lifetime:t=1.8,width:n=.035,color:r=16107496,quality:i=`standard`}={}){let a=Bp(Number.isFinite(e)?Math.floor(e):96,8,512),o=Bp(Number.isFinite(t)?t:1.8,.15,8),s=Bp(Number.isFinite(n)?n:.035,.002,1),c=new K;c.name=`SpringLetterWindBrush`,c.visible=!1;let l=new Float32Array(a*3),u=new Float64Array(a),d=new Uint32Array(a),f=new Float32Array(a),p=new Float32Array((a-1)*12*3),m=new Float32Array((a-1)*12),h=new Float32Array((a-1)*12),g=new Float32Array(a*3),_=new Float32Array(a),v=new Float32Array(a),y=new Xr;y.setAttribute(`position`,new Ir(p,3).setUsage(at)),y.setAttribute(`aBirth`,new Ir(m,1).setUsage(at)),y.setAttribute(`aEdge`,new Ir(h,1).setUsage(at)),y.setDrawRange(0,0);let b=new Xr;b.setAttribute(`position`,new Ir(g,3).setUsage(at)),b.setAttribute(`aBirth`,new Ir(_,1).setUsage(at)),b.setAttribute(`aSeed`,new Ir(v,1).setUsage(at)),b.setDrawRange(0,0);let x=Object.values(y.attributes),S=Object.values(b.attributes),C={uClock:{value:0},uLifetime:{value:o},uWidth:{value:s},uColor:{value:new q(r)},uOpacity:{value:1},uReducedMotion:{value:0}},w={uniforms:C,transparent:!0,depthWrite:!1,depthTest:!0,blending:2,toneMapped:!0},T=new $o({...w,name:`SpringLetterWindThread`,side:2,vertexShader:Hp,fragmentShader:Up}),E=new $o({...w,name:`SpringLetterWindSparks`,vertexShader:Wp,fragmentShader:Gp}),D=new yi(y,T),O=new ia(b,E);D.name=`WindThread`,O.name=`WindSparks`,D.frustumCulled=!1,O.frustumCulled=!1,D.renderOrder=20,O.renderOrder=21,c.add(D,O);let k=0,A=0,j=0,M=!1,N=0,P=0,F=!1,ee,te,ne=new G,I=new G,re=new G,L=new G,ie=new G,ae=new G,R=new G,oe=new G(0,1,0),se=new G(1,0,0),ce=new G;function le(e){if(!F){for(ee=e===`low`?`low`:`standard`,te=ee===`low`?Math.min(48,a):a;A>te;)k=(k+1)%a,A--;O.visible=ee!==`low`,de()}}le(i);function ue(e,t,n){A===te&&(k=(k+1)%a,A--);let r=(k+A)%a;e.toArray(l,r*3),u[r]=t,d[r]=j,f[r]=n,A++}function de(){let e=0;P=0;for(let t=0;t<A;t++){let n=(k+t)%a;for(let e=0;e<3;e++)g[t*3+e]=l[n*3+e];if(_[t]=u[n],v[t]=(n*73+d[n]*11)%101/101,t===0)continue;let r=(k+t-1)%a;if(d[r]===d[n]&&(re.fromArray(l,r*3),L.fromArray(l,n*3),ie.subVectors(L,re),!(ie.lengthSq()<1e-10))){ie.normalize(),ae.crossVectors(ie,Math.abs(ie.y)>.92?se:oe).normalize(),R.crossVectors(ie,ae).normalize();for(let t=0;t<2;t++){let i=t===0?ae:R;for(let t of Vp){let a=t>=2,o=t%2?1:-1,c=a?L:re,l=a?n:r,d=s*(.4+f[l]*.6);ce.copy(c).addScaledVector(i,d*o).toArray(p,e*3),m[e]=u[l],h[e]=o,e++}}P++}}y.setDrawRange(0,e),b.setDrawRange(0,ee===`low`?0:A);for(let e of x)e.needsUpdate=!0;for(let e of S)e.needsUpdate=!0;c.visible=A>0&&C.uOpacity.value>0}function fe(e,t,{gesture:n,reducedMotion:r=!1,opacity:i=1,color:c}={}){if(F)return;let l=Bp(Number.isFinite(e)?e:0,0,.1);for(N+=l,C.uClock.value=N,C.uReducedMotion.value=+!!r,C.uOpacity.value=Bp(Number.isFinite(i)?i:0,0,1),c&&C.uColor.value.set(c);A&&N-u[k]>=o;)k=(k+1)%a,A--;let d=!!(n?.active&&zp(n.position));if(d){I.set(Bp(n.position.x,-1e5,1e5),Bp(n.position.y,-1e5,1e5),Bp(n.position.z,-1e5,1e5));let e=Bp(Number.isFinite(n.strength)?n.strength:1,0,1),t=I.distanceTo(ne);if(!M||t>Math.max(s*120,2))j++,ue(I,N,e),ne.copy(I);else if(t>s*.4){let n=Math.min(8,Math.ceil(t/Math.max(s*.8,.01)));for(let t=1;t<=n;t++)ce.lerpVectors(ne,I,t/n),ue(ce,N-l*(1-t/n),e);ne.copy(I)}else A&&(u[(k+A-1)%a]=N)}M=d,de()}function pe(){F||(k=0,A=0,P=0,M=!1,y.setDrawRange(0,0),b.setDrawRange(0,0),c.visible=!1)}return{group:c,update:fe,clear:pe,setQuality:le,getStats:()=>({sampleCount:A,segmentCount:P,capacity:te,quality:ee,drawCalls:c.visible?+!!P+(O.visible&&A?1:0):0,lifetime:o,disposed:F}),dispose(){F||(pe(),F=!0,y.dispose(),b.dispose(),T.dispose(),E.dispose(),c.clear())}}}function qp(){let e=0,t=()=>{e=0};return{update(n,r,i=!0){return i?(!Number.isFinite(r)||r<=0||(e=Math.max(0,Math.min(18,e+((Number.isFinite(n)?Math.max(0,n):0)-e)*-Math.expm1(-8*r)))),e):(t(),e)},reset:t,get value(){return e}}}function Jp(){let e=new $o({side:1,depthWrite:!1,depthTest:!1,toneMapped:!0,uniforms:{uNight:{value:0},uDust:{value:0},uTime:{value:0}},vertexShader:`varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
   varying vec3 vDirection;uniform float uNight;uniform float uDust;uniform float uTime;
   float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
   void main(){
    vec3 d=normalize(vDirection);float h=smoothstep(-.12,.8,d.y);
    vec3 day=mix(vec3(.63,.48,.48),vec3(.25,.32,.46),h);
    day=mix(day,vec3(.35,.42,.46),(1.-smoothstep(-.38,-.02,d.y)));
    float sun=pow(max(dot(d,normalize(vec3(-.65,.24,-.7))),0.),100.);
    day+=vec3(.56,.3,.13)*sun*.5;
    vec3 night=mix(vec3(.075,.045,.11),vec3(.014,.019,.055),h);
    vec3 grid=floor(d*480.);float spark=step(.9992,hash(grid));
    night+=spark*pow(max(d.y,0.),.4)*(.32+.16*sin(uTime*.3+hash(grid+2.)*20.))*vec3(.7,.8,1.);
    vec3 color=mix(day,night,uNight);color=mix(color,vec3(.0025,.0015,.006),uDust);
    gl_FragColor=vec4(color,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`}),t=new yi(new Ho(140,24,16),e);return t.name=`the-weather-between-letters`,t.renderOrder=-1e3,t.frustumCulled=!1,{object:t,update(n,r,i,a){t.position.copy(r.position),e.uniforms.uTime.value=n,e.uniforms.uNight.value=i,e.uniforms.uDust.value=a},dispose(){t.geometry.dispose(),e.dispose()}}}function Yp(){let e=new K;e.name=`mi-the-spring-courier`;let t=new ts({color:`#e6d4ba`,roughness:.66,metalness:.05,side:2}),n=new ts({color:`#a45f77`,roughness:.56,side:2}),r=new ts({color:`#293b49`,roughness:.23,metalness:.4}),i=new ts({color:`#d6b777`,roughness:.3,metalness:.65}),a=new si({color:`#ffe4aa`}),o=(t,n,r,i=e)=>{let a=new yi(t,n);return a.position.set(...r),a.castShadow=!0,a.receiveShadow=!0,i.add(a),a},s=new K;e.add(s);let c=new Xr,l=[],u=[];for(let e=0;e<=18;e++)for(let t=0;t<=36;t++){let n=e/18,r=.5+t/36*(Math.PI*2-1),i=.1+n**.85*.28,a=Math.sin(r*7)*.018*n;if(l.push(Math.sin(r)*(i+a),.62-n*.6+Math.cos(r*3)*.04*n,Math.cos(r)*(i+a)),e<18&&t<36){let n=e*37+t;u.push(n,n+37,n+1,n+1,n+37,n+38)}}c.setAttribute(`position`,new J(l,3)),c.setIndex(u),c.computeVertexNormals();let d=o(c,t,[0,0,0],s);o(new ma(.18,.53,14),n,[0,.29,0],s),o(new Ho(.17,24,18),t,[0,.76,0],s).scale.set(1,1.12,1),o(new Ho(.133,20,14),r,[0,.755,.09],s).scale.set(1,.93,.55);for(let e of[-.047,.047])o(new Ho(.012,8,6),a,[e,.77,.157],s).scale.set(.6,1.25,.5);let f=o(new ma(.075,.25,12),t,[-.035,.98,-.015],s);f.rotation.z=.32;let p=o(new Uo(.115,.017,5,24),i,[0,.59,0],s);p.rotation.x=Math.PI/2;let m=o(new da(.19,.24,.04),t,[.04,.4,-.22],s);m.rotation.z=-.18;let h=o(new Ho(.035,12,8),i,[.04,.42,-.249],s);h.scale.z=.2;let g=o(new pa(.012,.016,.7,8),i,[.29,.36,.06],s);g.rotation.z=-.15;let _=o(new Lo(.045),a,[.34,.72,.06],s);_.scale.y=1.6;let v=new Ro(.12,.75,2,14);v.translate(0,-.375,0);let y=v.attributes.position.array.slice(),b=o(v,n,[-.12,.58,-.08],s);b.rotation.x=1.2,b.rotation.z=-.25;let x=0,S=new G,C=!1;return{group:e,update(e,t,n,r=!1){C||=(S.copy(n),!0);let i=n.x-S.x,a=n.z-S.z,o=Math.min(1,Math.hypot(i,a)/Math.max(.001,t)/3);if(o>.02){let e=Math.atan2(i,a);x+=Math.atan2(Math.sin(e-x),Math.cos(e-x))*(1-Math.exp(-t*12))}s.rotation.y=x,s.position.y=Math.sin(e*(o>.1?9:2))*(o>.1?.035:.018),d.rotation.z=Math.sin(e*8)*o*.035,g.rotation.z=r?-.45+Math.sin(e*3)*.08:-.15,_.material.color.set(r?`#ffc3f1`:`#ffe4aa`);let c=v.attributes.position.array;for(let t=0;t<c.length;t+=3){let n=-y[t+1]/.75;c[t+2]=Math.sin(n*5-e*3)*.05*n*(1+o),c[t]=y[t]+Math.sin(n*3-e*2)*.035*n}v.attributes.position.needsUpdate=!0,S.copy(n)},dispose(){e.traverse(e=>e.geometry?.dispose());for(let e of[t,n,r,i,a])e.dispose()}}}var Xp={A:{x:0,z:-26},R:{x:-5,z:-29},M:{x:0,z:-32},F:{x:0,z:-38}};function Zp(e,t,n,r){let i=r.x-n.x,a=r.z-n.z,o=Math.max(0,Math.min(1,((e-n.x)*i+(t-n.z)*a)/(i*i+a*a||1)));return Math.hypot(e-n.x-o*i,t-n.z-o*a)}function Qp(e,t,n){if(!Number.isFinite(e)||!Number.isFinite(t))return null;let r={height:.12,support:null};if(Math.hypot(e,t)<=6.8)return{...r,safe:`garden`};if(n.p1.solved&&(Math.abs(e)<=1.25&&t<=-6&&t>=-11||Math.hypot(e,t+16)<=6))return{...r,safe:`wind`};if(n.wind.solved){for(let[n,i]of Object.entries(Xp))if(Math.hypot(e-i.x,t-i.z)<=1.25)return{...r,safe:`pool`,platform:n};if(Math.abs(e)<=1.15&&t<=-21&&t>=-26)return{...r,safe:`pool`,platform:`A`};if(Zp(e,t,Xp.A,Xp.R)<=.85)return{...r,safe:`pool`,platform:`R`};let i=n.bridge.structure;if(i===`bridge_am`&&Zp(e,t,Xp.A,Xp.M)<=.78||i===`bridge_mf`&&Zp(e,t,Xp.M,Xp.F)<=.78)return{...r,safe:`pool`,support:i};if(i===`shield_rm`&&Zp(e,t,Xp.R,Xp.M)<=.78)return{...r,safe:`pool`,support:`leaf_rm`}}return n.bridge.solved&&(Math.hypot(e,t+46)<=6||Math.abs(e)<=1.15&&t<=-38&&t>=-42)?{...r,safe:`finale`}:null}function $p(e){return e.player.safe===`pool`&&e.wind.solved?{...Xp[e.bridge.platform]||Xp.A}:e.player.safe===`finale`&&e.bridge.solved?{x:0,z:-43}:e.player.safe===`wind`&&e.p1.solved?{x:0,z:-11}:{x:0,z:6}}var em=.5,tm=.75,nm=1.2,rm=.85,im=2.15,am=.4,om=e=>e&&Number.isFinite(e.x)&&Number.isFinite(e.z),sm=(e,t)=>Math.hypot(e.x-t.x,e.z-t.z),cm=(e,t,n)=>Math.max(t,Math.min(n,e)),lm=[[`bridge_am`,`A`,`M`,.28],[`bridge_mf`,`M`,`F`,-.32],[`shield_rm`,`R`,`M`,.24]];function um(e,t){let n=Xp[e.from],r=Xp[e.to],i=r.x-n.x,a=r.z-n.z,o=Math.hypot(i,a),s=Math.sin(t*Math.PI)*e.curve;return{x:n.x+i*t-a/o*s,y:am,z:n.z+a*t+i/o*s}}var dm=Object.freeze(lm.map(([e,t,n,r])=>{let i={shape:e,from:t,to:n,curve:r};return i.anchors=Object.freeze(Array.from({length:6},(e,t)=>Object.freeze(um(i,t/5)))),Object.freeze(i)}));function fm(e,t){if(!om(e))return null;let n=t?.bridge?.platform;return Xp[n]&&sm(e,Xp[n])<=nm?n:null}function pm(e,t){return{shape:e.shape,target:e.from===t?e.to:e.from,anchors:e.from===t?e.anchors:[...e.anchors].reverse()}}function mm(e,t){let n=1/0;for(let r=1;r<t.length;r++)n=Math.min(n,Zp(e.x,e.z,t[r-1],t[r]));return n}function hm(e,t,n,r){let i=r.x-n.x,a=r.z-n.z,o=i*i+a*a,s=-1;for(;t<e.anchors.length;){let r=e.anchors[t],c=o>1e-10?cm(((r.x-n.x)*i+(r.z-n.z)*a)/o,0,1):0;if(c<s-.02||Math.hypot(n.x+i*c-r.x,n.z+a*c-r.z)>em)break;s=c,t++}return t}function gm(){let e=!1,t=`idle`,n=null,r=null,i=[],a=1,o=0,s=0,c=`从脚下石台起笔，把悬光逐一连到彼岸。`,l=null,u=[],d={available:!1,origin:null,status:`idle`,shape:null,target:null,progress:0,hint:c,anchors:[]};function f(n=`风线散开了。回到脚下的光环，再轻轻起笔。`){(t===`drawing`||t===`ready`)&&(t=`fading`,s=1.1,c=n),e=!1}function p(e){t=`fading`,s=1.1,c=e}function m(f,{player:m,gesture:h,state:g,interactive:_=!0}={}){let v=[],y=cm(Number.isFinite(f)?f:0,0,.1),b=fm(m,g),x=g?.wind?.solved===!0,S=!!g?.bridge?.support,C=!!(_&&x&&!S&&b),w=!!(h?.active&&om(h.position)),T=w?h.position:null;if(t===`fading`?(s-=y,o*=Math.exp(-3.4*y),s<=0&&(t=`idle`,r=null,a=1,o=0,u.length=0)):t===`committed`&&(s-=y,s<=0&&(t=`idle`,r=null,a=1,o=0,u.length=0)),t!==`drawing`&&t!==`ready`||C&&b===n||p(S?`先回到石台，才能收放承托你的花桥。`:`站稳在起笔的石台上，再把这一笔送出去。`),w&&!e)C?sm(T,Xp[b])>tm?p(`从自己脚下的光环起笔，风线才知道从哪里出发。`):(n=b,i=dm.filter(e=>e.from===n||e.to===n).map(e=>pm(e,n)),r=i.length===1?i[0]:null,a=1,o=0,t=`drawing`,u.length=0,u.push({x:T.x,y:.41800000000000004,z:T.z}),l={x:T.x,z:T.z},c=`沿悬光慢慢写过去，让每一粒光都记住这一笔。`):c=x?S?`先回到石台，才能收放承托你的花桥。`:`走到一座固定石台，再开始织桥。`:`先让风廊的光抵达，池上的悬光才会醒来。`;else if(w&&(t===`drawing`||t===`ready`)){if(sm(T,l)>im)p(`这一笔跨得太远，风线断开了。沿悬光连续写过去。`);else if(Math.min(...(r?[r]:i).map(e=>mm(T,e.anchors)))>rm)p(`风线离开了悬光。松手，让它退回，再试一次。`);else{if(r)a=hm(r,a,l,T);else{let e=1;for(let t of i){let n=hm(t,1,l,T);n>e&&(r=t,a=n,e=n)}}r&&(o=(a-1)/(r.anchors.length-1),a>=r.anchors.length&&(t=`ready`,c=`彼岸接住了。留在最后一粒光上，松手让花桥成形。`)),sm(T,l)>.035&&(u.length>=160&&u.shift(),u.push({x:T.x,y:.41800000000000004,z:T.z})),l.x=T.x,l.z=T.z}}!w&&e&&(t===`ready`&&!h?.active&&C&&b===n&&h?.released!==!1&&!h?.cancelled&&sm(l,r.anchors.at(-1))<=tm?(v.push({type:`construct`,shape:r.shape}),t=`committed`,o=1,s=1.5,c=`花尘接成了一条路。收起风笔，走到下一座石台。`):(t===`drawing`||t===`ready`)&&p(h?.released===!1||h?.cancelled?`这一笔已收回。回到脚下的光环可以重新开始。`:`还差几粒悬光。风线会退回，等你重新起笔。`)),e=w;let E=t===`idle`;E&&(c=C?`从脚下光环起笔，沿悬光连到相邻石台，最后松手。`:x?S?`先回到石台，才能收放承托你的花桥。`:`走到一座固定石台，再开始织桥。`:`先让风廊的光抵达，池上的悬光才会醒来。`);let D=r||(C?pm(dm.find(e=>e.from===b||e.to===b),b):null);return d={available:C,origin:E?b:n,status:!C&&E?`blocked`:t,shape:r?.shape||null,target:r?.target||null,progress:o,hint:c,fade:t===`fading`?cm(s/1.1,0,1):1,anchors:D?D.anchors.map((e,t)=>({...e,passed:t<a,next:t===a})):[]},v}return{update:m,cancel:f,get context(){return d},get preview(){return u}}}var _m=`
attribute float aRoute;
attribute float aAlong;
varying float vRoute;
varying float vAlong;
void main(){vRoute=aRoute;vAlong=aAlong;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
`,vm=`
uniform vec3 uAvailable;
uniform vec3 uProgress;
uniform vec3 uReverse;
uniform vec3 uBuilt;
uniform vec3 uNext;
uniform float uTime;
uniform float uOpacity;
float channel(vec3 value,float route){return route<0.5?value.x:route<1.5?value.y:value.z;}
vec4 pathColor(float route,float along){
 float available=channel(uAvailable,route),built=channel(uBuilt,route);
 float progress=channel(uProgress,route),reverse=channel(uReverse,route);
 float travel=mix(along,1.0-along,reverse);
 float passed=step(travel,progress)*step(0.001,progress);
 float nextGlow=(1.0-smoothstep(0.025,0.09,abs(travel-channel(uNext,route))))*available*(1.0-built);
 float pulse=pow(max(0.0,sin(travel*18.0-uTime*2.2)),6.0)*available;
 vec3 cool=vec3(0.27,0.53,0.7),warm=vec3(1.25,0.88,0.45);
 vec3 color=mix(cool,warm,max(passed,built)*0.86);
 color=mix(color,vec3(1.4,1.05,0.7),nextGlow*0.65);
 float alpha=(0.05+available*0.19+passed*0.5+built*0.18+pulse*0.16+nextGlow*0.2)*uOpacity;
 return vec4(color,alpha);
}
`,ym=`
varying float vRoute;varying float vAlong;
${vm}
void main(){gl_FragColor=pathColor(vRoute,vAlong);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`,bm=`
attribute float aRoute;attribute float aAlong;
uniform float uTime;
varying float vRoute;varying float vAlong;
void main(){vRoute=aRoute;vAlong=aAlong;vec3 p=position;p.y+=sin(uTime*1.4+aAlong*8.0+aRoute)*0.035;
vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(230.0/max(-mv.z,0.2),5.0,20.0);}
`,xm=`
varying float vRoute;varying float vAlong;
${vm}
void main(){vec2 point=(gl_PointCoord-0.5)*2.0;float radius=length(point);if(radius>1.0)discard;vec4 color=pathColor(vRoute,vAlong);
float angle=atan(point.y,point.x+0.00001);float petal=0.68+0.25*cos(angle*4.0);
float flower=1.0-smoothstep(petal-0.16,petal,radius);float glow=exp(-radius*radius*4.5);
gl_FragColor=vec4(color.rgb*1.4,color.a*(glow*0.85+flower*0.35)*2.1);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`;function Sm(){let e=new K;e.name=`SpringLetterBridgeWeaver`;let t=gm(),n={uAvailable:{value:new G},uProgress:{value:new G},uReverse:{value:new G},uBuilt:{value:new G},uNext:{value:new G(.2,.2,.2)},uTime:{value:0},uOpacity:{value:1}},r=[],i=[],a=[],o=[],s=[],c=[];dm.forEach((e,t)=>{for(let n=0;n<32;n++)for(let o of[n/32,(n+1)/32]){let n=um(e,o);r.push(n.x,n.y,n.z),i.push(t),a.push(o)}e.anchors.forEach((e,n)=>{o.push(e.x,e.y+.045,e.z),s.push(t),c.push(n/5)})});function l(e,t,n){let r=new Xr;return r.setAttribute(`position`,new J(e,3)),r.setAttribute(`aRoute`,new J(t,1)),r.setAttribute(`aAlong`,new J(n,1)),r}let u=l(r,i,a),d=l(o,s,c),f=new $o({uniforms:n,vertexShader:_m,fragmentShader:ym,transparent:!0,depthWrite:!1,blending:2}),p=new $o({uniforms:n,vertexShader:bm,fragmentShader:xm,transparent:!0,depthWrite:!1,blending:2}),m=new Qi(u,f);m.name=`BridgeSuspendedPaths`;let h=new ia(d,p);h.name=`BridgeOrderedAnchors`;let g=new Xr,_=new Float32Array(480);g.setAttribute(`position`,new Ir(_,3).setUsage(at)),g.setDrawRange(0,0);let v=new Bi({color:16770998,transparent:!0,opacity:.8,depthWrite:!1,blending:2}),y=new Ji(g,v);y.name=`BridgeLiveStroke`,y.frustumCulled=!1;let b=new zo(.38,.425,48),x=new si({color:16767394,transparent:!0,opacity:.7,side:2,depthWrite:!1,blending:2}),S=new yi(b,x);S.rotation.x=-Math.PI/2,S.name=`BridgeStartRing`,e.add(m,h,y,S);let C=!1,w=new G;function T(r,i,a={}){if(C)return[];let o=cm(Number.isFinite(i)?i:0,0,.1),s=t.update(o,a),c=t.context;n.uTime.value=Number.isFinite(r)?r:0;let l=om(a.player)&&Math.hypot(a.player.x,a.player.z+32)<17;e.visible=!!(a.state?.wind?.solved&&l&&a.interactive!==!1);let u=c.origin;dm.forEach((e,t)=>{let r=u&&(e.from===u||e.to===u);n.uAvailable.value.setComponent(t,c.available&&r?1:0);let i=c.shape===e.shape?c.progress:0,s=w.getComponent(t)+(i-w.getComponent(t))*(1-Math.exp(-o*12));w.setComponent(t,s),n.uProgress.value.setComponent(t,s),n.uNext.value.setComponent(t,c.shape===e.shape?Math.min(1,c.progress+.2):.2),n.uReverse.value.setComponent(t,+(u===e.to)),n.uBuilt.value.setComponent(t,+(a.state?.bridge?.structure===e.shape))}),S.visible=!!(c.available&&u),S.visible&&(S.position.set(Xp[u].x,.41000000000000003,Xp[u].z),x.opacity=.5+Math.sin(n.uTime.value*2)*.16);let d=t.preview;for(let e=0;e<d.length;e++)_[e*3]=d[e].x,_[e*3+1]=d[e].y,_[e*3+2]=d[e].z;return g.attributes.position.needsUpdate=!0,g.setDrawRange(0,d.length),y.visible=d.length>1,v.opacity=c.status===`fading`?c.fade*.65:c.status===`committed`?.85:.65,s}return{group:e,update:T,cancel:t.cancel,get context(){return t.context},dispose(){if(!C){C=!0,e.clear();for(let e of[u,d,g,b,f,p,v,x])e.dispose()}}}}var Cm=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},wm=new qs(-1,1,1,-1,0,1),Tm=new class extends Xr{constructor(){super(),this.setAttribute(`position`,new J([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new J([0,2,0,0,2,0],2))}},Em=class{constructor(e){this._mesh=new yi(Tm,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,wm)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Dm={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:`x`,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new W},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new gn},cameraProjectionMatrixInverse:{value:new gn},cameraWorldMatrix:{value:new gn},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new G(-1,-1,-1)},sceneBoxMax:{value:new G(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},Om={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},km={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function Am(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=jm(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new G(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let a=new Si(i,t,t);return a.wrapS=v,a.wrapT=v,a.needsUpdate=!0,a}function jm(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;)i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]===0?(r[i*t+a]=e++,a++,i--):(a-=2,i++);return r}var Mm={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:Nm(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new W},cameraProjectionMatrixInverse:{value:new gn},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Nm(e,t,n){let r=Pm(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function Pm(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new G(Math.cos(a),Math.sin(a),o))}return r}var Fm={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Im=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,k=_-C+2*d,A=v-w+2*d,j=g-1+3*d,M=_-1+3*d,N=v-1+3*d,P=c&255,F=l&255,ee=u&255,te=this.perm[P+this.perm[F+this.perm[ee]]]%12,ne=this.perm[P+y+this.perm[F+b+this.perm[ee+x]]]%12,I=this.perm[P+S+this.perm[F+C+this.perm[ee+w]]]%12,re=this.perm[P+1+this.perm[F+1+this.perm[ee+1]]]%12,L=.6-g*g-_*_-v*v;L<0?r=0:(L*=L,r=L*L*this._dot3(this.grad3[te],g,_,v));let ie=.6-T*T-E*E-D*D;ie<0?i=0:(ie*=ie,i=ie*ie*this._dot3(this.grad3[ne],T,E,D));let ae=.6-O*O-k*k-A*A;ae<0?a=0:(ae*=ae,a=ae*ae*this._dot3(this.grad3[I],O,k,A));let R=.6-j*j-M*M-N*N;return R<0?o=0:(R*=R,o=R*R*this._dot3(this.grad3[re],j,M,N)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,k=w>E?16:0,A=T>E?8:0,j=w>D?4:0,M=T>D?2:0,N=+(E>D),P=O+k+A+j+M+N,F=+(a[P][0]>=3),ee=+(a[P][1]>=3),te=+(a[P][2]>=3),ne=+(a[P][3]>=3),I=+(a[P][0]>=2),re=+(a[P][1]>=2),L=+(a[P][2]>=2),ie=+(a[P][3]>=2),ae=+(a[P][0]>=1),R=+(a[P][1]>=1),oe=+(a[P][2]>=1),se=+(a[P][3]>=1),ce=w-F+c,le=T-ee+c,ue=E-te+c,de=D-ne+c,fe=w-I+2*c,pe=T-re+2*c,me=E-L+2*c,he=D-ie+2*c,ge=w-ae+3*c,_e=T-R+3*c,ve=E-oe+3*c,ye=D-se+3*c,be=w-1+4*c,xe=T-1+4*c,Se=E-1+4*c,Ce=D-1+4*c,we=h&255,Te=g&255,Ee=_&255,De=v&255,Oe=o[we+o[Te+o[Ee+o[De]]]]%32,ke=o[we+F+o[Te+ee+o[Ee+te+o[De+ne]]]]%32,z=o[we+I+o[Te+re+o[Ee+L+o[De+ie]]]]%32,Ae=o[we+ae+o[Te+R+o[Ee+oe+o[De+se]]]]%32,je=o[we+1+o[Te+1+o[Ee+1+o[De+1]]]]%32,Me=.6-w*w-T*T-E*E-D*D;Me<0?l=0:(Me*=Me,l=Me*Me*this._dot4(i[Oe],w,T,E,D));let B=.6-ce*ce-le*le-ue*ue-de*de;B<0?u=0:(B*=B,u=B*B*this._dot4(i[ke],ce,le,ue,de));let Ne=.6-fe*fe-pe*pe-me*me-he*he;Ne<0?d=0:(Ne*=Ne,d=Ne*Ne*this._dot4(i[z],fe,pe,me,he));let V=.6-ge*ge-_e*_e-ve*ve-ye*ye;V<0?f=0:(V*=V,f=V*V*this._dot4(i[Ae],ge,_e,ve,ye));let Pe=.6-be*be-xe*xe-Se*Se-Ce*Ce;return Pe<0?p=0:(Pe*=Pe,p=Pe*Pe*this._dot4(i[je],be,xe,Se,Ce)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},Lm=class e extends Cm{constructor(e,t,n=512,r=512,i,a,o){super(),this.width=n,this.height=r,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Am(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new pn(this.width,this.height,{type:P}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new $o({defines:Object.assign({},Dm.defines),uniforms:Xo.clone(Dm.uniforms),vertexShader:Dm.vertexShader,fragmentShader:Dm.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new rs,this.normalMaterial.blending=0,this.pdMaterial=new $o({defines:Object.assign({},Mm.defines),uniforms:Xo.clone(Mm.uniforms),vertexShader:Mm.vertexShader,fragmentShader:Mm.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new $o({defines:Object.assign({},Om.defines),uniforms:Xo.clone(Om.uniforms),vertexShader:Om.vertexShader,fragmentShader:Om.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new $o({uniforms:Xo.clone(Fm.uniforms),vertexShader:Fm.vertexShader,fragmentShader:Fm.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new $o({uniforms:Xo.clone(km.uniforms),vertexShader:km.vertexShader,fragmentShader:km.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new Em(null),this._originalClearColor=new q,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e===void 0?(this.depthTexture=new ca,this.depthTexture.format=R,this.depthTexture.type=te,this.normalRenderTarget=new pn(this.width,this.height,{minFilter:x,magFilter:x,type:P,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0):(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1);let n=+!!this.normalTexture,r=this.depthTexture===this.normalTexture?`w`:`x`;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=r,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=r,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Nm(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new Im,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let i=new Si(r,e,e,ie,D);return i.wrapS=v,i.wrapT=v,i.needsUpdate=!0,i}};Lm.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Rm=class extends Lm{constructor(e,t){super(e,t,640,400,void 0,{radius:.42,thickness:.6,scale:1.35,distanceExponent:1.5},{radius:5,lumaPhi:10,depthPhi:2,normalPhi:3}),this.resolutionScale=.5,this.blendIntensity=.55,this.output=Lm.OUTPUT.Default,this.name=`garden-contact-depth`}setSize(e,t){let n=this.resolutionScale??.5;super.setSize(Math.max(1,Math.round(e*n)),Math.max(1,Math.round(t*n)))}render(e,t,n,r,i){let a=[],o=e.shadowMap.autoUpdate,s=e.shadowMap.needsUpdate,c=e.getRenderTarget(),l=e.getClearColor(new q),u=e.getClearAlpha(),d=e.autoClear,f=this.scene.overrideMaterial;this.scene.traverse(e=>{if(!e.visible||!e.isMesh)return;let t=[e.material].flat();(e.userData.excludeFromAO||t.some(e=>e&&(e.transmission>.1||e.transparent&&e.opacity<.7||e.depthWrite===!1)))&&(a.push(e),e.visible=!1)});try{e.shadowMap.autoUpdate=!1,e.shadowMap.needsUpdate=!1,super.render(e,t,n,r,i)}catch(e){this.failed=!0,this.enabled=!1,console.warn(`Contact depth disabled after a rendering failure:`,e.message)}finally{e.shadowMap.autoUpdate=o,e.shadowMap.needsUpdate=s,this._restoreVisibility(),this.scene.overrideMaterial=f;for(let e of a)e.visible=!0;e.autoClear=d,e.setRenderTarget(c),e.setClearColor(l,u)}}};function zm(e=[]){let t=new hc,n=new G,r=e.map(e=>({object:e,material:e.material,opacity:1}));return{update(i,a,o,s=!0,c=[]){let l=new Set;if(s)for(let r of[o,...c]){n.subVectors(a.position,r);let i=n.length();if(i>.1){t.set(r,n.normalize()),t.near=.25,t.far=Math.max(.25,i-.25);for(let n of t.intersectObjects(e,!1))l.add(n.object)}}for(let e of r){let t=l.has(e.object)?.16:1;e.opacity=Wt.lerp(e.opacity,t,1-Math.exp(-Math.max(0,i)*9)),e.material.opacity=e.opacity,e.material.depthWrite=e.opacity>.98}return r.filter(e=>e.opacity<.95).length},reset(){for(let e of r)e.opacity=1,e.material.opacity=1,e.material.depthWrite=!0}}}function Bm(){let e=[[-2,.23,1.8,11,3.8,.12],[2,.36,-.8,9,3,.27],[-.5,.16,4,10,2.5,-.18]].map(([e,t,n,r,i,a])=>new Ro(r,i,1,1).rotateX(-Math.PI/2).rotateY(a).translate(e,t,n)),t=Nf(e);e.forEach(e=>e.dispose());let n=new $o({transparent:!0,depthWrite:!1,side:2,uniforms:{uTime:{value:0},uOpacity:{value:0},uNight:{value:0},uPointer:{value:new G},uWind:{value:0}},vertexShader:`varying vec3 vWorld;varying vec2 vUv;void main(){vUv=uv;vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}`,fragmentShader:`varying vec3 vWorld;varying vec2 vUv;uniform float uTime;uniform float uOpacity;uniform float uNight;uniform vec3 uPointer;uniform float uWind;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
   void main(){vec2 p=vWorld.xz*vec2(.8,1.8)+vec2(-uTime*.055,uTime*.025);float n=noise(p)*.58+noise(p*2.1)*.27+noise(p*4.3)*.15;
    float edge=pow(max(0.,sin(vUv.x*3.14159)*sin(vUv.y*3.14159)),1.8);float plume=smoothstep(.37,.76,n);float air=1.-exp(-dot(vWorld.xz-uPointer.xz,vWorld.xz-uPointer.xz)*.7)*uWind*.7;
    float alpha=edge*plume*uOpacity*air;gl_FragColor=vec4(mix(vec3(.72,.76,.83),vec3(.28,.26,.42),uNight),alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`}),r=new yi(t,n);r.name=`breath-over-the-flower-water`,r.renderOrder=3,r.frustumCulled=!1,r.userData.excludeFromAO=!0;let i=0;return{object:r,update(e,t,{focused:a=!1,night:o=0,scatter:s=0,gesture:c,reducedMotion:l=!1}){i=Wt.lerp(i,a?(1-s)*.34:0,1-Math.exp(-t*2)),n.uniforms.uOpacity.value=i,n.uniforms.uNight.value=o,n.uniforms.uTime.value=l?0:e,c?.position&&n.uniforms.uPointer.value.copy(c.position),n.uniforms.uWind.value=+!!c?.active,r.visible=i>.003},dispose(){t.dispose(),n.dispose()}}}var Vm=class extends ks{constructor(e){super(e),this.type=P}parse(e){let t=function(e,t){switch(e){case 1:throw Error(`THREE.HDRLoader: Read Error: `+(t||``));case 2:throw Error(`THREE.HDRLoader: Write Error: `+(t||``));case 3:throw Error(`THREE.HDRLoader: Bad File Format: `+(t||``));default:case 4:throw Error(`THREE.HDRLoader: Memory Error: `+(t||``))}},n=function(e,t,n){t||=1024;let r=e.pos,i=-1,a=0,o=``,s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));for(;0>(i=s.indexOf(`
`))&&a<t&&r<e.byteLength;)o+=s,a+=s.length,r+=128,s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));return-1<i&&(!1!==n&&(e.pos+=a+i+1),o+s.slice(0,i))},r=function(e){let r=/^#\?(\S+)/,i=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,a=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*FORMAT=(\S+)\s*$/,s=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:``,comments:``,programtype:`RGBE`,format:``,gamma:1,exposure:1,width:0,height:0},l,u;for((e.pos>=e.byteLength||!(l=n(e)))&&t(1,`no header found`),(u=l.match(r))||t(3,`bad initial token`),c.valid|=1,c.programtype=u[1],c.string+=l+`
`;l=n(e),!1!==l;)if(c.string+=l+`
`,l.charAt(0)===`#`)c.comments+=l+`
`;else if((u=l.match(i))&&(c.gamma=parseFloat(u[1])),(u=l.match(a))&&(c.exposure=parseFloat(u[1])),(u=l.match(o))&&(c.valid|=2,c.format=u[1]),(u=l.match(s))&&(c.valid|=4,c.height=parseInt(u[1],10),c.width=parseInt(u[2],10)),c.valid&2&&c.valid&4)break;return c.valid&2||t(3,`missing format specifier`),c.valid&4||t(3,`missing image size specifier`),c},i=function(e,n,r){let i=n;if(i<8||i>32767||e[0]!==2||e[1]!==2||e[2]&128)return new Uint8Array(e);i!==(e[2]<<8|e[3])&&t(3,`wrong scanline width`);let a=new Uint8Array(4*n*r);a.length||t(4,`unable to allocate buffer space`);let o=0,s=0,c=4*i,l=new Uint8Array(4),u=new Uint8Array(c),d=r;for(;d>0&&s<e.byteLength;){s+4>e.byteLength&&t(1),l[0]=e[s++],l[1]=e[s++],l[2]=e[s++],l[3]=e[s++],(l[0]!=2||l[1]!=2||(l[2]<<8|l[3])!=i)&&t(3,`bad rgbe scanline format`);let n=0,r;for(;n<c&&s<e.byteLength;){r=e[s++];let i=r>128;if(i&&(r-=128),(r===0||n+r>c)&&t(3,`bad scanline data`),i){let t=e[s++];for(let e=0;e<r;e++)u[n++]=t}else u.set(e.subarray(s,s+r),n),n+=r,s+=r}let f=i;for(let e=0;e<f;e++){let t=0;a[o]=u[e+t],t+=i,a[o+1]=u[e+t],t+=i,a[o+2]=u[e+t],t+=i,a[o+3]=u[e+t],o+=4}d--}return a},a=function(e,t,n,r){let i=2**(e[t+3]-128)/255;n[r+0]=e[t+0]*i,n[r+1]=e[t+1]*i,n[r+2]=e[t+2]*i,n[r+3]=1},o=function(e,t,n,r){let i=2**(e[t+3]-128)/255;n[r+0]=Mr.toHalfFloat(Math.min(e[t+0]*i,65504)),n[r+1]=Mr.toHalfFloat(Math.min(e[t+1]*i,65504)),n[r+2]=Mr.toHalfFloat(Math.min(e[t+2]*i,65504)),n[r+3]=Mr.toHalfFloat(1)},s=new Uint8Array(e);s.pos=0;let c=r(s),l=c.width,u=c.height,d=i(s.subarray(s.pos),l,u),f,p,m;switch(this.type){case N:m=d.length/4;let e=new Float32Array(m*4);for(let t=0;t<m;t++)a(d,t*4,e,t*4);f=e,p=N;break;case P:m=d.length/4;let t=new Uint16Array(m*4);for(let e=0;e<m;e++)o(d,e*4,t,e*4);f=t,p=P;break;default:throw Error(`THREE.HDRLoader: Unsupported type: `+this.type)}return{width:l,height:u,data:f,header:c.string,gamma:c.gamma,exposure:c.exposure,type:p,colorSpace:et,minFilter:w,magFilter:w,generateMipmaps:!1,flipY:!0}}setDataType(e){return this.type=e,this}},Hm=class extends Cm{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof $o?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Xo.clone(e.uniforms),this.material=new $o({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Em(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Um=class extends Cm{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Wm=class extends Cm{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Gm=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new W);this._width=n.width,this._height=n.height,t=new pn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:P}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Hm(Fm),this.copyPass.material.blending=0,this.timer=new ec}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Um!==void 0&&(r instanceof Um?n=!0:r instanceof Wm&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new W);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Km=class extends Cm{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new q}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},qm={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new q(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Jm=class e extends Cm{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new W(256,256):new W(e.x,e.y),this.clearColor=new q(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new pn(i,a,{type:P}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new pn(i,a,{type:P});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new pn(i,a,{type:P});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=qm;this.highPassUniforms=Xo.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new $o({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new W(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Xo.clone(Fm.uniforms),this.blendMaterial=new $o({uniforms:this.copyUniforms,vertexShader:Fm.vertexShader,fragmentShader:Fm.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new q,this._oldClearAlpha=1,this._basic=new si,this._fsQuad=new Em(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new W(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new $o({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new W(.5,.5)},direction:{value:new W(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new $o({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Jm.BlurDirectionX=new W(1,0),Jm.BlurDirectionY=new W(0,1);var Ym={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Xm=class extends Cm{constructor(){super(),this.isOutputPass=!0,this.uniforms=Xo.clone(Ym.uniforms),this.material=new es({name:Ym.name,uniforms:this.uniforms,vertexShader:Ym.vertexShader,fragmentShader:Ym.fragmentShader}),this._fsQuad=new Em(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},$t.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Zm=new G(0,1,0),Qm=Math.PI*2,$m=e=>Math.max(0,Math.min(1,Number.isFinite(e)?e:0)),eh={silver:{iridescence:.82,thickness:405,gloss:.85,radiance:.14},crystal:{iridescence:0,thickness:360,gloss:1,radiance:0},lily:{iridescence:0,thickness:360,gloss:.53/.9,radiance:0},amber:{iridescence:.12,thickness:320,gloss:.82,radiance:.04},celadon:{iridescence:.08,thickness:250,gloss:.72,radiance:.02}};function th(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function nh(e,{rows:t=48,columns:n=12,thickness:r=.009}={}){let i=(t+1)*(n+1),a=[],o=[],s=[],c=[];for(let i=0;i<2;i++)for(let c=0;c<=t;c++)for(let l=0;l<=n;l++){let u=c/t,d=l/n*2-1;for(let[t,n]of[[0,a],[1,o]]){let a=e(u,d,t);n.push(a[0],a[1]+(i?-.5:.5)*r,a[2])}s.push(l/n,u)}for(let e=0;e<t;e++)for(let t=0;t<n;t++){let r=e*(n+1)+t,a=r+n+1;c.push(r,r+1,a,a,r+1,a+1),c.push(r+i,a+i,r+1+i,a+i,a+1+i,r+1+i)}let l=[];for(let e=0;e<=n;e++)l.push(e);for(let e=1;e<=t;e++)l.push(e*(n+1)+n);for(let e=n-1;e>=0;e--)l.push(t*(n+1)+e);for(let e=t-1;e>0;e--)l.push(e*(n+1));for(let e=0;e<l.length;e++){let t=l[e],n=l[(e+1)%l.length];c.push(t,t+i,n,n,t+i,n+i)}let u=new Xr;u.setAttribute(`position`,new J(a,3)),u.setAttribute(`uv`,new J(s,2)),u.setIndex(c),u.computeVertexNormals();let d=u.clone();return d.setAttribute(`position`,new J(o,3)),d.computeVertexNormals(),u.morphAttributes.position=[d.attributes.position.clone()],u.morphAttributes.normal=[d.attributes.normal.clone()],u.morphTargetsRelative=!1,d.dispose(),u.computeBoundingBox(),u.computeBoundingSphere(),u}function rh(e,t=!1,n=`lily`){if(n===`dahlia`)return ah(e,t);if(n!==`lily`)return ih(e,t,n);let r=e%2==0,i=e*Qm/6+(r?.035:-.02),a=(r?1.14:1.25)*(1+Math.sin(e*3.3)*.025),o=r?.47:.39,s=Math.cos(i),c=Math.sin(i);return nh((n,r,i)=>{let l=t?.035:i,u=Math.max(0,Math.sin(Math.PI*n)),d=u**.78,f=.025+.17*u**.75+.003*n,p=f+(.025+a*(1.23*Math.sin(n*1.12)-.13*n**8)-f)*l,m=.008*(1-n)+.105*d,h=r*(m+(.008*(1-n)+o*u**.62*(.79+.21*n)-m)*l),g=a*1.12*n,_=a*(1.25*n-1.17*n**3),v=.115*a*r*r*u,y=.018*a*(1-r*r)*u,b=.007*r*r*Math.sin(n*14+e*1.7)*u,x=g+(_-g)*l+(v+y+b)*l;return[p*s-h*c,x,p*c+h*s]},{thickness:t?.007:.009})}function ih(e,t,n){let r=n===`lotus`,i=r?Math.floor(e/6):0,a=!r&&e%2==0,o=(r?e%6:e)*Qm/6+(r?i*.47:0)+Math.sin(e*2.7)*.021,s=Math.cos(o),c=Math.sin(o),l=(r?[1.34,1.13,.88][i]:a?1.45:1.35)*(1+Math.sin(e*4.1)*.032),u=(r?[.43,.39,.31][i]:a?.17:.75)*(1+Math.cos(e*2.3)*.027);return nh((n,o,d)=>{let f=t?.035:d,p=Math.max(0,Math.sin(Math.PI*n)),m=.025+.18*p**.8,h=l*1.03*n,g,_;r?(g=.025+l*Math.sin(n*(1.45-i*.17)),_=l*(.15*n+.47*n**3)+(2-i)*.025):a?(g=.025+l*(.23*Math.sin(Math.PI*n*.78)),_=l*(1.07*n-.06*n**4)):(g=.025+l*(1.06*n-.25*n**5),_=l*(.28*n-1.04*n**2.5));let v=m+(g-m)*f,y=r?.006*Math.sin(n*13+e):.025*Math.sin(n*19+o*4+e),b=r?p**.59:a?p**.88:p**.5*(.3+.7*n),x=o*(.006*(1-n)+(.1+(u-.1)*f)*b),S=h+(_-h)*f+(.09*o*o*p+y*o*o*p)*f;return[v*s-x*c,S,v*c+x*s]},{rows:r?36:48,columns:12,thickness:r?.018:.014})}function ah(e,t=!1){let n=Math.floor(e/12),r=e%12*Qm/12+n*.34+Math.sin(e*2.7)*.024,i=Math.cos(r),a=Math.sin(r),o=[1.38,1.12,.82,.49][n]*(1+Math.sin(e*3.3)*.027),s=[.21,.2,.17,.13][n],c=[-.13,.04,.19,.29][n];return nh((e,n,r)=>{let l=t?.02:r,u=Math.max(0,Math.sin(Math.PI*e)),d=.02+.14*u**.8,f=o*.95*e,p=.035+o*(1.04*e-.13*e**5),m=c*e+o*(.15*Math.sin(Math.PI*e)-.21*e**5),h=(.03+(s-.03)*l)*u**.65,g=n*(.55+1.7*l)*(.6+.4*e),_=h*Math.sin(g),v=f+(m-f)*l+h*(1-Math.cos(g))*l,y=d+(p-d)*l;return[y*i-_*a,v,y*a+_*i]},{rows:26,columns:10,thickness:.009})}function oh(e){let t=Nf(e,!1);for(let t of e)t.dispose();return t.computeBoundingBox(),t.computeBoundingSphere(),t}function sh(e,t,n,r=18){let i=new Wo(new Ea(e),r,n,6,!1),a=new Wo(new Ea(t),r,n,6,!1);return i.morphAttributes.position=[a.attributes.position.clone()],i.morphAttributes.normal=[a.attributes.normal.clone()],a.dispose(),i.computeBoundingBox(),i.computeBoundingSphere(),i}function ch(e,t,n){let r=new fa(.027,.105,3,8);r.rotateZ(.9),r.rotateY(n);let i=r.clone();return r.translate(...e),i.translate(...t),r.morphAttributes.position=[i.attributes.position.clone()],r.morphAttributes.normal=[i.attributes.normal.clone()],i.dispose(),r.computeBoundingBox(),r.computeBoundingSphere(),r}function lh(e,t,n,r,i){let a=Math.cos(n),o=Math.sin(n),s=nh((n,s)=>{let c=e*n,l=t*Math.max(0,Math.sin(Math.PI*n))**.85*s,u=r+e*(.72*n-.76*n*n)+t*.28*(1-s*s)*Math.sin(Math.PI*n);return[i[0]+c*a-l*o,u,i[1]+c*o+l*a]},{rows:28,columns:8,thickness:.005});return s.morphAttributes={},s}function uh(e){let t=e*2.4+.35,n=Math.cos(t)*(.56+e*.025),r=Math.sin(t)*(.56+e*.025),i=.62+e%2*.12,a=.12+e*.045,o=nh((o,s)=>{let c=s*(Math.PI-.14)+t,l=o*i*(1+.018*Math.sin(s*27+e)),u=.022*Math.sin(c*8)*o**3;return[n+l*Math.cos(c),a+.08*o**2+u,r+l*Math.sin(c)]},{rows:18,columns:64,thickness:.007});return o.morphAttributes={},o}function dh(e){let t=e*2.25+.3,n=Math.cos(t),r=Math.sin(t),i=1.4+e%4*.3,a=nh((t,a)=>{let o=(.08+e%2*.025)*Math.max(0,Math.sin(Math.PI*t))**.75,s=.05+i*(.2*t+.08*t*t),c=.04+i*(1.03*t-.1*t*t);return[s*n-o*a*r,c+.025*(1-a*a)*Math.sin(Math.PI*t),s*r+o*a*n]},{rows:32,columns:8,thickness:.006});return a.morphAttributes={},a}function fh(e){let t=Math.floor(e/2),n=e%2*Math.PI+t*.8+.3,r=Math.cos(n),i=Math.sin(n),a=.75+t*.07,o=.45+t*.48,s=nh((e,t)=>{let n=1+.085*Math.sin(e*Qm*7),s=.24*Math.max(0,Math.sin(Math.PI*e))**.74*n,c=a*e,l=o+a*(.38*e-.4*e*e)+.075*(1-t*t)*Math.sin(Math.PI*e);return[c*r-t*s*i,l,c*i+t*s*r]},{rows:32,columns:10,thickness:.006});return s.morphAttributes={},s}function ph(e){let t=new Uint8Array(131072),n=th(812),r=Array.from({length:55},()=>({x:.25+n()*.5,y:.16+n()*.43,radius:.003+n()*.007}));for(let n=0;n<256;n++)for(let i=0;i<128;i++){let a=i/127,o=n/255,s=Math.exp(-(((a-.5)*5)**2)),c=s*(.48*Math.exp(-(((o-.23)*3.8)**2))+.62*o**7),l=(Math.sin((a-.5)*110+Math.sin(o*8)*.4)*.5+.5)*s*.022,u=0;for(let e of r){let t=Math.hypot((a-e.x)*.55,o-e.y);t<e.radius&&(u=Math.max(u,.55*(1-t/e.radius)))}let d=e===`golden`?[.97-l,.93-c*.4-u*.4,.79-c*.78-u*.65]:[.96-l,.88-c*.62-u*.5,.87-c*.3-u*.3],f=(n*128+i)*4;for(let e=0;e<3;e++)t[f+e]=Math.round(Math.max(0,Math.min(1,d[e]))*255);t[f+3]=255}let i=new Si(t,128,256,ie,D);return i.colorSpace=$e,i.generateMipmaps=!0,i.minFilter=E,i.magFilter=w,i.anisotropy=2,i.needsUpdate=!0,i.name=`Original lily ${e} veins and freckles`,i}function mh(){let e=new Uint8Array(131072);for(let t=0;t<256;t++){let n=t/255;for(let r=0;r<128;r++){let i=r/127*2-1,a=n*2.4+i*i*.38+Math.sin(n*8)*.09,o=Math.sin(Qm*(n*1.05-i*.28))*.085,s=$m(.5+Math.sin(Qm*a)*.365+o),c=(t*128+r)*4,l=Math.round(s*255);e[c]=e[c+1]=e[c+2]=l,e[c+3]=255}}let t=new Si(e,128,256,ie,D);return t.generateMipmaps=!0,t.minFilter=E,t.magFilter=w,t.anisotropy=2,t.needsUpdate=!0,t.name=`Original lily thin-film thickness — linear scalar waves`,t}function hh(e){e.updateMatrixWorld(!0);let t=e.matrixWorld.clone().invert(),n=[],r=[],i=0,a=new G,o=new G;return e.traverse(e=>{if(!e.isMesh)return;let s=new gn().multiplyMatrices(t,e.matrixWorld),c=e.geometry,l=c.attributes.position,u=c.morphAttributes.position?.[0]??l,d=new Float32Array(l.count*3),f=new Float32Array(u.count*3),p=new G;for(let e=0;e<l.count;e++)p.fromBufferAttribute(l,e).applyMatrix4(s).toArray(d,e*3),p.fromBufferAttribute(u,e).applyMatrix4(s).toArray(f,e*3);let m=c.index;for(let t=0;t<(m?.count??l.count);t+=3){let s=[0,1,2].map(e=>m?m.getX(t+e):t+e),l=new G().fromArray(f,s[0]*3),u=new G().fromArray(f,s[1]*3),p=new G().fromArray(f,s[2]*3),h=a.subVectors(u,l).cross(o.subVectors(p,l)).length()*.5;h<1e-12||(i+=h,n.push({closed:d,open:f,ids:s,role:e.userData.role,uv:c.attributes.uv}),r.push(i))}}),{items:n,cumulative:r,area:i}}function gh({seed:e=17,scale:t=1}={}){if(!Number.isFinite(t)||t<=0)throw RangeError(`Bouquet scale must be positive and finite`);let n=new K;n.name=`Spring letter — three lilies and two promises`;let r=new K;r.scale.setScalar(t),n.add(r);let i=new Set,a=new Set,o=new Map,s=[],c=[],l=1,u=`silver`,d=`blush`,f=`lily`,p=1,m=!1,h,g={...eh.silver},_=mh();o.set(`thin-film-data`,_);let v={};for(let e of[`petal`,`bud`,`stem`,`leaf`,`filament`,`anther`])v[e]=new ns({color:14804204,metalness:1,roughness:.18,side:2}),v[e].name=`Lily ${e}`,v[e].forceSinglePass=!0,a.add(v[e]);function y(e,t,n,r){i.add(t);let a=new yi(t,v[n]);return a.name=r,a.userData.role=n,a.castShadow=!0,a.receiveShadow=!0,e.add(a),c.push(a),t.morphAttributes.position?.length&&s.push(a),a}function b(e){let t=[{p:[-.34,3.43,-.17],size:.89,axis:[.02,1,.1],spin:.14},{p:[-.23,1.93,.4],size:1.02,axis:[-.08,1,.4],spin:-.2},{p:[.75,2.75,-.06],size:.74,axis:[.27,1,.25],spin:.48},{p:[-1.02,2.48,.01],size:.62,axis:[-.2,1,.04],spin:.22,bud:!0},{p:[.91,3.25,-.12],size:.64,axis:[.09,1,-.04],spin:.35,bud:!0}];e===`lotus`&&(t[0]={p:[-.15,2.45,-.25],size:1.15,axis:[0,1,.02],spin:.2},t[1]={p:[-.78,1.34,.48],size:.72,axis:[-.12,1,.2],spin:-.3},t[2]={p:[1.02,1.76,-.12],size:.76,axis:[.15,1,.1],spin:.6},t[3].p=[-.91,2.19,-.25],t[3].size=.42,t[4].p=[.75,2.66,-.22],t[4].size=.4),e===`iris`&&(t[0].p=[-.25,3.03,-.15],t[0].size=.84,t[0].axis=[0,1,0],t[1].p=[-.55,1.87,.42],t[1].size=.86,t[1].axis=[-.12,1,.1],t[2].p=[.85,2.46,-.14],t[2].size=.73,t[2].axis=[.07,1,.04]),e===`dahlia`&&(t[0]={p:[-.12,3.28,-.35],size:.88,axis:[.25,.62,.74],spin:.15},t[1]={p:[-.93,1.64,.35],size:.73,axis:[-.1,.59,.8],spin:-.12},t[2]={p:[1.02,1.87,.04],size:.7,axis:[.55,.54,.63],spin:.38},t[3].p=[-1,2.34,-.12],t[3].size=.35,t[4].p=[.79,3.08,-.3],t[4].size=.34);let n=[];for(let i=0;i<t.length;i++){let a=t[i],o=new K;o.name=a.bud?`Unopened promise ${i-2}`:`${e} ${i+1}`,o.userData.botanicalHead=a.bud?`bud`:`blossom`,o.position.fromArray(a.p),o.scale.setScalar(a.size),o.quaternion.setFromUnitVectors(Zm,new G(...a.axis).normalize()),o.quaternion.multiply(new Gt().setFromAxisAngle(Zm,a.spin)),r.add(o);let s=oh(Array.from({length:a.bud?6:e===`lotus`?18:e===`dahlia`?48:6},(t,n)=>rh(n,a.bud,e)));a.bud&&(s.morphAttributes={}),y(o,s,a.bud?`bud`:`petal`,a.bud?`Six-seamed closed bud`:`Three inner petals and three recurved sepals`);let c=new G(...a.p);if(n.push(new Wo(new Ea([new G((i-2)*.035,.025,i%2*.035),new G(c.x*.28,c.y*.36,c.z*.36),new G(c.x*.76,c.y*.78,c.z*.84),c]),36,a.bud?.017:.024,7,!1)),!a.bud){let t=[],n=[],r=e===`lotus`?18:e===`iris`?3:e===`dahlia`?12:6;for(let i=0;i<r;i++){let a=i*Qm/r+.22,o=Math.cos(a),s=Math.sin(a),c=[o*.075,.94+i%2*.05,s*.075],l=e===`lotus`?.12+i%3*.06:e===`iris`?.16:e===`dahlia`?.06+i%3*.025:.25+i%2*.04,u=e===`lotus`?.32+i%3*.035:e===`iris`?.24:e===`dahlia`?.16+i%2*.02:.84+i%2*.08,d=[o*l,u,s*l];t.push(sh([new G(o*.018,.1,s*.018),new G(o*.04,.56,s*.04),new G(...c)],[new G(o*.018,.1,s*.018),new G(o*l*.45,u*.58,s*l*.45),new G(...d)],.009));let f=ch(c,d,a);if(e===`lotus`||e===`dahlia`||e===`iris`)for(let[e,t]of[[f.attributes.position,c],[f.morphAttributes.position[0],d]])for(let n=0;n<e.count;n++)e.setXYZ(n,t[0]+(e.getX(n)-t[0])*.55,t[1]+(e.getY(n)-t[1])*.55,t[2]+(e.getZ(n)-t[2])*.55);n.push(f)}t.push(sh([new G(0,.1,0),new G(.01,.6,0),new G(.02,1.01,0)],[new G(0,.1,0),new G(.01,e===`lotus`?.21:e===`iris`?.15:e===`dahlia`?.08:.6,.015),new G(.035,e===`lotus`?.38:e===`iris`?.29:e===`dahlia`?.2:.99,.045)],.014)),y(o,oh(t),`filament`,`Six filaments and central style`),y(o,oh(n),`anther`,`Amber pollen anthers`)}}y(r,oh(n),`stem`,`Five slender persistent stems`);let i=[];for(let t=0;t<(e===`lotus`?4:e===`iris`?7:e===`dahlia`?6:11);t++){if(e===`lotus`){i.push(uh(t));continue}if(e===`iris`){i.push(dh(t));continue}if(e===`dahlia`){i.push(fh(t));continue}let n=e===`lotus`?.14+t*.015:.28+t*.19,r=t*2.33+.6,a=.68+.17*Math.sin(t*1.8)+(t<3?.12:0);i.push(lh(e===`lotus`?a*1.15:e===`iris`?a*1.2:a,e===`lotus`?.39:.11+t%3*.018,r,n,[-.03+.09*Math.sin(t),.04]))}y(r,oh(i),`leaf`,`Original foliage with a raised midrib`)}b(f);function x(e){if(m)throw Error(`Cannot change a disposed bouquet`);let t=vf.some(t=>t.id===e)?e:`lily`;if(t===f)return f;for(let e of i)e.dispose();return i.clear(),r.clear(),s.length=0,c.length=0,h=void 0,f=t,b(f),S(p),C(l),f}function S(e){let t=p=$m(e);for(let e of s)e.morphTargetInfluences[0]=t}function C(e){l=$m(e),n.visible=l>.001;for(let e of a){let t=l<.999;e.transparent!==t&&(e.transparent=t,e.needsUpdate=!0),e.opacity=l,e.depthWrite=l>=.999}}function w(e=`silver`,t=`blush`){u=yf.some(t=>t.id===e)?e:`silver`,t=d=t===`golden`?`golden`:`blush`,g={...eh[u]},u===`lily`&&!o.has(t)&&o.set(t,ph(t));for(let[e,n]of Object.entries(v)){if(n.map=null,n.transmission=0,n.thickness=0,n.iridescence=0,n.clearcoat=0,n.sheen=0,n.dispersion=0,n.iridescenceThicknessMap=null,n.emissive.set(0),n.emissiveIntensity=0,n.ior=1.45,n.envMapIntensity=1.25,n.color.set(14804204),u===`silver`)n.color.set(13686753),n.metalness=.83,n.roughness=e===`petal`||e===`bud`?.235:.28,n.iridescenceIOR=1.7,n.iridescenceThicknessMap=_,n.clearcoat=.24,n.clearcoatRoughness=.19;else if(u===`crystal`)n.color.set(e===`petal`||e===`bud`?14083319:11850216),n.metalness=0,n.roughness=.08,n.transmission=e===`anther`?.78:.87,n.thickness=e===`petal`||e===`bud`?.72:.24,n.dispersion=.24,n.clearcoat=.8,n.clearcoatRoughness=.065,n.ior=1.7,n.attenuationColor.set(10271450),n.attenuationDistance=1.25,n.iridescenceIOR=1.45,n.iridescenceThicknessMap=_;else if(u===`amber`||u===`celadon`){let t=u===`amber`,r=e===`petal`||e===`bud`;n.color.set(r?t?15312205:9226932:e===`anther`?t?13994290:13151319:t?10057029:4886145),n.metalness=t?.12:.04,n.roughness=t?.24:.28,n.transmission=r?t?.42:.13:0,n.thickness=r?.52:.08,n.attenuationColor.set(t?11749919:5415829),n.attenuationDistance=t?.85:1.3,n.clearcoat=t?.55:.9,n.clearcoatRoughness=.16,n.ior=t?1.58:1.47,n.sheen=t?.1:.24,n.sheenColor.set(t?16106615:13230799),n.iridescenceIOR=1.3,n.iridescenceThicknessMap=_}else n.metalness=0,n.roughness=.47,n.envMapIntensity=.8,e===`petal`||e===`bud`?(n.color.set(16777215),n.map=o.get(t),n.sheen=.24,n.sheenColor.set(t===`golden`?16178096:15847644),n.sheenRoughness=.65,n.clearcoat=.07):e===`stem`||e===`leaf`?(n.color.set(e===`leaf`?4354113:5864262),n.roughness=.45,n.sheen=.08,n.sheenColor.set(11061120)):e===`anther`?(n.color.set(t===`golden`?12089126:10178366),n.roughness=.6):(n.color.set(13161641),n.roughness=.43);n.needsUpdate=!0}return E([`iridescence`,`thickness`,`radiance`]),C(l),{...g}}function T(e={}){let t=[];if(e&&typeof e==`object`){for(let n of[`iridescence`,`gloss`,`radiance`])Number.isFinite(e[n])&&(g[n]=$m(e[n]),t.push(n));Number.isFinite(e.thickness)&&(g.thickness=Math.max(100,Math.min(800,e.thickness)),t.push(`thickness`))}return u===`lily`&&(g.iridescence=0),t.length&&E(t),{...g}}function E(e){let t=Math.min(145,g.thickness-100,800-g.thickness);for(let[n,r]of Object.entries(v)){let i=n===`petal`||n===`bud`;e.includes(`gloss`)&&(r.roughness=1-g.gloss*.9),u===`lily`?r.iridescence=0:(r.iridescence=g.iridescence*(i?1:.62),r.iridescenceThicknessRange[0]=g.thickness-t,r.iridescenceThicknessRange[1]=g.thickness+t),e.includes(`radiance`)&&(r.envMapIntensity=(u===`lily`?.8:u===`crystal`?1.2:1.25)+g.radiance*.35,r.emissive.set(i?14080238:11056584),r.emissiveIntensity=g.radiance*(u===`lily`?.025:.1)*(i?1:.4))}}function D(r){if(!Number.isInteger(r)||r<0)throw RangeError(`Particle count must be a non-negative integer`);if(m)throw Error(`Cannot sample a disposed bouquet`);let i=new Float32Array(r*3),a=new Float32Array(r*3),o=new Float32Array(r*3);if(!r)return{closed:i,open:a,colors:o};h??=hh(n);let{items:s,cumulative:c,area:l}=h,f=th(e),p=xf(u,d),g=new q(p.low),_=new q(p.high),v=new q(p.accent),y=new q(p.stem),b=new q(p.pollen),x=new q;for(let e=0;e<r;e++){let n=f()*l,r=0,d=c.length-1;for(;r<d;){let e=r+d>>>1;c[e]<n?r=e+1:d=e}let p=s[r],m=Math.sqrt(f()),h=f(),S=[1-m,m*(1-h),m*h];for(let t=0;t<3;t++){let n=e*3+t;for(let e=0;e<3;e++)i[n]+=p.closed[p.ids[e]*3+t]*S[e],a[n]+=p.open[p.ids[e]*3+t]*S[e]}let C=f(),w=0;for(let e=0;e<3;e++)w+=(p.uv?.getY(p.ids[e])??.5)*S[e];let T=$m(w*.7+C*.3);u===`silver`?x.copy(g).lerp(_,$m((a[e*3+1]/t-.5)/3.7)):p.role===`stem`||p.role===`leaf`?x.copy(y).lerp(g,C*.18):p.role===`anther`||p.role===`filament`?x.copy(b).lerp(v,C*.3):x.copy(g).lerp(_,T).lerp(v,C**7*.42),x.toArray(o,e*3)}return{closed:i,open:a,colors:o}}function O(e){}function k(){if(!m){m=!0;for(let e of i)e.dispose();for(let e of a)e.dispose();for(let e of o.values())e.dispose();h=void 0}}return w(`silver`),S(1),{group:n,setBloom:S,setForm:x,setMaterial:w,setSurface:T,setOpacity:C,sampleSurface:D,update:O,dispose:k,get form(){return f},get palette(){return xf(u,d)}}}var _h=class{constructor(e,t,n){this.variables=[],this.currentTextureIndex=0;let r=N,i={passThruTexture:{value:null}},a=c(u(),i),o=new Em(a);this.setDataType=function(e){return r=e,this},this.addVariable=function(e,t,n){let r={name:e,initialValueTexture:n,material:this.createShaderMaterial(t),dependencies:null,renderTargets:[],wrapS:null,wrapT:null,minFilter:x,magFilter:x};return this.variables.push(r),r},this.setVariableDependencies=function(e,t){e.dependencies=t},this.init=function(){if(n.capabilities.maxVertexTextures===0)return`No support for vertex shader textures.`;for(let n=0;n<this.variables.length;n++){let r=this.variables[n];r.renderTargets[0]=this.createRenderTarget(e,t,r.wrapS,r.wrapT,r.minFilter,r.magFilter),r.renderTargets[1]=this.createRenderTarget(e,t,r.wrapS,r.wrapT,r.minFilter,r.magFilter),this.renderTexture(r.initialValueTexture,r.renderTargets[0]),this.renderTexture(r.initialValueTexture,r.renderTargets[1]);let i=r.material,a=i.uniforms;if(r.dependencies!==null)for(let e=0;e<r.dependencies.length;e++){let t=r.dependencies[e];if(t.name!==r.name){let e=!1;for(let n=0;n<this.variables.length;n++)if(t.name===this.variables[n].name){e=!0;break}if(!e)return`Variable dependency not found. Variable=`+r.name+`, dependency=`+t.name}a[t.name]={value:null},i.fragmentShader=`
uniform sampler2D `+t.name+`;
`+i.fragmentShader}}return this.currentTextureIndex=0,null},this.compute=function(){let e=this.currentTextureIndex,t=+(this.currentTextureIndex===0);for(let n=0,r=this.variables.length;n<r;n++){let r=this.variables[n];if(r.dependencies!==null){let t=r.material.uniforms;for(let n=0,i=r.dependencies.length;n<i;n++){let i=r.dependencies[n];t[i.name].value=i.renderTargets[e].texture}}this.doRenderTarget(r.material,r.renderTargets[t])}this.currentTextureIndex=t},this.getCurrentRenderTarget=function(e){return e.renderTargets[this.currentTextureIndex]},this.getAlternateRenderTarget=function(e){return e.renderTargets[+(this.currentTextureIndex===0)]},this.dispose=function(){o.dispose();let e=this.variables;for(let t=0;t<e.length;t++){let n=e[t];n.initialValueTexture&&n.initialValueTexture.dispose();let r=n.renderTargets;for(let e=0;e<r.length;e++)r[e].dispose();n.material.dispose()}};function s(n){n.defines.resolution=`vec2( `+e.toFixed(1)+`, `+t.toFixed(1)+` )`}this.addResolutionDefine=s;function c(e,t){t||={};let n=new $o({name:`GPUComputationShader`,uniforms:t,vertexShader:l(),fragmentShader:e});return s(n),n}this.createShaderMaterial=c,this.createRenderTarget=function(n,i,a,o,s,c){return n||=e,i||=t,a||=1001,o||=1001,s||=1003,c||=1003,new pn(n,i,{wrapS:a,wrapT:o,minFilter:s,magFilter:c,format:ie,type:r,depthBuffer:!1})},this.createTexture=function(){let n=new Si(new Float32Array(e*t*4),e,t,ie,N);return n.needsUpdate=!0,n},this.renderTexture=function(e,t){i.passThruTexture.value=e,this.doRenderTarget(a,t),i.passThruTexture.value=null},this.doRenderTarget=function(e,t){let r=n.getRenderTarget(),i=n.xr.enabled,s=n.shadowMap.autoUpdate;n.xr.enabled=!1,n.shadowMap.autoUpdate=!1,o.material=e,n.setRenderTarget(t),o.render(n),o.material=a,n.xr.enabled=i,n.shadowMap.autoUpdate=s,n.setRenderTarget(r)};function l(){return`void main()	{

	gl_Position = vec4( position, 1.0 );

}
`}function u(){return`uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`}}},vh=65536,yh=16384,bh=e=>Math.max(0,Math.min(1,Number.isFinite(e)?e:0)),xh=e=>{let t=Math.sin((e+1)*127.1)*43758.5453;return t-Math.floor(t)},Sh=e=>e&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.z),Ch=`
uniform float uBloom;
uniform float uDispersion;
uniform float uFlow;
uniform float uTime;
uniform float uReducedMotion;
uniform vec3 uCenter;
uniform float uExtent;
uniform vec3 uPointer;
uniform float uPointerStrength;
uniform float uPointerRadius;
uniform vec3 uGesturePosition;
uniform vec3 uGestureVelocity;
uniform float uGestureStrength;
uniform float uGestureMode;
uniform float uGestureRadius;

vec3 targetPosition(vec3 closedPosition, vec3 openPosition, float seed) {
  vec3 pose = mix(closedPosition, openPosition, uBloom);
  vec3 source = pose - uCenter;
  // Source-space angles carry the shape of the petals into the flow. The three
  // populations below are a scaffold, open sheets and connecting filaments;
  // they must not turn the flower into unrelated concentric orbit diagrams.
  float height = source.y / uExtent;
  float sourceAngle = atan(source.z, source.x + 0.00001);
  float sourceRadius = length(source.xz);
  float grain = fract(seed * 31.37) - 0.5;
  float time = uTime * mix(0.13, 0.014, uReducedMotion);
  float scaffoldAngle = sourceAngle + height * 0.48 + sin(time * 0.65) * 0.12;
  float scaffoldRadius = sourceRadius * (1.16 + sin(height * 4.0) * 0.04);
  vec3 scaffold = vec3(
    cos(scaffoldAngle) * scaffoldRadius,
    source.y * 1.06 + sin(sourceAngle * 2.0 + height * 7.0 + time) * uExtent * 0.022,
    sin(scaffoldAngle) * scaffoldRadius
  );
  float phase = sourceAngle + height * 2.25 + time * 0.48 + grain * 0.13;
  float radius = sourceRadius * 1.12 + uExtent * (0.16 + sin(sourceAngle * 3.0 + height * 3.0) * 0.055);
  vec3 sheet = vec3(
    cos(phase) * radius,
    source.y * 0.92 + sin(sourceAngle + height * 6.0 + time * 0.7) * uExtent * 0.13,
    sin(phase) * radius
  );
  sheet.y += grain * uExtent * 0.012;
  float filament = fract(seed * 13.71);
  vec3 bridge = mix(scaffold, sheet, filament);
  bridge += vec3(-sin(phase), 0.3, cos(phase)) * sin(filament * 3.141593) * uExtent * 0.045;
  vec3 flow = seed < 0.24 ? scaffold : seed < 0.74 ? sheet : bridge;
  // Drift grows from each petal's own angle and height, never a foreign cloud.
  // Smooth currents open negative space between the flower-derived ribbons.
  float journey = uFlow * (1.0 - uReducedMotion * 0.66);
  float stream = sourceAngle + height * 3.1 + time * 1.8 + grain * 0.48;
  vec3 current = vec3(
    cos(stream) * (sourceRadius * 1.25 + uExtent * (0.13 + grain * 0.09)),
    source.y * 0.80 + sin(stream * 1.35 + time) * uExtent * 0.14 + grain * uExtent * 0.08,
    sin(stream) * (sourceRadius * 1.16 + uExtent * 0.14)
  );
  flow = mix(flow, current, journey * (0.48 + 0.4 * sin(time * 0.53 + seed * 1.1) * sin(time * 0.53 + seed * 1.1)));
  return mix(pose, uCenter + flow, smoothstep(0.0, 1.0, uDispersion));
}

vec3 pointerDirection(vec3 position, float seed, out float influence) {
  vec3 offset = position - uPointer;
  float distanceToPointer = length(offset);
  influence = pow(max(0.0, 1.0 - distanceToPointer / uPointerRadius), 2.0) * uPointerStrength;
  // A finite direction even for a sample exactly beneath the pointer.
  return distanceToPointer > 0.0001 ? offset / distanceToPointer
    : normalize(vec3(cos(seed * 31.0), 0.37, sin(seed * 31.0)));
}

float gestureInfluence(vec3 position) {
  float radius = uGestureRadius * mix(1.0, 0.64, uGestureMode);
  float distanceToBrush = length(position - uGesturePosition) / max(radius, 0.001);
  float falloff = max(0.0, 1.0 - distanceToBrush * distanceToBrush);
  return falloff * falloff * uGestureStrength;
}

vec3 gestureForce(vec3 position, float seed, float influence) {
  vec3 offset = uGesturePosition - position;
  float distanceToBrush = length(offset);
  vec3 inward = offset / max(distanceToBrush, uExtent * 0.006);
  vec3 tangent = cross(vec3(0.0, 1.0, 0.0), inward);
  float motionScale = mix(1.0, 0.4, uReducedMotion);
  // Weave carries the local material with the hand; gather draws a soft knot.
  // Both are forces, never changes of sample IDs or teleports to the cursor.
  vec3 pull = offset * mix(8.0, 16.0, uGestureMode);
  vec3 carry = uGestureVelocity * mix(7.5, 2.2, uGestureMode);
  vec3 curl = tangent * uExtent * mix(5.8, 1.8, uGestureMode)
    * (0.8 + sin(seed * 12.0) * 0.2);
  return (pull + carry + curl) * influence * motionScale;
}
`,wh=`
uniform sampler2D uClosed;
uniform sampler2D uOpen;
uniform float uStep;
${Ch}
vec3 nextVelocity(vec3 position, vec3 velocity, vec2 uv, float seed) {
  vec3 target = targetPosition(texture2D(uClosed, uv).xyz, texture2D(uOpen, uv).xyz, seed);
  float brush = gestureInfluence(position);
  vec3 force = (target - position) * mix(38.0, 15.0, uDispersion) * (1.0 - brush * 0.62);
  float influence;
  vec3 away = pointerDirection(position, seed, influence);
  force += (away + cross(vec3(0.0, 1.0, 0.0), away) * 0.15)
    * influence * uExtent * mix(34.0, 13.0, uReducedMotion);
  force += gestureForce(position, seed, brush);
  vec3 next = (velocity + force * uStep) * exp(-mix(7.4, 4.8, brush) * uStep);
  float speed = length(next);
  return next * min(1.0, uExtent * 3.0 / max(speed, 0.0001));
}
`,Th=`
${wh}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 previous = texture2D(texturePosition, uv);
  vec3 velocity = texture2D(textureVelocity, uv).xyz;
  vec3 next = nextVelocity(previous.xyz, velocity, uv, previous.w);
  gl_FragColor = vec4(previous.xyz + next * uStep, previous.w);
}
`,Eh=`
${wh}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 position = texture2D(texturePosition, uv);
  vec4 previous = texture2D(textureVelocity, uv);
  vec3 next = nextVelocity(position.xyz, previous.xyz, uv, position.w);
  float brush = gestureInfluence(position.xyz);
  // Persistent heat makes the path of the hand legible after the hand leaves.
  float heat = max(previous.w * exp(-1.8 * uStep), brush * 0.9);
  gl_FragColor = vec4(next, heat);
}
`,Dh=`
uniform sampler2D uPreviousPosition;
uniform sampler2D uPreviousVelocity;
uniform sampler2D uClosed;
uniform sampler2D uOpen;
uniform float uPreviousSide;
uniform float uPreviousCount;
uniform float uStateKind;
${Ch}
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float index = cell.y * resolution.x + cell.x;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  if (index < uPreviousCount) {
    vec2 previousUv = (vec2(mod(index, uPreviousSide), floor(index / uPreviousSide)) + 0.5) / uPreviousSide;
    gl_FragColor = uStateKind < 0.5 ? texture2D(uPreviousPosition, previousUv) : texture2D(uPreviousVelocity, previousUv);
  } else {
    vec4 closed = texture2D(uClosed, uv);
    vec3 open = texture2D(uOpen, uv).xyz;
    gl_FragColor = uStateKind < 0.5 ? vec4(targetPosition(closed.xyz, open, closed.w), closed.w) : vec4(0.0);
  }
}
`,Oh=`
attribute vec3 aClosed;
attribute vec3 aOpen;
attribute vec3 aTint;
attribute vec2 aStateUv;
attribute float aSeed;
uniform sampler2D uPosition;
uniform sampler2D uVelocity;
uniform float uViewportHeight;
uniform float uPixelRatio;
uniform float uGrainScale;
uniform vec2 uHeightRange;
varying vec3 vTint;
varying float vDepth;
varying float vSeed;
varying float vHeat;
varying float vFlowAlpha;
varying float vGlimmer;
${Ch}
void main() {
  vec3 localPosition;
  #ifdef USE_SIMULATION
    localPosition = texture2D(uPosition, aStateUv).xyz;
    vHeat = texture2D(uVelocity, aStateUv).w;
  #else
    localPosition = targetPosition(aClosed, aOpen, aSeed);
    float influence;
    vec3 away = pointerDirection(localPosition, aSeed, influence);
    localPosition += away * influence * uPointerRadius * mix(0.72, 0.3, uReducedMotion);
    float brush = gestureInfluence(localPosition);
    localPosition += gestureForce(localPosition, aSeed, brush) * 0.032;
    vHeat = brush;
  #endif
  vec4 mv = modelViewMatrix * vec4(localPosition, 1.0);
  gl_Position = projectionMatrix * mv;
  float modelScale = length(modelViewMatrix[0].xyz);
  float pointSize = uExtent * 0.0033 * modelScale * uViewportHeight * projectionMatrix[1][1] / max(-mv.z, 0.5);
  gl_PointSize = clamp(pointSize * uGrainScale * (0.76 + aSeed * 0.48) * (1.0 + vHeat * 0.22), uPixelRatio * 0.95, uPixelRatio * 4.1);
  float height = smoothstep(uHeightRange.x, uHeightRange.y, mix(aClosed.y, aOpen.y, uBloom));
  // Linear-space values stay deliberately below white; dense overlaps retain
  // the reference's lilac/blue material identity after output color conversion.
  vTint = aTint * (0.70 + 0.15 * height);
  vDepth = -mv.z;
  vSeed = aSeed;
  vFlowAlpha = mix(1.0, aSeed < 0.24 ? 0.65 : aSeed < 0.74 ? 0.88 : 0.60, uDispersion);
  vGlimmer = pow(0.5 + 0.5 * sin(uTime * 0.9 + aSeed * 101.0), 18.0)
    * step(0.96, aSeed) * vHeat * (1.0 - uReducedMotion * 0.8);
}
`,kh=`
uniform float uNight;
uniform float uDensityAlpha;
uniform float uOpacity;
varying vec3 vTint;
varying float vDepth;
varying float vSeed;
varying float vHeat;
varying float vFlowAlpha;
varying float vGlimmer;
void main() {
  float radius2 = dot(gl_PointCoord - 0.5, gl_PointCoord - 0.5) * 4.0;
  if (radius2 > 1.0) discard;
  float core = exp(-radius2 * 4.8);
  float halo = exp(-radius2 * 1.8) * 0.19;
  float depthFade = 0.62 + 0.38 * exp(-vDepth * 0.045);
  float alpha = (core + halo) * uDensityAlpha * uOpacity * depthFade * (1.0 + vHeat * 0.2) * vFlowAlpha;
  vec3 color = vTint * mix(0.82, 1.24, uNight) * (0.86 + vSeed * 0.28);
  // Heat lifts luminance without washing the source's pink/blue strata white.
  // Only sparse, slow glints approach a pale highlight along the recent stroke.
  vec3 heated = vTint * 1.6 + sqrt(max(vTint,vec3(0.0))) * 0.09;
  color = mix(color, heated, min(vHeat * 0.6, 0.6));
  color += sqrt(max(vTint,vec3(0.0))) * vGlimmer * .7;
  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;function Ah(e,t,{quality:n=`standard`}={}){if(!t||![`closed`,`open`,`colors`].every(e=>t[e]instanceof Float32Array))throw TypeError(`Particle samples must be Float32Array closed/open/colors buffers.`);let r=t.closed.length;if(r===0||r%3||t.open.length!==r||t.colors.length!==r)throw RangeError(`Particle samples require nonempty matching xyz/rgb buffer lengths.`);let i=Math.min(vh,r/3),a=new pr,o=new G;for(let e=0;e<i*3;e+=3){for(let n of[t.closed,t.open,t.colors])if(!Number.isFinite(n[e])||!Number.isFinite(n[e+1])||!Number.isFinite(n[e+2]))throw RangeError(`Particle source samples must contain finite values.`);a.expandByPoint(o.fromArray(t.closed,e)),a.expandByPoint(o.fromArray(t.open,e))}let s=a.getCenter(new G),c=a.getSize(new G),l=Math.max(c.x,c.y,c.z,.1),u=new W,d={uBloom:{value:1},uDispersion:{value:0},uFlow:{value:0},uTime:{value:0},uReducedMotion:{value:0},uCenter:{value:s},uExtent:{value:l},uPointer:{value:new G},uPointerStrength:{value:0},uPointerRadius:{value:l*.31},uGesturePosition:{value:new G},uGestureVelocity:{value:new G},uGestureStrength:{value:0},uGestureMode:{value:0},uGestureRadius:{value:l*.39}},f={...d,uPosition:{value:null},uVelocity:{value:null},uViewportHeight:{value:720},uPixelRatio:{value:1},uGrainScale:{value:.92},uHeightRange:{value:new W(a.min.y,Math.max(a.max.y,a.min.y+.01))},uNight:{value:0},uDensityAlpha:{value:.64},uOpacity:{value:1}},p=new $o({name:`SpringLetterSurfaceParticles`,uniforms:f,vertexShader:Oh,fragmentShader:kh,transparent:!0,depthWrite:!1,depthTest:!0,blending:1,toneMapped:!0}),m=new ia(new Xr,p);m.name=`SpringLetterSurfaceParticles`,m.frustumCulled=!1;let h=null,g=null,_=null,v=null,y=null,b=0,S=0,C=`analytic-fallback`,w=null,T=!1,E=n,D=0,O=!1,k=!1,A=new G,j=new G;function M(){if(!e.capabilities?.isWebGL2||!e.extensions?.has(`EXT_color_buffer_float`)||!e.capabilities.maxVertexTextures)return w=`WebGL2 float color target or vertex texture support is unavailable.`,!1;let t=new pn(1,1,{type:N,format:ie,depthBuffer:!1,minFilter:x,magFilter:x}),n=e.getRenderTarget();try{e.setRenderTarget(t);let n=e.getContext(),r=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return r||(w=`Float framebuffer is incomplete.`),r}catch(e){return w=`Float framebuffer check failed: ${e.message}`,!1}finally{e.setRenderTarget(n),t.dispose()}}let P=M();function F(){h?.dispose(),v?.dispose(),y?.dispose(),h=null,g=null,_=null,v=null,y=null,f.uPosition.value=null,f.uVelocity.value=null}function ee(n,r=!1){if(T)return;E=n===`low`?`low`:n===`high`?`high`:n===`balanced`?`balanced`:`standard`;let a=Math.min(i,E===`low`?yh:vh);if(a===b&&!r)return;let o=h?{compute:h,closedTexture:v,openTexture:y,side:S,count:b,position:h.getCurrentRenderTarget(g).texture,velocity:h.getCurrentRenderTarget(_).texture}:null;h=null,g=null,_=null,v=null,y=null,f.uPosition.value=null,f.uVelocity.value=null,b=a,S=Math.ceil(Math.sqrt(b));let s=t.closed.slice(0,b*3),c=t.open.slice(0,b*3),l=t.colors.slice(0,b*3),u=new Float32Array(b),x=new Float32Array(b),D=new Float32Array(b*2);for(let e=0;e<b;e++)u[e]=e,x[e]=xh(e),D[e*2]=(e%S+.5)/S,D[e*2+1]=(Math.floor(e/S)+.5)/S;let O=new Xr;if(O.setAttribute(`position`,new Ir(c.slice(),3)),O.setAttribute(`aClosed`,new Ir(s,3)),O.setAttribute(`aOpen`,new Ir(c,3)),O.setAttribute(`aTint`,new Ir(l,3)),O.setAttribute(`aSeed`,new Ir(x,1)),O.setAttribute(`aSourceId`,new Ir(u,1)),O.setAttribute(`aStateUv`,new Ir(D,2)),O.setDrawRange(0,b),m.geometry.dispose(),m.geometry=O,C=`analytic-fallback`,delete p.defines.USE_SIMULATION,P)try{h=new _h(S,S,e),v=h.createTexture(),y=h.createTexture();let t=h.createTexture(),n=h.createTexture();for(let e=0;e<S*S;e++){let n=Math.min(e,b-1),r=n*3,i=e*4;for(let e=0;e<3;e++)v.image.data[i+e]=s[r+e],y.image.data[i+e]=c[r+e],t.image.data[i+e]=Wt.lerp(s[r+e],c[r+e],d.uBloom.value);v.image.data[i+3]=x[n],t.image.data[i+3]=x[n]}g=h.addVariable(`texturePosition`,Th,t),_=h.addVariable(`textureVelocity`,Eh,n),h.setVariableDependencies(g,[g,_]),h.setVariableDependencies(_,[g,_]);for(let e of[g,_])Object.assign(e.material.uniforms,d,{uClosed:{value:v},uOpen:{value:y},uStep:{value:0}});let r=h.init();if(r)throw Error(r);if(o){let e=h.createShaderMaterial(Dh,{...d,uPreviousPosition:{value:o.position},uPreviousVelocity:{value:o.velocity},uPreviousSide:{value:o.side},uPreviousCount:{value:o.count},uClosed:{value:v},uOpen:{value:y},uStateKind:{value:0}});try{for(let t of[g,_])e.uniforms.uStateKind.value=t===g?0:1,h.doRenderTarget(e,h.getCurrentRenderTarget(t)),h.doRenderTarget(e,h.getAlternateRenderTarget(t))}finally{e.dispose()}}C=`gpu-spring`,w=null,p.defines.USE_SIMULATION=1,f.uPosition.value=h.getCurrentRenderTarget(g).texture,f.uVelocity.value=h.getCurrentRenderTarget(_).texture}catch(e){w=`GPU initialization failed: ${e.message}`,F()}finally{o?.compute.dispose(),o?.closedTexture?.dispose(),o?.openTexture?.dispose()}p.needsUpdate=!0,f.uDensityAlpha.value=b<=yh?.83:.62,f.uGrainScale.value=b<=yh?1:.92}ee(n);function te(e){if(!e||![`closed`,`open`,`colors`].every(t=>e[t]instanceof Float32Array))throw TypeError(`Source requires Float32Array buffers`);let t=e.closed.length;if(!t||t%3||e.open.length!==t||e.colors.length!==t)throw RangeError(`Source buffers must match`);for(let n of[e.closed,e.open,e.colors])for(let e=0;e<Math.min(t,vh*3);e++)if(!Number.isFinite(n[e]))throw RangeError(`Source must be finite`)}function ne(e){if(!T){if(!(e instanceof Float32Array)||e.length!==r)throw RangeError(`Color buffer must match source`);for(let t=0;t<Math.min(r,vh*3);t++)if(!Number.isFinite(e[t]))throw RangeError(`Colors must be finite`);t={...t,colors:e},m.geometry.attributes.aTint.array.set(e.subarray(0,b*3)),m.geometry.attributes.aTint.needsUpdate=!0}}function I(e,{preserveMotion:n=!0}={}){if(T)return;te(e);let u=i;t=e,r=e.closed.length,i=Math.min(vh,r/3),a.makeEmpty();for(let e=0;e<i*3;e+=3)a.expandByPoint(o.fromArray(t.closed,e)),a.expandByPoint(o.fromArray(t.open,e));if(a.getCenter(s),a.getSize(c),l=Math.max(c.x,c.y,c.z,.1),d.uExtent.value=l,d.uPointerRadius.value=l*.31,d.uGestureRadius.value=l*.39,f.uHeightRange.value.set(a.min.y,Math.max(a.max.y,a.min.y+.01)),!n)F(),b=0,ee(E,!0);else if(u!==i)ee(E,!0);else{for(let[e,n]of[[`position`,`open`],[`aClosed`,`closed`],[`aOpen`,`open`],[`aTint`,`colors`]])m.geometry.attributes[e].array.set(t[n].subarray(0,b*3)),m.geometry.attributes[e].needsUpdate=!0;if(h){for(let e=0;e<S*S;e++){let n=Math.min(e,b-1);for(let r=0;r<3;r++)v.image.data[e*4+r]=t.closed[n*3+r],y.image.data[e*4+r]=t.open[n*3+r]}v.needsUpdate=!0,y.needsUpdate=!0}}}function re(t,n,r={}){if(T)return;let i=Math.max(0,Math.min(.05,Number.isFinite(t)?t:0));Number.isFinite(r.bloom)&&(d.uBloom.value=bh(r.bloom)),Number.isFinite(r.dispersion)&&(d.uDispersion.value=bh(r.dispersion)),d.uFlow.value=Number.isFinite(r.flow)?bh(r.flow):d.uDispersion.value*.7,Number.isFinite(r.opacity)&&(f.uOpacity.value=bh(r.opacity)),Number.isFinite(n)&&(d.uTime.value=n%1e4),d.uReducedMotion.value=+!!r.reducedMotion,f.uNight.value=typeof r.night==`number`?bh(r.night):+!!r.night;let a=r.pointer,o=r.gesture,c=!!(o?.active&&Sh(o.position)),p=c?bh(o.strength??1):0,m=1-Math.exp(-22*i);if(c){for(let e of[`x`,`y`,`z`])A[e]=Wt.clamp(o.position[e],s[e]-l*8,s[e]+l*8),j[e]=Sh(o.velocity)?Wt.clamp(o.velocity[e],-l*3,l*3):0;j.clampLength(0,l*3),!O||!k&&d.uGestureStrength.value<.02?(d.uGesturePosition.value.copy(A),O=!0):d.uGesturePosition.value.lerp(A,m),d.uGestureVelocity.value.lerp(j,m);let e=o.mode===`gather`||o.mode!==`weave`&&d.uGestureVelocity.value.length()<l*.08;d.uGestureMode.value+=(+!!e-d.uGestureMode.value)*m}else d.uGestureVelocity.value.multiplyScalar(Math.exp(-7*i));d.uGestureStrength.value+=(p-d.uGestureStrength.value)*(1-Math.exp(-(c?18:6.5)*i)),k=c;let v=Sh(a)&&!c;if(v)for(let e of[`x`,`y`,`z`])d.uPointer.value[e]=Wt.clamp(a[e],s[e]-l*8,s[e]+l*8);if(C===`gpu-spring`?d.uPointerStrength.value=+!!v:(D+=(+!!v-D)*(1-Math.exp(-12*i)),d.uPointerStrength.value=D),e.getDrawingBufferSize(u),f.uViewportHeight.value=Math.max(1,u.y),f.uPixelRatio.value=Math.min(3,Math.max(.5,e.getPixelRatio())),h&&i>0){let e=Math.max(1,Math.ceil(i/(1/60))),t=i/e;g.material.uniforms.uStep.value=t,_.material.uniforms.uStep.value=t;for(let t=0;t<e;t++)h.compute();f.uPosition.value=h.getCurrentRenderTarget(g).texture,f.uVelocity.value=h.getCurrentRenderTarget(_).texture}}return{object:m,update:re,setSource:I,setColors:ne,setQuality:ee,getStats:()=>({backend:C,activeCount:b,sourceCount:r/3,quality:E,simulationWidth:h?S:0,simulationHeight:h?S:0,simulationTexels:h?S*S:0,fallbackReason:w,disposed:T,gestureActive:k,gestureStrength:d.uGestureStrength.value,gestureMode:d.uGestureMode.value>.5?`gather`:`weave`,flowShape:`petal-streams-drifting-filaments`,flow:d.uFlow.value}),dispose(){T||(T=!0,F(),m.geometry.dispose(),p.dispose())}}}var jh=Math.PI*2,Mh=(e,t,n)=>Wt.smoothstep(n,e,t);function Nh({resources:e,leafGeometry:t,surfaceGeometry:n}){let r=new K;r.name=`tide-worn-gardens`;let i=[],a=471213,o=()=>(a=Math.imul(a,1664525)+1013904223>>>0,a/4294967296),s=(t,n={})=>{let r=new ts({color:t,roughness:.86,metalness:.015,...n});return e.add(r),r},c=s(10329742),l=s(5006686),u=s(10192997,{roughness:.62,metalness:.38}),d=s(14733227,{side:2,roughness:.91}),f=s(6653813,{side:2,roughness:.77}),p=s(10663808,{side:2,roughness:.68}),m=s(4741965),h=s(16777215,{vertexColors:!0,roughness:.95});h.name=`continuous-tide-worn-stone`;let g=s(11055266,{vertexColors:!0,roughness:.84,metalness:.018});g.name=`opening-matte-limestone`;let _=[c,l,h,g],v=(e,t,n=r,i=[0,0,0])=>{let a=new yi(e,t);return a.position.set(...i),a.receiveShadow=!0,n.add(a),a},y=(e,t,n,i=r,a=24)=>v(new Wo(new Ea(e.map(e=>new G(...e))),a,t,5,!1),n,i),b=(e,t,n,r,i,a=12)=>v(new pa(e,e*.96,t,a),n,r,i);function x(e){let t=e.getAttribute(`position`),n=e.getAttribute(`normal`),r=[],i=new q(1,.98,.92),a=new q(.69,.77,.76),o=new q;for(let e=0;e<t.count;e++){let s=t.getX(e),c=t.getY(e),l=Math.max(0,-Math.sign(s)*n.getX(e),-n.getY(e)),u=1-Mh(-.1,.85,c);o.copy(i).lerp(a,Math.min(.78,l*.6+u*.48)),r.push(o.r,o.g,o.b)}return e.setAttribute(`color`,new J(r,3)),e}function S(e,t){let n=e.getAttribute(`position`),r=[],i=new q(t===`wind`?10788488:9608076),a=new q(t===`wind`?12694158:12037524),o=new q(t===`wind`?6780509:5271394),s=new q;for(let e=0;e<n.count;e++){let c=n.getX(e),l=n.getZ(e),u=Math.hypot(c,l),d=t===`wind`?1-Mh(.5,1.9,Math.abs(l+c*.55)):Math.max(1-Mh(.6,1.8,Math.abs(c)),.62*(1-Mh(.1,1.1,Math.abs(l)))),f=Mh(3.15,5.75,u),p=.5+.5*Math.sin(c*1.2+Math.sin(l*1.6))*Math.cos(l*.83-c*.4);s.copy(i).lerp(a,d*.6).lerp(o,f*(.28+p*.42));let h=t===`wind`?-16:-46;for(let[e,t,,n]of w){if(Math.abs(t-h)>8)continue;let r=Math.hypot((c-e)/(n*.98),(l-t+h)/(n*.74));s.lerp(m.color,(1-Mh(.12,1.16,r))*.34)}s.multiplyScalar(.96+.06*Math.sin(c*3.2+l*.8)*Math.cos(l*4.1)),r.push(s.r,s.g,s.b);let g=Math.sin(c*2.1+Math.sin(l))*Math.cos(l*1.8)*.018;n.setY(e,n.getY(e)+g*Mh(1.5,4.2,u)*(1-d*.75))}return n.needsUpdate=!0,e.setAttribute(`color`,new J(r,3)),e.computeVertexNormals(),h}function C(e,r){if(r.name=`spring-purpose-${e}`,r.userData.purpose=e,e===`memory`){let e=b(.62,.14,l,r,[0,.07,0],8);e.scale.z=.82;let t=b(.47,.11,c,r,[0,.195,0],8);t.rotation.y=Math.PI/8;for(let e of[-.31,.31])for(let t of[-.24,.24])y([[e,.25,t],[e*.94,.91,t*.94],[e*.89,1.39,t*.89]],.023,u,r,12);v(n(8,12,(e,t)=>{let n=(t*2-1)*.48,r=(e*2-1)*.38;return[n,1.4+(1-Math.abs(t*2-1))*.2+Math.abs(e*2-1)*.035,r]}),l,r),y([[-.13,1.58,0],[-.18,1.82,0],[0,1.92,0],[.18,1.82,0],[.13,1.58,0]],.023,u,r,22);for(let e of[.32,1.36])y([[-.32,e,-.24],[.32,e,-.24],[.32,e,.24],[-.32,e,.24],[-.32,e,-.24]],.018,u,r,24);let i=v(new Ro(.52,.84),d,r,[0,.83,-.235]);i.rotation.y=.08}else if(e===`season`){let e=b(.83,.17,l,r,[0,.085,0],10);e.scale.z=.8,e.rotation.y=.24;let n=b(.74,.025,m,r,[0,.183,0],10);n.scale.z=.79;for(let[e,n,i,a]of[[-.28,.04,.93,-.85],[.24,-.08,1.22,.9]])y([[e,.17,n],[e*.7,i*.55,n],[e*1.4,i,n+.08]],.025,f,r),v(t(.94,.26,.18,16,5),p,r,[e*.7,i*.43,n]).rotation.set(-.86,a,e<0?.3:-.28);y([[0,.2,0],[-.05,.52,.01],[0,.82,0]],.026,f,r);for(let[e,t,n]of[[-.64,-.15,-.3],[.48,-.42,.8],[.57,.38,-.6]]){let i=v(new da(.47,.11,.16),c,r,[e,.19,t]);i.rotation.y=n}}else{b(.64,.12,l,r,[0,.06,0],8).scale.set(1.4,1,.68),v(n(12,24,(e,t)=>{let n=t*2-1,r=e*2-1,i=Math.max(0,1-n*n)**.65;return[n*.94,.22+r*r*.23+Math.abs(n)**3*.25,r*.34*i]}),u,r),y([[-.36,.35,-.04],[-.37,1.1,-.04],[-.41,1.98,-.04]],.026,u,r);let e=v(n(18,14,(e,t)=>[-.4+t*(Math.sin(e*Math.PI*.84)*.98),1.88-e*1.25,-.07+Math.sin(t*Math.PI)*.23*Math.sin(e*Math.PI)]),d,r);e.name=`letter-sail`,y([[-.4,1.88,-.07],[-.18,1.57,.03],[.49,.77,-.02]],.008,u,r,16),y([[-.39,1.92,-.07],[-.9,.57,.02]],.009,u,r,12)}}let w=[[-5.15,-47.5,.8,1.1],[-4.1,-50,.85,.75],[2.9,-50.65,.9,.8],[5.05,-47.7,.8,1.1],[5.03,-44.4,.53,.8],[-4.8,-43.55,.46,.8],[-5.2,-14.8,.65,.85],[-3.5,-20.25,.74,.85],[.9,-21.1,.8,.95],[3.65,-12.05,.7,.75],[5.2,-16.6,.65,.9]],T=new ji(t(1,.065,.48,8,2),f,w.length*42);T.name=`shore-grass-clusters`,r.add(T);let E=new ji(new pa(.007,.013,1,4,1),u,w.length*7);E.name=`shore-reed-stems`,r.add(E);let D=new Fo(1,1),O=D.getAttribute(`position`);for(let e=0;e<O.count;e++){let t=O.getX(e),n=O.getY(e),r=O.getZ(e),i=1+.09*Math.sin(t*7+n*4)*Math.cos(r*5);O.setXYZ(e,t*i,n*i,r*i)}D.computeVertexNormals();let k=new ji(D,l,w.length*5);k.name=`shore-water-worn-stones`,r.add(k);let A=new Un,j=0,M=0,N=0;function P(e,t,n=5.84){let r=t<-30?-46:-16,i=t-r,a=Math.min(1,n/Math.max(Math.hypot(e,i),.001));return[e*a,r+i*a]}for(let[e,t,n,r]of w)for(let i=0;i<42;i++){let a=o()*jh,s=Math.sqrt(o())*r,[c,l]=P(e+Math.cos(a)*s*.75,t+Math.sin(a)*s*.65),u=.5+o()*.5;if(A.position.set(c,.055,l),A.rotation.set(-.56-o()*.3,-.8+o()*.7,-.08+o()*.16),A.scale.set(n*u*(.6+o()*.4),n*u,n*u),A.updateMatrix(),T.setMatrixAt(j++,A.matrix),i<7){let e=n*(.55+o()*.5);A.position.set(c,.055+e/2,l),A.rotation.set(-.16,0,-.13),A.scale.set(1,e,1),A.updateMatrix(),E.setMatrixAt(M++,A.matrix)}if(i<5){let n=.12+o()*.18,[i,a]=P(e+(o()-.5)*r*1.5,t+(o()-.5)*r);A.position.set(i,.045,a),A.rotation.set(o()*.4,o()*jh,o()*.2),A.scale.set(n*1.7,n*.65,n),A.updateMatrix(),k.setMatrixAt(N++,A.matrix)}}for(let e of[T,E,k])e.instanceMatrix.needsUpdate=!0,e.computeBoundingSphere();for(let[e,t,n,i]of[[-3.7,-47.8,-.3,1.35],[3.8,-48.8,.9,1.3],[-3.9,-44.6,.6,.8],[4.1,-17.3,-.6,1],[-2.1,-20.1,-.65,1.15]]){let a=v(new da(i,.055,.14),c,r,[e,.063,t]);a.rotation.y=n}let F=[];for(let[e,t,a,o]of[[-4.8,-18.7,1.55,-.3],[4.1,-12.25,1.9,-.55]]){let s=new K;s.position.set(e,.06,t),s.rotation.y=o,r.add(s),y([[0,0,0],[.02,a*.55,0],[-.08,a,.04]],.025,u,s,16);let c=v(n(18,8,(e,t)=>[t*(.24-e*.07),a-e*.85,.08+Math.sin(e*5.2+t)*(.05+e*.13)+e*.36]),d,s);c.name=`wind-worn-letter-cloth`,F.push({object:c,phase:e}),i.push(c);let l=v(new Ho(.065,8,6),u,s,[0,a,.04]);l.scale.y=.6}function ee(e,t=!1){let n=Number.isFinite(e)?e:0;for(let e of F)e.object.rotation.x=t?0:Math.sin(n*.65+e.phase)*.025}return{group:r,dynamic:i,stoneMaterials:_,openingStone:g,paintOpeningStone:x,paintIsland:S,decorateVessel:C,update:ee}}var Ph=Math.PI*2,Fh=Wt.clamp,Ih={pearl:15196909,stone:11116203,edge:7761541,rose:14197207,blue:9551848,gold:13940603,ink:4801377,leaf:6524043};function Lh(e=16309){return()=>(e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296)}function Rh(e,t,n){let r=[],i=[],a=[];for(let a=0;a<=e;a++)for(let o=0;o<=t;o++){let s=n(a/e,o/t);r.push(s[0],s[1],s[2]),i.push(o/t,a/e)}for(let n=0;n<e;n++)for(let e=0;e<t;e++){let r=n*(t+1)+e,i=r+t+1;a.push(r,i,r+1,i,i+1,r+1)}let o=new Xr;return o.setAttribute(`position`,new J(r,3)),o.setAttribute(`uv`,new J(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function zh(e,t,n=56,r=6){return new Wo(new Ea(e.map(e=>new G(...e))),n,t,r,!1)}function Bh(e=1,t=.28,n=.35,r=18,i=6){return Rh(r,i,(r,i)=>{let a=Math.sin(Math.PI*r)**.72;return[(i*2-1)*t*a,n*Math.sin(r*Math.PI*.8)+.12*(1-(i*2-1)**2)*a,r*e]})}function Vh(){let e=new $o({transparent:!0,depthWrite:!1,side:2,uniforms:{uTime:{value:0},uNight:{value:0},uDetail:{value:0},uWaves:{value:Array.from({length:8},()=>new dn(0,0,-1e3,0))},uWater:{value:new q(3562347)},uPearl:{value:new q(9545655)},uReflection:{value:null},uReflectionMatrix:{value:new gn},uReflectionAmount:{value:0}},vertexShader:`
      uniform float uTime;
      uniform vec4 uWaves[8];
      uniform mat4 uReflectionMatrix;
      varying vec4 vReflection;
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying vec2 vLocal;
      float heightAt(vec2 p) {
        float h = sin(p.x * .48 + p.y * .23 + uTime * .58) * .025;
        h += sin(p.x * .19 - p.y * .51 - uTime * .39) * .018;
        h += sin(p.x * 1.13 + p.y * .83 + uTime * .24) * .007;
        for (int i = 0; i < 8; i++) {
          float age = uTime - uWaves[i].z;
          float dist = length(p - uWaves[i].xy);
          float ring = dist - age * 1.65;
          float gate = step(0., age) * (1. - step(7., age));
          h += sin(ring * 8.5) * exp(-ring * ring * .72) * exp(-age * .62)
            * uWaves[i].w * .065 * gate;
        }
        return h;
      }
      void main() {
        vec3 p = position;
        vec2 worldXZ = (modelMatrix * vec4(p, 1.)).xz;
        float h = heightAt(worldXZ);
        float hx = heightAt(worldXZ + vec2(.075, 0.));
        float hz = heightAt(worldXZ + vec2(0., .075));
        p.y += h;
        vNormal = normalize(vec3((h - hx) / .075, 1., (h - hz) / .075));
        vWorld = (modelMatrix * vec4(p, 1.)).xyz;
        vLocal = position.xz;
        vReflection = uReflectionMatrix * vec4(vWorld,1.);
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.);
      }
    `,fragmentShader:`
      uniform float uTime;
      uniform float uNight;
      uniform float uDetail;
      uniform vec3 uWater;
      uniform vec3 uPearl;
      uniform sampler2D uReflection;
      uniform float uReflectionAmount;
      varying vec4 vReflection;
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying vec2 vLocal;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float fresnel = pow(1. - max(dot(n, viewDir), 0.), 3.);
        vec2 q = vWorld.xz;
        // A warped interference field: high curvature gathers light into fine veins.
        vec2 w=q*mix(.9,2.2,uDetail)+vec2(sin(q.y*.71+uTime*.12),cos(q.x*.61-uTime*.1))*.8;
        float a=sin(dot(w,vec2(2.1,1.3))+sin(w.y*1.8+uTime*.16));
        float b=sin(dot(w,vec2(-1.4,2.7))+cos(w.x*1.1-uTime*.13));
        float c=sin(dot(w,vec2(3.2,-.8))+sin((w.x+w.y)*.7));
        float field=a+b*.75+c*.3;
        float caustic=pow(max(0.,1.-abs(field)*1.45),20.);
        caustic*=.5+.5*sin(w.x*.42+w.y*.57)*sin(w.y*.35-uTime*.08);
        vec3 color = mix(uWater, uPearl, fresnel * .68 + .12);
        float broadBands = sin(q.x * .24 + q.y * .17 + uTime * .09) * .5 + .5;
        color = mix(color, color * vec3(.87, .91, .99), broadBands * .24);
        color += vec3(.53, .48, .42) * caustic * (1. - fresnel) * (.08+.82*uDetail);
        float broad = pow(max(dot(n, normalize(vec3(-.4, 1., .24))), 0.), 16.);
        vec3 halfDir = normalize(viewDir + normalize(vec3(-.4, 1., .24)));
        float shine = pow(max(dot(n, halfDir), 0.), 140.);
        color += vec3(.045, .038, .05) * broad + vec3(.32, .24, .2) * shine;
        vec3 nightColor = color * vec3(.22, .19, .37) + vec3(.014, .013, .035);
        color = mix(color, nightColor, uNight);
        if(uReflectionAmount>.0&&vReflection.w>.0){
          vec4 coords=vReflection;coords.xy+=n.xz*coords.w*.032;
          vec3 reflected=texture2DProj(uReflection,coords).rgb;
          color=mix(color,reflected,(.18+fresnel*.36)*uReflectionAmount);
        }
        float edge = 1. - smoothstep(44., 69., length(vLocal * vec2(1., .88)));
        gl_FragColor = vec4(color, edge * .87);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,fog:!0});e.vertexShader=e.vertexShader.replace(`varying vec2 vLocal;`,`varying vec2 vLocal;
#include <fog_pars_vertex>`).replace(`gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.);`,`vec4 mvPosition = viewMatrix * vec4(vWorld, 1.);
gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>`),e.fragmentShader=e.fragmentShader.replace(`varying vec2 vLocal;`,`varying vec2 vLocal;
#include <fog_pars_fragment>`),Object.assign(e.uniforms,Xo.clone(Y.fog));let t=new Ro(140,140,96,96);t.rotateX(-Math.PI/2);let n=new yi(t,e);return n.position.set(0,-.18,-23),n.name=`shallow-water`,n.renderOrder=-1,n.userData.waveIndex=0,n}function Hh(){let e=new K;e.name=`spring-letter-world`;let t=Lh(),n=[],r=[],i=new Set,a=[],o=(e,t={})=>{let n=new ts({color:e,roughness:.58,metalness:.1,...t});return i.add(n),n},s=o(Ih.stone,{roughness:.57,metalness:.08}),c=o(9274003,{roughness:.76,metalness:.04,vertexColors:!0}),l=o(11243423,{roughness:.48,metalness:.12}),u=o(12957901,{roughness:.52,side:2}),d=o(14212587,{roughness:.25,metalness:.76}),f=o(Ih.gold,{roughness:.26,metalness:.66}),p=o(Ih.edge,{roughness:.61,metalness:.1}),m=o(9343403,{roughness:.8}),h=o(Ih.leaf,{roughness:.36,side:2}),g=o(Ih.rose,{roughness:.38,side:2}),_=o(Ih.blue,{roughness:.3,side:2}),v=new ns({color:14016240,roughness:.15,metalness:.05,transparent:!0,opacity:.4,side:2,depthWrite:!1,iridescence:.6,iridescenceIOR:1.25});i.add(v),v.forceSinglePass=!0;let y=(e,t=.35)=>{let n=o(e,{emissive:e,emissiveIntensity:t,roughness:.32});return r.push({material:n,base:t}),n},b=y(11130100,.44),x=y(15784354,.4),S=y(15516392,.27),C=Nh({resources:i,leafGeometry:Bh,surfaceGeometry:Rh});e.add(C.group);let T=new Uint8Array(16384);for(let e=0;e<64;e++)for(let t=0;t<64;t++){let n=Math.hypot((t-31.5)/31.5,(e-31.5)/31.5),r=(e*64+t)*4;T[r]=T[r+1]=T[r+2]=255,T[r+3]=Math.round(Math.max(0,1-n)**2.3*190)}let E=new Si(T,64,64);E.needsUpdate=!0,E.magFilter=E.minFilter=w;let D=new si({color:3878987,map:E,transparent:!0,opacity:.39,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,toneMapped:!1});i.add(D);let O=new Ro(1,1).rotateX(-Math.PI/2),k=(t,n,r=e,i)=>{let a=new yi(t,n);return i&&a.position.set(...i),a.receiveShadow=!0,r.add(a),a},A=(e,t,n,r,i=.1)=>{let a=k(new Uo(e,t,6,80),n,r);return a.rotation.x=-Math.PI/2,a.position.y=i,a},j=(e,t,n,r=.025)=>k(zh(e,r,28),t,n),M=(t,n,r,i,a=e,o=.072)=>{let s=k(O,D,a,[t,o,n]);return s.scale.set(r,1,i),s.renderOrder=1,s};function N(t,n,r,i=0,a=!1,o=``){let s=new K;s.position.set(t,0,n),e.add(s);let l=Rh(a?36:o?26:r<=1.3?10:12,a?100:r<=1.3?48:72,(e,t)=>{let n=-t*Ph,o=e*(r*(1+i*Math.sin(3*n+.5)+i*.35*Math.cos(7*n))),s=a?-.39+Wt.smoothstep(e,.78,.87)*.445:.055;return[Math.cos(n)*o,s-e**24*.035,Math.sin(n)*o]}),u=[],d=l.getAttribute(`position`);for(let e=0;e<d.count;e++){let t=d.getX(e),n=d.getZ(e),i=Math.hypot(t,n)/r,a=Math.sin(t*8.1+n*5.7)*Math.cos(n*6.4-t*1.8)*.012,o=.91+Math.sin(i*Math.PI)*.055+a;u.push(o,o*.978,Math.min(1,o*1.025))}l.setAttribute(`color`,new J(u,3)),k(l,o?C.paintIsland(l,o):c,s);let f=Rh(8,100,(e,t)=>{let n=-t*Ph,a=r*(1+i*Math.sin(3*n+.5)+i*.35*Math.cos(7*n))*(1-.11*Math.sin(e*Math.PI*.7));return[Math.cos(n)*a,.02-e*.72,Math.sin(n)*a]});k(f,p,s);let h=k(new Ho(r,48,12),m,s,[0,-.92,0]);h.scale.y=.065;let g=[];for(let e=0;e<=100;e++){let t=e/100*Ph,n=r*(1+i*Math.sin(3*t+.5)+i*.35*Math.cos(7*t));g.push([Math.cos(t)*n,.045,Math.sin(t)*n])}return k(zh(g,.012,150),p,s),s}let P=N(0,0,6.8,.012,!0);N(0,-16,6,.015,!1,`wind`),N(0,-46,6,.012,!1,`finale`),k(new Io([new W(0,-.37),new W(.68,-.37),new W(.71,-.19),new W(.6,-.07),new W(.4,.015),new W(0,.025)],48),s,P),A(.59,.014,f,P,-.055),M(0,.08,2.7,2.15,P,-.141);let F=Se(-2.1,1.25,.29,P),ee=Se(2.35,1.75,.25,P);F.position.y=-.16,ee.position.y=-.19,M(-2.1,1.25,1.4,1.1,P,-.141),M(2.35,1.75,1.25,1,P,-.141);let te=new K;te.position.set(0,-.14,.65),P.add(te);let ne=new si({color:7044732,transparent:!0,opacity:.14,depthWrite:!1});i.add(ne);for(let[e,t,n,r,i]of[[1.02,Math.PI*1.05,.2,-.12,.05],[1.55,Math.PI*.64,2.35,.16,-.11]])k(new Uo(e,.008,4,56,t),ne,te,[r,0,i]).rotation.set(-Math.PI/2,0,n);let I=[];for(let e=0;e<3;e++){let t=new si({color:e%2?12313070:15257757,transparent:!0,opacity:0,depthWrite:!1});i.add(t);let n=A(.88+e*.38,.025,t,te,.013);n.name=`opening-awakening-${e}`,I.push(n)}let re={A:[0,-26],R:[-5,-29],M:[0,-32],F:[0,-38]};for(let[e,[t,n]]of Object.entries(re)){let r=N(t,n,1.25);r.name=`anchor-${e}`,A(.96,.013,f,r,.075),A(.82,.009,p,r,.076);let i=k(new Lo(.065),b,r,[.82,.18,0]);i.rotation.z=Math.PI/4}function L(t,n,r,i=s,a=!1){let o=new K;e.add(o);let c=Math.hypot(n[0]-t[0],n[1]-t[1]),l=Math.max(2,Math.ceil(c/.65)),u=Math.atan2(n[0]-t[0],n[1]-t[1]),d=a?Bh(.87,r*.46,.045):new pa(1,.94,.16,32,1);for(let e=0;e<=l;e++){let s=e/l,c=Wt.lerp(t[0],n[0],s),f=Wt.lerp(t[1],n[1],s),p=k(d,i,o,[c,a?.055:-.025,f]);if(a?p.rotation.y=u+(e%2?-.28:.28):(p.scale.set(r*.51,1,.48),p.rotation.y=u),e%2==0){let e=k(new Ho(.025,8,6),x,o,[c,.075,f]);e.scale.y=.45}}return o}let ie=L([0,-6],[0,-11],2.6),ae=L([0,-21],[0,-26],2.1),R=L(re.A,re.R,1.45),oe=L(re.A,re.M,1.6,u,!0),se=L(re.M,re.F,1.6,g,!0),ce=L(re.R,re.M,1.5,h,!0),le=L(re.F,[0,-41],2),ue=[oe,se,ce].map(e=>{let t=new Map;return e.traverse(e=>{if(e.isMesh){if(!t.has(e.material)){let n=e.material.clone();n.transparent=!0,n.opacity=.22,n.forceSinglePass=!0,t.set(e.material,n),i.add(n)}e.material=t.get(e.material)}}),{path:e,materials:[...t.values()],start:-10}}),de=new K;e.add(de);let fe=new si({color:12891088,transparent:!0,opacity:.25,depthWrite:!1});i.add(fe);for(let[e,t]of[[re.A,re.M],[re.M,re.F],[re.R,re.M]])k(zh([[e[0],.025,e[1]],[(e[0]+t[0])/2,.03,(e[1]+t[1])/2],[t[0],.025,t[1]]],.017,24,4),fe,de);de.visible=!1;let pe=k(Rh(16,24,(e,t)=>{let n=e*Math.PI;return[(t-.5)*3.9,Math.sin(n)*2.3+.05,.22*Math.sin(t*Ph*2)+.45*Math.sin(n)]}),h,ce,[-2.6,0,-30.7]);pe.material=ue[2].materials[0],pe.rotation.y=-.55,pe.position.x-=.65;for(let e of[ie,ae,R,oe,se,ce,le])e.visible=!1;function me(t,n,r,o,c=0,u=l,d={}){let p=new K;p.position.set(t,0,n),p.rotation.y=c,e.add(p);let m=[[-r/2,-.2,0],[-r/2,o*.46,0]];for(let e=0;e<=24;e++){let t=Math.PI-e/24*Math.PI;m.push([Math.cos(t)*r/2,o*.46+Math.sin(t)*o*.54,0])}m.push([r/2,-.2,0]);let h=new qa,g=r/2,_=o*.46,v=o*.54,y=d.band??.32;if(h.moveTo(-g-y,-.2),h.lineTo(-g-y,_),d.fragment){let e=1.82;for(let t=0;t<=24;t++){let n=Math.PI-t/24*(Math.PI-e);h.lineTo(Math.cos(n)*(g+y),_+Math.sin(n)*(v+y))}for(let t=24;t>=0;t--){let n=Math.PI-t/24*(Math.PI-e);h.lineTo(Math.cos(n)*(g-y),_+Math.sin(n)*(v-y))}h.lineTo(-g+y,-.2),h.closePath()}else h.bezierCurveTo(-g-y,_+v*.56,-g*.55,o+y,0,o+y),h.bezierCurveTo(g*.55,o+y,g+y,_+v*.56,g+y,_),h.lineTo(g+y,-.2),h.lineTo(g-y,-.2),h.lineTo(g-y,_),h.bezierCurveTo(g-y,_+v*.52,g*.52,o-y,0,o-y),h.bezierCurveTo(-g*.52,o-y,-g+y,_+v*.52,-g+y,_),h.lineTo(-g+y,-.2),h.closePath();let b=d.depth??.48,x=new Mo(h,{depth:b,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:.045,bevelThickness:.04,curveSegments:24});if(x.translate(0,0,-b/2),d.opening){let e=x;x=If(x,Math.PI/3),e!==x&&e.dispose(),C.paintOpeningStone(x)}let S=u.clone();S.transparent=!0,i.add(S);let w=k(x,S,p);w.userData.cameraOccluder=!0,a.push(w),w.castShadow=!0;let T=m.map(([e,t,n])=>[e*.94,t,n-.11]);d.trim!==!1&&k(zh(T,.018,100,5),f,p);for(let e of d.feet===!1?[]:[-r/2,r/2]){let t=k(new Io([new W(.32,-.3),new W(.34,-.05),new W(.27,.09),new W(.18,.26)],24),s,p,[e,0,0]);t.castShadow=!0,t.scale.setScalar(d.footScale??1),M(e,0,1.25,.95,p,-.14)}return p}let he=me(-.6,-6.5,5.5,4.9,.2,C.openingStone,{band:.19,depth:.3,opening:!0,trim:!1,feet:!1});he.name=`opening-path-arch`,me(1.1,-22.5,5.8,4.9,-.18);let ge=me(0,-49,9.8,5.6,0,C.stoneMaterials[0],{band:.2,depth:.32,footScale:.8});ge.name=`finale-shore-arch`;for(let[t,n,r,i]of[[-3.8,-10,2.8,.4],[4.5,-19,2.2,-.35],[-3.2,-35,2.9,-.5],[4.4,-41,2.5,.25]]){let a=new K;a.position.set(t,0,n),a.rotation.y=i,e.add(a);for(let e=0;e<4;e++){let t=k(new da(r/4-.045,.48+e%3*.15,.58),l,a,[(e-1.5)*r/4,.22,0]);t.rotation.z=(e-1.5)*.025,t.castShadow=!0}k(zh([[-r/2,.5,0],[0,.75,.08],[r/2,.5,0]],.018,20,4),f,a)}let _e=me(-3.4,-2.9,4.4,3.5,-.22,C.openingStone,{band:.17,depth:.28,opening:!0,fragment:!0,trim:!1,feet:!1});_e.name=`opening-shore-rib`;let ve=o(11450284,{transparent:!0,opacity:.38,side:2,roughness:.82,depthWrite:!1});ve.forceSinglePass=!0;let ye=k(Rh(32,24,(e,t)=>[(t-.5)*.56,2.8-e*1.95-Math.sin(t*Math.PI)*.07,Math.sin(t*Ph*1.4+e*.6)*(.025+.04*e)+.16*e*e]),ve,e,[-4.85,0,-3.4]);ye.rotation.y=-.22,n.push({kind:`drape`,object:ye,base:-.22});let be=new K;be.position.set(0,0,-73),e.add(be);for(let e=0;e<9;e++){let t=(e/8-.5)*Math.PI*.87,n=Math.sin(t)*13,r=Math.cos(t)*-5,i=[[n,-.3,r],[n*1.12,4,r-1.4],[n*.78,10.8-Math.abs(t)*1.8,r-2.2],[n*.12,13,r-1.4]];k(zh(i,.11,70,8),u,be),k(zh(i.map(e=>[e[0]+.1,e[1],e[2]]),.015,70,5),f,be)}let xe=A(5.5,.028,d,be,10.1);xe.rotation.x=-.25;function Se(t,n,r=.38,i=e){let a=new K;a.position.set(t,.08,n),i.add(a);let o=[new W(0,0),new W(r*.42,.03),new W(r*.62,.08),new W(r*.78,.32),new W(r,.6),new W(r*1.02,.67)];return k(new Io(o,40),v,a),A(r*1.02,.014,f,a,.67),A(r*.62,.018,d,a,.08),a}let Ce=Se(-3,-14,.4),we=Se(3,-18,.4);M(-3,-14,1.4,1.1),M(3,-18,1.4,1.1);for(let e=0;e<3;e++){let t=k(Bh(.44,.14,.25),h,we,[0,.15,0]);t.rotation.y=e*Ph/3}let Te=A(.65,.016,x,we,.075),Ee=A(.63,.012,b,Ce,.075),De=new K;De.position.set(0,.07,-16),e.add(De),k(new Ho(.79,32,18),s,De).scale.set(1,.33,1),A(.8,.018,f,De,.08);let Oe=k(Bh(1.8,.5,.9),u,De,[0,.06,-.65]);Oe.rotation.z=-.3,M(0,-16,2.55,2.4);let ke=new Bi({color:11123154,transparent:!0,opacity:.48,depthWrite:!1});i.add(ke);for(let t of[-1,1]){let n=new Ea([new G(-3,.086,-14),new G(-1.8,.086,-16+t*1.7),new G(1.3,.086,-16+t*1.8),new G(3,.086,-18)]),r=new Ji(new Xr().setFromPoints(n.getPoints(80)),ke);e.add(r);for(let t=1;t<5;t++){let r=n.getPoint(t/5),i=k(new Ho(.026,8,6),b,e,[r.x,r.y+.02,r.z]);i.scale.y=.35}}let z=new K;e.add(z);let Ae=k(new Fo(.13,2),x,z),je=k(new Fo(.22,1),v,z);je.rotation.z=.3;let Me=k(new Uo(.28,.008,4,36),b,z);Me.rotation.x=.9;function B(t,r,i){let a=new K;if(a.position.set(t,.08,r),e.add(a),i===`table`){let e=k(new Io([new W(.39,-.32),new W(.25,.13),new W(.17,.42),new W(.54,.55),new W(.57,.61),new W(0,.64)],32),s,a);e.castShadow=!0;let t=k(Bh(.48,.29,.025),u,a,[0,.66,-.22]);t.rotation.y=.5,k(new Ho(.075,16,12),f,a,[.03,.72,.02]).scale.y=.25}else if(i===`leaf`)k(Bh(.92,.31,.28),d,a,[0,.04,-.4]).rotation.y=-.5,j([[0,.03,-.4],[0,.2,0],[.1,.22,.44]],f,a,.011);else if(i===`echo`)for(let e=0;e<3;e++){let t=Se((e-1)*.36,0,.18+e*.035,a);t.position.y=.12+e%2*.1}else{A(.53,.022,d,a,.07);for(let e=0;e<3;e++){let t=k(new Lo(.09),f,a,[Math.cos(e*Ph/3)*.32,.17,Math.sin(e*Ph/3)*.32]);t.scale.y=.45}}let o=k(new Ho(.035,10,8),x,a,[0,.92,0]);return M(0,0,i===`table`?1.65:1.2,1.1,a,r===3||r===-3?-.22:-.007),n.push({kind:`signal`,object:o,base:.92,phase:t+r}),a}B(-3,3,`table`),B(3,-3,`leaf`),B(-4,-16,`echo`),B(-5,-29,`protocol`);let Ne=new K;Ne.name=`player-seed`,e.add(Ne);let V=k(new Ho(.13,20,14),x,Ne,[0,.28,0]);V.scale.set(.8,1.35,.8);let Pe=new K;Ne.add(Pe);for(let e=0;e<3;e++){let t=k(Bh(.38,.12,.19),d,Pe,[0,.14,0]);t.rotation.y=e*Ph/3,t.rotation.x=-.7}let Fe=A(.24,.009,f,Ne,.16),Ie=A(.34,.013,b,Ne,.075),Le=-100,Re=new K;Re.name=`companion-four-petal`,Re.position.set(1.5,1.3,2.4),e.add(Re);let ze=new K;Re.add(ze);let Be=k(new Ho(.065,14,10),x,ze),Ve=[];for(let e=0;e<4;e++){let t=new K;t.rotation.y=e*Ph/4+Math.PI/4,ze.add(t);let n=k(Bh(.33,.12,.1),e%2?_:g,t);Ve.push(n)}let He={};function Ue(t,n,r,i){let a=new K;a.position.set(n,.08,r),e.add(a),C.decorateVessel(t,a),M(0,0,1.8,1.5,a,-.007);let o=k(new Fo(.12,2),i,a,[0,.77,0]),s=new K;s.position.y=.82,a.add(s);for(let e=0;e<6;e++){let t=k(Bh(.75,.23,.3),i,s);t.rotation.y=e*Ph/6,t.rotation.x=-.24}let c=A(.9,.018,i,a,1.24);c.rotation.x=-.4,c.visible=!1,He[t]={vessel:a,petals:s,halo:c,center:o}}Ue(`memory`,-3,-46,b),Ue(`season`,0,-48,S),Ue(`voyage`,3,-46,x);let We=new K;We.position.set(-3,1.45,-46),e.add(We);for(let e=0;e<3;e++)k(new Uo(.95+e*.14,.009,4,80,Math.PI*1.65),b,We).rotation.set(.4+e*.7,e*.8,e*.7);We.visible=!1;let Ge=new K;Ge.position.set(0,.075,-48),e.add(Ge);for(let e=0;e<7;e++){let t=e/7*Ph,n=new K;n.position.set(Math.cos(t)*.95,0,Math.sin(t)*.95),Ge.add(n),j([[0,0,0],[.03,.22,0],[0,.38,.03]],h,n,.014);for(let e=0;e<3;e++){let t=k(Bh(.27,.085,.12),h,n,[0,.08,0]);t.rotation.y=e*Ph/3;let r=k(Bh(.19,.075,.08),g,n,[0,.38,.03]);r.rotation.y=e*Ph/3}k(new Ho(.035,8,6),x,n,[0,.4,.03])}Ge.visible=!1;let Ke=new K;Ke.position.set(3,1.25,-46),e.add(Ke);let qe=new si({color:13285862,transparent:!0,opacity:.48,depthWrite:!1});i.add(qe);for(let e=0;e<3;e++){let t=e*Math.PI/3,n=[];for(let e=0;e<=30;e++){let r=e/30*Math.PI;n.push([Math.cos(r)*.68*Math.cos(t),Math.sin(r)*.65,Math.cos(r)*.68*Math.sin(t)])}k(zh(n,.012,36,4),qe,Ke)}let Je=k(new Ho(.05,10,6),x,Ke);Ke.visible=!1;let Ye=new K;Ye.position.set(0,.2,-32),e.add(Ye);let Xe=new si({color:13229295,transparent:!0,opacity:.24,depthWrite:!1,side:2});Xe.forceSinglePass=!0,i.add(Xe);let Ze=[];j([[0,0,0],[-.04,.55,.02],[0,1,0]],Xe,Ye,.016);for(let e=0;e<6;e++){let t=new K;t.position.y=1,t.rotation.y=e*Ph/6,Ye.add(t);let n=k(Bh(.83,.23,.29),Xe,t);Ze.push(n)}let Qe=[];for(let e=0;e<3;e++)Qe.push(A(.85,.009,Xe,Ye,.25+e*.5));Ye.visible=!1;let $e=new ji(new Ho(.045,8,6),x,34);$e.instanceMatrix.setUsage(at),$e.visible=!1,$e.frustumCulled=!1,e.add($e);let et=Array.from({length:34},()=>({phase:t(),angle:t()*Ph,speed:.75+t()*.5,sway:t()*.6})),tt=new Un,nt=new ji(Bh(.65,.075,.33,9,3),h,70),rt=Bh(.31,.1,.018,9,3),it=rt.getAttribute(`position`);for(let e=0;e<it.count;e++)it.setY(e,it.getY(e)*.13);rt.computeVertexNormals();let ot=new ji(rt,o(6650738,{roughness:.92,side:2}),18);ot.name=`opening-waterline-petals`;let st=0,ct=0;for(let[e,n,r]of[[0,0,6.8]])for(let i=0;i<70;i++){let a=Math.floor(i/10)/7*Ph+t()*.34,o=r*(n===0?.89+t()*.09:.77+t()*.17),s=e+Math.cos(a)*o,c=n+Math.sin(a)*o;tt.position.set(s,.065,c),tt.rotation.set(-.4-t()*.5,t()*Ph,t()*.3-.15),tt.scale.setScalar(.35+t()*.45),tt.updateMatrix(),nt.setMatrixAt(st++,tt.matrix)}for(let e=0;e<18;e++){let n=e<11,r=n?e/10:(e-11)/6,i=(n?3.48+r*.92:.2+r*.52)+(t()-.5)*.075,a=(n?4.55:4.8)+Math.sin(r*Math.PI)*.35+(t()-.5)*.2;tt.position.set(Math.cos(i)*a,-.172,Math.sin(i)*a),tt.rotation.set(0,-i+.4+t()*.5,0),tt.scale.setScalar(.7+t()*.5),tt.updateMatrix(),ot.setMatrixAt(ct++,tt.matrix)}e.add(nt,ot),nt.instanceMatrix.needsUpdate=ot.instanceMatrix.needsUpdate=!0,nt.computeBoundingSphere(),ot.computeBoundingSphere();let lt=new K;lt.position.set(0,.06,-46),e.add(lt);for(let e=0;e<14;e++){let n=e/14*Ph,r=new K;r.position.set(Math.cos(n)*(4.5+t()*.35),0,Math.sin(n)*(4.5+t()*.35)),lt.add(r);let i=.25+t()*.35;j([[0,0,0],[.03,i*.6,.03],[0,i,0]],h,r,.014);for(let e=0;e<4;e++){let t=k(Bh(.23,.09,.09),g,r,[0,i,0]);t.rotation.y=e*Ph/4}k(new Ho(.035,8,6),x,r,[0,i+.02,0])}lt.visible=!1;let ut=Vh();e.add(ut);let dt=[{id:`hero`,label:`初醒之花`,x:0,y:2,z:0,kind:`flower`},{id:`wind`,label:`循风花杯`,x:0,y:.6,z:-16,kind:`wind`},{id:`pool`,label:`归形之池`,x:0,y:1,z:-32,kind:`pool`},{id:`finale`,label:`春信花座`,x:0,y:1,z:-46,kind:`finale`},{id:`discover-table`,label:`未寄出的信`,x:-3,y:.7,z:3,kind:`discovery`},{id:`discover-leaf`,label:`银叶里的旧春`,x:3,y:.25,z:-3,kind:`discovery`},{id:`discover-echo`,label:`杯纹回声`,x:-4,y:.65,z:-16,kind:`discovery`},{id:`discover-protocol`,label:`方舟的约定`,x:-5,y:.3,z:-29,kind:`discovery`}],ft=new Set;function pt(t,n=new Set,r=!1){e.updateMatrixWorld(!0);let i=t.matrixWorld.clone().invert(),a=new Map;function o(e){if(!(n.has(e)||e.userData.cameraOccluder)){if(e.isMesh&&!e.isInstancedMesh&&!Array.isArray(e.material)){let t=new gn().multiplyMatrices(i,e.matrixWorld),n=e.geometry.clone().applyMatrix4(t);n.computeBoundingSphere();let o=r?Math.floor((n.boundingSphere.center.z+8)/16):0,s=`${e.material.uuid}:${o}:${e.renderOrder}`;a.has(s)||a.set(s,{material:e.material,geometry:[],objects:[],order:e.renderOrder,cast:!1});let c=a.get(s);c.geometry.push(n),c.objects.push(e),c.cast||=e.castShadow}for(let t of[...e.children])o(t)}}for(let e of[...t.children])o(e);for(let e of a.values()){let n=e.geometry;n.some(e=>!e.index)&&n.some(e=>e.index)&&(n=n.map(e=>{if(!e.index)return e;let t=e.toNonIndexed();return e.dispose(),t}));let r=Nf(n,!1);for(let e of n)e.dispose();if(!r)continue;r.computeBoundingSphere();let i=k(r,e.material,t);i.name=`static-material-batch`,i.renderOrder=e.order,i.castShadow=e.cast;for(let t of e.objects)ft.add(t.geometry),t.removeFromParent()}}let H=[ie,ae,R,oe,se,ce,le,de];for(let e of[...H,Pe,We,Ge,lt])pt(e);for(let e of Object.values(He))pt(e.petals);pt(e,new Set([...H,Ne,Re,z,Ee,Te,...n.map(e=>e.object),...I,...Object.values(He).flatMap(e=>[e.petals,e.halo,e.center]),We,Ge,lt,Ke,Ye,$e,ut,nt,ot,...C.dynamic]),!0);let U=new Set;e.traverse(e=>{e.geometry&&U.add(e.geometry)});for(let e of ft)U.has(e)||e.dispose();e.userData.staticBatches=!0;let mt=new G,ht=0,gt=!1,_t=null,vt=0,yt=!1,bt=-100,xt=!1,St=-100,Ct=`none`,wt=-100,Tt=!0;function Et(e=0,t=0,i={}){if(gt)return;ht=Number.isFinite(e)?e:ht;let a=Fh(Number.isFinite(t)?t:0,0,.1),o=i.settings?.reducedMotion===!0;C.update(ht,o);let s=o?.2:1,c=ht*s;ie.visible=!!i.p1?.solved,ae.visible=R.visible=!!i.wind?.solved,oe.visible=i.bridge?.structure===`bridge_am`,se.visible=i.bridge?.structure===`bridge_mf`,ce.visible=i.bridge?.structure===`shield_rm`,de.visible=!!i.wind?.solved,le.visible=!!i.bridge?.solved,i.p1?.solved&&!yt&&(bt=ht),yt=!!i.p1?.solved;for(let e=0;e<I.length;e++){let t=ht-bt-e*.68,n=I[e];n.visible=t>=0&&t<2.3,n.material.opacity=n.visible?Math.sin(Math.min(1,t/2.3)*Math.PI)*.68:0,n.scale.setScalar(1+Math.max(0,t)*.18)}i.wind?.solved&&!xt&&(St=ht),xt=!!i.wind?.solved;let l=i.bridge?.structure||`none`;if(l!==Ct){for(let e of ue)e.path.visible&&(e.start=ht);Ct=l}for(let e of ue){let t=Wt.smoothstep(ht-e.start,0,.7);for(let n of e.materials)n.opacity=.22+t*.78}if(ut.material.uniforms.uTime.value=ht,typeof i.night==`boolean`||typeof i.night==`number`){let e=Number(i.night);ut.material.uniforms.uNight.value+=(e-ut.material.uniforms.uNight.value)*(1-Math.exp(-a*3))}let u=Number.isFinite(i.wind?.x)?i.wind.x:-3,d=Number.isFinite(i.wind?.z)?i.wind.z:2;z.position.set(u,.72+Math.sin(c*1.9)*.045,d-16),Me.rotation.y=c*.5,je.rotation.y=-c*.3,Ae.scale.setScalar(1+Math.sin(c*2.1)*.07),Te.scale.setScalar(i.wind?.solved?1.12:1),Ee.visible=!i.wind?.solved,Pe.rotation.y=c*.18,V.position.y=.28+Math.sin(c*2)*.025,Fe.rotation.z=Math.sin(c*.8)*.12,Ie.scale.setScalar(1+Math.sin(c*2)*.07);let f=!!i.companion?.awakened,p=f?.65:1.35;mt.set(Ne.position.x+Math.cos(c*.35)*p,Ne.position.y+(f?.9:1.3)+Math.sin(c*1.5)*.11,Ne.position.z+Math.sin(c*.35)*p+.35),Re.position.lerp(mt,1-Math.exp(-a*(f?3:1.2))),ze.rotation.y=-c*.3,ze.rotation.z=Math.sin(c*1.2)*.12;for(let e=0;e<Ve.length;e++)Ve[e].rotation.x=-.1+Math.sin(c*3.3+e*.3)*.16;let m=ht-St;if(m>=0&&m<2.72){let e=Math.floor(m/.68),t=Math.sin(m%.68/.68*Math.PI);e<3&&Ae.scale.setScalar(1+t*.55),Be.scale.setScalar(e===3?1+t*1.25:1)}else Be.scale.setScalar(1);let h=ht-Le;h>=0&&h<1.4&&Be.scale.setScalar(1+Math.sin(h/1.4*Math.PI)*2);let g=Math.hypot(Ne.position.x,Ne.position.z+32);g>2.6&&(Tt=!0),g<1.5&&Tt&&i.wind?.solved&&(wt=ht,Tt=!1);let _=ht-wt;if(Ye.visible=_>=0&&_<7.5,Ye.visible){Xe.opacity=.29*Math.min(1,_*1.4)*Math.min(1,(7.5-_)*1.4);let e=Wt.smoothstep(_,1.3,5.8);for(let t of Ze)t.rotation.x=-.18-e*1.03;for(let e=0;e<Qe.length;e++)Qe[e].position.y=(_*.23+e*.52)%1.7,Qe[e].scale.setScalar(.85+Math.sin(_*.4+e)*.1)}for(let e of n)e.kind===`drape`?e.object.rotation.y=e.base+Math.sin(c*.33)*.013:e.object.position.y=e.base+Math.sin(c*1.4+e.phase)*.045;for(let{material:e,base:t}of r)e.emissiveIntensity=t*(1+Math.sin(c*.85)*.1);let v=Array.isArray(i.cores)?i.cores:[];for(let[e,t]of Object.entries(He)){let n=v.includes(e),r=n?1:.32;t.petals.scale.lerp(mt.set(r,r,r),1-Math.exp(-a*5)),t.center.visible=n,t.halo.visible=n,t.halo.rotation.y=c*.15}let y=typeof i.ending==`string`?i.ending:null;y!==_t&&(_t=y,vt=ht),Ge.visible=v.includes(`season`),lt.visible=!!y?.includes(`season`),We.visible=v.includes(`memory`)||!!y?.includes(`memory`),We.scale.setScalar(y?.includes(`memory`)?1.25:.67),We.rotation.y=c*.07,Ke.visible=v.includes(`voyage`)&&!y;let b=c*.8%Math.PI;if(Je.position.set(Math.cos(b)*.68,Math.sin(b)*.65,0),$e.visible=!!y?.includes(`voyage`),$e.visible){let e=Math.max(0,ht-vt)*s;for(let t=0;t<34;t++){let n=et[t],r=(e*n.speed+n.phase*9)%12,i=r*.22;tt.position.set(3+Math.cos(n.angle+r*.22)*i,1.1+r*.7,-46-r*.65+Math.sin(n.angle)*i),tt.rotation.set(r,n.angle,.4);let a=Math.min(1,r*2)*Math.min(1,(12-r)*.6);tt.scale.set(a,a*1.6,a),tt.updateMatrix(),$e.setMatrixAt(t,tt.matrix)}$e.instanceMatrix.needsUpdate=!0}}function Dt(e,t,n=1){if(gt||!Number.isFinite(e+t+n))return;let r=ut.userData.waveIndex;ut.material.uniforms.uWaves.value[r].set(e,t,ht,Fh(n,0,2)),ut.userData.waveIndex=(r+1)%8}function Ot(){if(gt)return;gt=!0;let t=new Set,n=new Set(i),r=new Set;e.traverse(e=>{if(e.geometry&&t.add(e.geometry),e.material)for(let t of Array.isArray(e.material)?e.material:[e.material])n.add(t)});for(let e of n){for(let t of Object.values(e))t?.isTexture&&r.add(t);e.dispose()}for(let e of t)e.dispose();for(let e of r)e.dispose();e.removeFromParent(),e.clear()}Et(0,0,{});function kt(e,t){for(let n of[s,c,l,p,m,...C.stoneMaterials,...a.map(e=>e.material)])n.normalMap=e,n.normalScale.set(.12,.12),n.roughnessMap=t,n.needsUpdate=!0}return{respond(){Le=ht},cameraOccluders:a,group:e,flowers:[],targets:dt,water:ut,player:Ne,companion:Re,update:Et,ripple:Dt,dispose:Ot,setStoneTextures:kt}}var Uh=class e extends yi{constructor(t,n={}){super(t),this.isReflector=!0,this.type=`Reflector`,this.forceUpdate=!1,this._reflectionCameras=new WeakMap;let r=this,i=n.color===void 0?new q(8355711):new q(n.color),a=n.textureWidth||512,o=n.textureHeight||512,s=n.clipBias||0,c=n.shader||e.ReflectorShader,l=n.multisample===void 0?4:n.multisample,u=new Fi,d=new G,f=new G,p=new G,m=new gn,h=new G(0,0,-1),g=new dn,_=new G,v=new G,y=new dn,b=new gn,x=new pn(a,o,{samples:l,type:P}),S=new $o({name:c.name===void 0?`unspecified`:c.name,uniforms:Xo.clone(c.uniforms),fragmentShader:c.fragmentShader,vertexShader:c.vertexShader});S.uniforms.tDiffuse.value=x.texture,S.uniforms.color.value=i,S.uniforms.textureMatrix.value=b,this.material=S,this.onBeforeRender=function(e,t,n){let i=this.getReflectionCamera(n);if(f.setFromMatrixPosition(r.matrixWorld),p.setFromMatrixPosition(n.matrixWorld),m.extractRotation(r.matrixWorld),d.set(0,0,1),d.applyMatrix4(m),_.subVectors(f,p),_.dot(d)>0&&this.forceUpdate===!1)return;_.reflect(d).negate(),_.add(f),m.extractRotation(n.matrixWorld),h.set(0,0,-1),h.applyMatrix4(m),h.add(p),v.subVectors(f,h),v.reflect(d).negate(),v.add(f),i.position.copy(_),i.up.set(0,1,0),i.up.applyMatrix4(m),i.up.reflect(d),i.lookAt(v),i.far=n.far,i.updateMatrixWorld(),i.projectionMatrix.copy(n.projectionMatrix),b.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),b.multiply(i.projectionMatrix),b.multiply(i.matrixWorldInverse),b.multiply(r.matrixWorld),u.setFromNormalAndCoplanarPoint(d,f),u.applyMatrix4(i.matrixWorldInverse),g.set(u.normal.x,u.normal.y,u.normal.z,u.constant);let a=i.projectionMatrix;i.isOrthographicCamera?(y.x=(Math.sign(g.x)+a.elements[8])/a.elements[0],y.y=(Math.sign(g.y)+a.elements[9])/a.elements[5],y.z=-n.far,y.w=1):(y.x=(Math.sign(g.x)+a.elements[8])/a.elements[0],y.y=(Math.sign(g.y)+a.elements[9])/a.elements[5],y.z=-1,y.w=(1+a.elements[10])/a.elements[14]),g.multiplyScalar(2/g.dot(y)),a.elements[2]=g.x,a.elements[6]=g.y,i.isOrthographicCamera?(a.elements[10]=g.z-s,a.elements[14]=g.w-1):(a.elements[10]=g.z+1-s,a.elements[14]=g.w),r.visible=!1;let o=e.getRenderTarget(),c=e.xr.enabled,l=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(x),e.state.buffers.depth.setMask(!0),e.autoClear===!1&&e.clear(),e.render(t,i),e.xr.enabled=c,e.shadowMap.autoUpdate=l,e.setRenderTarget(o);let S=n.viewport;S!==void 0&&e.state.viewport(S),r.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return x},this.dispose=function(){x.dispose(),r.material.dispose()},this.getReflectionCamera=function(e){let t=this._reflectionCameras.get(e);return t===void 0&&(t=e.clone(),this._reflectionCameras.set(e,t)),t}}};Uh.ReflectorShader={name:`ReflectorShader`,uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};function Wh({renderer:e,scene:t,camera:n,water:r,exclude:i=[]}){let a=new Uh(new Ro(140,140),{textureWidth:768,textureHeight:768,multisample:2,clipBias:.004});a.rotation.x=-Math.PI/2,a.position.copy(r.position),a.updateMatrixWorld(!0);let o=new gn,s=a.matrixWorld.clone().invert();Object.assign(r.material.uniforms,{uReflection:{value:a.getRenderTarget().texture},uReflectionMatrix:{value:o},uReflectionAmount:{value:0}});let c=!0,l=!1,u=768;function d(d=`balanced`,f=!0){if(c=d!==`light`&&f&&!l,r.material.uniforms.uReflectionAmount.value=+!!c,!c)return;let p=d===`delicate`?1024:768;p!==u&&(a.getRenderTarget().setSize(p,p),u=p),n.updateMatrixWorld(),t.updateMatrixWorld();let m=[r,...i],h=m.map(e=>e.visible);m.forEach(e=>{e.visible=!1});try{a.onBeforeRender(e,t,n),o.copy(a.material.uniforms.textureMatrix.value).multiply(s)}finally{m.forEach((e,t)=>{e.visible=h[t]})}}return{update:d,get enabled(){return c},dispose(){l||(l=!0,a.dispose(),a.geometry.dispose())}}}var Gh={garden:{tones:[130.81,196,329.63],air:.018,filter:850,notes:[523.25,659.25,392,587.33]},wind:{tones:[146.83,220,349.23],air:.032,filter:1450,notes:[440,587.33,698.46,523.25]},pool:{tones:[110,164.81,261.63],air:.011,filter:580,notes:[329.63,392,523.25,440]},finale:{tones:[130.81,196,293.66],air:.015,filter:1050,notes:[392,523.25,659.25,783.99]}},Kh=(e,t)=>Number.isFinite(e)?e:t,qh=(e,t,n)=>Math.min(n,Math.max(t,e));function Jh(){let e=null,t=null,n=null,r=null,i=null,a=!1,o=!1,s=!1,c=-1/0,l=[],u=13,d=0,f=``,p={zone:`garden`,night:0,opening:!1,branch:!1,ended:!1},m=[],h=new Set,g=new Set,_=new Set,v=()=>e?.currentTime||0,y=()=>!!e&&!s&&!a&&!o&&e.state===`running`;function b(e,t=!1){return h.add(e),t&&g.add(e),e}function x(e){let t=v();if(typeof e.cancelAndHoldAtTime==`function`)e.cancelAndHoldAtTime(t);else{let n=e.value;e.cancelScheduledValues(t),e.setValueAtTime(n,t)}}function S(e,t,n=.08){x(e),e.setTargetAtTime(t,v(),n)}function C(e){if(!e.cleaned){e.cleaned=!0;for(let t of e.nodes)try{t.disconnect()}catch{}_.delete(e)}}function w(e,t=0){if(e.cleaned)return;let n=v();x(e.envelope.gain),t?e.envelope.gain.setTargetAtTime(0,n,t/4):e.envelope.gain.setValueAtTime(0,n);for(let r of e.sources)try{r.stop(n+t)}catch{}t||C(e)}function T(e=0){l=[],u=13;for(let t of[..._])w(t,e)}function E(r,i,a,o={},s=!1){if(!y()||(r=qh(Kh(r,440),60,2400),i=qh(Kh(i,1.4),.08,6),a=qh(Kh(a,.3),0,.6),a<=0))return!1;for(o=o&&typeof o==`object`?o:{};_.size>=10;)w(_.values().next().value);let c=v(),l=e.createGain(),u=[],d=[l],f={envelope:l,sources:u,nodes:d,cleaned:!1},p=o.kind===`cup`,m=p?.006:o.kind===`air`?.16:.018;l.gain.setValueAtTime(1e-4,c),l.gain.linearRampToValueAtTime(a,c+Math.min(m,i*.2)),l.gain.exponentialRampToValueAtTime(1e-4,c+i);let h=l;if(typeof e.createStereoPanner==`function`){let t=e.createStereoPanner();t.pan.setValueAtTime(qh(Kh(o.pan,0),-1,1),c),l.connect(t),d.push(t),h=t}h.connect(s?n:t);let g=e.createOscillator();if(g.type=`sine`,g.frequency.setValueAtTime(r,c),g.connect(l),u.push(g),d.push(g),p){let t=e.createOscillator(),n=e.createGain();t.type=`sine`,t.frequency.setValueAtTime(r*2.76,c),n.gain.setValueAtTime(.09,c),t.connect(n),n.connect(l),u.push(t),d.push(t,n)}_.add(f),g.onended=()=>C(f);for(let e of u)e.start(c),e.stop(c+i+.03);return!0}function D(){n=b(e.createGain()),n.gain.value=0,n.connect(t);for(let t=0;t<3;t++){let r=b(e.createOscillator(),!0),i=b(e.createGain());if(r.type=`sine`,r.frequency.value=Gh.garden.tones[t],r.detune.value=[-2.5,2,.8][t],i.gain.value=0,r.connect(i),typeof e.createStereoPanner==`function`){let r=b(e.createStereoPanner());r.pan.value=[-.32,.3,0][t],i.connect(r),r.connect(n)}else i.connect(n);m.push({oscillator:r,gain:i}),r.start()}let a=Math.floor(e.sampleRate*4),o=e.createBuffer(1,a,e.sampleRate),s=o.getChannelData(0),c=9127,l=0;for(let e=0;e<a;e++){c=Math.imul(c,1664525)+1013904223>>>0;let t=c/2147483648-1;l=l*.97+t*.03,s[e]=(l*2.6+t*.04)*Math.min(1,e/512,(a-e-1)/512)}let u=b(e.createBufferSource(),!0);u.buffer=o,u.loop=!0,r=b(e.createBiquadFilter()),r.type=`lowpass`,r.Q.value=.3,i=b(e.createGain()),i.gain.value=0,u.connect(r),r.connect(i),i.connect(n),u.start()}function O(){if(!e||s||o)return;let n=e;Promise.resolve(n.resume()).then(()=>{s||e!==n||(o?n.suspend().catch(()=>{}):S(t.gain,a?0:.13,.12))}).catch(()=>{})}function k(){if(s)return!1;if(!e){let n=globalThis.window?.AudioContext||globalThis.window?.webkitAudioContext;if(!n)return!1;try{e=new n}catch{return!1}t=b(e.createGain()),t.gain.value=0,t.connect(e.destination),D()}return o||O(),!0}function A(e=440,t=1.4,n=.3,r={}){if(!y()||v()-c<.045)return!1;let i=E(e,t,n,r);return i&&(c=v()),i}function j(){y()&&(l=[261.63,392,523.25,659.25].map((e,t)=>({frequency:e,remaining:t*.14})))}function M(e,t={}){if(s)return;if(p={zone:Object.hasOwn(Gh,t.zone)?t.zone:p.zone,night:t.night===void 0?p.night:qh(Kh(Number(t.night),0),0,1),opening:t.opening===void 0?p.opening:!!t.opening,branch:t.branch===void 0?p.branch:!!t.branch,ended:t.ended===void 0?p.ended:!!t.ended},!y()){l=[];return}let a=qh(Kh(e,0),0,.1),o=Gh[p.zone],h=v();for(let e of l)e.remaining-=a;for(;l.length&&l[0].remaining<=0;)E(l.shift().frequency,2.2,.22),c=h;let g=h-c<.8,_=[p.zone,Math.round(p.night*20),p.opening,p.branch,p.ended,g].join(`:`);if(_!==f){f=_;let e=1-p.night*.18,t=(p.opening?.32:p.branch?.26:p.ended?.7:.58)*(g?.48:1);S(n.gain,t,.6),m.forEach(({oscillator:t,gain:n},r)=>{S(t.frequency,o.tones[r],1.4),S(n.gain,[.035,.017,.009][r]*e,.9)}),S(r.frequency,o.filter*(1-p.night*.2),1.4),S(i.gain,o.air*e,.8)}if(u-=a,u<=0){if(p.opening||p.branch||g||l.length)u=1.5;else{let e=d++%o.notes.length;E(o.notes[e],3.6,.052,{pan:[-.35,.3,-.18,.2][e],kind:`air`},!0),u=(p.ended?18:13)+d%4*2.3}}}function N(n){a=!!n,e&&!s&&(a&&T(.025),S(t.gain,a||o?0:.13,.08))}function P(n){o=!!n,e&&!s&&(o?(T(),x(t.gain),t.gain.setValueAtTime(0,v()),e.suspend().catch(()=>{})):O())}function F(){if(!s){s=!0,T();for(let e of g)try{e.stop()}catch{}for(let e of h)try{e.disconnect()}catch{}g.clear(),h.clear(),m.length=0,e?.close().catch(()=>{})}}return{unlock:k,note:A,chime:j,update:M,setMuted:N,pause:P,dispose:F,getStats(){return{state:e?.state||`uninitialized`,muted:a,paused:o,disposed:s,persistentNodes:h.size,persistentSources:g.size,voices:_.size}}}}function Yh({buttons:e,onChange:t=()=>{},onUnavailable:n=()=>{}}){let r=document.documentElement,i=()=>document.fullscreenElement||document.webkitFullscreenElement||null,a=()=>{let n=!!i();for(let t of e)t.setAttribute(`aria-pressed`,String(n)),t.textContent=n?`退出全屏`:`全屏体验`,t.title=n?`退出全屏 · Esc`:`全屏体验 · Alt+Enter`;t(n)};async function o(){try{if(i()){let e=document.exitFullscreen||document.webkitExitFullscreen;e&&await e.call(document)}else{let e=r.requestFullscreen||r.webkitRequestFullscreen;if(!e){n(`此浏览器未提供页面全屏；可继续窗口体验，或使用浏览器的全屏菜单。`);return}await e.call(r)}}catch{n(`浏览器没有允许本次全屏请求，窗口体验仍可继续。`)}a()}for(let t of e)t.addEventListener(`click`,o);return document.addEventListener(`fullscreenchange`,a),document.addEventListener(`webkitfullscreenchange`,a),a(),{toggle:o,isActive:()=>!!i(),dispose(){for(let t of e)t.removeEventListener(`click`,o);document.removeEventListener(`fullscreenchange`,a),document.removeEventListener(`webkitfullscreenchange`,a)}}}var Xh=[{id:`ark`,speaker:`引言`,text:`离开故乡以后，方舟替人们保留了一个春天。`,camera:[9.8,6,12.5],target:[-.5,1,-5],bloom:1,scatter:0},{id:`cups`,speaker:`引言`,text:`花记得雨。两只杯子，记得有人曾在这里等过。`,camera:[-1.4,2.8,6],target:[-2,.5,1.3],bloom:1,scatter:0},{id:`birth`,speaker:`引言`,text:`风暴过去，修复中的花尘结出一枚新种荚。`,camera:[5.4,3.8,8],target:[.1,2,0],bloom:.72,scatter:.65},{id:`mi`,speaker:`引言`,text:`你叫弥。没有旧日的记忆，却能让花庭回应。`,camera:[2.8,2.1,10],target:[0,.8,5.5],bloom:.4,scatter:.15},{id:`keeper`,speaker:`守园人·岑 / 旧记录`,text:`若有人先到，替我给后来的人留一杯。`,camera:[-1.5,2.5,5],target:[-3.7,.8,1.9],bloom:.22,scatter:0},{id:`begin`,speaker:`此刻`,text:`这朵花还记得风。你走近时，水下的旧路也仿佛轻轻亮了一下。`,camera:[4.2,6.6,13.8],target:[0,1,3.7],bloom:.82,scatter:0}],Zh={rhythm:{title:`留一席`,subtitle:`杯边的六拍`,x:-3.7,y:.85,z:1.9,need:0,text:`旧人留下两只杯子，却给第三个位置留了空。试着写一句自己的杯声。`,reward:`你的六拍在水面留下了新的波纹。第三只杯子，等一位未来的来客。`},light:{title:`光里的地址`,subtitle:`信笺的三处浅痕`,x:-3.8,y:1.2,z:-17.5,need:1,text:`信上没有收信人的姓名。沿着信笺移动光束，让三处浅刻慢慢显影。`,reward:`后来者，有席，此处。原来这封邀请，写给每一个尚未抵达的人。`},memory:{title:`等春的年份`,subtitle:`保形记录架`,x:-5,y:1.15,z:-29,need:2,text:`这一朵花曾合拢着挨过风暴，也曾错过许多晴日。把两段年份都看完，再留下你的姿态。`,reward:`你没有否定当年的保护。你只是为今天，留下一道能让风通过的缝。`}},Qh={1:[`弥 · 送春者`,`我能让花重新回应。但它还记得谁？`],2:[`游絮 · 初次回应`,`三声来自旧杯。第四声，是它自己添上的。`],3:[`岑 / 旧记录`,`那场风太久。我们先把花合上，等一个能落地的地方。`],4:[`弥 · 送春者`,`原来春信不是把昨天寄回去。是问后来的人，愿不愿意一起生活。`]},$h=`<h3>弥 · 新醒来的送春者</h3><p>风暴后的修复花尘孕育了弥。你继承了让花庭回应的能力，却没有继承旧人的记忆。你此刻的任务，是让这座保存故乡季节的方舟恢复往来。</p><h3>游絮 · 有自己节奏的生命</h3><p>它会追随轻轻的牵引，也会在你留出余地时靠近。它不是岑的化身，更不是一个等待被复制的旧人。</p><h3>岑 · 只留在旧记录里的守园人</h3><p>岑曾在风暴中启动保形，让故乡的花活下来。现在可听见的，是他留给后来者的杯声与字迹；这不是实时传来的指令。</p>`;function eg(e){let t=e.branches;return[t.rhythm?`杯边留下了你亲手写的六拍。`:null,t.light?`信笺上的邀请，终于被读到了。`:null,t.memory?`旧花保持着你选择的半开姿态。`:null].filter(Boolean).join(`<br>`)||`仍有一些留白，等下一次停留时慢慢读。`}var tg=e=>Math.min(.05,Math.max(0,Number.isFinite(e)?e:0)),ng=e=>Array.isArray(e)&&e.length===6&&e.every(e=>[0,1,2].includes(e))&&e.some(e=>e!==0);function rg(){return{introSeen:!1,branches:{rhythm:!1,light:!1,memory:!1},motif:[],lightFound:[!1,!1,!1],lightHold:[0,0,0],memorySeen:{closed:!1,open:!1},memoryHold:{closed:0,open:0},memoryBloom:.5,seenChapters:[]}}function ig(e){let t=rg();return!e||typeof e!=`object`||Array.isArray(e)||(t.introSeen=e.introSeen===!0,Array.isArray(e.motif)&&e.motif.length<=6&&e.motif.every(e=>[0,1,2].includes(e))&&(t.motif=[...e.motif]),t.branches.rhythm=e.branches?.rhythm===!0&&ng(t.motif),Array.isArray(e.lightFound)&&e.lightFound.length===3&&(t.lightFound=e.lightFound.map(e=>e===!0)),t.branches.light=t.lightFound.every(Boolean),t.memorySeen={closed:e.memorySeen?.closed===!0,open:e.memorySeen?.open===!0},Number.isFinite(e.memoryBloom)&&(t.memoryBloom=Math.min(1,Math.max(0,e.memoryBloom))),t.branches.memory=e.branches?.memory===!0&&t.memorySeen.closed&&t.memorySeen.open&&t.memoryBloom>=.35&&t.memoryBloom<=.65,Array.isArray(e.seenChapters)&&(t.seenChapters=[...new Set(e.seenChapters.filter(e=>[1,2,3,4].includes(e)))])),t}function ag(e,t){return e.branches.rhythm?{ok:!1,reason:`这段杯声已经留下。可以重听，或继续旅途。`}:[0,1,2].includes(t)?e.motif.length>=6?{ok:!1,reason:`六拍已满，可以试听、留存或重新编写。`}:(e.motif.push(t),{ok:!0}):{ok:!1,reason:`请选择左杯、右杯或留白。`}}function og(e){return ng(e.motif)?(e.branches.rhythm=!0,{ok:!0}):{ok:!1,reason:`写满六拍，并让其中至少一拍响起。其余节奏由你决定。`}}function sg(e,t,n){let r=[0,1,2].includes(t)?t:null;for(let t=0;t<3;t++)e.lightFound[t]||(e.lightHold[t]=t===r?e.lightHold[t]+tg(n):0,e.lightHold[t]>=.65&&(e.lightFound[t]=!0,e.lightHold[t]=.65));return e.branches.light=e.lightFound.every(Boolean),e.branches.light}function cg(e,t,n){if(!Number.isFinite(t))return;let r=t<.15?`closed`:t>.85?`open`:null;for(let t of[`closed`,`open`])e.memorySeen[t]||(e.memoryHold[t]=t===r?e.memoryHold[t]+tg(n):0,e.memoryHold[t]>=.65&&(e.memorySeen[t]=!0))}function lg(e,t){return!e.memorySeen.closed||!e.memorySeen.open?{ok:!1,reason:`先让旧花全合、全开各停留片刻，看看两段年份。`}:!Number.isFinite(t)||t<.35||t>.65?{ok:!1,reason:`留一个仍能保护、也允许生长的中间姿态。`}:(e.memoryBloom=t,e.branches.memory=!0,{ok:!0})}var ug=e=>document.getElementById(e),dg=[`留白`,`左杯`,`右杯`];function fg({getState:e,audio:t,caption:n,toast:r,save:i,project:a,getLightTargets:o,onOpeningStart:s,onOpeningEnd:c,onBranchStart:l,onBranchEnd:u,onReply:d=()=>{}}){let f=null,p=null,m=.5,h=null,g=null,_=0,v=0,y=null,b=null,x=null;function S(){let t=e();return t.bridge.solved?3:t.wind.solved?2:+!!t.p1.solved}function C(){let t=e();return Object.entries(Zh).filter(([,e])=>e.need<=S()&&Math.hypot(t.player.x-e.x,t.player.z-e.z)<2.05).sort((e,n)=>Math.hypot(t.player.x-e[1].x,t.player.z-e[1].z)-Math.hypot(t.player.x-n[1].x,t.player.z-n[1].z))[0]?.[0]||null}function w(){let e=Xh[f.index];ug(`opening-speaker`).textContent=e.speaker,ug(`opening-line`).textContent=e.text,ug(`opening-page`).textContent=`0${f.index+1} / 06`,ug(`opening-next`).textContent=f.index===5?`醒来，走进花庭 →`:`下一段 · Space`,t.note([261.63,329.63,392,523.25,440,293.66][f.index],2,.13)}function T(){f={index:0,elapsed:0},p=null,y=null,s(),ug(`opening`).hidden=!1,w()}function E(){f=null,ug(`opening`).hidden=!0,ug(`opening-progress`).style.width=`0%`}function D(){f&&(E(),e().story.introSeen=!0,c(),i())}function O(){f&&(f.index===5?D():(f.index++,f.elapsed=0,w()))}function k(e){_=e,v=1,e&&t.note(e===1?392:523.25,1.2,.28,{pan:e===1?-.45:.45,kind:`cup`})}function A(){let t=b??e().story.motif;y={notes:t.length?[...t]:[1,1,0,2,2,2],index:0,elapsed:.6}}function j(){let t=e().story;y={notes:t.branches.rhythm?[...t.motif]:[1,1,2],index:0,elapsed:0,reply:!0}}function M(e){t.chime(),i(),n(Zh[e].reward,10),ug(`branch-line`).textContent=Zh[e].reward,F()}function N(t){let n=e().story;if(b===null){r(`先选择改写杯曲，再留下新的六拍。`);return}let a=ag({...n,branches:{...n.branches,rhythm:!1},motif:b},t);a.ok?(n.branches.rhythm||(n.motif=[...b],i()),k(t),F()):r(a.reason)}function P(){let t=e().story,n;if(p===`rhythm`){if(b===null)return;n=og({...t,branches:{...t.branches,rhythm:!1},motif:b}),n.ok&&(t.motif=[...b],t.branches.rhythm=!0,b=null)}else if(p===`memory`)n=lg(t,m);else return;n.ok?M(p):r(n.reason)}function F(){if(!p)return;let t=e().story,n=t.branches[p],r=p===`rhythm`&&b!==null;if(ug(`branch-finish`).hidden=n&&!r||p===`light`,p===`rhythm`){let e=b??t.motif;ug(`branch-task`).innerHTML=`<div class="motif-slots" aria-label="六拍杯曲">${Array.from({length:6},(t,n)=>`<span class="${e[n]===void 0?``:`filled`}" aria-label="第${n+1}拍 ${dg[e[n]]||`未写`}">${e[n]===0?`—`:e[n]===1?`◒`:e[n]===2?`◓`:`·`}</span>`).join(``)}</div>${r?`<div class="beat-pad"><button data-beat="1">左杯 <kbd>1</kbd></button><button data-beat="2">右杯 <kbd>2</kbd></button><button data-beat="0">留白 <kbd>0</kbd></button></div>`:``}<div class="pair"><button id="motif-play">${e.length?r?`试听这一句`:`重听我的杯曲`:`听旧杯示范`}</button>${r?`<button id="motif-reset">重新编写</button>`:`<button id="motif-rewrite">改写杯曲</button>`}</div>${n&&r?`<button id="motif-cancel">保留原曲</button>`:``}`,document.querySelectorAll(`[data-beat]`).forEach(e=>e.onclick=()=>N(Number(e.dataset.beat))),ug(`motif-play`).onclick=A,ug(`motif-reset`)&&(ug(`motif-reset`).onclick=()=>{b=[],y=null,t.branches.rhythm||(t.motif=[],i()),F()}),ug(`motif-rewrite`)&&(ug(`motif-rewrite`).onclick=()=>{b=[],y=null,F()}),ug(`motif-cancel`)&&(ug(`motif-cancel`).onclick=()=>{b=null,y=null,F()}),ug(`branch-status`).textContent=n&&!r?`你留下的六拍，还可以重听或改写。`:n?`改写尚未保存。留下新曲后才会替换原曲；离开仍保留原曲。`:`自由编写六拍，至少让一拍响起。也可以留一点空白，让后来者接一句。`,ug(`branch-finish`).textContent=n?`以这句替换原曲`:`把这句杯声留下`}else p===`light`?(ug(`branch-task`).innerHTML=`<div class="inscription-guides">`+[`左边刻痕`,`中间刻痕`,`右边刻痕`].map((e,n)=>`<button data-inscription="${n}" aria-pressed="false"><span>${t.lightFound[n]?[`后来者`,`有席`,`此处`][n]:e}</span><kbd>${n+1}</kbd><i></i></button>`).join(``)+`</div>`,document.querySelectorAll(`[data-inscription]`).forEach(e=>e.onclick=()=>{h=Number(e.dataset.inscription)}),ug(`branch-status`).textContent=n?`这不是寄给某一个人的地址，而是一个向后来者敞开的席位。`:`在实景刻痕上停留光束；也可按 1 / 2 / 3 定位。光停稳，字才显影。`):(ug(`branch-task`).innerHTML=`<div class="memory-years"><span id="memory-closed">${t.memorySeen.closed?`✓`:`○`} 风暴那年</span><span id="memory-open">${t.memorySeen.open?`✓`:`○`} 晴天以后</span></div><label class="memory-range">合拢 <span>开放</span><input id="memory-bloom" type="range" min="0" max="100" value="${Math.round(m*100)}" aria-label="旧花开放程度"></label><p id="memory-evidence"></p>`,ug(`memory-bloom`).oninput=e=>{m=Number(e.target.value)/100},ug(`branch-status`).textContent=n?`你留下的姿态会保存在记录架上；此处仍可反复观察。`:`把旧花全合、全开各停留片刻，再选择一种仍有余地的中间姿态。`,ug(`branch-finish`).textContent=`留下这道能呼吸的缝`)}function ee(t){if(!Zh[t])return;p=t,h=null,g=null,y=null;let n=e().story;b=t===`rhythm`&&!n.branches.rhythm?[...n.motif]:null,m=n.memoryBloom,l(t),ug(`context-label`).textContent=Zh[t].title,ug(`branch-subtitle`).textContent=Zh[t].subtitle,ug(`branch-line`).textContent=n.branches[t]?Zh[t].reward:Zh[t].text,F()}function te(){p=null,h=null,g=null,y=null,b=null;let t=e().story;m=t.memoryBloom,t.lightHold=[0,0,0],t.memoryHold={closed:0,open:0}}function ne(e){return f?(e===`Space`?O():e===`Escape`&&D(),!0):p?p===`rhythm`&&[`Digit0`,`Digit1`,`Digit2`].includes(e)?(N(Number(e.at(-1))),!0):p===`light`&&[`Digit1`,`Digit2`,`Digit3`].includes(e)?(h=Number(e.at(-1))-1,!0):!1:!1}function I(n,{pointer:r,active:s,orbiting:c}){let l=e().story,u=r&&x&&(r.x!==x.x||r.y!==x.y);if(r&&(x={x:r.x,y:r.y}),f&&(f.elapsed+=n,ug(`opening-progress`).style.width=`${Math.min(100,f.elapsed/8*100)}%`,f.elapsed>=8&&O()),v=Math.max(0,v-n*2.5),y&&(y.elapsed+=n,y.elapsed>=.6&&(y.elapsed=0,y.index<y.notes.length?k(y.notes[y.index++]):((y.reply||l.branches.rhythm)&&e().companion.awakened&&(t.note(659.25,1.5,.2),d()),y=null))),p===`light`){let e=o(),d=h;if(s&&!c&&r&&u){d=null;let t=64;e.forEach((e,n)=>{let i=a(e.x,e.y,e.z),o=Math.hypot(i.x-r.x,i.y-r.y);o<t&&(t=o,d=n)}),h=d}g=d===null?null:e[d]||null;let f=l.lightFound.filter(Boolean).length,p=l.branches.light;sg(l,d,n),l.lightFound.filter(Boolean).length!==f&&(t.note([392,523.25,659.25][d],1.6,.2),i(),F()),document.querySelectorAll(`[data-inscription]`).forEach((e,t)=>{e.setAttribute(`aria-pressed`,String(d===t)),e.querySelector(`i`).style.width=`${l.lightFound[t]?100:l.lightHold[t]/.65*100}%`}),!p&&l.branches.light&&M(`light`)}else if(p===`memory`){let e=Number(l.memorySeen.closed)+Number(l.memorySeen.open);cg(l,m,n),e!==Number(l.memorySeen.closed)+Number(l.memorySeen.open)&&(i(),t.note(m<.5?261.63:523.25,1.8,.2)),ug(`memory-closed`).textContent=`${l.memorySeen.closed?`✓`:`○`} 风暴那年`,ug(`memory-open`).textContent=`${l.memorySeen.open?`✓`:`○`} 晴天以后`,ug(`memory-evidence`).textContent=m<.15?`花瓣合拢，风暴里的种子被保护了。`:m>.85?`花瓣打开，外面的年轮继续向前；留在花心里的时光，曾经停得太久。`:`花仍有遮护，也为新来的风留下一道缝。`}}return ug(`opening-next`).onclick=O,ug(`opening-skip`).onclick=D,ug(`branch-finish`).onclick=P,ug(`nearby-branch`).onclick=()=>{let e=C();e&&ee(e)},{startOpening:T,cancelOpening:E,finishOpening:D,nextOpening:O,openBranch:ee,exitBranch:te,nearby:C,handleKey:ne,update:I,playMotif:A,playFarewell:j,get opening(){return f?{...Xh[f.index],index:f.index,progress:(f.index+f.elapsed/8)/6}:null},get branch(){return p},get presentation(){return{lightSweep:g,memoryBloom:p===`memory`?m:e().story.memoryBloom,beatValue:_,beatPulse:v}},dispose(){te(),f=null}}}var pg=Object.freeze({rhythm:Object.freeze({x:-3.7,z:1.9}),light:Object.freeze({x:-3.8,z:-17.5}),memory:Object.freeze({x:-5,z:-29})}),mg=(e,t=0)=>Number.isFinite(e)?e:t,hg=e=>Wt.clamp(mg(e),0,1);function gg(){let e=new K;e.name=`cinematic-story-layer`,e.userData.anchors=pg;let t={rhythm:{x:pg.rhythm.x,y:.94,z:pg.rhythm.z},light:[-.34,0,.34].map(e=>({x:pg.light.x+e,y:1.109,z:pg.light.z+.33})),memory:{x:pg.memory.x+.035,y:1,z:pg.memory.z-.66}},n=new K;e.add(n);let r=!1,i=0,a=new Uint8Array(16384);for(let e=0;e<64;e++)for(let t=0;t<64;t++){let n=Math.sin(t*127.1+e*311.7)*43758.5453,r=n-Math.floor(n),i=Math.round(136+r*50+12*Math.sin(t*.7+Math.sin(e*.11))),o=(e*64+t)*4;a[o]=a[o+1]=a[o+2]=i,a[o+3]=255}let o=new Si(a,64,64,ie);o.name=`original-silt-and-paper-grain`,o.wrapS=o.wrapT=v,o.magFilter=o.minFilter=w,o.needsUpdate=!0;let s=new ts({color:11905719,roughness:.86,bumpMap:o,bumpScale:.035}),c=new ts({color:9667449,metalness:.62,roughness:.42}),l=new ts({color:15129033,roughness:.8,side:2,bumpMap:o,bumpScale:.012}),u=new ts({color:6581116,roughness:.72,metalness:.15}),d=new ns({color:13026007,roughness:.26,metalness:.12,clearcoat:.65,iridescence:.35,iridescenceIOR:1.3}),f=new ts({color:9285538,roughness:.5,side:2});function p(e,t,n,r=[0,0,0],i=[0,0,0],a=[1,1,1]){let o=new yi(e,t);return o.position.set(...r),o.rotation.set(...i),o.scale.set(...a),o.castShadow=!1,o.receiveShadow=!0,n.add(o),o}function m(e,t,n,r,i){return p(new da(...n),t,e,r,i)}function h(e,t,n,r=.025,i=20){return p(new Wo(new Ea(n.map(e=>new G(...e))),i,r,5,!1),t,e)}function g(e,t,n,r,i,a=[-Math.PI/2,0,0]){return p(new Uo(n,r,5,32),t,e,i,a)}function _(e,t,n,r,i,a){return p(new pa(n,r,i,20),t,e,a)}function y(e,t,n=d){p(new Io([[.07,0],[.09,.015],[.1,.04],[.12,.17],[.115,.18],[.097,.17],[.079,.04],[.065,.035]].map(([e,t])=>new W(e,t)),18),n,e,t),_(e,c,.077,.077,.006,[t[0],t[1]+.08,t[2]]),g(e,n,.15,.009,[t[0],t[1]+.004,t[2]])}function b(e,t,n,r,i=[0,0,0]){let a=new Xr;return a.setAttribute(`position`,new J([-t/2,0,-n/2,0,.065,-n/2,-t/2,0,n/2,-t/2,0,n/2,0,.065,-n/2,0,.065,n/2,0,.065,-n/2,t/2,.01,-n/2,0,.065,n/2,0,.065,n/2,t/2,.01,-n/2,t/2,.01,n/2],3)),a.setAttribute(`uv`,new J([0,0,.5,0,0,1,0,1,.5,0,.5,1,.5,0,1,0,.5,1,.5,1,1,0,1,1],2)),a.computeVertexNormals(),p(a,l,e,r,i)}function x(e,t,n,r,i=[0,0,0]){let a=new qa;return a.moveTo(0,0),a.bezierCurveTo(-.24,.28,-.2,.75,0,1),a.bezierCurveTo(.2,.75,.24,.28,0,0),p(new Bo(a,12),t,e,n,i,r)}function S(e,t){e.updateMatrixWorld(!0);let n=e.matrixWorld.clone().invert(),r=new Map,i=[];e.traverse(e=>{if(!e.isMesh)return;let t=e.geometry.index?e.geometry.toNonIndexed():e.geometry.clone();t.applyMatrix4(new gn().multiplyMatrices(n,e.matrixWorld)),t.getAttribute(`uv`)||t.setAttribute(`uv`,new J(new Float32Array(t.getAttribute(`position`).count*2),2)),r.has(e.material)||r.set(e.material,[]),r.get(e.material).push(t),i.push(e)});for(let e of i)e.removeFromParent(),e.geometry.dispose();let a=0;for(let[n,i]of r){let r=Nf(i,!1);for(let e of i)e.dispose();if(!r)throw Error(`Cannot batch cinematic geometry: ${t}`);let o=p(r,n,e);o.name=`${t}-${a++}`}}let C=new K;C.position.set(pg.rhythm.x,.12,pg.rhythm.z),n.add(C),_(C,s,.68,.65,.085,[0,.62,0]),_(C,s,.13,.21,.58,[0,.29,0]),_(C,s,.37,.4,.075,[0,.035,0]),g(C,c,.62,.009,[0,.668,0]),y(C,[-.28,.67,-.17]),y(C,[.27,.67,-.16]),g(C,c,.15,.006,[.04,.671,.34]),b(C,.24,.17,[-.2,.676,.25],[0,-.3,0]);for(let[e,t,n]of[[-.85,-.3,.45],[.85,-.3,-.45],[.06,1.03,0]]){m(C,s,[.5,.065,.34],[e,.32,t],[0,n,0]);for(let r of[-.15,.15])m(C,c,[.038,.3,.21],[e+r,.15,t],[0,n,0])}let T=new K;T.name=`rhythm-third-cup`,T.position.copy(C.position),T.visible=!1,e.add(T),y(T,[.04,.67,.34]),S(T,`restored-cup`);let E=new K;E.position.set(pg.light.x,.12,pg.light.z),n.add(E),_(E,s,.43,.54,.13,[0,.065,0]),_(E,c,.055,.1,.95,[0,.55,0]),g(E,c,.43,.022,[0,.81,0],[-.8,0,0]),m(E,u,[1.02,.035,.72],[0,.93,.09]),m(E,l,[1,.015,.2],[0,.98,.33]);for(let e of[-.17,.17])m(E,c,[.008,.006,.17],[e,.991,.33]);for(let e=0;e<7;e++){let t=-Math.PI*.7+e*Math.PI*.23;_(E,d,.018,.018,.03,[Math.cos(t)*.42,.16,Math.sin(t)*.42])}let D=new K;D.name=`light-letter-dial`,D.position.set(pg.light.x,1.1,pg.light.z),e.add(D),b(D,.5,.4,[0,0,0],[.16,0,0]);for(let e=0;e<5;e++){let t=e*Math.PI*2/5;p(new Ho(.025,8,6),c,D,[Math.sin(t)*.06,.061,Math.cos(t)*.06],[0,0,0],[1,.15,1.5])}S(D,`paper-dial`);let O=new K;O.name=`light-return-letter`,O.position.set(pg.light.x+.3,.83,pg.light.z+.22),O.visible=!1,e.add(O),b(O,.31,.22,[0,0,0],[.09,-.4,.1]),S(O,`return-letter`);let k=new K;k.position.set(pg.memory.x,.12,pg.memory.z-.7),n.add(k),_(k,s,.46,.51,.12,[0,.06,0]);for(let e of[-.34,.34])m(k,c,[.03,1.13,.03],[e,.65,0]);for(let e of[.21,1.2])m(k,c,[.71,.035,.035],[0,e,0]);m(k,s,[.61,.78,.028],[0,.73,-.025]),h(k,u,[[-.13,.34,.01],[-.12,.59,.02],[.035,.9,.02]],.009,12),x(k,u,[-.12,.49,.025],[.48,.25,.48],[0,0,.7]),x(k,u,[-.1,.58,.025],[.45,.23,.45],[0,0,-.85]),m(k,l,[.22,.09,.006],[.12,.35,.027]),g(k,c,.35,.004,[.035,.88,.062],[0,0,0]),g(k,c,.123,.003,[.035,.88,.065],[0,0,0]);let A=new qa;A.moveTo(0,0),A.bezierCurveTo(-.42,.36,-.32,.85,0,1),A.bezierCurveTo(.32,.85,.42,.36,0,0);let j=d.clone();j.side=2;let M=new ji(new Bo(A,12),j,5);M.name=`memory-comparison-petals`,M.instanceMatrix.setUsage(at),M.frustumCulled=!1,e.add(M);let N=new K;N.name=`memory-protected-bud`,N.position.set(t.memory.x,t.memory.y-.025,t.memory.z+.115),e.add(N),h(N,f,[[0,-.065,0],[-.006,.005,0],[.004,.07,0]],.008,8),x(N,f,[-.004,-.018,.004],[.19,.065,.19],[0,0,.75]),x(N,f,[.002,.01,.006],[.18,.058,.18],[0,0,-.8]),p(new Ho(.021,10,6),f,N,[.004,.073,.003],[0,0,0],[.7,1.35,.7]),S(N,`protected-bud`);let P=new si({color:16777215}),F=new ji(new da(1,1,1),P,80);F.name=`memory-year-and-current-marks`,F.instanceMatrix.setUsage(at),F.frustumCulled=!1,e.add(F);let ee=0,te=new K;te.name=`memory-new-shoot`,te.position.set(pg.memory.x+.28,.27,pg.memory.z-.42),te.visible=!1,e.add(te),h(te,f,[[0,0,0],[-.025,.17,0],[.025,.31,.015]],.014,10),x(te,f,[-.01,.12,0],[.66,.22,.66],[-.3,.3,.8]),x(te,f,[.012,.22,.01],[.6,.18,.6],[.25,-.3,-.75]),S(te,`living-shoot`);let ne=[[-16,4.7,-20],[14,6,-41],[-11,7.1,-62]];for(let e=0;e<3;e++){let[t,r,i]=ne[e],a=new K;a.position.set(t,r-3.2,i),a.rotation.y=[-.25,.65,-.5][e],n.add(a);let o=[3.5,3,2.6][e];h(a,s,[[-o,.3,0],[-o*.7,-.35,.16],[0,-.65,.28],[o*.7,-.35,.16],[o,.3,0]],.14,36),h(a,c,[[-o,.3,0],[0,-.28,-.1],[o,.3,0]],.032,28);for(let t=0;t<5;t++){let n=(t-2)/2,r=e===0?3.1-Math.abs(n)*.7:e===1?2.6+n*.9:3.7-Math.abs(n)*.5,i=e===2?n*.38:n*o*.8+(e===1?.6:0);h(a,c,[[n*o*.64,-.36,.15],[n*o*.98,r*.5,-.2],[i,r,-.06]],.028,24)}for(let t of[-1,1])x(a,s,[t*.1,-.3,.05],[o*.42,e===2?2.5:2.1,1],[.12,t*.12,-t*.4]);_(a,c,.12,.2,.2,[0,3.1,0])}S(n,`story-set`);let I;if(typeof document<`u`){let e=document.createElement(`canvas`);e.width=1152,e.height=192;let t=e.getContext(`2d`);t&&(t.clearRect(0,0,e.width,e.height),t.fillStyle=`#4c5369`,t.font=`72px "Noto Serif SC", "Songti SC", SimSun, serif`,t.textAlign=`center`,t.textBaseline=`middle`,[`后来者`,`有席`,`此处`].forEach((e,n)=>t.fillText(e,n*384+192,102)),I=new sa(e))}I||(I=new Si(new Uint8Array([0,0,0,0]),1,1,ie),I.needsUpdate=!0),I.name=`original-letter-fragment-atlas`,I.colorSpace=$e;let re=t.light.map((e,t)=>{let n=new Ro(.31,.155);n.rotateX(-Math.PI/2),n.translate(e.x,e.y,e.z);let r=n.getAttribute(`uv`);for(let e=0;e<r.count;e++)r.setX(e,(t+r.getX(e))/3);return n.setAttribute(`aLabel`,new J(new Float32Array(4).fill(t),1)),n}),L=Nf(re,!1);for(let e of re)e.dispose();let ae=new si({map:I,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1});ae.userData.found=new G,ae.onBeforeCompile=e=>{e.uniforms.uFound={value:ae.userData.found},e.vertexShader=`attribute float aLabel; varying float vLabel;
`+e.vertexShader,e.vertexShader=e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
vLabel = aLabel;`),e.fragmentShader=`uniform vec3 uFound; varying float vLabel;
`+e.fragmentShader,e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`#include <map_fragment>
diffuseColor.a *= vLabel < .5 ? uFound.x : (vLabel < 1.5 ? uFound.y : uFound.z);`)},ae.customProgramCacheKey=()=>`original-revealed-words-v1`;let R=p(L,ae,e);R.name=`light-revealed-words`;let oe=new Xr;oe.setAttribute(`position`,new J(ne.flat(),3)),oe.setAttribute(`color`,new J(new Float32Array(9),3));let se=new $i({color:16777215,size:.8,transparent:!0,opacity:.75,vertexColors:!0,depthWrite:!1,blending:2});se.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace(`#include <opaque_fragment>`,`float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard; diffuseColor.a *= pow(1.0 - d, 2.2);
#include <opaque_fragment>`)},se.customProgramCacheKey=()=>`cinematic-soft-beacons-v1`;let ce=new ia(oe,se);ce.name=`distant-reply-lights`,ce.frustumCulled=!1,e.add(ce);let le=new Xr;le.setAttribute(`position`,new J([pg.rhythm.x+.04,1.03,pg.rhythm.z+.34,pg.light.x,1.43,pg.light.z,pg.memory.x,1.47,pg.memory.z-.7,pg.rhythm.x-.28,.92,pg.rhythm.z-.17,pg.rhythm.x+.27,.92,pg.rhythm.z-.16,pg.light.x,1.2,pg.light.z+.33,pg.memory.x-.22,.49,pg.memory.z-.66,pg.memory.x+.22,.49,pg.memory.z-.66],3)),le.setAttribute(`color`,new J([.76,.66,.5,.57,.68,.81,.64,.8,.72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],3));let ue=se.clone();ue.onBeforeCompile=se.onBeforeCompile,ue.customProgramCacheKey=se.customProgramCacheKey,ue.size=.14,ue.opacity=.55;let de=new ia(le,ue);de.name=`branch-guide-lights`,e.add(de);let fe=new Xr,pe=[],me=[],he=4587,ge=()=>(he=Math.imul(he,1664525)+1013904223>>>0,he/4294967296);for(let e=0;e<220;e++){let t=e%2==0?-1:1;pe.push(t*(2.5+ge()*10),.3+ge()*5.4,5-ge()*62),me.push(ge())}fe.setAttribute(`position`,new J(pe,3)),fe.setAttribute(`aSeed`,new J(me,1));let _e=new $o({transparent:!0,depthWrite:!1,blending:2,uniforms:{uTime:{value:0},uMotion:{value:1},uNight:{value:0}},vertexShader:`attribute float aSeed; uniform float uTime; uniform float uMotion; varying float vSeed; varying float vDistance;
      void main(){vSeed=aSeed;vec3 p=position;p.x+=sin(uTime*.15+aSeed*21.)*.32*uMotion;p.y+=sin(uTime*.25+aSeed*41.)*.15*uMotion;
      vec4 mv=modelViewMatrix*vec4(p,1.);vDistance=-mv.z;gl_Position=projectionMatrix*mv;gl_PointSize=clamp((26.+aSeed*19.)/max(1.,-mv.z),1.,3.5);}`,fragmentShader:`uniform float uNight;varying float vSeed;varying float vDistance;
      void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float a=pow(1.-d,2.)*mix(.31,.5,uNight)*(1.-smoothstep(22.,60.,vDistance));
      gl_FragColor=vec4(mix(vec3(.63,.71,.87),vec3(.91,.74,.63),vSeed),a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`}),ve=new ia(fe,_e);ve.name=`quiet-airborne-pollen`,e.add(ve);let ye=new Xr,be=[];for(let e=0;e<64;e++)be.push(e/63);ye.setAttribute(`position`,new J(new Float32Array(192),3)),ye.setAttribute(`aAlong`,new J(be,1));let xe=new $o({transparent:!0,depthWrite:!1,blending:2,uniforms:{uTime:{value:0},uOpening:{value:0},uMotion:{value:1},uEnd:{value:new G(0,.8,6)}},vertexShader:`attribute float aAlong;uniform float uTime;uniform float uOpening;uniform float uMotion;uniform vec3 uEnd;varying float vAlpha;
      void main(){float p=aAlong;vec3 start=vec3(0.,2.,0.);vec3 end=uEnd;vec3 v=mix(start,end,p);v.y+=sin(p*3.14159)*.7;
      v.x+=sin(p*25.-uTime*2.)*.07*sin(p*3.14159)*uMotion;float head=clamp((uOpening-.35)/.24,0.,1.);
      vAlpha=(1.-smoothstep(.06,.2,abs(p-head)))*smoothstep(.35,.39,uOpening)*(1.-smoothstep(.59,.65,uOpening));
      vec4 mv=modelViewMatrix*vec4(v,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(50./max(1.,-mv.z),1.,6.);}`,fragmentShader:`varying float vAlpha;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(.92,.71,.47,pow(1.-d,2.)*vAlpha*.72);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`}),Se=new ia(ye,xe);Se.name=`opening-flower-to-seed-filament`,Se.frustumCulled=!1,Se.visible=!1,e.add(Se);let Ce=new $o({transparent:!0,depthWrite:!1,side:2,uniforms:{uTime:{value:0},uMotion:{value:1},uNight:{value:0}},vertexShader:`varying vec3 vWorld;varying vec2 vUv;void main(){vUv=uv;vec4 wp=modelMatrix*vec4(position,1.);vWorld=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,fragmentShader:`uniform float uTime;uniform float uMotion;uniform float uNight;varying vec3 vWorld;varying vec2 vUv;
      void main(){float t=uTime*.035*uMotion;float veil=sin(vWorld.x*.31+sin(vWorld.z*.21+t))*sin(vWorld.z*.17-t)*.5+.5;
      float edge=smoothstep(0.,.12,vUv.x)*smoothstep(0.,.12,1.-vUv.x)*smoothstep(0.,.1,vUv.y)*smoothstep(0.,.1,1.-vUv.y);
      float lane=smoothstep(5.,12.,abs(vWorld.x));float a=edge*lane*veil*mix(.038,.062,uNight);
      gl_FragColor=vec4(mix(vec3(.56,.53,.65),vec3(.19,.24,.38),uNight),a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`}),we=p(new Ro(68,88),Ce,e,[0,.42,-29],[-Math.PI/2,0,0]);we.name=`low-tide-haze`,we.renderOrder=0;let Te=new q,Ee=O.position.y,De=te.rotation.z,Oe=new Un,ke=new Un,z=new q,Ae=new Gt,je=new Gt,Me=new G(1,0,0),B=new G(0,0,1);function Ne(e,n,a={}){if(r)return;let o=mg(e,i);i=o;let s=+!a.reducedMotion,c=+!!a.night,l=Wt.clamp(mg(a.progress),0,4),u=hg(a.opening),d=a.branches||{},f=e=>a[e]??d[e],p=e=>d[e]===!0||d[e]?.done===!0;T.visible=p(`rhythm`),O.visible=p(`light`),te.visible=p(`memory`);let m=mg(a.player?.x),h=mg(a.player?.z),g=Math.hypot(m-pg.light.x,h-pg.light.z),_=mg(d.lightAngle,NaN),v=Number.isFinite(_)?_:Math.sin(o*.18)*.18*s,y=1-Math.exp(-Math.min(.1,Math.max(0,mg(n)))*5);D.rotation.y+=(v-D.rotation.y)*y,!s&&!Number.isFinite(_)&&(D.rotation.y=0),D.rotation.z=s*Math.sin(o*.42)*.018,O.position.y=Ee+s*.018*Math.sin(o*.65),te.rotation.z=De+s*Math.sin(o*.75)*.045;let b=hg(f(`memoryBloom`)),x=Wt.smoothstep(b,.16,.84);ee+=Math.min(.1,Math.max(0,mg(n)))*.11*x*s,N.scale.setScalar(Wt.lerp(.76,1.12,x));for(let e=0;e<5;e++)Oe.position.set(t.memory.x,t.memory.y,t.memory.z),Ae.setFromAxisAngle(B,e*Math.PI*2/5),je.setFromAxisAngle(Me,Wt.lerp(1.3,.1,b)),Oe.quaternion.copy(Ae).multiply(je),Oe.scale.set(.2+b*.15,.19+b*.06,.35),Oe.updateMatrix(),M.setMatrixAt(e,Oe.matrix);M.instanceMatrix.needsUpdate=!0;let S=o*.11*s,C=s?ee:0;for(let e=0;e<F.count;e++){let n,r,i=t.memory.z+.075,a,c,l,u;if(e<36){let t=e/36;a=t*Math.PI*2+S,n=Math.cos(a)*.35,r=Math.sin(a)*.35,c=e%3==0?.027:.017,l=.006,u=.65+.35*(.5+.5*Math.sin(t*Math.PI*2))**4,z.setRGB(.5,.64,.82).multiplyScalar(u),a+=Math.PI/2}else if(e<56)a=(e-36)/20*Math.PI*2+C,n=Math.cos(a)*.123,r=Math.sin(a)*.123,c=.017,l=.006,z.setRGB(Wt.lerp(.53,.5,x),Wt.lerp(.39,.81,x),Wt.lerp(.27,.64,x)),a+=Math.PI/2;else{let t=(e-36-20+.5)/24;n=-.45+t*.9,r=-.018+Math.sin(t*Math.PI*2)*.023,a=0,c=.024,l=.007;let d=Math.abs(n)<.185&&x<.32,f=s?o*.14%1:.62,p=Math.min(Math.abs(t-f),1-Math.abs(t-f));u=.38+.62*(1-Wt.smoothstep(p,.025,.2)),z.setRGB(.49,.7+x*.16,.69).multiplyScalar(u),d&&(c=l=0),i+=.01}ke.position.set(t.memory.x+n,t.memory.y+r,i),ke.rotation.set(0,0,a),ke.scale.set(c,l,.006),ke.updateMatrix(),F.setMatrixAt(e,ke.matrix),F.setColorAt(e,z)}F.instanceMatrix.needsUpdate=!0,F.instanceColor.needsUpdate=!0;let w=f(`lightFound`)||[];ae.userData.found.set(+!!w[0],+!!w[1],+!!w[2]);let E=le.getAttribute(`color`),k=f(`beatValue`),A=hg(f(`beatPulse`)),j=k===1?A:0,P=k===2?A:0;E.setXYZ(3,j*2.4,j*1.7,j*.9),E.setXYZ(4,P*1.3,P*1.9,P*2.6);let ne=f(`lightSweep`),I=ne&&[ne.x,ne.y,ne.z].every(Number.isFinite);E.setXYZ(5,I?1.8:0,I?1.5:0,I?.9:0),I&&(le.getAttribute(`position`).setXYZ(5,ne.x,ne.y+.012,ne.z),le.getAttribute(`position`).needsUpdate=!0);let re=f(`memorySeen`)||{};E.setXYZ(6,re.closed?.8:.08,re.closed?.62:.07,re.closed?.42:.08),E.setXYZ(7,re.open?.51:.08,re.open?.88:.07,re.open?.68:.08),E.needsUpdate=!0,Se.visible=u>.35&&u<.65,xe.uniforms.uTime.value=o,xe.uniforms.uOpening.value=u,xe.uniforms.uMotion.value=s,xe.uniforms.uEnd.value.set(m,.8,a.player?h:6);for(let e of[_e,Ce])e.uniforms.uTime.value=o,e.uniforms.uMotion.value=s,e.uniforms.uNight.value=c;ue.opacity=(c?.78:.46)+Math.max(0,1-g/4)*.12;let L=oe.getAttribute(`color`);for(let e=0;e<3;e++){let t=l>=e+1,n=Math.max(0,1-Math.abs(u-(.23+e*.22))/.18),r=t?.8+s*.1*Math.sin(o*.5+e*1.4):.12+n*.45;Te.setRGB(1,t?.69:.72,t?.36:.84).multiplyScalar(r),L.setXYZ(e,Te.r,Te.g,Te.b)}L.needsUpdate=!0,se.opacity=c?.94:.72}function V(){if(r)return;r=!0;let t=new Set,n=new Set,i=new Set([o,I]);e.traverse(e=>{e.geometry&&t.add(e.geometry);for(let t of e.material?[e.material].flat():[])n.add(t)});for(let e of t)e.dispose();for(let e of n)e.dispose();for(let e of i)e.dispose()}return Ne(0,0,{}),{group:e,branchTargets:t,update:Ne,dispose:V}}var _g=(e,t,n)=>Math.max(t,Math.min(n,e)),vg=(e,t=0)=>Number.isFinite(e)?e:t,yg=[`memory`,`season`,`voyage`],bg={bridge_am:[`A`,`M`],bridge_mf:[`M`,`F`],shield_rm:[`R`,`M`]},xg=`spring-letter:journey:v1`;function Sg(){return{version:1,started:!1,bloom:.12,player:{x:0,z:6,safe:`garden`},p1:{solved:!1,hold:0,broken:!1,ink:0},wind:{x:-3,z:2,vx:0,vz:0,touched:!1,solved:!1,hold:0,returns:0,time:0},companion:{trust:0,awakened:!1},bridge:{platform:`A`,support:null,structure:`none`,solved:!1},cores:[null,null],deliveryCarried:null,ending:null,discoveries:[],story:rg(),exploration:yp(),settings:{muted:!1,quality:`balanced`,reducedMotion:!1,autoCamera:!0,flowerForm:`lily`,flowerSeries:`silver`}}}function Cg(e,t){let n=e.bridge;return e.wind.solved?t!==`none`&&!bg[t]?{ok:!1,reason:`这里没有可归形的锚位。`}:n.support?{ok:!1,reason:`先回到石台，再收回承托你的结构。`}:t!==`none`&&!bg[t].includes(n.platform)?{ok:!1,reason:`先走到与这段路相接的石台。`}:(n.structure=t,{ok:!0}):{ok:!1,reason:`先让风廊的光抵达。`}}function wg(e,t,n){return e.ending?{ok:!1,reason:`春信已经启程；可以回到启程前重新安排。`}:e.bridge.solved?![0,1].includes(t)||n!==null&&!yg.includes(n)?{ok:!1,reason:`请选择一个可见的花座。`}:n!==null&&e.cores.some((e,r)=>r!==t&&e===n)?{ok:!1,reason:`这个花座已有种核，另一个可以留给其他用途。`}:(e.cores[t]=n,{ok:!0}):{ok:!1,reason:`沿花桥到达初绽穹顶后，再安放种核。`}}function Tg(e){return e.ending?{ok:!1,reason:`这封春信已经出发。`}:!e.bridge.solved||e.cores.some(e=>!yg.includes(e))||new Set(e.cores).size!==2?{ok:!1,reason:`先为两枚种核安排不同的花座。`}:(e.ending=[...e.cores].sort().join(`+`),{ok:!0})}function Eg(e){let{version:t,started:n,bloom:r,player:i,p1:a,wind:o,companion:s,bridge:c,cores:l,deliveryCarried:u,ending:d,discoveries:f,story:p,exploration:m,settings:h}=e;return JSON.stringify({version:t,started:n,bloom:r,player:i,p1:a,wind:o,companion:s,bridge:c,cores:l,deliveryCarried:u,ending:d,discoveries:f,story:p,exploration:m,settings:h})}function Dg(e){let t=Sg(),n;try{n=typeof e==`string`?JSON.parse(e):null}catch{return t}if(!n||Array.isArray(n)||n.version!==1)return t;t.started=n.started===!0,t.bloom=_g(vg(n.bloom,.12),0,1),t.p1.solved=n.p1?.solved===!0,t.p1.hold=t.p1.solved?.8:0,t.p1.broken=n.p1?.broken===!0,t.p1.ink=t.p1.broken?_g(vg(n.p1?.ink),0,1.2):0,t.wind.solved=t.p1.solved&&n.wind?.solved===!0,t.bridge.solved=t.wind.solved&&n.bridge?.solved===!0,t.companion.awakened=t.wind.solved&&n.companion?.awakened===!0,t.companion.trust=+!!t.companion.awakened,t.wind.solved&&(t.wind.x=3,t.wind.z=-2,t.wind.touched=!0,t.wind.hold=.8),t.wind.solved&&[`A`,`R`,`M`,`F`].includes(n.bridge?.platform)&&(t.bridge.platform=n.bridge.platform);let r=n.bridge?.structure;if(t.wind.solved&&typeof r==`string`&&(r===`none`||Object.hasOwn(bg,r))&&(t.bridge.structure=r),t.wind.solved&&n.player?.safe===`pool`){let e={A:[0,-26],R:[-5,-29],M:[0,-32],F:[0,-38]};[t.player.x,t.player.z]=e[t.bridge.platform],t.player.safe=`pool`}else t.bridge.solved?t.player={x:0,z:-43,safe:`finale`}:t.p1.solved&&(t.player={x:0,z:-11,safe:`wind`});if(t.bridge.solved&&Array.isArray(n.cores))for(let e=0;e<2;e++){let r=n.cores[e];yg.includes(r)&&!t.cores.includes(r)&&(t.cores[e]=r)}let i=t.cores.every(e=>yg.includes(e))?[...t.cores].sort().join(`+`):null;return i&&n.ending===i&&(t.ending=i),t.bridge.solved&&!t.ending&&[0,1].includes(n.deliveryCarried)&&t.cores[n.deliveryCarried]===null&&(t.deliveryCarried=n.deliveryCarried),Array.isArray(n.discoveries)&&(t.discoveries=[...new Set(n.discoveries.filter(e=>[`leaf`,`table`,`echo`,`protocol`].includes(e)))]),t.exploration=bp(n.exploration),t.story=ig(n.story),!n.story&&t.p1.solved&&(t.story.introSeen=!0),t.settings.muted=n.settings?.muted===!0,t.settings.reducedMotion=n.settings?.reducedMotion===!0,t.settings.autoCamera=n.settings?.autoCamera!==!1,[`lily`,`lotus`,`iris`,`dahlia`].includes(n.settings?.flowerForm)&&(t.settings.flowerForm=n.settings.flowerForm),[`silver`,`crystal`,`lily`,`amber`,`celadon`].includes(n.settings?.flowerSeries)&&(t.settings.flowerSeries=n.settings.flowerSeries),[`delicate`,`balanced`,`light`].includes(n.settings?.quality)&&(t.settings.quality=n.settings.quality),t}var X=e=>document.getElementById(e),Og=e=>[...document.querySelectorAll(e)],kg=Wt.clamp,Ag=Wt.lerp,jg,Mg,Ng,Pg,Fg,Ig,Lg,Rg,zg,Bg,Vg,Hg,Ug,Wg,Gg,Kg,qg,Jg,Yg,Xg,Zg,Qg,Z=Sg(),Q=`cover`,$=null,$g=`flower`,e_=!1,t_=`silver`,n_=`blush`;Z.settings=m({getItem:Ev},{reducedMotion:matchMedia(`(prefers-reduced-motion: reduce)`).matches}),jg=u(X(`loading`),{reducedMotion:Z.settings.reducedMotion});var r_,i_=!1,a_,o_,s_,c_=0,l_=0,u_=0,d_=0,f_=!1,p_=!1,m_=!1,h_=!1,g_=0,__=0,v_=.9,y_=0,b_=0,x_=0,S_=0,C_=!1,w_=df(),T_=ff(),E_=_f(),D_=wf.map(e=>new G(e.x,1.1,e.z)),O_=0,k_=-1,A_=`lily`,j_=!1,M_=!1,N_,P_=E_.state,F_=!1,I_={min:[-2,0,-2],max:[2,5,2]},L_=!1,R_=.12,z_=!1,B_=!1,V_={x:0,y:0},H_={active:!1,position:new G,velocity:new G,strength:0,mode:`auto`,released:!1},U_=qp(),W_=new G,G_=new G,K_=new Map,q_=0,J_={x:0,y:0},Y_=!1,X_=null,Z_=new Fi(new G(0,1,0),.18),Q_=0,$_=!1,ev=!1,tv=!1,nv={x:0,y:0},rv=new Set,iv=Jh(),av=new W(9,9),ov=new hc,sv=new Fi(new G(0,1,0),-.5),cv=new G,lv=new G,uv=new G,dv=new G,fv=new G(-1.1,1.9,0);new G;var pv=0,mv=0,hv=!1,gv=-1/0,_v={longestMs:0,over50:0,over100:0,over1000:0},vv={totalMs:0,warmupMs:0,overlayHiddenMs:null},yv=[],bv=[],xv={environment:!1,contextLost:!1},Sv={memory:`旧日的灯`,season:`眼前的四季`,voyage:`远方的春天`},Cv={table:[`两只杯子`,`桌上有两只杯子，第三个位置留着空。这里未必曾坐着第三个人，也可能一直在等一位未来的来客。水的回应，不必永远重复旧日的节拍。`],leaf:[`归来的花`,`花尘散开以后，仍记得每一片花瓣的位置。你写下的风停了，光却没有离开。它回到花里，也落进了水下的路。`],echo:[`第四声`,`旧日的杯纹敲出三拍。游絮却回了第四拍——它会记得你，也会拥有自己的节奏。`],protocol:[`保形协议`,`风暴来临时，方舟选择保存。年复一年，花没有凋谢，也没有再生长。保护曾经拯救过这里；现在，等待也有了重量。`]};function wv(e){X(`toast`).textContent=e,X(`toast`).classList.add(`show`),clearTimeout(b_),b_=setTimeout(()=>X(`toast`).classList.remove(`show`),3600)}function Tv(e,t=7){X(`caption`).textContent=e,X(`caption`).style.opacity=`1`,y_=u_+t}function Ev(e){try{return localStorage.getItem(e)}catch{return null}}function Dv(){if(h({setItem:(e,t)=>localStorage.setItem(e,t)},Z.settings),Q===`play`||Q===`opening`)try{localStorage.setItem(xg,Eg(Z))}catch{xv.storage||(xv.storage=!0,wv(`此浏览器暂时无法保存；本次旅途仍可继续。`))}}function Ov(e){Z.discoveries.includes(e)?Uv(e):(Z.discoveries.push(e),iv.note(659,2,.25),Tv(Cv[e][1],9),Dv())}function kv(e){e_=e,document.body.classList.toggle(`night`,e_),X(`night`).textContent=e_?`破晓`:`入夜`}function Av(){Lp(Z),Z.exploration=Sp(Z.exploration),H_.released=!1,M_=!1,j_=!1,Yg?.cancel(),K_.clear(),q_=0,Y_=!1,X_=null,rv.clear(),B_=!1,tv=!1,$_=!1,m_=!1,H_.active=!1,H_.velocity.set(0,0,0),z_=!1,U_.reset()}function jv(e){L_=e;for(let t of[X(`wind-pen`),X(`scatter`)])t?.setAttribute(`aria-pressed`,String(e));document.body.classList.toggle(`wind-pen`,e),e&&wv(matchMedia(`(pointer:coarse)`).matches?`按住并拖动写风；关闭风笔后单指环看，双指拖动环看，张合缩放。`:`在场景里按住并拖动，风会沿着你的笔迹走；右键仍可环看。`)}function Mv(e){Av(),X(`modal-content`).innerHTML=e,X(`modal`).showModal(),p_=!0,iv.pause(!0)}function Nv(){X(`modal`).open&&X(`modal`).close(),p_=!1,iv.pause(f_)}function Pv(){let e=[{x:0,z:0,label:`让春风经过`,done:Z.p1.solved},{x:0,z:-16,label:`风中的回信`,done:Z.wind.solved},{x:0,z:-32,label:`借一段花桥`,done:Z.bridge.solved},{x:0,z:-46,label:`待寄出的春信`,done:!!Z.ending},...Object.entries(Ug.targets).map(([e,t])=>({...t,label:t.title,done:Z.exploration[e].done}))],t=e=>160+e*7,n=e=>55-e*6;Mv(`<small>一路走来的地方</small><h2>尚未寄出的春天</h2><p>主路连接四幕故事；两侧的春庭，留着三封未完成的信。<br>深处的路，会随花庭苏醒而显现。</p><svg class="journey-map" viewBox="0 0 320 370" role="img" aria-label="花庭路径与当前位置"><path d="M160 55 L160 331 M160 55 Q85 90 76 61 Q65 25 160 55 M160 151 Q235 115 244 151 Q250 190 160 151 M160 247 Q100 265 76 229" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="1"/>`+e.map(e=>`<circle cx="`+t(e.x)+`" cy="`+n(e.z)+`" r="`+(e.done?6:4)+`" fill="`+(e.done?`#bf8d6e`:`#807887`)+`"/><text x="`+t(e.x)+`" y="`+(n(e.z)+19)+`" text-anchor="middle">`+e.label+`</text>`).join(``)+`<circle cx="`+t(Z.player.x)+`" cy="`+n(Z.player.z)+`" r="8" fill="none" stroke="#af5f7e" stroke-width="2"/><circle cx="`+t(Z.player.x)+`" cy="`+n(Z.player.z)+`" r="2" fill="#af5f7e"/></svg><p class="muted">空心圈：你的位置　实心金点：已送达的春信<br>拖动环看 · WASD 漫游 · Shift 加快脚步 · Space＋拖动写风</p>`)}function Fv(){let e=Yg?.context,t=Z.wind.solved&&Z.bridge.support&&H_.active,n=Jg.context||(e?.available||t?{title:t?`脚下的路仍在托住你`:e.status===`ready`?`松手，让花尘成为路`:`用一阵风，借一段花桥`,detail:e.hint,progress:e.progress}:null),r=Q===`play`&&!$&&!!n&&(!Jg.context||![`walk`,`carry`].includes(n.kind));X(`field-action`).hidden=!r;let i=Jg.context?[`take`,`plant`,`lift`,`send`].includes(Jg.context.kind)?Jg.context.actionLabel:`查看指引`:null;X(`focus-button`).innerHTML=`<kbd>E</kbd> `+(i||($?`回到花庭`:`靠近 · 细看`)),r&&(X(`field-title`).textContent=n.title,X(`field-hint`).textContent=n.detail,X(`field-progress`).parentElement.hidden=!!Jg.context,X(`field-progress`).style.width=Math.round((n.progress||0)*100)+`%`)}function Iv(){p_||Q!==`play`||(!$&&Af(Z,Z.player,Jg.carried)?M_=!0:$v())}function Lv(){if(Z.cores.some(e=>!e)||Z.ending)return;let e=wf.filter(e=>Z.cores.includes(e.purpose)),t=wf.find(e=>!Z.cores.includes(e.purpose));Mv(`<small>寄出之前</small><h2>这封春信，会去往……</h2><div class="letter-preview">`+e.map(e=>`<article><i>✦</i><div><h3>`+e.title+`</h3><p>`+e.detail+`。</p></div></article>`).join(``)+`</div><p class="muted">`+t.title+`暂不持续。它留下的记忆仍在，同行者也仍会陪着你。</p><div class="row"><button id="send-confirm" class="primary">寄出这封春信 ↗</button><button id="send-cancel">再想一想</button></div>`),X(`send-cancel`).onclick=Nv,X(`send-confirm`).onclick=()=>{Nv(),oy()}}function Rv(e){A_=Lg.setForm(e),Z.settings.flowerForm=A_;let t=Lg.sampleSurface(65536);I_=mf(t),Rg.setSource(t),Og(`[data-form]`).forEach(e=>{e.classList.toggle(`active`,e.dataset.form===A_),e.setAttribute(`aria-pressed`,String(e.dataset.form===A_))}),Dv()}function zv(e){t_=e,n_=`blush`,Z.settings.flowerSeries=e,Lg.setMaterial(e,n_),Rg.setColors(Lg.sampleSurface(65536).colors),ey(),Og(`[data-material]`).forEach(t=>{t.classList.toggle(`active`,t.dataset.material===e),t.setAttribute(`aria-pressed`,String(t.dataset.material===e))}),Dv()}function Bv(){($===`flower`||Q===`gallery`)&&P_.phase===`solid`&&(j_=!0,iv.note(392,1.4,.16),zg.ripple(0,0,.8))}function Vv(){let e=Z.exploration;return[e.rain.done?`雨留庭的悬花，记住了你画下的那一圈风。`:null,e.wind.done?`在风过庭，你把一枚种子送进了避风的花巢。`:null,e.tide.done?`在潮生庭，你听完了那些尚未被选择的愿望。`:null].filter(Boolean).join(`<br>`)}function Hv(){let e=Ug.context,t=Q===`play`&&!$&&!!e.nearTarget;X(`exploration-hint`).hidden=!t,document.body.classList.toggle(`in-side-garden`,t&&!Z.exploration[e.key]?.done),t&&(X(`garden-title`).textContent=Ug.targets[e.key]?.title||``,X(`garden-objective`).textContent=e.objective,X(`garden-hint`).textContent=matchMedia(`(pointer:coarse)`).matches&&e.touchHint||e.hint,X(`garden-progress`).style.width=Math.round(e.progress*100)+`%`,X(`replay-garden`).hidden=!Z.exploration[e.key]?.done)}function Uv(e){let t=e?[e]:Z.discoveries;Mv(`<small>旅途中留下的回声</small><h2>拾光册</h2><p>花记住形状，水记住声音。<br>你记下的，是它们之间的停顿。</p>${t.length?t.map(e=>`<div class="journal-entry"><h3>${Cv[e][0]}</h3><p>${Cv[e][1]}</p></div>`).join(``):`<p class="muted">靠近杯纹、叶片和旧台，按 E 倾听。</p>`}<div class="journal-entry"><h3>写进春信的回声</h3><p>${eg(Z.story)}</p><p>${Vv()}</p>${Z.exploration.tide.done?`<details class="echo-pages"><summary>潮生庭 · 三封未署名的信</summary>`+sp.map(e=>`<p>`+e.text+`</p>`).join(``)+`</details>`:``}<p class="muted">${Object.entries(Zh).map(([e,t])=>`${Z.story.branches[e]?`✓`:`○`} ${t.title}`).join(`　`)}</p></div><details class="journal-roles"><summary>旅途中相遇的生命</summary>${$h}</details>${Q===`play`?`<button id="replay-opening">重看序章</button>`:``}`),X(`replay-opening`)&&(X(`replay-opening`).onclick=()=>{Nv(),Qv(),a_.startOpening()})}function Wv(){Mv(`<small>行走与声音</small><h2>以你的步调</h2><label class="option" for="quality-choice">画面密度</label><select id="quality-choice"><option value="light">轻盈 · 较低负担</option><option value="balanced">均衡 · 标准花尘</option><option value="delicate">细腻 · 更清晰的光</option></select><label class="option">镜头随行<input type="checkbox" id="camera-follow" ${Z.settings.autoCamera===!1?``:`checked`}></label><label class="option">轻缓动态<input type="checkbox" id="reduce-motion" ${Z.settings.reducedMotion?`checked`:``}></label><label class="option">静音<input type="checkbox" id="mute-setting" ${Z.settings.muted?`checked`:``}></label><p class="muted">WASD 行走，镜头会跟着你的脚步转向。拖动可以临时环看，C 回到身后，滚轮拉近或远离。近看花时，轻触花心或按 F 让它化作花尘，再按住拖动写风。花尘会漂游片刻，再缓慢归形。旅途中按住 Space 拖动，或开启风笔 R。种核靠近后点按 E 拾起、安放和取回。</p><div class="row"><button id="recover">回到最近的石台</button><button id="about">作品与来源</button></div>`),X(`camera-follow`).onchange=e=>{Z.settings.autoCamera=e.target.checked,Dv()},X(`quality-choice`).value=Z.settings.quality,X(`quality-choice`).onchange=e=>{Z.settings.quality=e.target.value,Kv(),Dv()},X(`reduce-motion`).onchange=e=>{Z.settings.reducedMotion=e.target.checked,Dv()},X(`mute-setting`).onchange=e=>{Z.settings.muted=e.target.checked,Gv(),Dv()},X(`recover`).onclick=()=>{let e=$p(Z);Z.player.x=e.x,Z.player.z=e.z,Z.bridge.support=null,Nv(),Qv(),wv(`已回到最近的固定石台。`),Dv()},X(`about`).onclick=()=>{Nv(),Mv(`<small>SPRING LETTER · FIRST PLAYABLE EDITION</small><h2>花漾年华</h2><p>弥，一位新醒来的送春者，在保存故乡季节的方舟上醒来。<br>沿四幕主路和三座春庭，把自己的回应带到这封尚未寄出的信里。</p><p>花朵、场景与声音由程序构建。棚光环境来自 Poly Haven 的 Studio Small 09，作者 Sergej Majboroda，CC0。晨光环境来自 Spruit Sunrise，作者 Greg Zaal；石材微表面来自 White Plaster 02 与 Mossy Rock，作者 Rob Tuytel，均为 Poly Haven CC0 素材。使用 Three.js、Vite 与 Web Audio。</p><p class="muted">制作参考：用户提供的 ShiningBlossom 与 3D粒子效果视频；光学与交互研究包括 Sael、Evan Wallace、Codrops 等公开作品。未打包这些作品的图像或模型。详细来源与研究保存在项目文档。</p>`)}}function Gv(){iv.setMuted(Z.settings.muted),X(`sound`).textContent=Z.settings.muted?`音 · 关`:`音 · 开`,X(`sound`).setAttribute(`aria-label`,Z.settings.muted?`打开声音`:`关闭声音`)}function Kv(){let e=Z.settings.quality===`light`?1:Math.min(devicePixelRatio,Z.settings.quality===`delicate`?2:1.5);Mg.setPixelRatio(e),Fg.setPixelRatio(e),Xg&&(Xg.enabled=Z.settings.quality!==`light`,Xg.resolutionScale=Z.settings.quality===`delicate`?.65:.5),Rg?.setQuality(Z.settings.quality===`light`?`low`:`standard`),Wg?.setQuality(Z.settings.quality===`light`?`low`:`standard`),uy()}function qv(){E_.reset(),P_=E_.state,T_.reset(),pv=0,Jg?.reset(),a_?.cancelOpening(),a_?.exitBranch(),document.body.classList.remove(`opening`,`branch-focus`),X(`nearby-branch`).hidden=!0,X(`exploration-hint`).hidden=!0,X(`field-action`).hidden=!0,Av(),$=null,h_=!1,g_=0,Ig.autoRotate=!1,Ig.enabled=!1,X(`context`).hidden=!0,document.body.classList.remove(`focus`),X(`auto-rotate`).setAttribute(`aria-pressed`,`false`)}function Jv(e=!1){let t={...Z.settings};qv(),Q=`play`,Z=e?Dg(Ev(xg)):Sg(),Z.settings=t,Z.started=!0,Z.p1.solved||(Z.bloom=Math.max(.82,Z.bloom)),Jg.restoreCarried(Z.deliveryCarried,Z),w_.reset(),F_=Z.p1.solved,k_=-1,Rv(Z.settings.flowerForm),zv(Z.settings.flowerSeries),jv(!1),v_=Z.bloom,document.body.classList.add(`play`),document.body.classList.remove(`gallery`),X(`cover`).hidden=!0,X(`hud`).hidden=!1,X(`controls`).hidden=!1,X(`gallery-tabs`).hidden=!0,zg.group.visible=!0,zg.player.visible=!0,Lg.group.visible=!0,Gv(),Kv(),kv(!1),iv.unlock(),Tv(e?Z.bridge.solved&&Z.cores.some(e=>!e)?Z.deliveryCarried===null?`春信还在。未安放的种核，在终庭入口等你。`:`春信还在。那枚种核，仍在你的手中。`:`春信还在，花庭等你继续。`:``,7),X(`touch-pad`).hidden=!matchMedia(`(pointer:coarse)`).matches,Dv(),cy(),Z.story.introSeen||a_.startOpening()}function Yv(){Dv(),qv(),Q=`cover`,document.body.classList.remove(`play`,`gallery`),X(`cover`).hidden=!1,X(`hud`).hidden=!0,X(`controls`).hidden=!0,X(`gallery-tabs`).hidden=!0,X(`touch-pad`).hidden=!0,zg.group.visible=!0,zg.player.visible=!1,Lg.group.visible=!0,X(`caption`).textContent=``,X(`continue`).hidden=!Dg(Ev(xg)).started,kv(!1)}function Xv(e=`flower`){let t=Q===`gallery`,n=C_,r=Ig.target.clone();t||(qv(),v_=1,g_=0),Q=`gallery`,$g=e,document.body.classList.add(`play`,`gallery`),X(`cover`).hidden=!0,X(`hud`).hidden=!0,X(`controls`).hidden=!1,X(`gallery-tabs`).hidden=!1,X(`touch-pad`).hidden=!0,zg.player.visible=!1,kv(e===`dust`),Zv(`flower`),t&&(C_=n,Ig.target.copy(r)),Og(`[data-gallery]`).forEach(t=>t.classList.toggle(`active`,t.dataset.gallery===e)),Tv(e===`dust`?`把手伸近，花尘为你让出一小片夜。`:`花开有时，停留亦有时。`,5)}function Zv(e){$=e,Av(),X(`context`).hidden=!1,document.body.classList.add(`focus`);for(let t of[`flower`,`wind`,`pool`,`finale`,`branch`])X(t+`-controls`).hidden=t!==e;X(`context-label`).textContent={flower:Q===`gallery`?`一朵花的许多种生命`:`第一幕 · 让春风经过`,wind:`第二幕 · 风中的回信`,pool:`第三幕 · 借一段花桥`,finale:`第四幕 · 待寄出的春信`}[e],Ig.enabled=!1,C_=!0,X(`surface-controls`).hidden=Q!==`gallery`||$g===`dust`,e===`flower`&&(X(`flower-workbench`).open=Q===`gallery`,X(`flower-practice`).textContent=matchMedia(`(pointer:coarse)`).matches?`轻触花心，打散花瓣。按住拖动，给花尘一阵风；双指拖动环看，张合缩放。`:`轻触花心或按 F，打散花瓣。按住拖动写风，右键环看。`,X(`bloom`).value=Math.round((Q===`gallery`?v_:Z.bloom)*100),ty()),e===`pool`&&(Z.bridge.platform===`M`||Z.bridge.platform,ry()),e===`finale`&&ay(),e===`wind`&&(X(`wind-reset`).hidden=Z.wind.solved)}function Qv(){a_?.exitBranch(),document.body.classList.remove(`branch-focus`),Q===`gallery`?Yv():($=null,X(`context`).hidden=!0,document.body.classList.remove(`focus`),Ig.enabled=!1,h_=!1,Ig.autoRotate=!1,Av())}function $v(){if(Q!==`play`)return;if($){Qv();return}let e=a_.nearby();if(e){a_.openBranch(e);return}let t=Z.player,n=zg.targets.filter(e=>e.kind===`discovery`&&Math.hypot(t.x-e.x,t.z-e.z)<1.8).sort((e,n)=>Math.hypot(t.x-e.x,t.z-e.z)-Math.hypot(t.x-n.x,t.z-n.z))[0];n?Ov(n.id.replace(`discover-`,``)):Math.hypot(t.x,t.z)<8?(Zv(`flower`),Tv(`花还记得风。轻轻碰一碰它。`,4)):Z.p1.solved&&Math.hypot(t.x,t.z+16)<7?(Zv(`wind`),Tv(`按住游光，把它引向远处的花杯。松手，它会慢慢停下。`,5)):Z.bridge.solved&&t.z<-39?(Zv(`finale`),Tv(`保存、滋养、远行。
两枚种核，写不尽三个愿望。`,6)):Z.wind.solved&&t.z<-23?Zv(`pool`):wv(`向花庭深处走一走，再靠近细看。`)}function ey(){let e=Lg.setSurface?.()||{iridescence:.75,thickness:325,gloss:.81,radiance:.08};Og(`[data-surface]`).forEach(t=>{t.value=e[t.dataset.surface],t.disabled=t_===`lily`&&[`iridescence`,`thickness`].includes(t.dataset.surface)})}function ty(){let e=Q===`gallery`?v_:Z.bloom;X(`bloom-value`).textContent=Math.round(e*100)+`%`,X(`bloom-hint`).textContent=Q===`gallery`?P_.phase===`solid`?`轻触花心，让这一朵花换一种生命。`:P_.phase===`returning`?`光正慢慢回到花瓣里。`:`沿花尘拖动，试试轻推、盘旋，或留下一道风。`:Cf(Z,P_.phase),X(`flower-cycle-label`).textContent={solid:`花的形体`,breaking:`破开`,drifting:`逐风而行`,returning:`缓缓归形`}[P_.phase],X(`flower-burst`).disabled=P_.phase!==`solid`}function ny(e){let t=kg(e,0,1);Q===`gallery`?v_=t:Z.bloom=t,X(`bloom`).value=Math.round(t*100),ty()}function ry(){X(`platform-label`).textContent=Z.bridge.support?`正在花路上：结构承托着你，暂不能收回。`:`当前石台：${{A:`此岸`,R:`旧台`,M:`中庭`,F:`彼岸`}[Z.bridge.platform]} · 用风笔从脚下的光环，沿亮点连向另一座台。下方按钮可辅助归形。`,Og(`[data-shape]`).forEach(e=>e.classList.toggle(`active`,e.dataset.shape===Z.bridge.structure))}function iy(e){let t=Cg(Z,e);t.ok?(iv.note(e===`none`?261:523,1.5,.3),wv(e===`none`?`花尘已回到你的身边。`:`花尘凝成一段可走的路。`),ry(),Dv()):wv(t.reason)}function ay(){X(`allocation`).textContent=Z.cores.map(e=>e?Sv[e]:`尚未安放`).join(` · `),X(`depart`).disabled=!1,X(`depart`).hidden=!!Z.ending,X(`review-letter`).hidden=!Z.ending}function oy(){try{localStorage.setItem(xg+`:before-letter`,Eg(Z))}catch{}let e=Tg(Z);e.ok?(Dv(),Qv(),iv.chime(),a_.playFarewell(),Tv(`花庭记住了你的来信。
新的安排，会从你放下种核的地方慢慢发生。`,10),pv=u_+7.2):wv(e.reason)}function sy(){pv=0;let[e,t]={"memory+season":[`旧灯与新芽`,`旧日的声音仍有归处，新的季节在身边萌生。远方的航道，留待另一封春信。`],"memory+voyage":[`把故乡寄给远方`,`灯仍亮着，种子已飞向陌生的星岸。这里的花庭，将耐心等候属于自己的下一季。`],"season+voyage":[`春天不只一种形状`,`眼前开始生长，远方也收到种子。旧日没有被抹去，只是完整的重现，暂时留在了花里。`]}[Z.ending];Mv(`<small>春信已经启程</small><h2>${e}</h2><p>${t}</p><p>游絮接住了最后一段杯声。<br>它停在你身旁，等你再留下一点空白。</p><div class="journal-entry"><p>${eg(Z.story)}</p><p>${Vv()}</p></div><div class="row"><button id="ending-stay">留在花庭</button><button id="ending-photo">保存我的春信</button><button id="ending-rewind">回到启程前</button></div><p class="muted">旅途已保存。三种安排没有高低，你可以回看不同的余韵。</p>`),X(`ending-stay`).onclick=Nv,X(`ending-photo`).onclick=()=>{Nv(),ly()},X(`ending-rewind`).onclick=()=>{let e=Dg(Ev(xg+`:before-letter`)),t={...Z.settings};Z=e.bridge.solved?e:Dg(Eg({...Z,ending:null})),Z.settings=t,Z.ending=null,pv=0,Jg.restoreCarried(Z.deliveryCarried,Z),Nv(),Qv(),Tv(`回到了启程前。靠近花座，可以把种核重新带走。`,6),Dv()}}function cy(){if(Q!==`play`)return;let e=Z.bridge.solved?3:Z.wind.solved?2:+!!Z.p1.solved;e!==k_&&(k_=e,O_=u_+9),document.body.classList.toggle(`chapter-notice`,u_<O_);let t=[`让春风经过`,`风中的回信`,`借一段花桥`,`待寄出的春信`],n=[`THE FIRST BREATH`,`A REPLY IN THE WIND`,`THE SHAPE OF A PASSAGE`,`A LETTER TO TOMORROW`];X(`act-number`).textContent=[`Ⅰ`,`Ⅱ`,`Ⅲ`,`Ⅳ`][e],X(`act-title`).textContent=t[e],X(`act-eyebrow`).textContent=n[e],X(`objective`).textContent=Z.ending?`春信已启程。停留片刻，或拾起另一段回声。`:[`走近眼前的花。让它化作光，再给花尘一阵风。`,`沿石径走进风廊。按住引导游光，让它落进花杯。`,`向深处的石台前行。花尘只有一份，走到中庭再换一段路。`,`沿彼岸前行，抵达穹顶。用两枚种核，写下你愿意照料的未来。`][e],X(`progress-fill`).style.width=`${Z.ending?100:e*25+(e===0?Z.p1.hold/.8*20:10)}%`,Hv(),Fv(),$===`pool`&&ry(),$===`wind`&&(X(`wind-reset`).hidden=Z.wind.solved);let r=$?null:a_?.nearby();X(`nearby-branch`).hidden=!r,r&&(X(`nearby-branch`).querySelector(`span`).textContent=(Z.story.branches[r]?`重访 · `:``)+Zh[r].title)}function ly(){try{Fg.render();let e=document.createElement(`canvas`);e.width=Mg.domElement.width,e.height=Mg.domElement.height;let t=e.getContext(`2d`);t.drawImage(Mg.domElement,0,0);let n=e.width/1440;t.fillStyle=e_?`#f3e4f0`:`#493b51`,t.font=`${Math.round(22*n)}px "SimSun",serif`,t.fillText(`花漾年华 · 待寄出的春信`,48*n,e.height-55*n),t.font=`${Math.round(10*n)}px Georgia`,t.fillText(`A SPRING WORTH SENDING`,48*n,e.height-34*n),e.toBlob(e=>{if(!e)return;let t=document.createElement(`a`),n=URL.createObjectURL(e);t.href=n,t.download=`我的春信.png`,t.click(),setTimeout(()=>URL.revokeObjectURL(n),1e3),wv(`这一帧春光，已保存为本地图片。`)},`image/png`)}catch{wv(`此浏览器无法导出画面，可以使用系统截图。`)}}function uy(){if(!Mg)return;let e=innerWidth,t=innerHeight;Pg.aspect=e/t,Pg.updateProjectionMatrix(),Mg.setSize(e,t),Fg.setSize(e,t)}function dy(e){let t=Mg.domElement.getBoundingClientRect();return av.set((e.clientX-t.left)/t.width*2-1,-(e.clientY-t.top)/t.height*2+1),ov.setFromCamera(av,Pg),ov.ray.intersectPlane(sv,cv)}function fy(){X(`begin`).onclick=()=>Jv(),X(`continue`).onclick=()=>Jv(!0),X(`gallery`).onclick=()=>{iv.unlock(),Xv()},X(`home`).onclick=Yv,X(`gallery-back`).onclick=Yv,Og(`[data-gallery]`).forEach(e=>e.onclick=()=>Xv(e.dataset.gallery)),X(`night`).onclick=()=>kv(!e_),X(`sound`).onclick=()=>{iv.unlock(),Z.settings.muted=!Z.settings.muted,Gv(),Dv()},X(`settings`).onclick=Wv,X(`journal`).onclick=()=>Uv(),X(`close-modal`).onclick=Nv,X(`modal`).addEventListener(`cancel`,e=>{e.preventDefault(),Nv()}),X(`leave-focus`).onclick=()=>Q===`gallery`?Yv():Qv(),X(`focus-button`).onclick=Iv,X(`recenter-camera`).onclick=()=>T_.recenter(),X(`flower-burst`).onclick=Bv,X(`photo`).onclick=ly,X(`bloom`).oninput=e=>ny(e.target.value/100),X(`scatter`).onclick=()=>jv(!L_),X(`wind-pen`).onclick=()=>jv(!L_),X(`map`).onclick=Pv,X(`replay-garden`).onclick=()=>{let e=Ug.context.key;e&&(Z.exploration=Cp(Z.exploration,e),Dv())},X(`chase-light`).onclick=()=>{i_=!i_,X(`chase-light`).setAttribute(`aria-pressed`,String(i_))},Og(`[data-surface]`).forEach(e=>e.oninput=()=>Lg.setSurface?.({[e.dataset.surface]:Number(e.value)})),X(`auto-rotate`).onclick=()=>{h_=!h_,Ig.autoRotate=h_,X(`auto-rotate`).setAttribute(`aria-pressed`,String(h_))},Og(`[data-material]`).forEach(e=>e.onclick=()=>zv(e.dataset.material)),Og(`[data-form]`).forEach(e=>e.onclick=()=>Rv(e.dataset.form)),X(`wind-reset`).onclick=()=>{Z.wind.solved||(Object.assign(Z.wind,{x:-3,z:2,vx:0,vz:0,hold:0,touched:!1}),wv(`光回到了最初的花杯。`))},Og(`[data-shape]`).forEach(e=>e.onclick=()=>iy(e.dataset.shape)),X(`depart`).onclick=()=>{Qv(),Tv(`带着种核走近花座，点按 E 安放。`,5)},X(`review-letter`).onclick=sy,window.addEventListener(`keydown`,e=>{e.altKey&&e.code===`Enter`?(e.preventDefault(),e.repeat||s_.toggle()):e.code===`Escape`&&s_.isActive()?(e.preventDefault(),s_.toggle()):e.code===`Escape`&&performance.now()-gv<300?e.preventDefault():X(`modal`).open||(e.code===`Space`&&(B_=!0),e.code===`Escape`?(e.preventDefault(),a_.opening?a_.finishOpening():$?Qv():Wv(),e.target.blur?.()):e.target.matches(`input,select,textarea`)||e.repeat||(a_.handleKey(e.code)?e.preventDefault():e.code===`Space`&&e.target.matches(`button`)||([`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`].includes(e.code)&&e.preventDefault(),rv.add(e.code),e.code===`KeyE`&&Iv(),e.code===`KeyF`&&Bv(),e.code===`KeyC`&&T_.recenter(),e.code===`KeyR`&&jv(!L_),e.code===`KeyM`&&Pv())))}),window.addEventListener(`keyup`,e=>{rv.delete(e.code),e.code===`Space`&&(B_=!1)}),Og(`[data-move]`).forEach(e=>{e.onpointerdown=t=>{t.preventDefault(),e.setPointerCapture(t.pointerId),rv.add(e.dataset.move)},e.onpointerup=e.onpointercancel=()=>rv.delete(e.dataset.move)});let e=Mg.domElement;e.tabIndex=0,document.addEventListener(`click`,e=>{e.detail>0&&e.target.closest(`button`)?.blur()}),e.addEventListener(`contextmenu`,e=>e.preventDefault()),e.addEventListener(`pointerdown`,t=>{if(Q!==`cover`&&Q!==`opening`){if(t.preventDefault(),B_&&rv.add(`Space`),iv.unlock(),t.pointerType===`touch`&&(K_.set(t.pointerId,{x:t.clientX,y:t.clientY}),K_.size===2)){let e=[...K_.values()];q_=Math.hypot(e[0].x-e[1].x,e[0].y-e[1].y),J_={x:(e[0].x+e[1].x)/2,y:(e[0].y+e[1].y)/2},Y_=!0,H_.active=!1,z_=!1,H_.released=!1,Lp(Z),Z.exploration=Sp(Z.exploration),Yg?.cancel()}e.setPointerCapture(t.pointerId),K_.size<2&&(X_=t.pointerId),$_=!0,ev=!1,V_={x:t.clientX,y:t.clientY},nv={x:t.clientX,y:t.clientY},m_=t.button===2||!(L_||rv.has(`Space`)||rv.has(`KeyQ`)||$===`flower`||$===`wind`||Q===`gallery`),tv=!m_,dy(t),e.focus({preventScroll:!0})}},!0),e.addEventListener(`pointermove`,e=>{if(e.pointerType===`touch`&&K_.has(e.pointerId)&&(K_.set(e.pointerId,{x:e.clientX,y:e.clientY}),K_.size===2)){let e=[...K_.values()],t=Math.hypot(e[0].x-e[1].x,e[0].y-e[1].y);q_>5&&t>5&&w_.zoom(-Math.log(t/q_)*1250);let n={x:(e[0].x+e[1].x)/2,y:(e[0].y+e[1].y)/2};w_.drag(n.x-J_.x,n.y-J_.y),T_.orbit(),J_=n,q_=t,tv=!1;return}let t=e.clientX-nv.x,n=e.clientY-nv.y;ev||=$_&&Math.hypot(e.clientX-V_.x,e.clientY-V_.y)>5,$_&&m_?(T_.orbit(),w_.drag(t,n),tv=!1):(tv=!e.shiftKey,$_&&(L_||rv.has(`Space`)||$===`flower`||Q===`gallery`)&&($===`flower`||Q===`gallery`)&&P_.phase===`solid`&&Math.abs(n)<24&&ny((Q===`gallery`?v_:Z.bloom)-n*.0025)),nv={x:e.clientX,y:e.clientY},dy(e),tv&&$!==`wind`&&u_-Q_>.14&&ov.ray.intersectPlane(Z_,cv)&&(zg.ripple(cv.x,cv.z,.22),Q_=u_)}),e.addEventListener(`pointerleave`,()=>{$_||(tv=!1)}),window.addEventListener(`pointerup`,t=>{(t.pointerId===X_||K_.has(t.pointerId))&&(K_.delete(t.pointerId),t.target!==e||t.button===2||ev||Y_||$!==`flower`&&Q!==`gallery`||(ov.setFromCamera(av,Pg),ov.intersectObjects(Lg.group.children,!0).length&&Bv()),t.target===e&&!ev&&!Y_&&dy(t)&&ov.ray.intersectPlane(Z_,cv)&&(zg.ripple(cv.x,cv.z,.8),iv.note(290+Math.random()*80,.8,.12)),$_=!1,m_=!1,K_.size||(q_=0,Y_=!1,X_=null))}),e.addEventListener(`wheel`,e=>{Q!==`cover`&&Q!==`opening`&&(e.preventDefault(),e.shiftKey&&($===`flower`||Q===`gallery`)?ny((Q===`gallery`?v_:Z.bloom)-e.deltaY*.001):w_.zoom(e.deltaY))},{passive:!1}),window.addEventListener(`pointercancel`,Av),window.addEventListener(`blur`,()=>{Av(),f_=!0,iv.pause(!0),Dv()}),window.addEventListener(`focus`,()=>{f_=document.hidden,d_=performance.now(),iv.pause(f_||p_)}),document.addEventListener(`visibilitychange`,()=>{f_=document.hidden,Av(),d_=performance.now(),iv.pause(f_||p_),f_&&Dv()}),window.addEventListener(`beforeunload`,Dv),window.addEventListener(`resize`,uy),e.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),xv.contextLost=!0,Av(),Dv(),X(`failure-detail`).textContent=`图形上下文已中断，进度已尝试保存。重新打开后可继续旅途。`,X(`failure`).hidden=!1})}function py(e,t){return Qp(e,t,Z)||Hg?.supportAt(e,t,Z)}function my(e){if($===`flower`||$===`wind`||$===`branch`)return;let t=(rv.has(`KeyD`)||rv.has(`ArrowRight`)?1:0)-(rv.has(`KeyA`)||rv.has(`ArrowLeft`)?1:0),n=(rv.has(`KeyW`)||rv.has(`ArrowUp`)?1:0)-(rv.has(`KeyS`)||rv.has(`ArrowDown`)?1:0),r=T_.movement(t,n,w_.state.azimuth??0),i=rv.has(`ShiftLeft`)||rv.has(`ShiftRight`)?4.6:3,a=r.x*e*i,o=r.z*e*i,s=Z.player,c=s.x,l=s.z,u=py(s.x+a,s.z+o);u?(s.x+=a,s.z+=o):(u=py(s.x+a,s.z),u?s.x+=a:(u=py(s.x,s.z+o),u&&(s.z+=o))),T_.observe(s.x-c,s.z-l,e);let d=py(s.x,s.z);d?.platform===`M`&&!Z.story.seenChapters.includes(3)&&(Z.story.seenChapters.push(3),vy(`protocol`),Tv(Qh[3].join(`：`),8),Dv()),d&&(R_=Ag(R_,d.height??.12,1-Math.exp(-e*12)),s.safe=d.safe,d.platform&&(Z.bridge.platform=d.platform),Z.bridge.support=d.support||null,d.platform===`F`&&!Z.bridge.solved&&(Z.bridge.solved=!0,iv.chime(),Tv(`风暴之后，这里只剩两枚能够萌发的种核。
前方，三座花庭仍在等待。`,8),Dv()))}function hy(e){let t=Q===`cover`||$===`flower`||Q===`gallery`?40:48;Pg.fov=Ag(Pg.fov,t,1-Math.exp(-e*4)),Pg.updateProjectionMatrix();let n=null,r=null;if(Q===`opening`&&a_.opening){let e=a_.opening;uv.fromArray(e.camera),dv.fromArray(e.target),Z.settings.reducedMotion&&(uv.set(8,4.7,11),dv.set(0,1.4,0))}else if(Q===`cover`)uv.set(innerWidth<700?12:7.4,innerWidth<700?6.2:4.2,innerWidth<700?18:10.5),dv.set(innerWidth<700?-.4:-1.8,innerWidth<700?4.1:1.95,0);else if($===`flower`||Q===`gallery`)dv.set(.35,2.3,0),n=`flower`,r={x:4.45,y:1.45,z:7.2};else if($===`branch`){let e=a_.branch,t=Zh[e],i=e!==`rhythm`;dv.set(t.x+(innerWidth<700?0:i?.55:1),i?1.05:.9,t.z+(innerWidth<700?.65:e===`memory`?-.5:-.1)),n=`branch-`+e,r={x:i?-1.85:1.2,y:i?1.3:2.5,z:i?2.6:4.5}}else if($===`wind`)dv.set(0,.2,-16),n=`wind`,r={x:0,y:9.1,z:8.6};else if($===`finale`||pv&&Z.ending){let e=Math.max(1,Math.min(2,.8/Pg.aspect));dv.set(0,.8,-46),n=($===`finale`?`finale`:`farewell`)+(e>1?`-portrait`:``),r={x:6.8*e,y:6.2*e,z:($===`finale`?10.2:-10.2)*e}}else{let e=T_.state.movingTime>.2?.65:0,t=T_.state.heading;dv.set(Z.player.x-Math.sin(t)*e,R_+1.12,Z.player.z-Math.cos(t)*e);let i=innerWidth/innerHeight<.78,a=Z.bridge.solved&&Z.player.z<-39;n=i?a?`roam-portrait-finale`:`roam-portrait`:`roam`,r=i?a?{x:0,y:7,z:18.7}:{x:0,y:3.9,z:9.8}:{x:0,y:2.65,z:6.7}}if(n){if(w_.select(n,r),n.startsWith(`roam`)&&w_.orient(T_.turn(e,{azimuth:w_.state.azimuth,enabled:Z.settings.autoCamera!==!1,blocked:m_||H_.active,reducedMotion:Z.settings.reducedMotion})),h_&&w_.rotate(e*.11),n===`flower`){let e=X(`context`).getBoundingClientRect(),t=innerWidth/innerHeight<.78?{left:22,right:innerWidth-22,top:78,bottom:Math.max(230,e.top-24)}:{left:Math.max(24,innerWidth*.045),right:Math.max(innerWidth*.45,e.left-28),top:Math.min(100,innerHeight*.19),bottom:innerHeight-88},n={direction:w_.offset(),fov:40,width:innerWidth,height:innerHeight,rect:t};w_.fit(pf(I_,n).radius);let r=1+__*.12,i=pf(I_,{...n,distance:w_.state.radius*r});dv.copy(i.target),uv.copy(i.target).add(i.offset)}else if(n===`roam-portrait-finale`){let e={direction:w_.offset(),fov:48,width:innerWidth,height:innerHeight,rect:{left:22,right:innerWidth-22,top:150,bottom:Math.max(350,innerHeight-255)}},t={min:[-4,0,-50.8],max:[4,2.6,-41.6]};w_.fit(pf(t,e).radius);let n=pf(t,{...e,distance:w_.state.radius});dv.copy(n.target),uv.copy(n.target).add(n.offset)}else{let e=w_.offset();uv.set(dv.x+e.x,dv.y+e.y,dv.z+e.z)}}let i=py(uv.x,uv.z);uv.y=Math.max(uv.y,(i?.height??-.18)+.6);let a=1-Math.exp(-e*(Z.settings.reducedMotion?14:m_?16:5));Pg.position.lerp(uv,a);let o=py(Pg.position.x,Pg.position.z);Pg.position.y=Math.max(Pg.position.y,(o?.height??-.18)+.45),fv.lerp(dv,a),Pg.lookAt(fv),Ig.enabled=!1}function gy(e,t=e){if(H_.active=(Q===`play`||Q===`gallery`)&&$!==`branch`&&!m_&&K_.size<2&&!Y_&&($_&&(L_||rv.has(`Space`)||$===`flower`||$===`wind`||Q===`gallery`)||rv.has(`KeyQ`)),H_.released=z_&&!H_.active,H_.active){ov.setFromCamera(av,Pg);let t=$===`flower`||Q===`gallery`?new Fi().setFromNormalAndCoplanarPoint(Pg.getWorldDirection(new G).negate(),new G(0,2,0)):new Fi(new G(0,1,0),-(Ug?.context?.key?Ug.targets[Ug.context.key].y+.3:Z.wind.solved&&Z.player.z<-23&&Z.player.z>-40?.4:R_+1.2));Math.abs(av.x)>2?G_.set(0,2,0):ov.ray.intersectPlane(t,G_)||G_.copy(H_.position),H_.position.copy(G_),z_&&e>0?(H_.velocity.subVectors(H_.position,W_).divideScalar(e),U_.update(H_.velocity.length(),e),H_.velocity.clampLength(0,18)):(H_.velocity.set(0,0,0),U_.reset()),W_.copy(H_.position),H_.strength=kg(.55+H_.velocity.length()*.035,.55,1.25)}else H_.velocity.multiplyScalar(Math.exp(-e*6)),H_.strength*=Math.exp(-e*4),U_.reset();z_=H_.active,Q!==`opening`&&(P_=E_.update(t,{active:($===`flower`||Q===`gallery`)&&H_.active,energy:U_.value,burst:j_||($===`flower`||Q===`gallery`)&&rv.has(`KeyQ`),reducedMotion:Z.settings.reducedMotion}),j_=!1,g_=P_.dispersion),document.body.classList.toggle(`drawing-wind`,H_.active)}function _y(e){if(my(e),zg.player.position.set(Z.player.x,R_+.23,Z.player.z),Sf(Z,{phase:P_.phase,active:$===`flower`&&H_.active,energy:$===`flower`?U_.value:0},e)&&(iv.chime(),Tv(`春风走过花尘。水下的路，也醒了。`,7),vy(`leaf`),Dv()),$===`flower`&&ty(),!$&&!Z.p1.solved&&!F_&&Math.hypot(Z.player.x,Z.player.z)<3.9&&(F_=!0,Zv(`flower`),Tv(`轻触花心。花会换一种方式，留在你身边。`,6)),$===`wind`&&!Z.wind.solved){let t=Z.wind.solved;ov.setFromCamera(av,Pg);let n=H_.active&&!m_&&!Y_&&K_.size<2&&ov.ray.intersectPlane(sv,cv)?{x:cv.x,z:cv.z+16}:null;Rp(Z,{pointer:n,released:H_.released,cancelled:Y_||K_.size>1,bloom:Z.bloom},e),S_=n?0:S_+e,!t&&Z.wind.solved&&(iv.chime(),Tv(`游光落进花杯，照亮了前方。
一小簇花尘，开始跟着你走。`,8),Dv())}Z.wind.solved&&!Z.companion.awakened&&(S_+=e,S_>.8&&(Z.companion.awakened=!0,Z.companion.trust=1,vy(`echo`),iv.note(880,1.8,.25),Dv())),v_=Ag(v_,Z.bloom,1-Math.exp(-e*7)),x_+=e,x_>5&&(x_=0,Dv()),cy()}function vy(e){Z.discoveries.includes(e)||Z.discoveries.push(e)}var yy=new q(`#8d9fab`),by=new q(`#21172f`),xy=new q(`#090612`),Sy,Cy,wy,Ty;function Ey(e,t=!0){t&&requestAnimationFrame(Ey);let n=d_?(e-d_)/1e3:0;if(d_=e,f_||p_||xv.contextLost)return;let r=Math.min(n,.05);if(n>0){mv++;let e=n*1e3;_v.longestMs=Math.max(_v.longestMs,e),e>50&&_v.over50++,e>100&&_v.over100++,e>=1e3&&_v.over1000++,yv.push(e),yv.length>1800&&yv.shift()}if(u_+=r,Mg.info.reset(),iv.update(r,{zone:Q===`play`?Z.player.z<-39?`finale`:Z.player.z<-23?`pool`:Z.player.z<-10?`wind`:`garden`:`garden`,night:l_,opening:Q===`opening`,branch:$===`branch`,ended:!!Z.ending}),(Q===`play`||Q===`opening`)&&a_.update(r,{pointer:{x:(av.x*.5+.5)*innerWidth,y:(-.5*av.y+.5)*innerHeight},active:tv,orbiting:m_}),gy(r,Math.min(n,.25)),Q===`play`&&pv&&u_>=pv){pv=0,Z.ending&&sy();return}if(Q===`play`)_y(r);else if(Q===`gallery`)ty();else if(Q===`opening`){let e=a_.opening;e&&(v_=Ag(v_,e.bloom,1-Math.exp(-r*2)),g_=e.scatter)}else Q===`cover`&&(v_=Ag(v_,1,r*2));c_=Ag(c_,+(Q===`gallery`&&$g===`dust`),1-Math.exp(-r*2.1)),l_=Ag(l_,+!!e_,1-Math.exp(-r*2));let i=Ug.update(u_,r,{player:Z.player,gesture:H_,progress:Z,exploration:Z.exploration,reducedMotion:Z.settings.reducedMotion,interactive:Q===`play`&&!$&&!Y_&&K_.size<2});for(let e of i)if(e.type===`complete`)iv.chime(),Tv(e.first===!1?`这一阵风，已经写进花庭。`:e.text||`又一座春庭，记起了生长的方向。`,e.first===!1?3:8),Dv();else if(e.type===`memory`)Tv(e.text,7),iv.note(392+Math.random()*100,1.6,.16),Dv();else if(e.type===`checkpoint`||e.type===`echo`){let t=(e.x??Z.player.x)-Z.player.x,n=(e.z??Z.player.z)-Z.player.z,r=w_.state.azimuth||0,i=kg((t*Math.cos(r)-n*Math.sin(r))/4,-.8,.8);iv.note(e.type===`echo`?440+(e.step||0)*55:659,e.type===`echo`?1.6:1,e.type===`echo`?.04+(e.proximity||0)*.12:.13,{pan:i,kind:`cup`})}else e.type===`soft-return`&&e.text&&wv(e.text);let a=Yg.update(u_,r,{player:Z.player,gesture:H_,state:Z,interactive:Q===`play`&&$!==`branch`&&$!==`flower`&&$!==`wind`});for(let e of a)if(e.type===`construct`){let t=Cg(Z,e.shape);t.ok?(e.shape,iv.chime(),Tv(`你写下的风，托起了脚下的路。`,5),Dv()):wv(t.reason)}let o=Jg.update(u_,r,{state:Z,player:{...Z.player,y:R_+.23},trigger:M_,active:Q===`play`&&!$});M_=!1;for(let e of o)e.type===`carry`?(iv.note(523,1.4,.18),Tv(`一枚种核在你手中。
走近花座，再决定把它留在哪里。`,5),Z.deliveryCarried=Jg.persistCarried(),Dv()):e.type===`allocate`?wg(Z,e.id,e.purpose).ok&&(iv.note(e.purpose?659:392,1.6,.16),Z.deliveryCarried=Jg.persistCarried(),Tv(e.purpose?Z.cores.every(Boolean)?`两枚种核都已安放。
沿着花粉走向启程台，看看这封春信。`:`这一枚，已经在这里生根。
入口的种核花杯里，还有一枚等你带走。`:`种核重新回到你手中。
再走近一座你想照料的花庭。`,7),Dv()):e.type===`preview-send`?Lv():e.type===`guide`&&wv(e.text);Hg.update(u_,r,Z),Hg.group.visible=Q!==`cover`&&Q!==`gallery`&&c_<.995,Ug.group.visible=Q!==`cover`&&Q!==`gallery`&&c_<.995,Wg.update(r,u_,{gesture:H_,reducedMotion:Z.settings.reducedMotion,color:$===`flower`||Q===`gallery`?Lg.palette.high:`#d9b995`,opacity:Q===`play`||Q===`gallery`?$===`flower`?.42:1:0}),hy(r),Zg.update(r,Pg,fv,Q===`play`||Q===`gallery`,Q===`play`&&Z.bridge.solved&&Z.player.z<-39?D_:[]),N_.update(u_,r,{state:Z,mode:Q,focus:$,camera:Pg,delivery:Jg,phase:P_.phase}),__=Ag(__,g_,1-Math.exp(-r*3.8)),Qg.update(u_,r,{focused:Q===`cover`||$===`flower`,night:l_,scatter:Math.max(__,c_),gesture:H_,reducedMotion:Z.settings.reducedMotion}),Lg.setBloom(v_),Lg.setOpacity((1-c_)*(1-Wt.smoothstep(__,0,.65))),Lg.update(u_);let s=null;if(tv&&!m_&&($===`flower`||Q===`gallery`)){ov.setFromCamera(av,Pg);let e=new Fi().setFromNormalAndCoplanarPoint(Pg.getWorldDirection(new G).negate(),new G(0,2,0));ov.ray.intersectPlane(e,lv)&&(Lg.group.worldToLocal(lv),s=lv)}r_.visible=i_&&($===`flower`||Q===`gallery`),r_.visible&&(s?r_.position.copy(s).add(new G(0,0,2)):r_.position.set(1,3,3)),Rg.object.visible=__>.005||c_>.001,Rg.update(r,u_,{flow:P_.flow,bloom:v_,dispersion:__,pointer:s,night:e_,reducedMotion:Z.settings.reducedMotion,gesture:H_,opacity:Math.max(c_,Wt.smoothstep(__,0,.3))});let c=Wt.smoothstep(__,.08,.8)*.94;document.body.classList.toggle(`ink-scene`,c>.28||c_>.3),Gg.update(u_,Pg,Math.max(l_,c),c_),Ng.background.copy(yy).lerp(by,Math.max(l_,c)).lerp(xy,c_),Ng.fog.color.copy(Ng.background),Ng.fog.density=Ag(.018,.42,c_),Ng.environmentIntensity=Ag(.43,.055,Math.max(l_,c)),Sy.intensity=Ag(.23,.055,Math.max(l_,c)),Cy.intensity=Ag(2.5,.16,Math.max(l_,c)),wy.intensity=Ag(.72,1.25,Math.max(l_,c)),Ty.strength=Ag(Ag(.15,.38,Math.max(l_,c)),.36,c_);let l=Q===`play`?$===`flower`?0:$===`wind`?-16:$===`finale`?-46:Z.player.z:0,u=Q===`play`&&!$?Z.player.x:0;Cy.position.set(u-7,8,l+5),Cy.target.position.set(u,0,l),zg.group.visible=c_<.995,zg.water.material.uniforms.uDetail.value=+($===`flower`||Q===`gallery`),zg.water.material.uniforms.uNight.value=Math.max(l_,c),zg.update(u_,r,Z),Kg.update(u_,r,zg.player.position,H_.active),o_.group.visible=c_<.995,o_.update(u_,r,{player:Q===`opening`?{x:0,z:6}:Z.player,progress:Z.ending?4:Z.bridge.solved?3:Z.wind.solved?2:+!!Z.p1.solved,night:l_,reducedMotion:Z.settings.reducedMotion,branches:Z.story.branches,opening:a_.opening?.progress||0,lightFound:Z.story.lightFound,memorySeen:Z.story.memorySeen,...a_.presentation}),zg.companion.visible=Z.companion.awakened&&Q===`play`&&$!==`branch`,zg.player.visible=Q===`play`&&$!==`branch`||Q===`opening`&&(a_.opening?.index??0)>=3,y_&&u_>y_&&(X(`caption`).style.opacity=`0`),Xg.enabled=!Xg.failed&&Z.settings.quality!==`light`&&c_<.1&&__<.15,Vg?.update(Z.settings.quality,c_<.8),Fg.render()}async function Dy(){let e=performance.now();try{jg.setStage(`garden`),await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))),Mg=new Rd({antialias:!0,powerPreference:`high-performance`,preserveDrawingBuffer:!0}),Mg.shadowMap.enabled=!0,Mg.shadowMap.type=1,Mg.info.autoReset=!1,Mg.outputColorSpace=$e,Mg.toneMapping=4,Mg.toneMappingExposure=.7,Mg.setClearColor(`#e7e2ed`),X(`scene`).append(Mg.domElement),Ng=new Qn,Ng.background=yy.clone(),Ng.fog=new Zn(`#e7e2ed`,.012),Pg=new Ws(48,innerWidth/innerHeight,.1,160),Pg.position.set(7.4,4.2,10.5),Pg.lookAt(fv),Sy=new Ms(`#f5efff`,`#c3a4b3`,1.5),Ng.add(Sy),Cy=new Ys(`#fff5e2`,3.2),Cy.position.set(4,9,5),Cy.castShadow=!0,Cy.shadow.mapSize.set(1536,1536),Object.assign(Cy.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:.5,far:40}),Cy.shadow.bias=-5e-4,Cy.shadow.normalBias=.03,Ng.add(Cy,Cy.target),wy=new Ys(`#c1c9ff`,1.6),wy.position.set(-5,4,-3),Ng.add(wy),r_=new Ks(`#ffeafa`,9,12,2),r_.visible=!1,Ng.add(r_),Fg=new Gm(Mg),Fg.addPass(new Km(Ng,Pg)),Xg=new Rm(Ng,Pg),Fg.addPass(Xg),Ty=new Jm(new W(innerWidth,innerHeight),.15,.45,1),Fg.addPass(Ty),Fg.addPass(new Xm),Ig=new Yd(Pg,Mg.domElement),Ig.enableDamping=!0,Ig.dampingFactor=.07,Ig.enablePan=!1,Ig.enableZoom=!1,Ig.enabled=!1,Ig.autoRotateSpeed=.35,Ig.maxPolarAngle=Math.PI*.48,zg=Hh(),Ng.add(zg.group),Zg=zm(zg.cameraOccluders),zg.player.children.forEach(e=>e.visible=!1),Kg=Yp(),zg.player.add(Kg.group),Hg=rp(),Ng.add(Hg.group),Ug=Np(),Ng.add(Ug.group),Wg=Kp(),Ng.add(Wg.group),Jg=jf(),Ng.add(Jg.group),N_=Mf(X(`world-guide`)),Ng.add(N_.group),Yg=Sm(),Ng.add(Yg.group),Gg=Jp(),Ng.add(Gg.object),Qg=Bm(),Ng.add(Qg.object),o_=gg(),Ng.add(o_.group),Lg=gh({seed:17,scale:1}),Ng.add(Lg.group),zg.group.traverse(e=>{e.isMesh&&e!==zg.water&&!e.material?.transparent&&(e.castShadow=!0)}),Lg.group.traverse(e=>{e.isMesh&&(e.castShadow=!0,e.receiveShadow=!0)}),Lg.setBloom(.9),Lg.setMaterial(`silver`,`blush`),ey();let t=Lg.sampleSurface(65536);I_=mf(t),Rg=Ah(Mg,t,{quality:`standard`}),Ng.add(Rg.object),jg.setStage(`garden`,`正在铺开晨光与浅水`);try{let e=await new Vm().loadAsync(`/assets/environment/studio_small_09_1k.hdr`),t=new Gc(Mg);Bg=t.fromEquirectangular(e),Ng.environment=Bg.texture,e.dispose(),t.dispose(),xv.environment=!0,Lg.group.traverse(e=>{e.material&&(e.material.envMap=Bg.texture,e.material.needsUpdate=!0)})}catch(e){bv.push(`Environment: `+e.message),wv(`棚光未载入，使用本地柔光继续。`)}try{let e=await new Vm().loadAsync(`/assets/environment/spruit_sunrise_1k.hdr`),t=new Gc(Mg);qg=t.fromEquirectangular(e),Ng.environment=qg.texture,Ng.environmentRotation.y=.65,e.dispose(),t.dispose(),xv.outdoorEnvironment=!0}catch(e){xv.outdoorEnvironment=!1,bv.push(`Morning environment: `+e.message)}let n=new As;try{let[e,t]=await Promise.all([n.loadAsync(`/assets/surfaces/white-plaster-02-normal.jpg`),n.loadAsync(`/assets/surfaces/white-plaster-02-roughness.jpg`)]);for(let n of[e,t])n.wrapS=n.wrapT=v,n.repeat.set(5,5),n.anisotropy=Math.min(4,Mg.capabilities.getMaxAnisotropy());zg.setStoneTextures(e,t),xv.stoneTextures=!0}catch{xv.stoneTextures=!1,wv(`石材微纹理未载入，柔光石台仍可继续体验。`)}try{let[e,t]=await Promise.all([n.loadAsync(`/assets/surfaces/mossy-rock-normal.jpg`),n.loadAsync(`/assets/surfaces/mossy-rock-roughness.jpg`)]);for(let n of[e,t])n.wrapS=n.wrapT=v,n.anisotropy=Math.min(4,Mg.capabilities.getMaxAnisotropy());Hg.setSurfaceTextures?.(e,t),xv.landscapeTextures=!0}catch{xv.landscapeTextures=!1}a_=fg({getState:()=>Z,audio:iv,caption:Tv,toast:wv,save:Dv,onReply:()=>zg.respond(),getLightTargets:()=>o_.branchTargets.light,project:(e,t,n)=>{let r=new G(e,t,n).project(Pg);return{x:(r.x*.5+.5)*innerWidth,y:(-.5*r.y+.5)*innerHeight}},onOpeningStart:()=>{Av(),$=null,Ig.enabled=!1,Q=`opening`,document.body.classList.add(`opening`),X(`context`).hidden=!0,X(`nearby-branch`).hidden=!0,X(`caption`).style.opacity=`0`,zg.player.position.set(0,.35,6)},onOpeningEnd:()=>{Av(),Q=`play`,g_=0,document.body.classList.remove(`opening`),Tv(Z.p1.solved?`最初的春光，仍留在拾光册里。继续你的旅途吧。`:`WASD 行走，镜头会跟着你。
向眼前的花走近一些。`,9),cy()},onBranchStart:e=>{y_=0,X(`caption`).textContent=``,e===`rhythm`&&vy(`table`),e===`memory`&&vy(`protocol`),Dv(),Zv(`branch`),document.body.classList.add(`branch-focus`),X(`nearby-branch`).hidden=!0},onBranchEnd:()=>{}}),s_=Yh({buttons:Og(`[data-fullscreen]`),onChange:e=>{hv&&!e&&(gv=performance.now()),hv=e,Av(),f_=document.hidden,d_=performance.now(),uy(),iv.pause(f_||p_)},onUnavailable:wv}),fy(),Gv(),Kv(),Yv(),jg.setStage(`light`,`正在准备花瓣与水面的光泽`);let r=performance.now();Vg=Wh({renderer:Mg,scene:Ng,camera:Pg,water:zg.water,exclude:[Rg.object,Qg.object]}),Rg.update(.016,0,{bloom:1,dispersion:0,pointer:null,night:!1,reducedMotion:!1,opacity:0});async function i(){let e=Mg.getRenderTarget();try{Mg.setRenderTarget(Fg.readBuffer),await Mg.compileAsync(Ng,Pg)}finally{Mg.setRenderTarget(e)}}for(let e of[`crystal`,`lily`,`amber`,`silver`])Lg.setMaterial(e,`blush`),Lg.setOpacity(1),await i(),Vg.update(Z.settings.quality,!0),Fg.render(),Lg.setOpacity(.42),Rg.object.visible=!0,Rg.update(0,0,{bloom:v_,dispersion:.75,flow:.5,opacity:.7}),await i(),Vg.update(Z.settings.quality,!0),Fg.render();Rv(Z.settings.flowerForm),zv(Z.settings.flowerSeries),Lg.setOpacity(1),Rg.update(0,0,{bloom:v_,dispersion:0,flow:0,opacity:0}),ey(),d_=0,Ey(0,!1),Mg.info.reset(),vv.warmupMs=performance.now()-r,vv.totalMs=performance.now()-e,jg.setStage(`ready`),jg.complete().then(()=>{vv.overlayHiddenMs=performance.now()-e}),d_=0,requestAnimationFrame(()=>requestAnimationFrame(Ey)),window.__SPRING__={snapshot(){return{state:JSON.parse(Eg(Z)),mode:Q,focus:$,galleryKind:$g,displayBloom:v_,scatter:__,material:t_,flowerForm:A_,flowerCycle:{...P_},travel:T_.state,night:e_,dustView:c_,opening:a_.opening?.index??null,branch:a_.branch,camera:Pg.position.toArray(),fov:Pg.fov,cameraLook:fv.toArray(),view:w_.state,gesture:{active:H_.active,position:H_.position.toArray(),velocity:H_.velocity.toArray(),strength:H_.strength,motionEnergy:U_.value},penMode:L_,weaver:Yg.context,depthPass:Xg.enabled,delivery:Jg.context,carried:Jg.carried,exploration:Ug.context,outdoorEnvironment:xv.outdoorEnvironment,landscapeTextures:xv.landscapeTextures,stoneTextures:xv.stoneTextures,reflection:Vg?.enabled,presentation:{memoryBloom:a_.presentation.memoryBloom,actor:zg.player.position.toArray(),companionVisible:zg.companion.visible},renderer:{calls:Mg.info.render.calls,triangles:Mg.info.render.triangles,points:Mg.info.render.points,renderer:Mg.getContext().getParameter(Mg.getContext().RENDERER)},memory:{...Mg.info.memory,programs:Mg.info.programs?.length||0},audio:iv.getStats?.(),particles:Rg.getStats(),environment:xv.environment,errors:[...bv],frameNumber:mv,frameTiming:{..._v},loadingTiming:{...vv},frameTimes:[...yv]}},project(e,t,n){let r=new G(e,t,n).project(Pg);return{x:(r.x*.5+.5)*innerWidth,y:(-.5*r.y+.5)*innerHeight}}}}catch(e){console.error(e),bv.push(e.stack||String(e)),jg.dispose(),X(`loading`).hidden=!0,X(`failure`).hidden=!1,X(`failure-detail`).textContent=`浏览器需要启用 WebGL 2。若已启用，请查看项目运行说明。详细原因：`+e.message}}Dy();