'use strict';

const ROOT       = "/storage/sdcard0/Download/zaman.old/";
const PATH_out   = ROOT + "index.html";
const PATH_drive = ROOT + "data/BYH. Al-Hikam/drive.json";
const PATH_dur   = ROOT + "data/BYH. Al-Hikam/dur.txt";

const URL_home = "https://zzvvzx.github.io/zaman.old/";
const URL_source = "https://www.youtube.com/playlist?list=PLZlkOj3-mAkD8WfxMydcTXHiagq5IV-G9";
const URL_download_item = "https://drive.google.com/uc?id=";
const URL_download_all = "https://drive.google.com/drive/folders/1-ELEIlePwqMhvdCLkJV0ofNy8kqa3Evt";


const fs   = require('fs');
const file = fs.readFileSync(PATH_drive);
const dur  = fs.readFileSync(PATH_dur).toString().split("\n");
const files = JSON.parse(file).files;
files.reverse();

let html = "";
let totalsize = 0;
let totalitem = dur.length;
let totaldur  = (dur[totalitem-2]/3600).toFixed(2);


for(let i=0; i<files.length; i++){
  html += `
<li>
  <span>${i+1}</span>
  <span>${files[i].name.slice(4,-5)}</span>
  <span>9/18/2019</span>
  <span>8Kbp/s(opus)</span>
  <span>${(dur[i] || "").substr(0,8)}</span>
  <span>${(files[i].size/1000000).toFixed(2)}Mb</span><br>
  <span><a href="${URL_download_item + files[i].id}&export=download" target="blank">Download</a></span>
  <span><a href="${URL_download_item + files[i].id}" target="blank">Play Now</a></span>
</li>`;

  totalsize += parseInt(files[i].size);
};


let out = `
<!DOCTYPE html>
<title>zaman.old</title>
<meta content='width=device-width,initial-scale=1,shrink-to-fit=no' name='viewport'/>
<link href='css/basic.css' rel='stylesheet'/>

<div class="nav">
Last update: ${new Date().toLocaleString()}<br>
<a href="help.html">Situs apa ini?</a>
<br><br>
<a href="">Home</a> / BYH. Al-Hikam</div>
<div class="info">
  <span>Title: Kajian Kitab Al-Hikam</span>
  <span>Ustaz: Buya Yahya</span>
  <span>Source: Al-Bahjah TV</span>
  <span>Total duration: ${totaldur} hours (${totalitem} items)</span>
  <span>Total size: ${(totalsize/1000000).toFixed(2)}Mb</span>
  <span>Filetype: Audio/opus 8k</span>
  <span class="dl-all"><a href="${URL_source}" target="blank">Source</a></span>
  <span class="dl-all"><a href="${URL_download_all}" target="blank">Download All</a></span>
</div>

<div class="list">${html}</div>
`;



fs.writeFileSync(PATH_out, out);

