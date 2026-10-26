import 'dotenv/config';
import express from "express";
import clienteRoutes from "./routes/clienteRouter";

const app = express();

app.use(express.json());

// Registra as rotas
app.use('', clienteRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
