import { Router } from "express";
import { gerarContrato, listarContratos } from "../controllers/contratoController";
import { gerarContratoPDF } from "../controllers/contratoController";

const router = Router();

// Rota para criar um contrato
router.post("/", gerarContrato);

// Rota para listar contratos
router.get("/", listarContratos);
router.post("/gerar-pdf", gerarContratoPDF); // Nova rota para gerar PDF

// Rota para baixar um contrato (Futuro)
router.get("/:id/download", (req, res) => {
    res.send("🚀 Aqui retornaremos o contrato em DOCX/PDF futuramente");
});

export default router;