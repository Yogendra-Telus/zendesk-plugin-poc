const languageKey = "LANGUAGES";

var client = ZAFClient.init();
client.invoke("resize", { width: "100%", height: "280px" });

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

const detectedLanguage = document.getElementById("detected-language");
const detectedText = document.getElementById("detected-text");
const translatedText = document.getElementById("translated-text");
const copyBtn = document.getElementById("copy-btn");

client.get(["ticket.conversation"]).then(function (data) {
  var conversionLength = data["ticket.conversation"].length;

  if (conversionLength) {
    const conversionDetail = data["ticket.conversation"][conversionLength - 1];
    const textToTranslate = conversionDetail.message.content;

    detectedText.innerText = textToTranslate;

    if (textToTranslate) detectLanguageAndTranslate(textToTranslate, client);
  }
});

function detectLanguageAndTranslate(text, client) {
  const url = "https://tl-qa.xavlab.xyz/extension/api/detect";
  const payload = {
    Text: text,
  };

  const optionsForDetect = {
    url,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
  };

  client.request(optionsForDetect).then(async (response) => {
    const { result } = response;
    const languages = await JSON.parse(localStorage.getItem(languageKey));

    if (!!result && Array.isArray(result)) {
      const languageCode = result[0].language;

      const languageDetail = languages.find((lan) => lan.code === languageCode);

      detectedLanguage.innerText = languageDetail?.name || "";

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

          translatedText.innerText = translatedTextFromAPI || "";
        }
      });
    }
  });
}

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(translatedText.innerText);
});
