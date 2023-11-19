import { Translation } from "../types/translations.js";
import { fromCsvToJson } from "./fromCsvToJson.js";

export function getMissingTranslations(languageField: string): string[] {
    return fromCsvToJson()
        .filter((translation: Translation) => !translation[languageField])
        .map((translation: Translation) => translation.key);
}