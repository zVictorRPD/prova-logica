# Teste prático - Lógica Básica - v4

Teste de lógica para programadores Jr. proposto pela TG4 desenvolvido utilizando JavaScript

### Bibliotecas instaladas

- jest v29.7.0

## Estrutura do projeto

```markdown
├── TAREFA1/
│   ├── mapa_formatado.csv             # Arquivo gerado após tratativa     
│   ├── Program.js                     # Arquivo com a lógica da tarefa
│   └── Program.test.js                # Arquivo com a lógica de testes     
├── TAREFA1/
│   ├── mapa_ordenado.csv                     
│   ├── Program.js                     
│   └── Program.test.js 
└── TAREFA1/
    ├── CEPs_complementados.csv                     
    ├── Program.js                     
    └── Program.test.js 
```

## Comandos de execução

Clone o projeto

```bash
  git clone https://github.com/zVictorRPD/prova-logica.git
```

Entre no diretório do projeto

```bash
  cd prova-logica
```

Instale as dependências

```bash
  npm install
```

Inicie a tarefa desejada (tarefa1, tarefa2 ou tarefa3)

```bash
  npm run tarefa1
```

Inicie o teste desejado (test1, test2 ou test3)

```bash
  npm run test1
```

## Observações

No arquivo de CEPs.csv existe o código "4711130" que está faltando um número, ao colocar 0 na primeira posição encontrei um CEP válido e bem similar aos outros, porém, como não sei se é proposital ou não, resolvi deixar dessa forma e apenas tratar o erro.
