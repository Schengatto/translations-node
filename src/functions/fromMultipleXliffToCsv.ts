import fs from "fs";
import path from "path";
import { LanguageTranslations, Translation } from "../types/translations.js";

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

const getTranslations = (xliff: Record<string, any>): LanguageTranslations => {
    const languageCode = getLanguageCode(xliff);

    const transUnits = xliff.file.body["trans-unit"] || [];
    const translations = transUnits.map((transUnit: Record<string, any>) =>
        fromTransUnitToTranslate(transUnit, languageCode)
    );
    return { languageCode, translations };
};

const readFile = (filePath: string): string => {
    const data = fs.readFileSync(filePath);
    return data.toString();
};

const fromMultipleXliffToCsv = (xliffFolder: string, filters: string[] = []): any => {
    const map = new Map<string, Translation>();
    const dirPath = path.resolve(xliffFolder);

    console.log("dirPath", dirPath);

    fs.readdirSync(dirPath)
        .filter((fileName: string) => fileName.endsWith(".xliff"))
        .forEach((fileName: string) => {
            const xmlContent = readFile(`${dirPath}/${fileName}`);
            const { xliff } = xmlParser.parse(xmlContent);
            const { languageCode, translations } = getTranslations(xliff);

            const filteredTranslations = filters.length
                ? translations.filter((t) => filters.some((filter) => t.key.includes(filter)))
                : translations;

            filteredTranslations.forEach((translation: Translation) => {
                const key = translation.key;
                map.has(key)
                    ? map.set(key, { ...map.get(key), [languageCode]: translation[languageCode] } as Translation)
                    : map.set(key, translation);
            });
        });

    const filteredTranslations = [...map.values()];
    const csvData = csvParser.parse(filteredTranslations);

    // Remove quotes around each field
    const updatedData = csvData.replace(/\"(.*?)\"/g, "$1");

    const writeStream = fs.createWriteStream(`translations.csv`, "utf16le");
    writeStream.write(updatedData);
    writeStream.end();
    console.log("File saved: translations.csv");
};

export const convertMultipleXliffToCsv = async () => {
    const multipleCsvToXliffAnswer = await inquirer.prompt([
        {
            type: "input",
            name: "dirPath",
            message: "What is the dir path of the xliff file?",
            default: "./input/xliff-module",
        },
        {
            type: "input",
            name: "rowFilters",
            message: "Type key filters separed by comma (eg: 'mykey,mykey2') or leave empty in order to parse all keys",
            default: "",
        },
    ]);
    const filters = multipleCsvToXliffAnswer.rowFilters.split(",");
    fromMultipleXliffToCsv(multipleCsvToXliffAnswer.dirPath, filters);
};
