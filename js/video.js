function videoSwitcher() {
    var div=document.querySelector(".video-switcher");
    if (div) {
      var imgs=div.querySelectorAll("ul li img")
      var inner="";
      imgs.forEach((e) => {
        e.parentNode.onclick=selectVideo;
        var first=e.alt.split(" ")[0];
        var rest=e.alt.substring(first.length);
        inner+=`<li>${first}<br><span class="long">${rest}</span></li>`;
      })
      var ul=div.appendChild(document.createElement("ul"));
      ul.innerHTML=inner;
      Array.from(ul.children).forEach((e)=>{e.onclick=selectVideo});
    }
  }

function selectVideo(e) {
    var index=0;

    if (e) {
        var sib=e.currentTarget;
        while((sib = sib.previousElementSibling) != null) index++;
    } else {
        index=0;
    }

    var uls=document.querySelectorAll(".video-switcher ul");
    uls.forEach((ul) => {
        lis=Array.from(ul.children);
        lis.forEach((li, i) => {
        if (i==index) li.classList.add("selected")
        else li.classList.remove("selected");
        }) 
    } );

    showSelectedVideo();
}

function loadVideos() {
    if (!videoData.length) {
      var xhr = new XMLHttpRequest();
      var url = "videos.json";

      xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              videoData = JSON.parse(this.responseText);
              showSelectedVideo();
              completeCarousel();
          }
      };
      xhr.open("GET", url, true);
      xhr.send();
    }
  }

  function completeCarousel() {
    var div=document.querySelector(".video-card-carousel");
    if (div) {
      var heads=div.querySelectorAll("ul li");
      heads.forEach((e) => {
        var title=e.textContent;
        var video=videoData.find((v) => { return (v.title == title)});
        if (video) {
          var inner=`<div class="videocard"><div class="video"><img src="${video.image}"></div><div class="desc"><h3>${video.title}</h3><p><span class="time">${video.runtimeReadable}</span><span class="platform">${video.platform}</span></p></div></div>`;
          e.innerHTML=inner;
        }
      })
    }
  }

  function showSelectedVideo() {
    var name=document.querySelector(".video-switcher .selected img").alt;
    var video={};
    
    if (videoData.length) {
      video=videoData.find((v) => { return (v.ref == name)});
      var inner="";
      if (video) {
        inner=`<div class="video"><img src="${video.image}"></div><h3>${video.title}</h3><p><span class="time">${video.runtimeReadable}</span> <span class="platform">${video.platform}</span></p><div class="edits"><h4>Skip to an edit</h4>`;
        video.timestamps.forEach((e)=>{ inner+=`<p><span class="timestamp-title">${e.title}</span> <span class="timestamp">${e.runtimeReadable}</span></p>` })
        inner+=`</div><h4>${video.nextHeadline}</h4>`;
        var nextVideo=videoData.find((v) => { return (v.id == video.next[0])});
        inner+=`<div class="next-video"><img src="${nextVideo.image}"><p class="next-title">${nextVideo.title}</p><p class="next-runtime">${nextVideo.runtimeReadable}</p></div>`;
        inner+=`</div>`;
      }

      var videoDetails=document.querySelector(".video-switcher div.video-details");
      if (!videoDetails) {
        videoDetails=document.querySelector(".video-switcher").appendChild(document.createElement("div"));
        videoDetails.classList.add("video-details");   
      }
      videoDetails.innerHTML=inner;
    }    
  }

  var videoData=[];

  window.addEventListener("load", (e) => {
    videoSwitcher();
    loadVideos();
    selectVideo();
  })
