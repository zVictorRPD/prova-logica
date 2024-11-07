import { readFileSync, writeFileSync } from "fs";

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
        return value.replace(/["\r]/g, "");
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
                    population,
                });
            }
        });
    }

    // Método para ordernar a população 
    sortPopulation() {
        for (let i = 0; i < this.lines.length; i++) {
            for (let j = 0; j < this.lines.length - 1 - i; j++) {
                if (this.lines[j].population < this.lines[j + 1].population) {
                    const temp = this.lines[j];
                    this.lines[j] = this.lines[j + 1];
                    this.lines[j + 1] = temp;
                }
            }
        }
    }

    // Retorna os 10 primeiros elementos
    getTop10() {
        return this.lines.slice(0, 10);
    }

    // Formatar os dados para salvar no arquivo
    formatDataToFile() {
        const data = this.getData();
        const formattedData = [data.headers.map((header) => `"${header}"`).join("; ")];
        const top_10 = this.getTop10();
        top_10.forEach((line) => {
            const formattedLine = `"${line.name}"; ${line.population}`;
            formattedData.push(formattedLine);
        });
        const fileContent = formattedData.join("\n");
        return fileContent;
    }

    // Método para salvar os dados em um arquivo
    saveToFile() {
        const fileContent = this.formatDataToFile();
        writeFileSync("./TAREFA2/mapa_ordenado.csv", fileContent);
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
parser.sortPopulation();
parser.saveToFile();