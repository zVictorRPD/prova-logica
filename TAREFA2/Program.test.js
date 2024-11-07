import { CSVParser } from "./Program";
import {expect, jest} from '@jest/globals';

// Mock do conteúdo do arquivo
const mockCSVContent = 
    '"Local";"População no último censo"\n' +
    '"Cidade A"; 90000\n' +
    '"Cidade B"; 45000\n' +
    '"Cidade C"; 120000\n' +
    '"Cidade D"; 75000\n' +
    '"Cidade E"; 180000\n' +
    '"Cidade F"; 30000\n' +
    '"Cidade G"; 95000\n' +
    '"Cidade H"; 150000\n' +
    '"Cidade I"; 60000\n' +
    '"Cidade J"; 85000\n' +
    '"Cidade K"; 125000\n' +
    '"Cidade L"; 300000';

// Mock do conteúdo do arquivo formatado para salvar
const mockFormattedCSVContent = 
    '"Local"; "População no último censo"\n' +
    '"Cidade L"; 300000\n' +
    '"Cidade E"; 180000\n' +
    '"Cidade H"; 150000\n' +
    '"Cidade K"; 125000\n' +
    '"Cidade C"; 120000\n' +
    '"Cidade G"; 95000\n' +
    '"Cidade A"; 90000\n' +
    '"Cidade J"; 85000\n' +
    '"Cidade D"; 75000\n' +
    '"Cidade I"; 60000'

// Mock dos dados tratados
const mockTreatedData = [
    { name: "Cidade A", population: 90000 },
    { name: "Cidade B", population: 45000 },
    { name: "Cidade C", population: 120000 },
    { name: "Cidade D", population: 75000 },
    { name: "Cidade E", population: 180000 },
    { name: "Cidade F", population: 30000 },
    { name: "Cidade G", population: 95000 },
    { name: "Cidade H", population: 150000 },
    { name: "Cidade I", population: 60000 },
    { name: "Cidade J", population: 85000 },
    { name: "Cidade K", population: 125000 },
    { name: "Cidade L", population: 300000 },
];

// Mock dos dados ordenados
const mockSortedData = [
    { name: "Cidade L", population: 300000 },
    { name: "Cidade E", population: 180000 },
    { name: "Cidade H", population: 150000 },
    { name: "Cidade K", population: 125000 },
    { name: "Cidade C", population: 120000 },
    { name: "Cidade G", population: 95000 },
    { name: "Cidade A", population: 90000 },
    { name: "Cidade J", population: 85000 },
    { name: "Cidade D", population: 75000 },
    { name: "Cidade I", population: 60000 },
    { name: "Cidade B", population: 45000 },
    { name: "Cidade F", population: 30000 },
];

// Mock dos top 10 dados
const mockTop10Data = mockSortedData.slice(0, 10);

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

    test("should read the file and add the headers and lines", () => {
        parser.readFile = jest.fn().mockReturnValue(mockCSVContent);
        parser.processFile();
        expect(parser.headers).toEqual(["Local", "População no último censo"]);
        expect(parser.lines).toEqual(mockTreatedData);
    });

    test("should sort the population in descending order", () => {
        parser.lines = mockTreatedData;
        parser.sortPopulation();
        expect(parser.lines).toEqual(mockSortedData);
    });

    test("should get the top 10 cities by population", () => {
        parser.lines = mockSortedData;
        const top10 = parser.getTop10();
        expect(top10).toEqual(mockTop10Data);
    });

    test("should generate the correct content for the file", () => {
        parser.lines = mockSortedData;
        const fileContent = parser.formatDataToFile();
        expect(fileContent).toBe(mockFormattedCSVContent);
    });
});
