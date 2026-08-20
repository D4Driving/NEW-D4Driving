const fs = require("fs");
const path = require("path");

const SITE = process.argv[2];
const html = fs.readFileSync(path.join(SITE, "blog.html"), "utf8");

const MONTHS = { Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",
                 Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12" };

function decode(s) {
  return s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
          .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g," ")
          .replace(/&rsquo;/g,"\u2019").replace(/&hellip;/g,"\u2026").trim();
}
function toISO(d) {
  const m = /^(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})$/.exec(d.trim());
  if (!m) return "";
  return m[3] + "-" + (MONTHS[m[2]] || "01") + "-" + String(m[1]).padStart(2,"0");
}
function grab(block, cls) {
  const re = new RegExp('<div class="' + cls + '">([\\s\\S]*?)</div>');
  const m = re.exec(block);
  return m ? decode(m[1].replace(/<[^>]+>/g,"")) : "";
}

const cardRe = /<a href="([^"]+)" class="blog-card glass-card">([\s\S]*?)<\/a>/g;
const out = [];
let m;
while ((m = cardRe.exec(html)) !== null) {
  const url = m[1], block = m[2];
  const img = (/<img src="([^"]+)"/.exec(block) || [,""])[1];
  const dateRaw = (/<span class="blog-date">([^<]+)<\/span>/.exec(block) || [,""])[1];
  let excerpt = grab(block, "blog-excerpt").replace(/\u2026+$/,"").trim();
  out.push({
    title: grab(block, "blog-title"),
    excerpt: excerpt,
    url: url,
    date: toISO(dateRaw),
    image: img,
    category: grab(block, "blog-cat") || "Driving Tips"
  });
}

out.sort((a,b) => (b.date || "").localeCompare(a.date || ""));

const missingDate = out.filter(a => !a.date).length;
const missingImg  = out.filter(a => !a.image).length;
const missingUrl  = out.filter(a => !a.url).length;

fs.writeFileSync(path.join(SITE, "articles.json"), JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("posts written : " + out.length);
console.log("missing date  : " + missingDate);
console.log("missing image : " + missingImg);
console.log("missing url   : " + missingUrl);
console.log("newest        : " + out[0].date + "  " + out[0].title);
console.log("oldest        : " + out[out.length-1].date + "  " + out[out.length-1].title);
