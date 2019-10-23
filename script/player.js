

'use strict';


const PLAYER = {};

  PLAYER.el = {};
  PLAYER.el.player = document.getElementById('PLAYER');
  
  var PLAYER_intervalLow;
  var PLAYER_timeoutBuffering;
  var PLAYER_timeoutWaiting;
  var PLAYER_timeoutLowSwitch;

PLAYER.init = function(){
  PLAYER.el.player.innerHTML = 
    "<audio id='audio' preload='none' src=''></audio>"+
    "<button id='PLAYER-play'></button>"+
    "<div id='PLAYER-bars'>"+
      "<div class='PLAYER-bar' id='PLAYER-barBg'></div>"+
      "<div class='PLAYER-bar' id='PLAYER-barBuffered'></div>"+
      "<div class='PLAYER-bar' id='PLAYER-barPlayed'></div>"+
      "<div class='PLAYER-bar' id='PLAYER-barText'>"+
        "<span id='PLAYER-status'>Please select an audio.</span>"+
        "<span id='PLAYER-currentTime'>0:00 - </span>"+
        "<span id='PLAYER-duration'>0:00</span>"+
      "</div>"+
      "<div class='PLAYER-bar' id='PLAYER-barCov'></div>"+
    "</div>"
  ;
  
  
  PLAYER.lowIntervalSec = 10000;
  PLAYER.lowSwitchSec   = 30000;
  PLAYER.width          = parseFloat(getComputedStyle(PLAYER.el.player).width);
  PLAYER.aud            = document.getElementById('audio');
  PLAYER.aud.volume     = 1;
  
  PLAYER.el.titleCover  = document.getElementById('PLAYER-title-cover');
  PLAYER.el.play        = document.getElementById('PLAYER-play');
  PLAYER.el.barPlayed   = document.getElementById('PLAYER-barPlayed');
  PLAYER.el.barBuffered = document.getElementById('PLAYER-barBuffered');
  PLAYER.el.status      = document.getElementById('PLAYER-status');
  PLAYER.el.currentTime = document.getElementById('PLAYER-currentTime');
  PLAYER.el.duration    = document.getElementById('PLAYER-duration');
  PLAYER.el.cover       = document.getElementById('PLAYER-barCov');
  PLAYER.el.more        = document.getElementById('PLAYER-more');

  PLAYER.el.title       = document.getElementById('PLAYER-title');
  PLAYER.el.artist      = document.getElementById('PLAYER-artist');
  PLAYER.el.bitrate     = document.getElementById('PLAYER-bitrate');
  PLAYER.el.fileSize    = document.getElementById('PLAYER-fileSize');
  
  // HTML Audio/Video Events 
  // https://www.w3schools.com/tags/ref_av_dom.asp 
  // https://developer.mozilla.org/id/docs/Web/Guide/Events/Media_events
  
  PLAYER.aud.addEventListener("error", PLAYER.error);
  PLAYER.aud.addEventListener("waiting", PLAYER.waiting);
  PLAYER.aud.addEventListener("playing", PLAYER.playing);
  PLAYER.aud.addEventListener("progress", PLAYER.buffering);
  PLAYER.aud.addEventListener("loadstart", PLAYER.buffered);
  PLAYER.aud.addEventListener("durationchange", PLAYER.durationchange);
  PLAYER.aud.addEventListener("seeked", PLAYER.seeked);
  PLAYER.aud.addEventListener("play", PLAYER.play);
  PLAYER.aud.addEventListener("pause", PLAYER.pause);
  PLAYER.aud.addEventListener("ended", PLAYER.ended);

  PLAYER.el.play.addEventListener("click", PLAYER.toggle);
  PLAYER.el.cover.addEventListener("click", PLAYER.seeking);
  
  window.addEventListener("resize", function(){ PLAYER.width = parseFloat(getComputedStyle(PLAYER.el.player).width) });
  PLAYER.high();
}


