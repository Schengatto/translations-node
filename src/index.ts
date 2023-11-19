import inquirer from "inquirer";
import { fromCsvToJson, fromCsvToJsonFile, generateTranslations, getMissingTranslations } from "./app.js";

const translations = fromCsvToJson();

const availableLanguages =
    translations.length > 0 ? Object.keys(translations[0]).filter((key) => !["id", "key"].includes(key)) : [];

const GENERATE_XLIFF_OPT = "Generate xliff file";
const CHECK_MISSING_TRANSLATIONS_OPT = "Check missing translations";
const CONVERT_CSV_TO_JSON_OPT = "Convert csv to json";

const menu = await inquirer.prompt([
    {
        type: "list",
        name: "option",
        message: "Which utils do you want to use?",
        choices: [GENERATE_XLIFF_OPT, CHECK_MISSING_TRANSLATIONS_OPT, CONVERT_CSV_TO_JSON_OPT],
    },
]);

switch (menu.option) {
    case GENERATE_XLIFF_OPT:
        const opt1_answer = await inquirer.prompt([
            {
                type: "input",
                name: "module",
                message: "What is the name of the weblate module? (default: tours)",
                default: "tours",
            },
            {
                type: "list",
                name: "language",
                message: "What is the target language?",
                choices: availableLanguages,
            },
            {
                type: "input",
                name: "languageCode",
                message: "What is the target language code? (e.g. en-GB)",
                validate(input) {
                    return input.includes("-");
                },
            },
        ]);
        generateTranslations(opt1_answer.languageCode, opt1_answer.language, opt1_answer.module);
        break;

    case CHECK_MISSING_TRANSLATIONS_OPT:
        const opt2_answer = await inquirer.prompt([
            {
                type: "list",
                name: "language",
                message: "What is the target language?",
                choices: availableLanguages,
            },
        ]);
        const missingTranslations = getMissingTranslations(opt2_answer.language);
        const outputText = missingTranslations.length
            ? `There are ${missingTranslations.length} missing translations:\n${missingTranslations.join("\n")}`
            : "No missing translations were found!";
        console.log(outputText);
        break;

    case CONVERT_CSV_TO_JSON_OPT:
        fromCsvToJsonFile();
        break;

    default:
        console.error("Unknown option");
}
