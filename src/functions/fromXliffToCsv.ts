import fs from "fs";
import { Translation } from "../types/translations.js";
import { csvParser } from "../common/csvParser.js";
import { xmlParser } from "../common/xmlParser.js";
import inquirer from "inquirer";

const getLanguageCode = (xliff: Record<string, any>): string => {
    return xliff?.file["@_target-language"] ?? "";
};

const fromTransUnitToTranslate = (transUnit: Record<string, any>, languageCode: string): Translation => {
    const id = transUnit["@_id"];
    const key = transUnit.source;
    const value = transUnit.target["#text"];
    return { id, key, [languageCode]: value };
};

const getTranslations = (xliff: Record<string, any>): Translation[] => {
    const languageCode = getLanguageCode(xliff);

    const transUnits = xliff.file.body["trans-unit"] || [];
    return transUnits.map((transUnit: Record<string, any>) => fromTransUnitToTranslate(transUnit, languageCode));
};

const readFile = (filePath: string): string => {
    const data = fs.readFileSync(filePath);
    return data.toString();
};

const fromXliffToCsv = (fileName: string): any => {
    const xmlContent = readFile(fileName);
    const { xliff } = xmlParser.parse(xmlContent);

    const translations = getTranslations(xliff);
    const csvData = csvParser.parse(translations);

    const writeStream = fs.createWriteStream(`translations.csv`, "utf16le");
    writeStream.write(csvData);
    writeStream.end();
    console.log("File saved: translations.csv");
};

export const convertXliffToCsv = async() => {
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
};