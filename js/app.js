const state={posts:[],category:"All"};

function parseFrontMatter(md){
  const match=md.match(/^---\s*([\s\S]*?)\s*---\s*/);
  const data={}; let body=md;
  if(match){
    match[1].split(/\r?\n/).forEach(line=>{
      const i=line.indexOf(":"); if(i<0)return;
      let k=line.slice(0,i).trim(), v=line.slice(i+1).trim();
      if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1);
      if(v==="true")v=true; else if(v==="false")v=false;
      data[k]=v;
    });
    body=md.slice(match[0].length);
  }
  return {meta:data,body};
}
function readingTime(text){return Math.max(1,Math.ceil(text.trim().split(/\s+/).length/200))}
async function loadPosts(){
  try{
    const names=await fetch("posts/index.json").then(r=>r.json());
    state.posts=await Promise.all(names.map(async name=>{
      const raw=await fetch("posts/"+name).then(r=>r.text());
      const {meta,body}=parseFrontMatter(raw);
      return {...meta,body,file:name,readingTime:readingTime(body)};
    }));
    state.posts.sort((a,b)=>new Date(b.date)-new Date(a.date));
    render();
  }catch(e){
    document.querySelector("#posts").innerHTML='<div class="empty">Could not load posts. Run this site through a local server.</div>';
  }
}
function render(){
  const filtered=state.category==="All"?state.posts:state.posts.filter(p=>(p.category||"Uncategorized")===state.category);
  const featured=document.querySelector("#featured");
  const grid=document.querySelector("#posts");
  const f=filtered.find(p=>p.featured)||filtered[0];
  featured.innerHTML=f?`<a class="featured" href="post.html?post=${encodeURIComponent(f.file)}"><div class="featured-main"><span class="tag">FEATURED / ${esc(f.category||"BUILDING")}</span><h3>${esc(f.title)}</h3><p>${esc(f.description||"A FirstCommit story.")}</p><span class="read">Read story <b>↗</b></span></div><div class="featured-side"><span>FIRST<br>COMMIT</span><b>↗</b></div></a>`:"";
  grid.innerHTML=filtered.filter(p=>p!==f).map(p=>`<a class="post-card" href="post.html?post=${encodeURIComponent(p.file)}"><div class="card-top"><span class="tag">${esc(p.category||"BUILDING")}</span><span>${fmt(p.date)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.description||"")}</p><span class="read">Read <b>→</b></span></a>`).join("");
  document.querySelector("#empty").classList.toggle("hidden",filtered.length>0);
  buildCategories();
}
function buildCategories(){
  const cats=["All",...new Set(state.posts.map(p=>p.category||"Uncategorized"))];
  document.querySelector("#categories").innerHTML=cats.map(c=>`<button class="${c===state.category?"active":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;render();document.querySelector("#filterModal").classList.add("hidden")});
}
function fmt(d){return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function openSearch(){document.querySelector("#searchModal").classList.remove("hidden");setTimeout(()=>document.querySelector("#searchInput").focus(),30)}
function closeSearch(){document.querySelector("#searchModal").classList.add("hidden")}
document.querySelector("#searchOpen").onclick=openSearch;
document.querySelector("#searchClose").onclick=closeSearch;
document.querySelector("#filterOpen").onclick=()=>document.querySelector("#filterModal").classList.remove("hidden");
document.querySelector("#filterClose").onclick=()=>document.querySelector("#filterModal").classList.add("hidden");
document.querySelectorAll(".modal-backdrop").forEach(x=>x.onclick=()=>x.parentElement.classList.add("hidden"));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();document.querySelector("#filterModal").classList.add("hidden")}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}});
document.querySelector("#searchInput").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase().trim(), box=document.querySelector("#searchResults");
 if(!q){box.innerHTML="";return}
 box.innerHTML=state.posts.filter(p=>(p.title+" "+p.description+" "+p.category).toLowerCase().includes(q)).slice(0,7).map(p=>`<a class="result" href="post.html?post=${encodeURIComponent(p.file)}"><small>${esc(p.category||"BUILDING")}</small><b>${esc(p.title)}</b></a>`).join("")||'<div class="empty">No matching stories.</div>';
});
const saved=localStorage.getItem("fc-theme");if(saved==="light")document.body.classList.add("light");
document.querySelector("#themeToggle").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("fc-theme",document.body.classList.contains("light")?"light":"dark")};
document.querySelector("#year").textContent=new Date().getFullYear();
loadPosts();

const fsPill=document.querySelector("#floatingPill");
const fsInput=document.querySelector("#floatingInput");
const fsResults=document.querySelector("#floatingResults");
let fsActive=false;
function fsExpand(){fsPill.classList.add("expanded");fsActive=true;setTimeout(()=>fsInput.focus(),50)}
function fsCollapse(){if(fsInput.value)return;fsPill.classList.remove("expanded");fsResults.classList.remove("visible");fsResults.innerHTML="";fsActive=false}
fsPill.addEventListener("click",e=>{if(!fsActive)fsExpand()});
fsInput.addEventListener("blur",()=>setTimeout(fsCollapse,150));
fsInput.addEventListener("input",()=>{
 const q=fsInput.value.toLowerCase().trim();
 if(!q){fsResults.classList.remove("visible");fsResults.innerHTML="";return}
 const hits=state.posts.filter(p=>(p.title+" "+p.description+" "+p.category).toLowerCase().includes(q)).slice(0,5);
 fsResults.innerHTML=hits.length?hits.map(p=>`<a class="fs-result" href="post.html?post=${encodeURIComponent(p.file)}"><small>${esc(p.category||"BUILDING")}</small><b>${esc(p.title)}</b></a>`).join(""):'<div class="fs-empty">No matching stories.</div>';
 fsResults.classList.add("visible");
});
document.addEventListener("keydown",e=>{
 if((e.metaKey||e.ctrlKey)&&e.key==="/"){e.preventDefault();fsExpand()}
 if(e.key==="Escape"&&fsActive){fsInput.blur();fsCollapse()}
});