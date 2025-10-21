const { Router } = require("express");
const pedidoController = require("../controllers/pedidoController");

const router = Router();


router.get("/", pedidoController.list);

router.post("/", pedidoController.create);

router.get("/:id", pedidoController.getById);

router.put("/:id/status", pedidoController.updateStatus);

module.exports = router;
