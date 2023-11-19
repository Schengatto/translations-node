import { Translation } from "./types/translations.js";
import csvToJson from "convert-csv-to-json";
import xmlFormat from "xml-formatter";
import fs from "fs";

export function fromCsvToJson(): any[] {
    let fileInputName = "input/translations.csv";
    let jsonOutput = null;
    try {
        jsonOutput = csvToJson.parseSubArray("*", ",").getJsonFromCsv(fileInputName);
        if (!jsonOutput) {
            throw new Error("The input file is an invalid CSV file");
        }

    } catch (e) {
        throw new Error(`The CSV file is not valid: ${e}`);
    }
    const incompletedTranslations = jsonOutput.filter((translationRow: Translation) => !translationRow.id || !translationRow.key);

    if (incompletedTranslations.length) {
        console.warn("The input file is missing values for id or key.", incompletedTranslations);
    }

    return jsonOutput;
}

export function fromCsvToJsonFile(): void {
    let fileInputName = "input/translations.csv";
    let fileOutputName = "translations.json";
    csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);
}

export function getMissingTranslations(languageField: string): string[] {
    return fromCsvToJson()
        .filter((translation) => !translation[languageField])
        .map((translation) => translation.key);
}

export function getTargetTag(translationValue: string): string {
    return translationValue ? `<target state="translated">${translationValue}</target>` : `<target state="new" />`;
}

export function generateTranslations(
    languageCode: string,
    languageField: string,
    weblateModuleName: string = "tours-fe"
): string {
    const header = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:jms="urn:jms:translation" version="1.2">
      <file date="2022-08-17T08:31:06.073Z" source-language="en-GB" target-language="${languageCode}" datatype="plaintext" original="not.available">
        <header>
          <tool tool-id="JMSTranslationBundle" tool-name="JMSTranslationBundle" tool-version="1.1.0-DEV"/>
          <note>The source node in most cases contains the sample message as written by the developer. If it looks like a dot-delimited string such as "form.label.firstname", then the developer has not provided a default message.</note>
        </header>
        <body>`;

    const footer = `</body></file></xliff>`;

    const body = fromCsvToJson().reduce(
        (output: string, translation: Translation) => `${output}
    <trans-unit id="${translation.id}" resname="${translation.key}">
        <source>${translation.key}</source>
        ${getTargetTag(translation[languageField])}
      </trans-unit>`,
        ""
    );

    const result = xmlFormat(`${header}${body}${footer}`, {
        indentation: "  ",
        collapseContent: true,
        lineSeparator: "\n",
    });

    const writeStream = fs.createWriteStream(`${weblateModuleName}.${languageCode}.xliff`);
    writeStream.write(result);
    writeStream.end();

    return result;
}
