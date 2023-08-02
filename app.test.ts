import { generateTranslations, checkForMissingTranslations, fromCsvToJson, fromCsvToJsonFile } from "./app";

test("should generate translations", () => {
    expect(generateTranslations("pt-PT", "Portuguese")).not.toBeNull();
});

test("checkForMissingTranslations should return the list of missing translations", () => {
    const missingTranslations = checkForMissingTranslations("Portuguese");
    expect(missingTranslations).not.toBeNull();
    console.log(missingTranslations.join("\n"));
});

test("fromCsvToJson should return the JSON object from the file translations.csv", async () => {
    const translations = fromCsvToJson();
    expect(translations).not.toBeNull();
    console.log(translations);
});

test("fromCsvToJsonFile should create the file translations.json from the file translations.csv", async () => {
    const translations = fromCsvToJsonFile();
});