'use strict';

const fs   = require('fs');
const ROOT = "/storage/sdcard0/Download/zaman.old/";
const PATH_out = ROOT + "faq.html";

let out = `
<!DOCTYPE html>
<title>Faq - kajian.zaman.old</title>
<meta content='width=device-width,initial-scale=1,shrink-to-fit=no' name='viewport'/>
<link href='css/basic.css' rel='stylesheet'/>

<div class="nav">
Last update: ${new Date().toLocaleString()}<br>
<a href="index.html">Home</a><br>

<pre>
<b>Situs apa ini?</b>
Situs koleksi kajian penting

<b>Untuk apa?</b>
Koleksi saja,, 
backup jg kalo2 youtube down

<b>Apa kelebihannya?</b>
  1. Gratis
  2. Sudah disusun rapih
  2. Ringan
      Ytbe 360p: 337.45 Mb
      Opus 8k: 7.57 Mb (98% less space)
  3. Gampang download

<b>Apa kurangnya?</b>
  Audio only

<b>Cara pake?</b>
  Pilih kajian, trus play/download sja


 kritik & saran: IG @zzv.zx

</pre
`;

fs.writeFileSync(PATH_out, out);
