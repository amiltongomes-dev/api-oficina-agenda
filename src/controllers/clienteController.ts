import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// 1. Criar Cliente
export const criarCliente = async (req: Request, res: Response) => {
  try {
    const { nome, telefone, email } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
    }

    const cliente = await prisma.cliente.create({
      data: { nome, telefone, email: email || null },
    });

    return res.status(201).json(cliente);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    return res.status(500).json({ error: 'Erro ao criar cliente.', details: error.message });
  }
};

// 2. Listar todos os Clientes
export const listarClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        veiculos: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(clientes);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao listar clientes.', details: error.message });
  }
};

// 3. Buscar Cliente por ID
export const buscarClientePorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: {
        veiculos: true,
        agendamentos: {
          include: { servico: true, veiculo: true }
        },
      },
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    return res.status(200).json(cliente);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao buscar cliente.', details: error.message });
  }
};

// 4. Atualizar Cliente
export const atualizarCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, telefone, email } = req.body;

    const cliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data: { nome, telefone, email },
    });

    return res.status(200).json(cliente);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'E-mail já está em uso.' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar cliente.', details: error.message });
  }
};

// 5. Deletar Cliente
export const deletarCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.cliente.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }
    return res.status(500).json({ error: 'Erro ao deletar cliente.', details: error.message });
  }
};
