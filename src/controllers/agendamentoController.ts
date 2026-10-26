import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// 1. Criar Agendamento
export const criarAgendamento = async (req: Request, res: Response) => {
  try {
    const { idCliente, idVeiculo, idServico, descricao, dataServico } = req.body;

    if (!idCliente || !idVeiculo || !idServico) {
      return res.status(400).json({ error: 'idCliente, idVeiculo e idServico são obrigatórios.' });
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        idCliente: Number(idCliente),
        idVeiculo: Number(idVeiculo),
        idServico: Number(idServico),
        descricao: descricao || null,
        dataServico: dataServico ? new Date(dataServico) : null,
      },
      include: {
        cliente: true,
        veiculo: true,
        servico: true,
      },
    });

    return res.status(201).json(agendamento);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cliente, veículo ou serviço informado não existe.' });
    }
    return res.status(500).json({ error: 'Erro ao criar agendamento.', details: error.message });
  }
};

// 2. Listar Agendamentos
export const listarAgendamentos = async (_req: Request, res: Response) => {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        cliente: { select: { id: true, nome: true, telefone: true } },
        veiculo: { select: { id: true, marca: true, modelo: true, placa: true } },
        servico: { select: { id: true, descricao: true, valor: true } },
      },
      orderBy: { dataAgendamento: 'desc' },
    });

    return res.status(200).json(agendamentos);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao listar agendamentos.', details: error.message });
  }
};

// 3. Buscar Agendamento por ID
export const buscarAgendamentoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: true,
        veiculo: true,
        servico: true,
      },
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    return res.status(200).json(agendamento);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao buscar agendamento.', details: error.message });
  }
};

// 4. Atualizar Agendamento
export const atualizarAgendamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { descricao, dataServico, dataCancelamento, idVeiculo, idServico } = req.body;

    const agendamento = await prisma.agendamento.update({
      where: { id: Number(id) },
      data: {
        descricao,
        dataServico: dataServico ? new Date(dataServico) : undefined,
        dataCancelamento: dataCancelamento ? new Date(dataCancelamento) : undefined,
        idVeiculo: idVeiculo ? Number(idVeiculo) : undefined,
        idServico: idServico ? Number(idServico) : undefined,
      },
    });

    return res.status(200).json(agendamento);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar agendamento.', details: error.message });
  }
};

// 5. Cancelar Agendamento (Marcar data de cancelamento sem deletar)
export const cancelarAgendamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const agendamento = await prisma.agendamento.update({
      where: { id: Number(id) },
      data: {
        dataCancelamento: new Date(),
      },
    });

    return res.status(200).json({ message: 'Agendamento cancelado com sucesso.', agendamento });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }
    return res.status(500).json({ error: 'Erro ao cancelar agendamento.', details: error.message });
  }
};

// 6. Deletar Agendamento do banco
export const deletarAgendamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.agendamento.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }
    return res.status(500).json({ error: 'Erro ao remover agendamento.', details: error.message });
  }
};