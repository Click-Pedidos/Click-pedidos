import { createProdutoDB, getProdutoByIdDB } from "../models/ProdutoModel";

// camada de lógica de negocio
// business logic layer

export async function criarNovoProduto(data: any) {
  if (!data.nome || !data.preco) {
    throw new Error("O nome e o preço do produto são obrigatórios.");
  }
  if (data.preco <= 0) {
    throw new Error("O valor do produto não pode ser negativo.");
  }

  const produtoFormatado = {
    ...data,
    estoque: data.estoque || 0,
    ativo: data.ativo !== undefined ? data.ativo : true,
  };

  const novoProduto = await createProdutoDB(produtoFormatado);

  return novoProduto;
}

export async function buscarProdutoPorId(id: any) {
  const produto = await getProdutoByIdDB(id);

  return produto;
}
