import inquirer from "inquirer";
import { fromCsvToJson, fromCsvToJsonFile } from "./functions/fromCsvToJson.js";
import { generateTranslations } from "./functions/generateXliff.js";
import { getMissingTranslations } from "./functions/missingTranslations.js";
import { fromXliffToCsv } from "./functions/fromXliffToCsv.js";
import { fromMultipleXliffToCsv } from "./functions/fromMultipleXliffToCsv.js";

const translations = fromCsvToJson();

const availableLanguages =
    translations.length > 0 ? Object.keys(translations[0]).filter((key) => !["id", "key"].includes(key)) : [];

const CONVERT_CSV_TO_XLIFF = "Convert csv to xliff";
const CONVERT_CSV_TO_JSON_OPT = "Convert csv to json";
const CONVERT_XLIFF_TO_CSV_OPT = "Convert xliff to csv";
const CONVERT_MULTIPLE_XLIFF_TO_CSV_OPT = "Convert multiple xliff to csv";
const CHECK_MISSING_TRANSLATIONS_OPT = "Check for missing translations";

const menu = await inquirer.prompt([
    {
        type: "list",
        name: "option",
        message: "Which utils do you want to use?",
        choices: [
            CONVERT_CSV_TO_XLIFF,
            CONVERT_CSV_TO_JSON_OPT,
            CONVERT_XLIFF_TO_CSV_OPT,
            CONVERT_MULTIPLE_XLIFF_TO_CSV_OPT,
            CHECK_MISSING_TRANSLATIONS_OPT,
        ],
    },
]);

switch (menu.option) {
    case CONVERT_CSV_TO_XLIFF:
        const convertToXliffAnswer = await inquirer.prompt([
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
        generateTranslations(
            convertToXliffAnswer.languageCode,
            convertToXliffAnswer.language,
            convertToXliffAnswer.module
        );
        break;

    case CHECK_MISSING_TRANSLATIONS_OPT:
        const missingTranslationsAnswer = await inquirer.prompt([
            {
                type: "list",
                name: "language",
                message: "What is the target language?",
                choices: availableLanguages,
            },
        ]);
        const missingTranslations = getMissingTranslations(missingTranslationsAnswer.language);
        const outputText = missingTranslations.length
            ? `There are ${missingTranslations.length} missing translations:\n${missingTranslations.join("\n")}`
            : "No missing translations were found!";
        console.log(outputText);
        break;

    case CONVERT_CSV_TO_JSON_OPT:
        fromCsvToJsonFile();
        break;

    case CONVERT_XLIFF_TO_CSV_OPT:
        const csvToXliffAnswer = await inquirer.prompt([
            {
                type: "input",
                name: "filePath",
                message: "What is the path of the xliff file?",
                default: "tours.fr-FR.xliff",
                validate(input: string) {
                    return input.endsWith(".xliff");
                },
            },
        ]);
        fromXliffToCsv(csvToXliffAnswer.filePath);
        break;

    case CONVERT_MULTIPLE_XLIFF_TO_CSV_OPT:
        const multipleCsvToXliffAnswer = await inquirer.prompt([
            {
                type: "input",
                name: "dirPath",
                message: "What is the dir path of the xliff file?",
                default: "./input",
            },
        ]);
        fromMultipleXliffToCsv(multipleCsvToXliffAnswer.dirPath);
        break;

    default:
        console.error("Unknown option");
}
