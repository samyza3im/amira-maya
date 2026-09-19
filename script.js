const PASSWORD="2109";
const home=document.getElementById("home"), password=document.getElementById("password"), errorScreen=document.getElementById("errorScreen"), reveal=document.getElementById("reveal");
const knife=document.getElementById("knife"), date=document.getElementById("date"), go=document.getElementById("go"), wrong=document.getElementById("wrong"), retry=document.getElementById("retry"), music=document.getElementById("music"), sound=document.getElementById("sound");
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function show(s){[home,password,errorScreen,reveal].forEach(x=>x.classList.toggle("active",x===s));}
async function takeKnife(){
 knife.disabled=true;
 knife.style.transition="transform .75s cubic-bezier(.15,.8,.2,1)";
 knife.style.transform="translate(-135px,-105px) rotate(-48deg) scale(1.02)";
 await wait(760); knife.style.opacity="0"; await wait(250);
 show(password); date.focus();
}
async function success(){
 show(home);
 const cake=document.querySelector(".real-cake");
 const r=cake.getBoundingClientRect(), k=knife.getBoundingClientRect();
 const x=r.left+r.width*.63-(k.left+k.width/2), y=r.top+r.height*.46-(k.top+k.height/2);
 knife.style.opacity="1"; knife.style.transition="none"; knife.style.transform=`translate(${x}px,${y-125}px) rotate(-48deg)`;
 await wait(400);
 knife.style.transition="transform .55s cubic-bezier(.18,.8,.2,1)";
 knife.style.transform=`translate(${x-5}px,${y+8}px) rotate(-48deg)`;
 await wait(500);
 show(reveal);
 try{music.volume=.8;await music.play()}catch(e){}
}
function fail(){wrong.style.display="block";show(errorScreen)}
go.onclick=()=>date.value.replace(/\D/g,"")===PASSWORD?success():fail();
date.oninput=()=>{date.value=date.value.replace(/\D/g,"").slice(0,4);wrong.style.display="none"};
date.onkeydown=e=>{if(e.key==="Enter")go.click()};
retry.onclick=()=>{knife.disabled=false;knife.style="";show(home);date.value="";wrong.style.display="none"};
sound.onclick=()=>{if(music.paused){music.play();sound.textContent="PAUSE"}else{music.pause();sound.textContent="SON"}};
knife.onclick=takeKnife;
