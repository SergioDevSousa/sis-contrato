import { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, Table, TableRow, TableCell, WidthType } from "docx";
import { writeFileSync } from "fs";

export const criarContrato = (dados: { 
    contratado: string; 
    contratante: string; 
    servico: string; 
    valor: string; 
    data: string; 
}) => {
    const doc = new Document({
        sections: [
            {
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "CONTRATO DE PRESTAÇÃO DE MICRO SERVIÇOS", font: "Arial", bold: true, size: 28 })],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                children: [new TextRun("Página ")],
                                alignment: AlignmentType.RIGHT,
                            }),
                        ],
                    }),
                },
                children: [
                    new Paragraph("\n"),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "CONTRATANTE: ", font: "Arial", bold: true }),
                            new TextRun(dados.contratante),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "CONTRATADO: ", font: "Arial", bold: true }),
                            new TextRun(dados.contratado),
                        ],
                    }),
                    new Paragraph("\n"),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "OBJETO DO CONTRATO", font: "Arial", bold: true, size: 14 }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Paragraph("\n"),

                    new Paragraph(`Este contrato tem como objeto a prestação de micro serviço de ${dados.servico}.`),
                    new Paragraph("\n"),

                    // dados implementado
                    new Paragraph({
                        children: [
                            new TextRun({ text: "PRAZO E CRONOGRAMA", font: "Arial", bold: true, size: 14 }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Paragraph("\n"),

                    new Paragraph(`O prazo para execução dos serviços será por tempo Limitado e sua finalização se dará com a entrega dos documentos ${dados.servico} em PDF, com início da aceitação deste termo.`),
                    new Paragraph("\n"),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "REMUNERAÇÃO", font: "Arial", bold: true, size: 14 }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph("Serviço")],
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("Valor")],
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(dados.servico)],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(dados.valor)],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new Paragraph("\n"),

                    // implementado
                    new Paragraph({
                        children: [
                            new TextRun({ text: "OBRIGAÇÕES DO CONTRATADO", font: "Arial", bold: true, size: 14 }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Paragraph("\n"),

                    new Paragraph({
                        children: [new TextRun({ text: "Desenvolver o microserviço conforme especificações acordadas.", font: "Arial" })],
                        bullet: { level: 0 }, // Usa "•" como marcador
                    }),
                    new Paragraph("\n"),
                    new Paragraph({
                        children: [new TextRun({ text: "Garantir a integridade e a confidencialidade das informações fornecidas pela CONTRATANTE.", font: "Arial" })],
                        bullet: { level: 0 }, // Usa "•" como marcador
                    }),
                    new Paragraph("\n"),
                    new Paragraph({
                        children: [new TextRun({ text: "Garantir a efetividade da entrega dos documentos finalizando o microserviço.", font: "Arial", size: 14 })],
                        bullet: { level: 0 }, // Usa "•" como marcador
                    }),
                    new Paragraph("\n"),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "OBRIGAÇÕES DO CONTRATANTE", font: "Arial", bold: true, size: 14 }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Paragraph("\n"),
                    new Paragraph({
                        children: [new TextRun({ text: "Fornecer todas as informações e recursos necessários para o desenvolvimento do microserviço.", font: "Arial", size: 14})],
                        bullet: { level: 0 }, // Usa "•" como marcador
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Efetuar os pagamentos nas condições estabelecidas neste contrato.", font: "Arial", size: 14 })],
                        bullet: { level: 0 }, // Usa "•" como marcador
                    }),
                    new Paragraph("\n"),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "DISPOSIÇÕES GERAIS", font: "Arial", bold: true, size: 14 }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Paragraph("\n"),
                    new Paragraph({
                        children: [new TextRun({text: "Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da comarca de JOÃO PESSOA. Por estarem de pleno acordo com os termos deste contrato, as partes assinam o presente instrumento em duas vias de igual teor.", font: "Arial", size: 14 })],
                    }),
                    new Paragraph("\n"),
                    new Paragraph(`João Pessoa/PB, ${dados.data}, pelas partes abaixo assinadas.`),
                    new Paragraph("\n\n"),

                    new Paragraph({
                        children: [new TextRun("_________________________")],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [new TextRun(`CONTRATANTE: ${dados.contratante}`)],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph("\n\n"),
                    new Paragraph({
                        children: [new TextRun("_________________________")],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [new TextRun(`CONTRATADO: ${dados.contratado}`)],
                        alignment: AlignmentType.CENTER,
                    }),
                ],
            },
        ],
    });

    // Salvar o contrato
    Packer.toBuffer(doc).then((buffer) => {
        writeFileSync("contrato.docx", buffer);
        console.log("Contrato gerado com sucesso!");
    });
};
