import "../css/main.css";
import { detectLanguage, translateLanguage } from "../utils/functions";

var client = ZAFClient.init();

client.invoke("resize", { width: "100%", height: "340px" });

const chatRoom = document.getElementById("chat-container");
const sendBtn = document.getElementById("send-btn");
const sendText = document.getElementById("send-txt");
let updateLangCode = "en";

client.get(["ticket.conversation"]).then(function (data) {
  var conversionLength = data["ticket.conversation"].length;

  if (conversionLength) {
    const conversations = data["ticket.conversation"];

    detectLanguageAndTranslate(conversations, client);
  }
});

client.on("ticket.conversation.changed", function (conversations) {
  const conversionLength = conversations.length;

  if (conversionLength) {
    detectLanguageAndTranslate(conversations, client);
  }
});

function detectLanguageAndTranslate(conversations, client) {
  const conversationElements = [];

  conversations.forEach((element, elementId) => {
    const textInHTML = element.message.content;
    const convertInElement = document.createElement("div");
    convertInElement.innerHTML = textInHTML;

    const text = convertInElement.textContent;

    const payload = {
      Text: text,
    };

    detectLanguage({ payload, client }).then((response) => {
      const { result } = response;

      if (!!result && Array.isArray(result)) {
        const languageCode = result[0].language;

        if (elementId === conversations.length - 1)
          updateLangCode = languageCode;

        translateLanguage({
          client,
          payload,
          translateFrom: languageCode,
        }).then((response) => {
          const { result } = response;

          if (!!result && Array.isArray(result)) {
            const translatedTextFromAPI = result[0].translations[0].text;

            const chatContainer = document.createElement("div");
            chatContainer.id = `${elementId}`;
            chatContainer.classList.add("chat-item");

            const headingContainer = document.createElement("div");
            headingContainer.classList.add("heading");

            const authorName = document.createElement("div");
            authorName.innerText = element.author.name;
            authorName.classList.add("username");

            const timeOfMsg = document.createElement("div");
            const time = new Date(element.timestamp).toLocaleTimeString();
            const date = new Date(element.timestamp).toLocaleDateString();
            timeOfMsg.innerText = date + "  " + time;
            timeOfMsg.classList.add("date-time");

            headingContainer.appendChild(authorName);
            headingContainer.appendChild(timeOfMsg);

            const messageContainer = document.createElement("div");
            messageContainer.classList.add("msg-container");

            const originalMsg = document.createElement("div");
            originalMsg.innerText = text;
            originalMsg.style.marginBottom = "5px";

            const translatedMsg = document.createElement("div");
            translatedMsg.style.display = "flex";

            const translatedHeading = document.createElement("div");
            translatedHeading.style.marginRight = "10px";
            translatedHeading.innerText = "Translated Text:";
            translatedHeading.classList.add("translation-heading");
            const translatedText = document.createElement("div");
            translatedText.innerText = `${translatedTextFromAPI}`;

            translatedMsg.appendChild(translatedHeading);
            translatedMsg.appendChild(translatedText);

            messageContainer.appendChild(originalMsg);
            messageContainer.appendChild(translatedMsg);

            chatContainer.appendChild(headingContainer);
            chatContainer.appendChild(messageContainer);

            conversationElements.push({ id: elementId, node: chatContainer });
          }
        });
      }
    });
  });

  const timeoutId = setTimeout(() => {
    if (conversations.length === conversationElements.length) {
      chatRoom.innerHTML = "";

      conversationElements.sort((a, b) => a.id - b.id);

      conversationElements.forEach((e) => {
        chatRoom.appendChild(e.node);
      });

      const scrollTimeoutId = setTimeout(() => {
        chatRoom.scrollTop = chatRoom.scrollHeight;

        clearTimeout(scrollTimeoutId);
      }, 500);

      clearTimeout(timeoutId);
    }
  }, 1000);
}

sendBtn.addEventListener("click", () => {
  const payload = {
    Text: sendText.value,
  };
  const optionsForTranslate = {
    url: `https://tl-qa.xavlab.xyz/extension/api/translator?to=${updateLangCode}&from=en`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
  };

  client.request(optionsForTranslate).then((response) => {
    const { result } = response;
    if (!!result && Array.isArray(result)) {
      client
        .invoke("ticket.sendMessage", {
          channel: "messaging",
          message: result[0].translations[0].text,
        })
        .then(() => {
          sendText.value = "";
        });
    }
  });
});