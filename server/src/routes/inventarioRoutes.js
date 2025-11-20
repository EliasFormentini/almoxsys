const express = require("express");
const router = express.Router();
const inventarioController = require("../controllers/inventarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const permission = require("../middlewares/permissionMiddleware");


router.use(authMiddleware);
router.use(permission("MOVIMENTACOES"));

router.get("/", inventarioController.list);        
router.post("/", inventarioController.create);     
router.get("/:id", inventarioController.getById);    
router.post("/:id/concluir", inventarioController.concluir); 

module.exports = router;
