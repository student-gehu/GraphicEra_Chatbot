let prompt=document.querySelector('#prompt');
let chatContainer=document.querySelector('.chat_container');

const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCMTJ1o5EegGhzeKsTKukHxT5nv2EwLeaA"
let user={
    data:null,
}

async function generateResponse(aiChatBox){

    let text=aiChatBox.querySelector(".teacher-chat-area")
    
    let RequestOption={
        method:'POST',
        headers:{ 'Content-Type':'application/json'},
        body:JSON.stringify({
            "contents": [{
                "parts":[{"text": user.data}]
            }]
        })
    }
    try{
        let response=await fetch(Api_Url,RequestOption);
        let data=await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        text.innerHTML=apiResponse;
    }catch(error){
        console.log("error")
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
    }
    
}


function createChatBox(html,classes){
    let div=document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);
    return div;
}

async function handlechatResponse(message){
    user.data=message
    let html =  `<img src="img/user.png" alt="" id="userImage" width="50">
    <div class="user-chat-area">${user.data}</div>`

    prompt.value=' ';//clar the prompt 
    let userChatBox=createChatBox(html,"user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});

    const notes = await fetchNotes(user.data);
    let aiChatBox = createChatBox(`<img src="img/teacher1.png" alt="" id="AiImage" width="50">
                                    <div class="teacher-chat-area">${notes}</div>`, "teacher-chat-box");


    setTimeout(()=>{
        let html =  `  <img src="img/teacher1.png" alt="" id="AiImage" width="50">
            <div class="teacher-chat-area">
            <img src="img/loading.gif" alt="loading" width="50px">
            </div>`
            let aiChatBox=createChatBox(html,"teacher-chat-box");
            chatContainer.appendChild(aiChatBox);
            generateResponse(aiChatBox)
        },600)
}

//code for message write box
prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        handlechatResponse(prompt.value)
    }
        
})