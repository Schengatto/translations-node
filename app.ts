function fromCsvToJson(): any[] {
    let csvToJson = require("convert-csv-to-json");
    let fileInputName = "input/translations.csv";
    return csvToJson.parseSubArray("*", ",").getJsonFromCsv(fileInputName);
}

function fromCsvToJsonFile(): void {
    let csvToJson = require("convert-csv-to-json");
    let fileInputName = "input/translations.csv";
    let fileOutputName = "translations.json";
    csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);
}

function checkForMissingTranslations(languageField: string): string[] {
    return fromCsvToJson()
        .filter((translation) => !translation[languageField])
        .map((translation) => translation["ns1:source"]);
}

function generateTranslations(languageCode: string, languageField: string): string {
    const headTemplate = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:jms="urn:jms:translation" version="1.2">
      <file date="2022-08-17T08:31:06.073Z" source-language="en-GB" target-language="${languageCode}" datatype="plaintext" original="not.available">
        <header>
          <tool tool-id="JMSTranslationBundle" tool-name="JMSTranslationBundle" tool-version="1.1.0-DEV"/>
          <note>The source node in most cases contains the sample message as written by the developer. If it looks like a dot-delimited string such as "form.label.firstname", then the developer has not provided a default message.</note>
        </header>
        <body>`;

    const footerTemplate = `    </body>
    </file>
  </xliff>`;

    const body = fromCsvToJson().reduce(
        (output, translation) => `${output}
    <trans-unit id="${translation.id}" resname="${translation["ns1:source"]}">
        <source>${translation.key}</source>
        <target state="${translation.state}">${translation[languageField]}</target>
      </trans-unit>`,
        ""
    );

    const xmlFormat = require("xml-formatter");
    const result = xmlFormat(
        `${headTemplate}
    ${body}
    ${footerTemplate}`,
        {
            indentation: "  ",
            collapseContent: true,
            lineSeparator: "\n",
        }
    );

    const fs = require("fs");
    const writeStream = fs.createWriteStream(`tours-fe.${languageCode}.xliff`);
    writeStream.write(result);
    writeStream.end();

    return result;
}

export { generateTranslations, checkForMissingTranslations, fromCsvToJson, fromCsvToJsonFile };
