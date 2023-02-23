import {
  fetchAllowLanguages,
  detectLanguageUrl,
  translateLanguageUrl,
} from "../constants/endpoints";

export const fetchLanguageList = async () => {
  const options = {
    url: fetchAllowLanguages,
    type: "GET",
  };

  const response = await client.request(options);

  // localStorage.setItem(languageKey, JSON.stringify(response.result));
};

export const detectLanguage = async ({ payload, client }) => {
  const options = {
    url: detectLanguageUrl,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
  };

  return await client.request(options);
};

export const translateLanguage = async ({
  translateFrom,
  translateTo = "en",
  payload,
  client,
}) => {
  const options = {
    url: `${translateLanguageUrl}?to=${translateTo}&from=${translateFrom}`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
  };

  return await client.request(options);
};
