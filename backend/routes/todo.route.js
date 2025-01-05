import express from "express";
import { getAllTasks, createNewTask, getSingleTask, updateTask, deleteTask } from "../controllers/todo.controller.js";

const router = express.Router();

router.route("/").get(getAllTasks).post(createNewTask);
router.route("/:id").get(getSingleTask).put(updateTask).delete(deleteTask);

export default router;
