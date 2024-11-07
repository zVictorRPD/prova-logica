import { readFileSync, writeFileSync } from "fs";

class CSVParser {
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
        return value.replace(/["\r]/g, "");
    }

    // Método para gerar um número aleatório para o IDH
    generateRandomIDH() {
        return (Math.random() * 0.4 + 0.5).toFixed(1);
    }

    // Método para formatar a população
    formatPopulation(population) {
        return (population / 1000).toFixed(1).replace('.', ',') + " mil";
    }

    // Utilizado para normalizar os dados do arquivo e salvar em um array
    processFile() {
        const fileContent = this.readFile();

        fileContent.split("\n").forEach((line, index) => {
            if (index === 0) {
                this.headers = line.split(";").map(header => this.regexToFormatString(header).trim());
                return;
            }

            const [nameRaw, populationRaw] = line.split(";");
            const name = this.regexToFormatString(nameRaw);
            const population = Number(populationRaw);

            if (name && !isNaN(population)) {
                this.lines.push({
                    name,
                    population: this.formatPopulation(population),
                });
            }
        });
    }

    // Inserindo a nova coluna de IDH
    addIDHColumn() {
        this.headers.push("IDH");
        this.lines = this.lines.map((line) => {
            return {
                ...line,
                IDH: this.generateRandomIDH(),
            };
        });
    }

    // Método para salvar os dados em um arquivo
    saveToFile() {
        const data = this.getData();
        const formattedData = [data.headers.map((header) => `"${header}"`).join("; ")];
        data.lines.forEach((line) => {
            const formattedLine = `"${line.name}"; "${line.population}"; ${line.IDH}`;
            formattedData.push(formattedLine);
        });

        const fileContent = formattedData.join("\n");
        writeFileSync("./TAREFA1/mapa_formatado.csv", fileContent);
    }

    // Retorna os dados
    getData() {
        return {
            headers: this.headers,
            lines: this.lines,
        };
    }
}

const parser = new CSVParser("mapa.csv");
parser.processFile();
parser.addIDHColumn();
parser.saveToFile();