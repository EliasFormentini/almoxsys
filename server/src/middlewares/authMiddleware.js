const { Usuario } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Não autenticado." });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Token inválido." });
    }

    if (!token.startsWith("fake-token-")) {
      return res.status(401).json({ error: "Token inválido." });
    }

    const idStr = token.replace("fake-token-", "");
    const userId = Number(idStr);

    if (!userId) {
      return res.status(401).json({ error: "Token inválido." });
    }

    const usuario = await Usuario.findByPk(userId); 

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    req.user = usuario;
    next();
  } catch (err) {
    console.error("Erro no authMiddleware:", err);
    return res.status(500).json({ error: "Erro na autenticação." });
  }
};
