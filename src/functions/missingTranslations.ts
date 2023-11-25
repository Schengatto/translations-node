import inquirer from "inquirer";
import { Translation } from "../types/translations.js";
import { fromCsvToJson } from "./fromCsvToJson.js";
import { getAvailableLanguages } from "../common/utils.js";

export const checkMissingTranslations = async(): Promise<void> => {
    const { filePath } = await inquirer.prompt([
        {
            type: "input",
            name: "filePath",
            message: "What is the path of the csv file? (default: input/translations.csv)",
            default: "input/translations.csv",
        },
    ]);

    const missingTranslationsAnswer = await inquirer.prompt([
        {
            type: "list",
            name: "language",
            message: "What is the target language?",
            choices: getAvailableLanguages(filePath),
        },
    ]);
    const missingTranslations = getMissingTranslations(missingTranslationsAnswer.language);
    const outputText = missingTranslations.length
        ? `There are ${missingTranslations.length} missing translations:\n${missingTranslations.join("\n")}`
        : "No missing translations were found!";
    console.log(outputText);
}

const getMissingTranslations = (languageField: string): string[] => {
    return fromCsvToJson()
        .filter((translation: Translation) => !translation[languageField])
        .map((translation: Translation) => translation.key);
};
