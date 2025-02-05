import { criarContrato } from "./templates/contratoTemplate.ts";

const dadosContrato = {
    contratado: "Ampla Tecnologia e Serviços",
    contratante: "Maria Souza",
    servico: "Petição ANVISA assunto 733",
    valor: "R$ 1.000,00",
    data: "05 de fevereiro de 2025",
};

// Gerar o contrato
criarContrato(dadosContrato);
