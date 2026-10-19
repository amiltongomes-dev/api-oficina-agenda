import { Router } from 'express';
import { criarCliente, listarClientes } from '../controllers/clienteController';

const router = Router();

router.post('/clientes', criarCliente);
router.get('/clientes', listarClientes);

export default router;