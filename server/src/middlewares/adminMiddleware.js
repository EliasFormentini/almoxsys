module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  if (req.user.perfil !== "admin") {
    return res.status(403).json({ error: "Apenas administradores podem acessar esta rota." });
  }

  next();
};
