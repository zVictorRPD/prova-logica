import { readFileSync } from 'fs';

class CSVParser {
    constructor(filePath) {
        this.filePath = filePath;
        this.headers = [];
        this.lines = [];
    }

    // Lê o arquivo
    readFile() {
        return readFileSync(this.filePath, 'utf8');
    }

    // Removendo aspas adicionais e quebras de linha
    regexToFormatString(value) {
        return value.replace(/["\r]/g, "");
    }

    // Utilizado para normalizar os dados do arquivo e salvar em um array
    processFile() {
        const fileContent = this.readFile();
        
        fileContent.split('\n').forEach((line, index) => {
            if (index === 0) {
                this.headers = line.split('; ').map(this.regexToFormatString);
                return;
            }
            
            const [nameRaw, populationRaw] = line.split(';');
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

    // Retorna os dados
    getData() {
        return {
            headers: this.headers,
            lines: this.lines
        };
    }
}


const parser = new CSVParser('mapa.csv');
parser.processFile();
const data = parser.getData();
console.log(data);


