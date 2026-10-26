import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// 1. Criar Veículo
export const criarVeiculo = async (req: Request, res: Response) => {
  try {
    const { idCliente, marca, modelo, placa, ano } = req.body;

    if (!idCliente || !marca || !modelo || !placa || !ano) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const veiculo = await prisma.veiculo.create({
      data: {
        idCliente: Number(idCliente),
        marca,
        modelo,
        placa: placa.toUpperCase(),
        ano: Number(ano),
      },
    });

    return res.status(201).json(veiculo);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Placa já cadastrada.' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cliente informado não existe.' });
    }
    return res.status(500).json({ error: 'Erro ao criar veículo.', details: error.message });
  }
};

// 2. Listar Veículos
export const listarVeiculos = async (_req: Request, res: Response) => {
  try {
    const veiculos = await prisma.veiculo.findMany({
      include: {
        cliente: {
          select: { id: true, nome: true, telefone: true },
        },
      },
    });

    return res.status(200).json(veiculos);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao listar veículos.', details: error.message });
  }
};

// 3. Buscar Veículo por ID
export const buscarVeiculoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const veiculo = await prisma.veiculo.findUnique({
      where: { id: Number(id) },
      include: { cliente: true, agendamentos: true },
    });

    if (!veiculo) {
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }

    return res.status(200).json(veiculo);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao buscar veículo.', details: error.message });
  }
};

// 4. Atualizar Veículo
export const atualizarVeiculo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { marca, modelo, placa, ano, idCliente } = req.body;

    const veiculo = await prisma.veiculo.update({
      where: { id: Number(id) },
      data: {
        marca,
        modelo,
        placa: placa ? placa.toUpperCase() : undefined,
        ano: ano ? Number(ano) : undefined,
        idCliente: idCliente ? Number(idCliente) : undefined,
      },
    });

    return res.status(200).json(veiculo);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Placa já está em uso.' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar veículo.', details: error.message });
  }
};

// 5. Deletar Veículo
export const deletarVeiculo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.veiculo.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }
    return res.status(500).json({ error: 'Erro ao deletar veículo.', details: error.message });
  }
};
