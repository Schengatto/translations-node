import inquirer from "inquirer";
import xmlFormat from "xml-formatter";
import fs from "fs";
import { fromCsvToJson } from "./fromCsvToJson.js";
import { Translation } from "../types/translations.js";
import { getAvailableLanguages } from "../common/utils.js";

export const convertCsvToXliff = async () => {
    const { filePath } = await inquirer.prompt([
        {
            type: "input",
            name: "filePath",
            message: "What is the path of the csv file? (default: input/translations.csv)",
            default: "input/translations.csv",
        },
    ]);

    const { languageCode, language, module } = await inquirer.prompt([
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
            choices: getAvailableLanguages(filePath),
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
    generateTranslations(languageCode, language, module);
};

const getTargetTag = (translationValue: string): string => {
    return translationValue ? `<target state="translated">${translationValue}</target>` : `<target state="new" />`;
};

const generateTranslations = (
    languageCode: string,
    languageField: string,
    weblateModuleName: string = "tours-fe"
): string => {
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
};
