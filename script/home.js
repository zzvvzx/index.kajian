'use strict';

const fs   = require('fs');

const ROOT = "/storage/sdcard0/Download/zaman.old/data/";
const DIR  = fs.readdirSync(ROOT);
const PATH_out = ROOT + "../index.html";

function time(x){ var h=~~(x/3600),m=~~(x/60)%60,s=~~(x)%60; return (h?(h<10?"0":"")+h+":":"")+((m<10)&&h?"0":"")+m+":"+(s<10?"0":"")+s };


let html = "";

for(let i=0; i<DIR.length; i++){
  let d    = DIR[i];
  let META = JSON.parse(fs.readFileSync(ROOT + d + "/meta.json"));

  html += `
<li>
  <span>${i+1}</span>
  <span><a href="data/${d}/">${d}</a></span>
  <span>${META.date} / ${time(parseFloat(META.total_duration)*3600)} ${META.total_size}Mb</span>
</li>`;
};


let out = `
<!DOCTYPE html>
<title>Help - zaman.old</title>
<meta content='width=device-width,initial-scale=1,shrink-to-fit=no' name='viewport'/>
<link href='css/basic.css' rel='stylesheet'/>

<div class="nav">
Last update: ${new Date().toLocaleString()}<br>
<a href="faq.html">Situs apa ini?</a><br><br>
<div class="list">${html}</div>
`;



fs.writeFileSync(PATH_out, out);