const languageKey = "LANGUAGES";

var client = ZAFClient.init();

client.invoke("resize", { width: "100%", height: "340px" });

const fetchLanguageList = () => {
  const options = {
    url: "https://tl-qa.xavlab.xyz/extension/api/languages/allowed",
    type: "GET",
  };

  client.request(options).then((response) => {
    localStorage.setItem(languageKey, JSON.stringify(response.result));
  });
};

fetchLanguageList();

const chatRoom = document.getElementById("chat-container");
const sendBtn = document.getElementById("send-btn");
const sendText = document.getElementById("send-txt");
let updateLangCode = "en";

setInterval(() => {
  client.get(["ticket.conversation"]).then(function (data) {
    var conversionLength = data["ticket.conversation"].length;

    if (conversionLength) {
      const conversations = data["ticket.conversation"];

      detectLanguageAndTranslate(conversations, client);
    }
  });
}, 1000);

function detectLanguageAndTranslate(conversations, client) {
  const conversationElements = [];

  conversations.forEach((element, elementId) => {
    const text = element.message.content;
    const payload = {
      Text: text,
    };

    const optionsForDetect = {
      url: "https://tl-qa.xavlab.xyz/extension/api/detect",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
    };

    client.request(optionsForDetect).then(async (response) => {
      const { result } = response;
      const languages = await JSON.parse(localStorage.getItem(languageKey));

      if (!!result && Array.isArray(result)) {
        const languageCode = result[0].language;

        if (elementId === conversations.length - 1)
          updateLangCode = languageCode;

        const languageDetail = languages.find(
          (lan) => lan.code === languageCode
        );

        // detectedLanguage.innerText = languageDetail?.name || "";

        const optionsForTranslate = {
          url: `https://tl-qa.xavlab.xyz/extension/api/translator?to=en&from=${languageCode}`,
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(payload),
        };

        client.request(optionsForTranslate).then((response) => {
          const { result } = response;

          if (!!result && Array.isArray(result)) {
            const translatedTextFromAPI = result[0].translations[0].text;

            // translatedText.innerText = translatedTextFromAPI || "";

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

  const intervalId = setInterval(() => {
    if (conversations.length === conversationElements.length) {
      while (chatRoom.firstChild) {
        chatRoom.removeChild(parentElement.firstChild);
      }

      conversationElements.sort((a, b) => a.id - b.id);

      conversationElements.forEach((e) => {
        chatRoom.appendChild(e.node);
      });

      clearInterval(intervalId);
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
        .invoke("ticket.comment.appendText", result[0].translations[0].text)
        .then(() => {
          sendText.value = "";
        });
    }
  });
});

client.on("message", (data) => {
  console.log("data", data);
});
