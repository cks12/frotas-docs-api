import PDFDocument from 'pdfkit'
import { ShcemaTermoSchema } from './schema';
import { Prisma } from '@prisma/client';
import { PdfTermo } from './body';
import { Response } from 'express';
import db from '../../db/db';
import { createBlob } from './blob';
import axios from 'axios';
class CreateTermo {
    async responsabilidade(res: Response, d: any) {
        const data = ShcemaTermoSchema.parse(d);
        const user = await db.prisma.usuario.findUniqueOrThrow({
            where: { id: data.tecnicoId },
            include: {
                tech: {
                    select: {
                        rg: true,
                        cpf: true,
                        cnh: true,
                        id:true,
                        CPF_DOC: true,
                        CNH_DOC: true,
                    }
                }
            }
        })

        const car = await db.prisma.carro.findUniqueOrThrow({
            where: { id: data.carroId },
        })

        const cpf = user.tech?.CPF_DOC?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') ? user.tech?.CPF_DOC?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') :
            user.tech?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

        const relatorNome = await db.prisma.usuario.findFirst({
            where: { id: data.usuarioId },
            select: { nome: true }
        })

        const rgComMascara = user.tech?.rg?.replace(/^(\d{2})\.?(\d{3})\.?(\d{3})-?(\d{1}|X)$/, '$1.$2.$3-$4');
        
        await db.prisma.termo.updateMany({
            where: {
                AND: {
                    carroId: car.id,
                    OR: [
                        {
                            status: "Ativo"
                        },
                        {
                            status: "Pendente"
                        }
                    ]
                }
            },
            data: {
                status: "Inativo",
            },

        });
        const url = `${process.env.REPORT_API_URL}/api/FastRepot/Responsabilidade?TecnicoId=${user.techId}&CarroId=${data.carroId}`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw "Erro"
        }
        const arrayBufferData = await response.arrayBuffer();
        const bufferData = Buffer.from(arrayBufferData);
        const blob = await createBlob(bufferData);
        const termo = await db.prisma.termo.create({
            data: {
                TechName: user.nome,
                CarAno: car.Ano,
                CarCor: car.Cor,
                CarMarca: car.Marca,
                CarModelo: car.modelo,
                CarPlaca: car.Placa,
                carPlacaTag: car.Placa,
                CarChassi: car.Chassis,
                tecnicoId: data.tecnicoId,
                carroId: data.carroId,
                relatorNome: relatorNome?.nome || "",
                TechCnh: user.tech?.CNH_DOC?.cnh || user.tech?.cnh || "",
                TechCpf: cpf || "",
                TechRg: rgComMascara || "",
                TechCnhCategoria: user.tech?.CNH_DOC?.categoria || "B",
                TechCnhValidade: new Date(user.tech?.CNH_DOC?.validade || Date.now()),
                usuarioId: data.usuarioId,
                isAssinado: false,
                blob:blob
            }
        });
        return PdfTermo(res, termo)
    }
    async devolucao(res: Response, d: any) {
        const data = ShcemaTermoSchema.parse(d);
        const user = await db.prisma.usuario.findUniqueOrThrow({
            where: { id: data.tecnicoId },
            include: {
                tech: {
                    select: {
                        rg: true,
                        cpf: true,
                        cnh: true,
                        CPF_DOC: true,
                        CNH_DOC: true,
                        id:true,
                    }
                }
            }
        })

        const car = await db.prisma.carro.findUniqueOrThrow({
            where: { id: data.carroId },
        })

        const cpf = user.tech?.CPF_DOC?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') ? user.tech?.CPF_DOC?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') :
            user.tech?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

        const relatorNome = await db.prisma.usuario.findFirst({
            where: { id: data.usuarioId },
            select: { nome: true }
        })

        const rgComMascara = user.tech?.rg?.replace(/^(\d{2})\.?(\d{3})\.?(\d{3})-?(\d{1}|X)$/, '$1.$2.$3-$4');
        
        await db.prisma.termo.updateMany({
            where: {
                AND: {
                    carroId: car.id,
                    OR: [
                        {
                            status: "Ativo"
                        },
                        {
                            status: "Pendente"
                        }
                    ]
                }
            },
            data: {
                status: "Inativo",
            },

        })

        const termo = await db.prisma.termo.create({
            data: {
                TechName: user.nome,
                CarAno: car.Ano,
                CarCor: car.Cor,
                isDevolucao: true,
                CarMarca: car.Marca,
                CarModelo: car.modelo,
                CarPlaca: car.Placa,
                carPlacaTag: car.Placa,
                CarChassi: car.Chassis,
                tecnicoId: data.tecnicoId,
                carroId: data.carroId,
                relatorNome: relatorNome?.nome || "",
                TechCnh: user.tech?.CNH_DOC?.cnh || user.tech?.cnh || "",
                TechCpf: cpf || "",
                TechRg: rgComMascara || "",
                TechCnhCategoria: user.tech?.CNH_DOC?.categoria || "B",
                TechCnhValidade: new Date(user.tech?.CNH_DOC?.validade || Date.now()),
                usuarioId: data.usuarioId,
                isAssinado: false,
            }
        });

        const request = await axios.get(`${process.env.REPORT_API_URL}/api/FastRepot/Devolucao`,{
            params: {
                TecnicoId:user.tech?.id,
                CarroId: data.carroId,
            },
            responseType: 'arraybuffer'  
        });

        const pdfBuffer = Buffer.concat(request.data);
        const blob = await createBlob(pdfBuffer);
        await db.prisma.termo.update({
            where: {id:termo.id},
            data:{blob: blob}
        })

        return PdfTermo(res, termo)
    }
}

export default CreateTermo;