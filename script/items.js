'use strict';

const fs   = require('fs');
const ROOT = "/storage/sdcard0/Download/script/pengumpul.ilmu/";


// outer loop
const DIR = fs.readdirSync(ROOT + "data/");
for(let i=0; i<DIR.length; i++){
   main(DIR[i]);
};



function main(item){

const PATH       = ROOT + "data/" + item + "/";
const META       = JSON.parse(fs.readFileSync(PATH + "meta.json"));
const PATH_out   = PATH + "index.html";
const PATH_drive = PATH + "drive.json";
const PATH_dur   = PATH + "dur.txt";

const URL_source = META.source;
const URL_download_item = "https://drive.google.com/uc?id=";
const URL_download_all = `https://drive.google.com/drive/folders/${META.drive_folder}`;

const files = JSON.parse(fs.readFileSync(PATH_drive)).files;
const dur   = fs.readFileSync(PATH_dur).toString().split("\n");

let html      = "";
let totalsize = 0;
let totalitem = files.length;
let totaldur  = (dur[totalitem]/3600).toFixed(2);

for(let i=0; i<files.length; i++){
  let name = files[i].name.split('.');
  html += `
<li>
  <span>${i+1}</span>
  <span>${name[1].substr(1)}</span>
  <span>9/18/2019</span>
  <span>${(dur[i] || "").substr(0,8)}</span>
  <span>${(files[i].size/1048576).toFixed(2)}Mb</span><br>
  <span><a href="${URL_download_item + files[i].id}&export=download" target="blank">Download</a></span>
  <span><a href="${URL_download_item + files[i].id}" target="blank">Play Now</a></span>
</li>`;

  totalsize += parseInt(files[i].size);
};

let out = `
<!DOCTYPE html>
<title>Pengumpul Ilmu / ${item}</title>
<meta content='width=device-width,initial-scale=1,shrink-to-fit=no' name='viewport'/>
<link href='../../css/basic.css' rel='stylesheet'/>
<div class="nav">
Last update: ${new Date().toLocaleString()}<br>
<a href="../../faq.html">Situs apa ini?</a>
<br><br>
<a href="../../">Home</a> / ${item}</div>
<div class="info">
  <span>Title: ${META.title}</span>
  <span>Ustaz: ${META.ustaz}</span>
  <span>Source: ${META.source_name}</span>
  <span>Total duration: ${totaldur} hours (${totalitem} items)</span>
  <span>Total size: ${(totalsize/1048576).toFixed(2)}Mb</span>
  <span>Filetype: ${META.filetype}</span>
  <span class="dl-all"><a href="${URL_source}" target="blank">Source</a></span>
  <span class="dl-all"><a href="${URL_download_all}" target="blank">Download All</a></span>
</div>
<div class="list">${html}</div>
`;

fs.writeFileSync(PATH_out, out);
};



