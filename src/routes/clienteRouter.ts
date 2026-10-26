import { Router } from 'express';
import {
  criarCliente,
  listarClientes,
  buscarClientePorId,
  atualizarCliente,
  deletarCliente,
} from '../controllers/clienteController.js';

const router = Router();

router.post('/clientes', criarCliente);
router.get('/clientes', listarClientes);
router.get('/clientes/:id', buscarClientePorId);
router.put('/clientes/:id', atualizarCliente);
router.delete('/clientes/:id', deletarCliente);

export default router;