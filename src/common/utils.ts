import { fromCsvToJson } from "../functions/fromCsvToJson.js";

export const getAvailableLanguages = (fileInputName: string = "input/translations.csv"): string[] => {
    const translations = fromCsvToJson(fileInputName);
    const availableLanguages =
        translations.length > 0 ? Object.keys(translations[0]).filter((key) => !["id", "key"].includes(key)) : [];

    return availableLanguages;
};
