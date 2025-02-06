import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { contratoTemplate } from "../templates/contratoTemplate";

// Caminho do arquivo JSON onde os contratos serão salvos
const contratosFilePath = path.join(__dirname, "../data/contratos.json");
const pdfsPath = path.resolve(__dirname, "../data/pdfs");

// Criar a pasta "pdfs" se não existir
// if (!fs.existsSync(pdfsPath)) {
//     fs.mkdirSync(pdfsPath);
// }

// Função auxiliar para ler os contratos do JSON
const lerContratos = (): any[] => {
    try {
        const data = fs.readFileSync(contratosFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Função auxiliar para salvar contratos no JSON
const salvarContratos = (contratos: any[]) => {
    fs.writeFileSync(contratosFilePath, JSON.stringify(contratos, null, 2), "utf-8");
};

// ✅ Função para gerar e salvar um contrato
export const gerarContrato = async (req: Request, res: Response) => {
    try {

        const dadosContrato = req.body;
        if (dadosContrato == undefined) {
            console.error('Dados não podem ser nulos');
        }
        contratoTemplate(dadosContrato); // Gera o DOCX
        
        // Carregar os contratos existentes e adicionar o novo
        const contratos = lerContratos();
        contratos.push({
            id: contratos.length + 1,
            ...dadosContrato,
            criado_em: new Date().toISOString()
        });

        salvarContratos(contratos);

        res.status(201).json({ mensagem: "Contrato gerado e salvo com sucesso!", contrato: dadosContrato });
    } catch (error) {
        console.error("❌ Erro ao gerar contrato:", error);
        res.status(500).json({ erro: "Erro ao gerar contrato", detalhes: error });
    }
};

// codigo para criar pdf

// 🔹 Definir margens
const MARGEM_SUPERIOR = 50;
const MARGEM_ESQUERDA = 30;
const MARGEM_DIREITA = 30;
const ALTURA_MINIMA = 100; // Quando o conteúdo chega a essa altura, cria uma nova página

// 🔹 Definir tamanhos de fonte
const TAMANHO_FONTE_TITULO = 10;
const TAMANHO_FONTE_TEXTO = 10;
const TAMANHO_FONTE_ASSINATURA = 8;

// 🔹 Dados fixos do contratado
const DADOS_CONTRATADO = {
    nome: "Sérgio Ricardo Barbosa Maciel de Sousa 02347967401",
    cnpj: "20.528.992/0001-31",
    estadoCivil: "Casado",
    enderecoSede: "Rua Ozório Velozo Cruz Gouveia, 15 A, Bairro: Funcionarios IV, Cidade: João Pessoa - PB",
    enderecoResidencia: "Rua Ozório Velozo Cruz Gouveia, 15 A, Bairro: Funcionarios IV, Cidade: joão Pessoa - PB",
    cpf: "023.479.674-01",
    natural: "Timbaúba - PE",
};

// 🔹 Função para adicionar um título com sublinhado
const adicionarTitulo = (page: any, text: string, x: number, y: number, font: any) => {
    const textWidth = font.widthOfTextAtSize(text, TAMANHO_FONTE_TITULO);
    page.drawText(text, { x: x + (page.getWidth() - textWidth) / 2 - MARGEM_ESQUERDA, y, font, size: TAMANHO_FONTE_TITULO });
    page.drawLine({
        start: { x: x + (page.getWidth() - textWidth) / 2 - MARGEM_ESQUERDA, y: y - 2 },
        end: { x: x + (page.getWidth() + textWidth) / 2 - MARGEM_ESQUERDA, y: y - 2 },
        thickness: 1,
        color: rgb(0, 0, 0)
    });
};

// 🔹 Função para adicionar texto e criar nova página se necessário
const adicionarTextoComQuebra = (
    pdfDoc: PDFDocument,
    page: any,
    text: string,
    x: number,
    y: number,
    font: any,
    larguraMaxima: number,
    alturaMinima: number
) => {
    const { height, width } = page.getSize();
    
    // Quebrar o texto em múltiplas linhas se for muito longo
    const palavras = text.split(" ");
    let linha = "";
    const linhas: string[] = [];

    palavras.forEach((palavra) => {
        if (font.widthOfTextAtSize(linha + palavra, TAMANHO_FONTE_TEXTO) < larguraMaxima) {
            linha += `${palavra} `;
        } else {
            linhas.push(linha.trim());
            linha = `${palavra} `;
        }
    });
    linhas.push(linha.trim());

    linhas.forEach((linhaTexto) => {
        if (y < alturaMinima) {
            // Criar nova página se não houver espaço
            page = pdfDoc.addPage([width, height]);
            y = height - MARGEM_SUPERIOR;
        }

        page.drawText(linhaTexto, { x, y, font, size: TAMANHO_FONTE_TEXTO });
        y -= 20; // Espaçamento entre linhas
    });

    return { page, y };
};

// 🔹 Função para gerar um PDF formatado com margens fixas
export const gerarContratoPDF = async (req: Request, res: Response) => {
    try {
        const { contratado, contratante, servico, valor, data, cidade } = req.body;

        const pdfDoc = await PDFDocument.create();
        const pageWidth = 595; // Largura A4 em pontos
        const pageHeight = 842; // Altura A4 em pontos
        let page = pdfDoc.addPage([pageWidth, pageHeight]); // Primeira página
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let y = pageHeight - MARGEM_SUPERIOR;

        // 🔹 Título do contrato
        adicionarTitulo(page, "CONTRATO DE PRESTAÇÃO DE MICRO SERVIÇOS", MARGEM_ESQUERDA, y, font);
        y -= 30;

        // 🔹 Dados do contratante
        ({ page, y } = adicionarTextoComQuebra(pdfDoc, page, `CONTRATANTE: ${contratante}`, MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA));

        // 🔹 Dados do contratado (fixos)

        adicionarTitulo(page, "CONTRATADO", MARGEM_ESQUERDA, y, font);
        y -= 20;
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            `NOME/RAZÃO SOCIAL: ${DADOS_CONTRATADO.nome}, Portado do CNPJ: ${DADOS_CONTRATADO.cnpj}, com sede na ${DADOS_CONTRATADO.enderecoSede}, Estado Civil: ${DADOS_CONTRATADO.estadoCivil}, natural de ${DADOS_CONTRATADO.natural}, portador de CPF: ${DADOS_CONTRATADO.cpf}, residente e dominiliado na ${DADOS_CONTRATADO.enderecoResidencia}`,
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));

        // 🔹 Objeto do contrato
        adicionarTitulo(page, "OBJETO DO CONTRATO", MARGEM_ESQUERDA, y, font);
        y -= 20;
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page, `Este contrato tem como objeto a prestação de micro serviço referente a ${servico}.`,
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));

        // 🔹 Remuneração
        adicionarTitulo(page, "REMUNERAÇÃO", MARGEM_ESQUERDA, y, font);
        y -= 20;
        ({ page, y } = adicionarTextoComQuebra(pdfDoc, page, `Serviço: ${servico}`, MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA));
        ({ page, y } = adicionarTextoComQuebra(pdfDoc, page, `Valor: ${valor}`, MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA));

        // 🔹 Obrigações do Contratado
        adicionarTitulo(page, "OBRIGAÇÕES DO CONTRATADO (A)", MARGEM_ESQUERDA, y, font);
        y -= 20;
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            "- Desenvolver o microserviço conforme especificações acordadas;",
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            "- Garantir a integridade e a confidencialidade das informações fornecidas pela CONTRATANTE;",
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            "- Garantir a efetividade da entrega dos documentos finalizando o microserviço.",
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));

        // 🔹 Obrigações do Contratante
        adicionarTitulo(page, "OBRIGAÇÕES DO CONTRATANTE (A)", MARGEM_ESQUERDA, y, font);
        y -= 20;
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            "- Fornecer todas as informações e recursos necessários para o desenvolvimento do microserviço;",
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            "- Efetuar os pagamentos nas condições estabelecidas neste contrato.",
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));

        // 🔹 Disposições gerais
        adicionarTitulo(page, "DISPOSIÇÕES GERAIS", MARGEM_ESQUERDA, y, font);
        y -= 20;
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            `Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da comarca de ${cidade}. Por estarem de pleno acordo com os termos deste contrato, as partes assinam o presente instrumento em duas vias de igual teor`,
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));

        // 🔹 Confidencialidade
        adicionarTitulo(page, "CONFIDENCIALIDADE", MARGEM_ESQUERDA, y, font);
        y -= 20;
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            "Ambas as partes comprometem-se a manter sigilo sobre todas as informações trocadas durante e após a vigência deste contrato.",
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));

        // 🔹 Recisão
        adicionarTitulo(page, "RECISÃO", MARGEM_ESQUERDA, y, font);
        y -= 20;
        ({ page, y } = adicionarTextoComQuebra(
            pdfDoc, page,
            "Este contrato poderá ser rescindido por qualquer das partes em caso de: .",
            MARGEM_ESQUERDA, y, font, pageWidth - MARGEM_DIREITA - MARGEM_ESQUERDA, ALTURA_MINIMA
        ));


        // 🔹 Assinaturas
        page.drawText(`${cidade}, ${data}`, { x: page.getWidth() - MARGEM_DIREITA, y, font, size: TAMANHO_FONTE_TEXTO});


        adicionarTitulo(page, "ASSINATURAS", MARGEM_ESQUERDA, y, font);
        y -= 50;
        page.drawText("_________________________", { x: MARGEM_ESQUERDA, y, font, size: TAMANHO_FONTE_ASSINATURA });
        y -= 15;
        page.drawText(`CONTRATANTE: ${contratante}`, { x: MARGEM_ESQUERDA, y, font, size: TAMANHO_FONTE_ASSINATURA });
        y -= 50;
        page.drawText("_________________________", { x: MARGEM_ESQUERDA, y, font, size: TAMANHO_FONTE_ASSINATURA });
        y -= 15;
        page.drawText(`CONTRATADO: ${contratado}`, { x: MARGEM_ESQUERDA, y, font, size: TAMANHO_FONTE_ASSINATURA });

        // Salvar o PDF
        const pdfBytes = await pdfDoc.save();
        const pdfPath = path.join(__dirname, `contrato_${Date.now()}.pdf`);
        fs.writeFileSync(pdfPath, pdfBytes);

        console.log("✅ PDF gerado:", pdfPath);

        res.status(201).json({ mensagem: "Contrato gerado com sucesso!", pdf: pdfPath });
    } catch (error) {
        console.error("❌ Erro ao gerar PDF:", error);
        res.status(500).json({ mensagem: "Erro ao gerar contrato em PDF" });
    }
};







// ✅ Função para listar todos os contratos salvos
export const listarContratos = (req: Request, res: Response) => {
    const contratos = lerContratos();
    res.status(200).json(contratos);
};
