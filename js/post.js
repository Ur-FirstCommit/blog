function parseFrontMatter(md){
 const m=md.match(/^---\s*([\s\S]*?)\s*---\s*/);const data={};let body=md;
 if(m){m[1].split(/\r?\n/).forEach(line=>{const i=line.indexOf(":");if(i<0)return;let k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1);data[k]=v});body=md.slice(m[0].length)}
 return {meta:data,body};
}
function readingTime(t){return Math.max(1,Math.ceil(t.trim().split(/\s+/).length/200))}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
async function load(){
 const file=new URLSearchParams(location.search).get("post");
 const article=document.querySelector("#article");
 if(!file){article.innerHTML='<div class="article-wrap"><h1>Post not found.</h1></div>';return}
 try{
  const raw=await fetch("posts/"+file).then(r=>r.text());
  const {meta,body}=parseFrontMatter(raw);
  document.title=meta.title+" — FirstCommit";
  article.innerHTML=`<div class="article-wrap">
    <a class="article-back" href="index.html">← BACK TO BLOG</a>
    <div class="article-meta"><span class="tag">${esc(meta.category||"BUILDING")}</span><span>${new Date(meta.date+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span><span>${readingTime(body)} MIN READ</span></div>
    <h1>${esc(meta.title)}</h1>
    ${meta.description?`<p class="article-description">${esc(meta.description)}</p>`:""}
    <div class="article-content">${marked.parse(body)}</div>
  </div>`;
 }catch(e){article.innerHTML='<div class="article-wrap"><h1>Could not load this post.</h1><p>Use a local server when developing this site.</p></div>'}
}
const saved=localStorage.getItem("fc-theme");if(saved==="light")document.body.classList.add("light");
document.querySelector("#themeToggle").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("fc-theme",document.body.classList.contains("light")?"light":"dark")};
document.querySelector("#year").textContent=new Date().getFullYear();
load();

const fsPill=document.querySelector("#floatingPill");
const fsInput=document.querySelector("#floatingInput");
const fsResults=document.querySelector("#floatingResults");
let fsPosts=[],fsActive=false;
fetch("posts/index.json").then(r=>r.json()).then(names=>Promise.all(names.map(n=>fetch("posts/"+n).then(r=>r.text()).then(raw=>{const{meta,body}=parseFrontMatter(raw);return{...meta,body,file:n}})))).then(posts=>{fsPosts=posts});
function fsExpand(){
 if(fsActive)return;
 fsPill.classList.add("expanded");fsActive=true;
 requestAnimationFrame(()=>setTimeout(()=>fsInput.focus(),120));
}
function fsCollapse(){
 if(fsInput.value)return;
 fsResults.classList.remove("visible");
 fsInput.value="";
 setTimeout(()=>{fsPill.classList.remove("expanded");fsResults.innerHTML="";fsActive=false},40);
}
fsPill.addEventListener("click",()=>{if(!fsActive)fsExpand()});
fsInput.addEventListener("blur",()=>setTimeout(fsCollapse,180));
fsInput.addEventListener("input",()=>{
 const q=fsInput.value.toLowerCase().trim();
 if(!q){fsResults.classList.remove("visible");fsResults.innerHTML="";return}
 const hits=fsPosts.filter(p=>(p.title+" "+p.description+" "+p.category).toLowerCase().includes(q)).slice(0,5);
 fsResults.innerHTML=hits.length?hits.map(p=>`<a class="fs-result" href="post.html?post=${encodeURIComponent(p.file)}"><small>${esc(p.category||"BUILDING")}</small><b>${esc(p.title)}</b></a>`).join(""):'<div class="fs-empty">No matching stories.</div>';
 fsResults.classList.add("visible");
});
document.addEventListener("keydown",e=>{
 if((e.metaKey||e.ctrlKey)&&e.key==="/"){e.preventDefault();fsExpand()}
 if(e.key==="Escape"&&fsActive){fsInput.blur();fsCollapse()}
});