import { Parser } from "@json2csv/plainjs";


export const csvParser = new Parser({
    delimiter: ";",
    withBOM: true,
});