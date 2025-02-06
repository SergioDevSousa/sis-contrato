import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contratoRoutes from "./routes/contratoRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Agora a API funciona corretamente com "/contratos"
app.use("/contratos", contratoRoutes);

// Inicializando o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}/contratos`);
});
