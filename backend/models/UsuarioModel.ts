import db from "../db/db_config";

// Adiciona novo usuario
export function createUsuario(usuarioData: any) {
  const sql = `INSERT INTO Usuario (nome, email, password)
               VALUES (?, ?)`;
  const values = [usuarioData.nome, usuarioData.email, usuarioData.password];

  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        // Erro comum: email duplicado
        if (error.code === "ER_DUP_ENTRY") {
          return reject(new Error("Email já cadastrado."));
        }

        return console.error("Erro ao salvar", error);
      }

      resolve({ id: results.insertId, ...usuarioData });
    });
  });
}
