import fs from "fs";
import { Translation } from "../types/translations.js";
import { XMLParser } from "fast-xml-parser";
import { Parser } from '@json2csv/plainjs';

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

export const fromXliffToCsv = (fileName: string): any => {
    const xmlContent = readFile(fileName);
    const xmlParser = new XMLParser({ ignoreAttributes: false });
    const { xliff } = xmlParser.parse(xmlContent);

    const translations = getTranslations(xliff);
    const csvParser = new Parser({delimiter: ";"});
    const csvData = csvParser.parse(translations);

    const writeStream = fs.createWriteStream(`translations.csv`, "utf16le");
    writeStream.write(csvData);
    writeStream.end();
    console.log("File saved: translations.csv");
};