PLAYER.play  = function(){ 	PLAYER.el.player.classList.add('PLAYER--playing') }
PLAYER.pause = function(){ PLAYER.el.player.classList.remove('PLAYER--playing'); PLAYER.el.status.textContent = 'Paused.'; }
PLAYER.ended = function(){ PLAYER.el.barPlayed.style.width = 0; PLAYER.high(); }




/* low/high cpu time usage */
PLAYER.high = function(){
  clearInterval(PLAYER_intervalLow);
  clearTimeout(PLAYER_timeoutLowSwitch);
  PLAYER.aud.removeEventListener('timeupdate', PLAYER.timeupdate);
  PLAYER.aud.addEventListener('timeupdate', PLAYER.timeupdate);
  PLAYER.el.player.classList.remove('PLAYER--low');
  PLAYER.state = 'high';
  if(!PLAYER.aud.paused) PLAYER_timeoutLowSwitch = setTimeout(function(){ PLAYER.low() }, PLAYER.lowSwitchSec); 
}
PLAYER.low = function(){
  PLAYER.aud.removeEventListener("timeupdate", PLAYER.timeupdate);
  clearInterval(PLAYER_intervalLow);
  // manual update played-bar by interval
  PLAYER_intervalLow = setInterval(function(){
    PLAYER.el.barPlayed.style.width = PLAYER.aud.currentTime / PLAYER.aud.duration * PLAYER.width +'px';
    PLAYER.el.currentTime.textContent = UTILS.toHHMMSS2(PLAYER.aud.currentTime) + ' - ';
  },PLAYER.lowIntervalSec);
  PLAYER.el.player.classList.add('PLAYER--low');
  PLAYER.state = 'low';
}



/* timeupdate (fired every second on playing state) */
PLAYER.timeupdate = function(){
  PLAYER.el.barPlayed.style.width = (PLAYER.aud.currentTime / PLAYER.aud.duration * PLAYER.width |0) +'px';
  PLAYER.el.currentTime.textContent = UTILS.toHHMMSS2(PLAYER.aud.currentTime) + ' - ';
}

PLAYER.buffered = function(){
  try{
    var e = PLAYER.aud.buffered.end(PLAYER.aud.buffered.length - 1);
    var d = PLAYER.aud.duration;
    if(d>0) PLAYER.el.barBuffered.style.width = (e/d) * PLAYER.width +'px';
  }
  catch(e){}
}
PLAYER.buffering = function(){
  clearTimeout(PLAYER_timeoutBuffering);
  PLAYER.buffered();
  PLAYER.el.status.textContent = 'Buffering..';
  PLAYER_timeoutBuffering = setTimeout(function(){ PLAYER.el.status.textContent = 'Playing ~' },2000);
}

PLAYER.durationchange = function(){
  PLAYER.el.duration.textContent = UTILS.toHHMMSS2(PLAYER.aud.duration);
  PLAYER.buffered();
}

PLAYER.toggle = function(){
  PLAYER.aud.paused ? PLAYER.aud.play() : PLAYER.aud.pause()
}

PLAYER.error = function(){ PLAYER.el.status.textContent = 'Error loading audio.' }
PLAYER.waiting = function(){ PLAYER.el.status.textContent = 'Waiting..' }
PLAYER.playing = function(){
  PLAYER.el.status.textContent = 'Playing ~';
  PLAYER.high(); 
}


PLAYER.seeking = function(e) {
  PLAYER.aud.currentTime = (e.pageX - e.target.getBoundingClientRect().left)
    * PLAYER.aud.duration / PLAYER.width
}


PLAYER.loadAudioInfo = function(obj){
  PLAYER.el.title.textContent = obj.title;
  PLAYER.el.artist.textContent = obj.artist + ', ' + UTILS.formatDate(obj.date);
  PLAYER.el.bitrate.textContent = ', ' + MAP.bitrate + ' / ';
  PLAYER.el.fileSize.textContent = UTILS.formatBytes(obj.size);
}













  document.addEventListener("click", function(e){
    if(e.target.textContent === 'Play Now'){
      e.preventDefault();
      PLAYER.aud.src = e.target.href;
      PLAYER.aud.play();
    }
  });