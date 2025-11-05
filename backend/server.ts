import express from "express";
import produtoRoutes from "./routers/produtoRoutes";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT_SERVER;

// middleware essencial, express leia json em post
app.use(express.json());

// Middleware simples para log
app.use((req, res, next) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  next();
});

// rota
app.use("/api/produtos", produtoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
