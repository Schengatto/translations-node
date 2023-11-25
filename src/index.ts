import inquirer from "inquirer";
import { fromCsvToJsonFile } from "./functions/fromCsvToJson.js";
import { convertMultipleXliffToCsv } from "./functions/fromMultipleXliffToCsv.js";
import { convertXliffToCsv } from "./functions/fromXliffToCsv.js";
import { convertCsvToXliff } from "./functions/generateXliff.js";
import { checkMissingTranslations } from "./functions/missingTranslations.js";

const CONVERT_CSV_TO_XLIFF = "Convert csv to xliff";
const CONVERT_CSV_TO_JSON_OPT = "Convert csv to json";
const CONVERT_XLIFF_TO_CSV_OPT = "Convert xliff to csv";
const CONVERT_MULTIPLE_XLIFF_TO_CSV_OPT = "Convert multiple xliff to csv";
const CHECK_MISSING_TRANSLATIONS_OPT = "Check for missing translations";

const menu = await inquirer.prompt([
    {
        type: "list",
        name: "option",
        message: "Which function do you need",
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
        await convertCsvToXliff();
        break;

    case CHECK_MISSING_TRANSLATIONS_OPT:
        await checkMissingTranslations();
        break;

    case CONVERT_CSV_TO_JSON_OPT:
        await fromCsvToJsonFile();
        break;

    case CONVERT_XLIFF_TO_CSV_OPT:
        await convertXliffToCsv();
        break;

    case CONVERT_MULTIPLE_XLIFF_TO_CSV_OPT:
        await convertMultipleXliffToCsv();
        break;

    default:
        console.error("Unknown option");
};
