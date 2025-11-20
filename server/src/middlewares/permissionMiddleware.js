module.exports = function permissionMiddleware(requiredDeck) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Não autenticado." });
      }

      const perfil = req.user.perfil;
      if (perfil === "admin" || perfil === "administrador") {
        return next();
      }

      const raw = req.user.permissoes;

      let permissoesArray = [];

      if (Array.isArray(raw)) {
        permissoesArray = raw;
      } else if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            permissoesArray = parsed;
          } else {
            permissoesArray = raw
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean);
          }
        } catch (e) {
          permissoesArray = raw
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
        }
      } else if (raw == null) {
        permissoesArray = [];
      }

      if (!permissoesArray.includes(requiredDeck)) {
        return res.status(403).json({
          error: "Permissão insuficiente para acessar este recurso.",
          requiredDeck,
        });
      }

      return next();
    } catch (err) {
      console.error("Erro no permissionMiddleware:", err);
      return res.status(500).json({ error: "Erro na verificação de permissão." });
    }
  };
};
