import { Router } from "express";
import { listarContratos } from "../controllers/contratoController";
import { criarContrato } from "../templates/contratoTemplate.ts";

const router = Router();

// Rota para criar um contrato
router.post("/", criarContrato);

// Rota para listar contratos
router.get("/", listarContratos);

// Rota para baixar um contrato (Futuro)
router.get("/:id/download", (req, res) => {
    res.send("🚀 Aqui retornaremos o contrato em DOCX/PDF futuramente");
});

export default router;