import mysql from "mysql";
import "dotenv/config";

// checa se está rodando no docker ou localmente
// ajusta para localhost ou docker
const HOST =
  process.env.NODE_ENV === "docker" ? process.env.DB_HOST : "localhost";

const connection = mysql.createConnection({
  host: HOST,
  user: "root",
  password: process.env.DB_ROOT_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao DB", err);
    return;
  }
  console.log("Conexão feita com sucesso.");
});

export default connection;
