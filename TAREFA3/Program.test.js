import { CSVParser } from "./Program";
import { expect, jest } from "@jest/globals";

// Mock do conteúdo do arquivo
const mockCSVContent =
    "CEP;Logradouro;Complemento;Bairro;Localidade;UF;Unidade;IBGE;GIA\n" +
    "04007-900;;;;;;;\n" +
    "12345 678;;;;;;;";

// Mock do conteúdo do arquivo formatado para salvar
const mockFormattedCSVContent =
    '"CEP"; "Logradouro"; "Complemento"; "Bairro"; "Localidade"; "UF"; "Unidade"; "IBGE"; "GIA"\n' +
    '"04007900"; "Rua Tutóia"; "1157"; "Vila Mariana"; "São Paulo"; "SP"; "IBM Brasil - Indústria, Máquinas e Serviços Ltda"; "3550308"; "1004"\n' +
    '"12345678"; "CEP não encontrado ou inválido"; ""; ""; ""; ""; ""; ""; ""';

// Mock dos headers
const mockHeaders = [
    "CEP",
    "Logradouro",
    "Complemento",
    "Bairro",
    "Localidade",
    "UF",
    "Unidade",
    "IBGE",
    "GIA",
];

// Mock dos dados tratados
const mockTreatedData = [
    {
        cep: "04007900",
        logradouro: "",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
        unidade: "",
        ibge: "",
        gia: "",
    },
    {
        cep: "12345678",
        logradouro: "",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
        unidade: "",
        ibge: "",
        gia: "",
    },
];

const mockApiResponse = [
    {
        cep: "04007900",
        logradouro: "Rua Tutóia",
        complemento: "1157",
        bairro: "Vila Mariana",
        localidade: "São Paulo",
        uf: "SP",
        unidade: "IBM Brasil - Indústria, Máquinas e Serviços Ltda",
        ibge: "3550308",
        gia: "1004",
    },
    {
        cep: "12345678",
        logradouro: "CEP não encontrado ou inválido",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
        unidade: "",
        ibge: "",
        gia: "",
    },
];

describe("CSVParser", () => {
    const parser = new CSVParser("CEPs.csv");

    test("should remove quotes, spaces and hyphens from strings", () => {
        const testCases = [
            { input: '"12345-678"', expected: "12345678" },
            { input: "\r 12345-678 ", expected: "12345678" },
            { input: '\r"12345 678"', expected: "12345678" },
        ];

        testCases.forEach(({ input, expected }) => {
            const result = parser.regexToFormatString(input);
            expect(result).toBe(expected);
        });
    });

    test("should read the file and add the headers and lines", () => {
        parser.readFile = jest.fn().mockReturnValue(mockCSVContent);
        parser.processFile();
        expect(parser.headers).toEqual(mockHeaders);
        expect(parser.lines).toEqual(mockTreatedData);
    });

    test("should complete the address by fetching data from the API", async () => {
        expect.assertions(1);
        parser.lines = mockTreatedData;
        await parser.completeAddress();
        expect(parser.lines).toEqual(mockApiResponse);
    });

    test("should generate the correct content for the file", async () => {
        const fileContent = parser.formatDataToFile();
        expect(fileContent).toEqual(mockFormattedCSVContent);
    });
});
