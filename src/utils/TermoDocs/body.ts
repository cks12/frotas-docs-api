import { Response } from "express";
import PDFDocument, { } from "pdfkit";
import path from "path";
import { Termo } from "@prisma/client";
import {createBlob} from "./blob";
import db from "../../db/db";

export function PdfTermo(res: Response, termoProps: Termo) {
    const doc = new PDFDocument({
        size: "A4",
        displayTitle: true,
        bufferPages: true,
        margins: {
            top: 100,
            bottom: 50,
            left: 50,
            right: 50,
        },
    });

    const buffers: Uint8Array[] = [];

    const date = new Date();

    const regularFontPath = path.join(__dirname, "..", "..", "..", "assets", "calibri-font-family", "calibri-regular.ttf");
    const boldFontPath = path.join(__dirname, "..", "..", "..","assets", "calibri-font-family", "calibri-bold.ttf");
    
    doc.fontSize(13)
    
    doc.font(boldFontPath)
        .text(`Termo de responsabilidade por utilização de veículo`, {
            align: "center",
        })
    doc.fontSize(11)

    doc.font(regularFontPath).fontSize(12).text(
        `Pelo presente instrumento de TERMO DE RESPONSABILIDADE POR UTILIZAÇÃO DE VEÍCULO DA EMPRESA, de um lado a Empresa WYNTECH SERVIÇOS EM TECNOLOGIA DA INFORMAÇÃO LTDA, estabelecida à Rua Arabutan, 372, bairro Navegantes na cidade de Porto Alegre/RS, CEP 90240-470, inscrita no CNPJ sob n° 08.911.585/0001-03 neste ato Representado pelo seu Diretor Executivo – CEO Joelson de Oliveira, o qual nomeia e institui como seu Preposto Viviane Santos Dal Pizzol, pessoa física portadora do RG Nº 1093025672 e CPF 014.444.260-44 , entrega neste ato no final assinado, doravante denominada simplesmente “EMPRESA” e de outro ${termoProps.TechName}, portador do CPF número ${termoProps.TechCpf}, carteira de identidade de número RG: ${termoProps.TechRg}, CNH de número ${termoProps.TechCnh}, Categoria ${termoProps.TechCnhCategoria}, com validade até ${termoProps.TechCnhValidade.toLocaleDateString("pt-br", {
            "weekday":"long",
            month: 'long',
            day:"numeric",
            year: 'numeric',})}, doravante denominado (a) “COLABORADOR” tem entre si, justo e contratado o que a seguir especificam:

I – Do Objeto 
Cláusula Primeira - O presente Termo tem como objetivo regular o uso do veículo marca ${termoProps.CarMarca}, ano de fabricação/modelo ${termoProps.CarAno}, placas ${termoProps.CarPlaca}, chassi n° ${termoProps.CarChassi}, Placa TAG nº ${termoProps.carPlacaTag} que o COLABORADOR acima qualificado, recebe da EMPRESA em perfeito estado de funcionamento, conforme termo de vistoria, para o exercício de suas funções, bem como o Manual de Revisões do veículo e a Apólice de Seguros correspondente.

Único – Fica estabelecido que o referido veículo, ficará à disposição da empresa WYNTECH, de segunda á sexta-feira no horário comercial, para atendimentos aos clientes, sendo que o condutor será identificado através da planilha de controle de utilização de veículos.

II – Das formas de utilização 
Cláusula Segunda - A utilização do veículo acima se destina única e exclusivamente para fins de exercício das atividades inerentes à função.

Cláusula Terceira - São expressamente vedadas: 
1. A utilização do veículo por terceiros; 
2. A utilização do veículo para fins particulares; 
3. A concessão de carona.

Cláusula Quarta - Os encargos e despesas com abastecimento, manutenção, licenciamento, seguro e pedágio ficam a encargo da EMPRESA.

Cláusula Quinta - O COLABORADOR se compromete a conferência diária da quilometragem, bem como do estado de conservação do veículo, concordando desde já em prestar contas sobre possíveis danos, avarias e consumo excessivo, se a EMPRESA julgar necessário, reportando ao Setor Administrativo a necessidade das revisões periódicas quando atingirem a cada 10.000 km, sucessivamente em concordância com a cláusula Primeira- do Item – Objeto.

Cláusula Sexta - O COLABORADOR declara para todos e devidos fins ter recebido, nesta data, o veículo supracitado (remissão à Cláusula Primeira – Do Objeto), comprometendo-se à: 
1. Zelar pela conservação do veículo; 
2. Comunicar diretamente à EMPRESA a necessidade de manutenção ou conserto do veículo, não podendo esse procedimento (conserto ou manutenção) ser feito sem prévio consentimento ou por pessoa não autorizada pela EMPRESA, excetuando-se aquelas de pequena monta, imprescindíveis à continuidade de viagens. 
3. Prestar contas ou devolver o veículo por solicitação da EMPRESA, por mera liberalidade ou para troca do mesmo. 
4. Comunicar imediatamente a empresa qualquer ocorrência relacionada ao veículo, tais como, danos, avarias e roubo ou furto. 
5. Comunicar imediatamente a empresa em caso de recebimento de multa por qualquer tipo de infração de trânsito. 
6. Pagar as multas decorrentes de infração de trânsito de sua responsabilidade. 
7. Abastecer o veículo em postos com bandeira, considerando o combustível preferencial (álcool ou gasolina) segundo orientação da EMPRESA para cada usuário. 
8. Controlar o consumo conforme planilha em anexo, mediante apresentação da nota fiscal do abastecimento, e anotação da quilometragem no mento do abastecimento. 
9. Não utilizar o veículo para viagens particulares, inclusive no período de férias, salvo se houver liberação formal, por escrito da EMPRESA. 
10. Devolver imediatamente em caso de rescisão de contrato. 
Parágrafo Único: Em caso de danos ou avarias no veículo, decorrentes de negligência ou má utilização do mesmo, bem como o recebimento de multas por infração de trânsito ou ainda pelo não cumprimento das determinações acima, o COLABORADOR autoriza a EMPRESA a proceder a desconto em folha de pagamento do valor correspondente ao mesmo. Em caso de acidente, o funcionário responderá, civil e criminalmente, pelos danos eventualmente causados a terceiros, ressalvado a hipótese de culpa exclusiva de terceiro.

III – Das Disposições Gerais 
Cláusula Sétima - As cláusulas e/ou condições ora pactuadas poderão ser revistas, suprimidas e/ou revogadas no todo ou em parte a critério da EMPRESA, mediante comunicação ao COLABORADOR.

Cláusula Oitava - Nenhuma indenização será devida pela EMPRESA, durante a vigência do presente termo, ou em caso de revogação, suspensão ou extinção do mesmo.

Cláusula Nona - Por não ser permitida a utilização do veículo para fins particulares, o mesmo não integrará salário para qualquer fim, seja ele previdenciário, trabalhista ou tributário.

IV – Dos controles 
Cláusula Décima - Os controles de custos serão feitos através dos modelos emitidos pela EMPRESA.

V – Da Vigência 
O presente Termo terá início a partir da data de sua assinatura e vigorará pelo prazo de 60 (sessenta) dias, enquanto durar o vínculo empregatício, podendo ser revogado a qualquer tempo.

Parágrafo Único: Dar-se-á como automaticamente extinto o presente Adendo, na ocorrência das seguintes hipóteses: mudança de função cuja utilização do veículo deixe de ser necessária; determinação ou liberalidade da empresa; e extinção, cessação ou rescisão do contrato de trabalho.

E por estarem de pleno acordo com todas as cláusulas e condições ora pactuadas, assinam o presente instrumento em três vias da qual teor, sendo uma delas entregue ao COLABORADOR.

Porto Alegre, ${date.toLocaleDateString("pt-br", {
    "weekday":"long",
    month: 'long',
    day:"numeric",
    year: 'numeric',
})}.

_____________________________________________________________________________________________
${termoProps.TechName} 
RG ${termoProps.TechRg} 
CPF ${termoProps.TechCpf} 

________________________________________________________________________________________________
WYNTECH SERVIÇOS EM TECNOLOGIA DA INFORMAÇÃO LTDA 
CNPJ 08.911.585/0001-03 

Testemunha 01 ____________________ Testemunha 02 ___________________________ 
CPF ______________________________ CPF______________________________________`
    ,{align:"justify"}).moveDown(1);
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);
        doc.image(path.join(__dirname, "..", "..", "..","assets", "logo.png"),220,20, {
            height: 50,
            align: "center",
        })
    }
    doc.end();
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async() => {
        const pdfBuffer = Buffer.concat(buffers);
        const blob = await createBlob(pdfBuffer);
        const termo = await db.prisma.termo.update({
            where: {id:termoProps.id},
            data:{blob: blob}
        })
        res.json(termo)
    });
}