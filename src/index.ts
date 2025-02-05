import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contratoRoutes from "./routes/contratoRoutes";
import { criarContrato } from "./templates/contratoTemplate.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const dadosContrato = {
    contratado: "Ampla Tecnologia e Serviços",
    contratante: "Maria Souza",
    servico: "Petição ANVISA assunto 733",
    valor: "R$ 1.000,00",
    data: "05 de fevereiro de 2025",
    cidade: "João Pessoa",
};

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/contratos", contratoRoutes);

// Inicializando o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}/contratos`);
});



// Gerar o contrato
criarContrato(dadosContrato);
