import { Request, Response } from "express";
import path from "path";

// Simulando um banco de dados em memória
let contratos = [
    {
        id: 1,
        contratante: "Empresa XYZ",
        servico: "Desenvolvimento Web",
        valor: "R$ 1.000"
    },
];


export const criarContrato = (req: Request, res: Response) => {
    const { contratante, servico, valor } = req.body;
    const contratoTemplatePath = path.join(__dirname, "../templates/contrato.json");

    if (!contratante || !servico || !valor) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const novoContrato = { id: contratos.length + 1, contratante, servico, valor };
    contratos.push(novoContrato);

    res.status(201).json(novoContrato);
};

export const listarContratos = (req: Request, res: Response) => {
    res.json({ mensagem: "Lista de contratos", contratos });
};
