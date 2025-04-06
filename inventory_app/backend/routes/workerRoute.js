import express from "express";
import { 
  registerWorker, 
  loginWorker, 
  logoutWorker, 
  getAllWorkers, 
  getWorkerById 
} from "../controllers/workercontroller.js";

const router = express.Router();

router.post("/register", registerWorker); // Register worker
router.post("/login", loginWorker); // Login worker
router.post("/logout", logoutWorker); // Logout worker
router.get("/", getAllWorkers); // Get all workers
router.get("/:id", getWorkerById); // Get worker by ID

export default router;
