import fs from "fs";
import path from "path";
import { LanguageTranslations, Translation } from "../types/translations.js";
import { XMLParser } from "fast-xml-parser";
import { Parser } from "@json2csv/plainjs";

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

export const fromMultipleXliffToCsv = (xliffFolder: string): any => {
    const map = new Map<string, Translation>();
    const dirPath = path.resolve(xliffFolder);

    console.log("dirPath", dirPath);

    fs.readdirSync(dirPath)
        .filter((fileName: string) => fileName.endsWith(".xliff"))
        .forEach((fileName: string) => {
            const xmlContent = readFile(`${dirPath}/${fileName}`);
            const xmlParser = new XMLParser({ ignoreAttributes: false });
            const { xliff } = xmlParser.parse(xmlContent);

            const { languageCode, translations } = getTranslations(xliff);
            translations.forEach((translation: Translation) => {
                const key = translation.key;
                map.has(key)
                    ? map.set(key, { ...map.get(key), [languageCode]: translation[languageCode] } as Translation)
                    : map.set(key, translation);
            });
        });

    const translations = [...map.values()];
    const csvParser = new Parser({ delimiter: ";" });
    const csvData = csvParser.parse(translations);

    const writeStream = fs.createWriteStream(`translations.csv`, "utf16le");
    writeStream.write(csvData);
    writeStream.end();
    console.log("File saved: translations.csv");
};
