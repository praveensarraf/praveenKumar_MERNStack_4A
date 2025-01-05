import Todo from "../models/todo.model.js";

// Get all the tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Todo.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      tasks,
      totalTasks: tasks.length,
      message: "Tasks retrieved successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Create a new task
export const createNewTask = async (req, res) => {
  try {
    const task = await Todo.create(req.body);
    res.status(201).json({
      task,
      message: "Task created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get single task
export const getSingleTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const task = await Todo.findOne({ _id: taskId });
    if (!task) {
      return res.status(404).json({
        message: `Task not found with Id: ${taskId}`,
        success: false,
      });
    }
    res.status(200).json({
      task,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const task = await Todo.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        message: `Task not found with Id: ${taskId}`,
        success: false,
      });
    }
    res.status(200).json({
      task,
      message: "Task updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const task = await Todo.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        message: `Task not found with Id: ${taskId}`,
        success: false,
      });
    }
    res.status(200).json({
      task,
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
