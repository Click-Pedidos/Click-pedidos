import db from "../db/db_config";

// Cria um novo produto
export function createProduto(produtoData: any) {
  // SQL para inserir os dados. Note que estamos passando um objeto '?'
  const sql = `INSERT INTO Produto (nome, preco, imagem, descricao, estoque, ativo, categoria)
               VALUES (?, ?, ?, ?)`;

  const values = [
    produtoData.nome,
    produtoData.preco,
    produtoData.imagem,
    produtoData.descricao,
    produtoData.estoque,
    produtoData.ativo,
    produtoData.categoria,
  ];

  return new Promise((resolve, reject) => {
    db.query(sql, values, (error: any, results: any) => {
      if (error) {
        return console.error("Erro ao salvar", error);
      }

      resolve({ id: results.insertId, ...produtoData });
    });
  });
}

// Função de exemplo para buscar um produto
export function getProdutoById(id: any) {
  const sql = `SELECT id, nome, preco, imagem, descricao
               FROM Produto
               WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, [id], (error: any, results: any) => {
      if (error) {
        return console.error("Erro ao salvar", error);
      }

      resolve(results[0] || null);
    });
  });
}
