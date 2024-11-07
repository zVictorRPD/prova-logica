import { readFileSync, writeFileSync } from "node:fs";

export class CSVParser {
    constructor(filePath) {
        this.filePath = filePath;
        this.headers = [];
        this.lines = [];
    }

    // Lê o arquivo
    readFile() {
        return readFileSync(this.filePath, "utf8");
    }

    // Removendo aspas adicionais e quebras de linha
    regexToFormatString(value) {
        return value.replace(/["\r \-]/g, "");
    }

    // Utilizado para normalizar os dados do arquivo e salvar em um array
    processFile() {
        const fileContent = this.readFile();

        fileContent.split("\n").forEach((line, index) => {
            if (index === 0) {
                this.headers = line.split(";").map(this.regexToFormatString);
                return;
            }

            const [zipcodeRaw] = line.split(";");
            const zipcode = this.regexToFormatString(zipcodeRaw);

            if (zipcode) {
                this.lines.push({
                    cep: zipcode,
                    logradouro: "",
                    complemento: "",
                    bairro: "",
                    localidade: "",
                    uf: "",
                    unidade: "",
                    ibge: "",
                    gia: "",
                });
            }
        });
    }

    // Utilizado para atualizar uma linha
    updateLine({
        cep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        unidade,
        ibge,
        gia,
    }) {
        this.lines = this.lines.map((line) => {
            if (line.cep === cep) {
                return {
                    cep,
                    logradouro,
                    complemento,
                    bairro,
                    localidade,
                    uf,
                    unidade,
                    ibge,
                    gia,
                };
            }
            return line;
        })
    }

    // Método para completar o endereço
    async completeAddress() {
        const zipcodes = this.lines.map((line) => line.cep);
        let allPromises = [];

        for (let i = 0; i < zipcodes.length; i += 5) {
            const zipcodesSlice = zipcodes.slice(i, i + 5);
            const batchPromises = zipcodesSlice.map(async (zipcode) => {
                try {
                    const response = await fetch(
                        `https://viacep.com.br/ws/${zipcode}/json/`
                    );
                    if(!response.ok) throw new Error("Erro ao buscar CEP");
                    const data = await response.json();
                    this.updateLine({
                        cep: zipcode,
                        logradouro: data.logradouro,
                        complemento: data.complemento,
                        bairro: data.bairro,
                        localidade: data.localidade,
                        uf: data.uf,
                        unidade: data.unidade,
                        ibge: data.ibge,
                        gia: data.gia,
                    });
                } catch (error) {
                    this.updateLine({
                        cep: zipcode,
                        logradouro: "CEP não encontrado ou inválido",
                        complemento: "",
                        bairro: "",
                        localidade: "",
                        uf: "",
                        unidade: "",
                        ibge: "",
                        gia: "",
                    })
                }
            });

            allPromises.push(...batchPromises);

            if (batchPromises.length >= 5 || i + 5 >= zipcodes.length) {
                await Promise.all(batchPromises);
            }
        }

        await Promise.all(allPromises);
    }

    // Formatar os dados para salvar no arquivo
    formatDataToFile() {
        const data = this.getData();
        const formattedData = [data.headers.map((header) => `"${header}"`).join("; ")];
        data.lines.forEach((line) => {
            const formattedLine = [
                `"${line.cep}"`,
                `"${line.logradouro}"`,
                `"${line.complemento}"`,
                `"${line.bairro}"`,
                `"${line.localidade}"`, 
                `"${line.uf}"`,
                `"${line.unidade}"`,
                `"${line.ibge}"`,
                `"${line.gia}"`,
            ].join("; ");
            formattedData.push(formattedLine);
        });

        const fileContent = formattedData.join("\n");
        return fileContent;
    }
    
    // Método para salvar os dados em um arquivo
    saveToFile() {
        const fileContent = this.formatDataToFile();
        writeFileSync("./TAREFA3/CEPs_completados.csv", fileContent);
    }

    // Retorna os dados
    getData() {
        return {
            headers: this.headers,
            lines: this.lines,
        };
    }
}

const parser = new CSVParser("CEPs.csv");
parser.processFile();
await parser.completeAddress();
parser.saveToFile();