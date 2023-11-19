import csvToJson from "convert-csv-to-json";
import { Translation } from "../types/translations.js";

export function fromCsvToJson(fileInputName = "input/translations.csv"): any[] {
    let jsonOutput = null;
    try {
        jsonOutput = csvToJson.parseSubArray("*", ",").getJsonFromCsv(fileInputName);
        if (!jsonOutput) {
            throw new Error("The input file is an invalid CSV file");
        }
    } catch (e) {
        throw new Error(`The CSV file is not valid: ${e}`);
    }
    const incompletedTranslations = jsonOutput.filter(
        (translationRow: Translation) => !translationRow.id || !translationRow.key
    );

    if (incompletedTranslations.length) {
        console.warn("The input file is missing values for id or key.", incompletedTranslations);
    }

    return jsonOutput;
}

export function fromCsvToJsonFile(
    fileInputName = "input/translations.csv",
    fileOutputName = "translations.json"
): void {
    csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);
}
