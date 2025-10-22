import {
  criarNovoProduto,
  buscarProdutoPorId,
} from "../services/produtoService.js";

// http logic layer
// recebe requisitos http, chama o service e envia resposta http

/**
 * Controller para a rota POST /api/produtos
 */
export async function criarProduto(req: any, res: any) {
  try {
    const produtoData = req.body;

    // Chama a lógica de negócio no Service
    const novoProduto = await criarNovoProduto(produtoData);

    // Resposta HTTP 201 (Created)
    res.status(201).json({
      message: "Produto criado com sucesso.",
      data: novoProduto,
    });
  } catch (error: any) {
    if (
      error.message.includes("obrigatórios") ||
      error.message.includes("preço")
    ) {
      return res.status(400).json({ error: error.message }); // 400 Bad Request
    }

    console.error("Erro ao criar produto:", error);

    res.status(500).json({ error: "Falha interna do servidor." }); // 500 Internal Server Error
  }
}

/**
 * Controller para a rota GET /api/produtos/:id
 */
export async function buscarProduto(req: any, res: any) {
  try {
    const idProduto = req.params.id;

    const produto = await buscarProdutoPorId(idProduto);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.status(200).json(produto); // 200 OK
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ error: "Falha interna do servidor." });
  }
}
