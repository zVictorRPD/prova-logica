import { CSVParser } from "./Program";
import {expect, jest} from '@jest/globals';

// Mock do conteúdo do arquivo
const mockCSVContent = 
    '"Local";"População no último censo"\n' +
    '"Cidade A"; 90000\n' +
    '"Cidade B"; 45000';

// Mock do conteúdo do arquivo formatado para salvar
const mockFormattedCSVContent = 
    '"Local"; "População no último censo"; "IDH"\n' +
    '"Cidade A"; "90,0 mil"; 0.7\n' +
    '"Cidade B"; "45,0 mil"; 0.6';

// Mock dos dados tratados
const mockTreatedData = [
    { name: "Cidade A", population: "90,0 mil" },
    { name: "Cidade B", population: "45,0 mil" },
];

// Mock dos dados tratados com IDH
const mockTreatedDataWithIDH = [
    { name: "Cidade A", population: "90,0 mil", IDH: "0.7" },
    { name: "Cidade B", population: "45,0 mil", IDH: "0.6" },
];

describe("CSVParser", () => {
    const parser = new CSVParser("mapa.csv");

    test("should remove extra quotes and line breaks", () => {
        const testCases = [
            { input: '"Cidade A"', expected: "Cidade A" },
            { input: '\r"Cidade B"', expected: "Cidade B" },
        ];

        testCases.forEach(({ input, expected }) => {
            expect(parser.regexToFormatString(input)).toBe(expected);
        });
    });

    test("should generate IDH between 0.5 and 0.9", () => {
        for (let i = 0; i < 100; i++) {
            const idh = parseFloat(parser.generateRandomIDH());
            expect(idh).toBeGreaterThanOrEqual(0.5);
            expect(idh).toBeLessThanOrEqual(0.9);
        }
    });

    test("should correctly format population numbers", () => {
        const testCases = [
            { input: 1000, expected: "1,0 mil" },
            { input: 90000, expected: "90,0 mil" },
            { input: 110000, expected: "110,0 mil" },
        ];

        testCases.forEach(({ input, expected }) => {
            expect(parser.formatPopulation(input)).toBe(expected);
        });
    });

    test("should read the file and add the headers and lines", () => {
        parser.readFile = jest.fn().mockReturnValue(mockCSVContent);
        parser.processFile();
        expect(parser.headers).toEqual(["Local", "População no último censo"]);
        expect(parser.lines).toEqual(mockTreatedData);
    });

    test("should add IDH column correctly", () => {
        parser.lines = mockTreatedData;
        parser.addIDHColumn();
        expect(parser.headers).toContain("IDH");
        parser.lines.forEach((line) => {
            expect(line).toHaveProperty("IDH");
            const idh = parseFloat(line.IDH);
            expect(idh).toBeGreaterThanOrEqual(0.5);
            expect(idh).toBeLessThanOrEqual(0.9);
        });
    });

    test("should generate the correct content for the file", () => {
        parser.lines = mockTreatedDataWithIDH;
        const fileContent = parser.formatDataToFile();
        expect(fileContent).toBe(mockFormattedCSVContent);
    });
});
