window.onload=function(){var e,t,n=document.body,o=document.getElementById("mnav"),i=document.getElementById("main-menu"),c=document.getElementById("process"),l=document.querySelectorAll(".img-ajax"),a=(document.getElementById("comments-count"),document.getElementById("gitcomment"),document.getElementById("back-to-top")),r=document.getElementById("article-toc"),s=null,d=!0;function m(){return n.scrollTop||document.documentElement.scrollTop}1==/iphone|ios|android|ipod/i.test(navigator.userAgent.toLowerCase())&&"mobile"!=(e=location.search,(t=new RegExp("(?:&|/?)from=([^&$]+)").exec(e))?t[1]:"")&&(d=!1),o.onclick=function(){"-1"!=i.getAttribute("class").indexOf("in")?i.setAttribute("class","collapse navbar-collapse"):i.setAttribute("class","collapse navbar-collapse in")};function u(){c&&(c.style.width=m()/(n.scrollHeight-window.innerHeight)*100+"%"),d&&300<=m()?a.removeAttribute("class","hide"):a.setAttribute("class","hide"),function(o){if(o){var e=o.length;if(0<e)for(var i=m()+window.innerHeight,c=0;c<e;c++)!function(e){var t=o[c];if(t.getBoundingClientRect().top+window.pageYOffset-document.documentElement.clientTop<=i&&t.getAttribute("data-src")&&0<t.getAttribute("data-src").length){if("img"===t.nodeName.toLowerCase())t.src=t.getAttribute("data-src"),t.style.display="block";else{var n=new Image;n.onload=function(){t.innerHTML=""},n.src=t.getAttribute("data-src"),t.style.backgroundImage="url("+t.getAttribute("data-src")+")"}t.removeAttribute("data-src")}}()}}(l)}u(),window.addEventListener("scroll",function(){if(r){var e=r.offsetTop,t=r.offsetLeft,n=r.offsetWidth;m()<=e?r.style="":(r.style.position="fixed",r.style.top="5px",r.style.left=t+"px",r.style.width=n+"px")}clearTimeout(s),s=setTimeout(function(){u()},200)}),a.onclick=function(){cancelAnimationFrame(s),s=requestAnimationFrame(function e(){var t=m();0<t?(n.scrollTop=document.documentElement.scrollTop=t-50,s=requestAnimationFrame(e)):cancelAnimationFrame(s)})}};