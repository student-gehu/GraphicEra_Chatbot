const prompt=document.querySelector('#prompt');
const chatContainer=document.querySelector('.chat_container');

const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCMTJ1o5EegGhzeKsTKukHxT5nv2EwLeaA"
const user={
    data:null,
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".teacher-chat-area");

    // Check if the user input is a request for fetching notes
    const fetchNotesRegex = /fetch (\w+) sir notes(?: with keyword (.+))?/i; 
    const match = user.data.match(fetchNotesRegex);

    if (match) {
        const teacherName = match[1].trim();
        const keyword = match[2] ? match[2].trim() : ''; // Get the keyword if it exists


        console.log("Fetching notes for:", teacherName, "with keyword:", keyword); // Debug log


        // Fetch notes from the server
        try {
            const response =await fetch(`http://localhost:3000/fetch-notes?teacher_name=${encodeURIComponent(teacherName)}&keyword=${encodeURIComponent(keyword)}`);
            const data = await response.json();


            console.log("Response data:", data); // Debug log


            if (data.length > 0) {
                const pdfLinks = data.map(note => `<a href="${note.file_url}" target="_blank">${note.file_url}</a>`).join('<br>');
                text.innerHTML = `Found the following notes:<br>${pdfLinks}`;
            } else {
                text.innerHTML = 'No notes found for the specified teacher.';
            }
        } catch (error) {
            // console.error("Error fetching notes:", error);
            text.innerHTML = 'Error fetching notes.';
        }
    } else {
        // If not a fetch request, proceed with the existing API call
        let RequestOption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "contents": [{
                    "parts": [{ "text": user.data }]
                }]
            })
        };
        try {
            let response = await fetch(Api_Url, RequestOption);
            let data = await response.json();
            let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            text.innerHTML = apiResponse;
        } catch (error) {
            console.log("error");
        } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        }
    }
}

function createChatBox(html,classes){
    let div=document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);
    return div;
}

function handlechatResponse(message){
    user.data=message
    let html =  `<img src="img/user.png" alt="" id="userImage" width="50">
    <div class="user-chat-area">${user.data}</div>`

    prompt.value=' ';//clar the prompt 
    let userChatBox=createChatBox(html,"user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});

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

const menuIcon = document.getElementById("menu-icon");
const menuContent = document.getElementById("menu-content");

menuIcon.addEventListener("click", () => {
  if (menuContent.style.display === "block") {
    menuContent.style.display = "none"; // Hide the menu
  } else {
    menuContent.style.display = "block"; // Show the menu
    menuContent.style.left = "0px"; // Slide in from the right
  }
});

// Log out functionality
document.getElementById("logout").addEventListener("click", function () {
  alert("You have been logged out!");
  window.location.href = "login.html"; // Redirect to your login page
});