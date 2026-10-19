import { Request, Response } from "express";
import { prisma } from '../lib/prisma';

// Inserir novo cliente
export const criarCliente = async (req: Request, res: Response) => {
  try {
    const { nome, telefone, email } = req.body;

    // Validação básica
    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
    }

    const novoCliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        email: email || null,
      },
    });

    return res.status(201).json(novoCliente);
  } catch (error: any) {
    // Trata erro de e-mail duplicado (@unique no Prisma)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    return res.status(500).json({ error: 'Erro ao criar cliente.', details: error.message });
  }
};

// Listar clientes
export const listarClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        veiculos: true, // Opcional: traz também os veículos associados
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(clientes);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao buscar clientes.', details: error.message });
  }
};
