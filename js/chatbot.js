const chatForm = document.querySelector("#chat-form");

const chatInput = document.querySelector("#chat-input");

const chatContainer = document.querySelector("#chat-container");


// OPENROUTER API KEY
const API_KEY = "YOUR_API_KEY";


chatForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const userMessage = chatInput.value;


  // USER MESSAGE
  const userDiv = document.createElement("div");

  userDiv.classList.add("user-message");

  userDiv.innerText = userMessage;

  chatContainer.appendChild(userDiv);


  // BOT MESSAGE
  const botDiv = document.createElement("div");

  botDiv.classList.add("bot-message");

  botDiv.innerText = "Thinking...";

  chatContainer.appendChild(botDiv);


  chatInput.value = "";


  try{

    const response = await fetch(

      "https://openrouter.ai/api/v1/chat/completions",

      {

        method: "POST",

        headers: {

          "Authorization":
          `Bearer ${API_KEY}`,

          "Content-Type":
          "application/json"

        },

        body: JSON.stringify({

          model: "openai/gpt-3.5-turbo",

          messages: [

            {

              role: "system",

              content:
              "You are a helpful AI study assistant for students."

            },

            {

              role: "user",

              content: userMessage

            }

          ]

        })

      }

    );


    const data = await response.json();

    console.log(data);


    if(data.choices){

      botDiv.innerText =

      data.choices[0]
      .message.content;

    }

    else if(data.error){

      botDiv.innerText =
      data.error.message;

    }

    else{

      botDiv.innerText =
      "No AI response.";

    }

  }

  catch(error){

    console.log(error);

    botDiv.innerText =
    "Error connecting to AI.";

  }


  // AUTO SCROLL
  chatContainer.scrollTop =
  chatContainer.scrollHeight;

});