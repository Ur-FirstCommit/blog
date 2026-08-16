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