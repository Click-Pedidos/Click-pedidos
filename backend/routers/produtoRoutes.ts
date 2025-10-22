import express from "express";

import { criarProduto, buscarProduto } from "../controller/produtoController";

// mapeia o caminho da URL para o controller

const router = express.Router();

router.post("/", criarProduto);

router.get("/:id", buscarProduto);

export default router;
