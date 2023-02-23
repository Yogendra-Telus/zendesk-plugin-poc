const baseURL = process.env.BASE_URL;

export const fetchAllowLanguages = `${baseURL}/extension/api/languages/allowed`;

export const detectLanguageUrl = `${baseURL}/extension/api/detect`;

export const translateLanguageUrl = `${baseURL}/extension/api/translator`;
