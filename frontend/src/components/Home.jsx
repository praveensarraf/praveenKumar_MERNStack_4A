import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TODOS_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Trash2, Pen } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/tasksSlice";

const Home = () => {
    const tasks = useSelector((store) => store.tasks.tasks);
    const dispatch = useDispatch();

    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const navigate = useNavigate();

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(TODOS_API_END_POINT);
            dispatch(setTasks(data.tasks));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();

        if (!task.trim()) return toast.error("Task cannot be empty!");
        if (task.length > 50) return toast.error("Task must be less than 50 characters!");

        try {
            const { data } = await axios.post(TODOS_API_END_POINT, { task });
            setTask("");
            dispatch(setTasks([data.task, ...tasks]));
            toast.success('Task added successfully!');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add task!");
        }
    };

    const deleteTask = async () => {
        if (!taskToDelete) return;
        try {
            await axios.delete(`${TODOS_API_END_POINT}/${taskToDelete._id}`);
            dispatch(setTasks(tasks.filter(task => task._id !== taskToDelete._id)));
            toast.success('Task deleted successfully!');
            setOpenDialog(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleCompletion = async (id, completed) => {
        try {
            await axios.put(`${TODOS_API_END_POINT}/${id}`, { completed });
            dispatch(setTasks(tasks.map(task => task._id === id ? { ...task, completed } : task)));
            toast.success(completed ? 'Task marked as completed!' : 'Task marked as uncompleted!');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-1">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-slate-400 shadow-md">
                <h1 className="text-2xl text-center font-bold mb-6">To-Do List</h1>

                <form onSubmit={addTask} className="flex flex-col gap-2">
                    <Input
                        type="text"
                        placeholder="Enter a new task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask(e)}
                        className="py-6 font-medium border-gray-400 focus-visible:ring-2 focus-visible:ring-blue-700"
                    />
                    <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                        Add Task
                    </Button>
                </form>

                <div className="my-5 w-full h-[1.1px] bg-black"></div>

                {loading ? (
                    <p className="text-center animate-bounce">Loading.. Please wait!</p>
                ) : (
                    <ul className="space-y-2">
                        {
                            tasks.map((task) => (
                                <li key={task._id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <Label className="flex items-center gap-2 overflow-hidden text-ellipsis">
                                        <input type="checkbox" checked={task.completed} onChange={() => toggleCompletion(task._id, !task.completed)} className="mt-1" />
                                        <span className={`${task.completed ? "line-through text-gray-500" : ""} truncate text-base`} title={task.task}>{task.task}</span>
                                    </Label>

                                    <div className="flex items-center">
                                        {/* Tooltip for Edit */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span onClick={() => navigate(`/task/${task._id}`)} className='p-2 rounded-full text-yellow-400 hover:bg-yellow-500 hover:text-white cursor-pointer'>
                                                        <Pen />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Task</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {/* Tooltip and Dialog for Delete */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span onClick={() => { setTaskToDelete(task); setOpenDialog(true); }} className="p-2 rounded-full text-red-400 hover:bg-red-600 hover:text-white cursor-pointer">
                                                        <Trash2 />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Task</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>



                                </li>
                            ))
                        }
                    </ul>
                )}
            </div>

            {/* Dialog for Confirming Deletion */}
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()} aria-describedby={undefined}>
                    <DialogHeader className='overflow-hidden text-ellipsis text-center px-4'>
                        <DialogTitle className='text-red-500 text-center text-2xl truncate'>{`Delete - ${taskToDelete?.task}`}</DialogTitle>
                    </DialogHeader>

                    <h2 className="text-center text-lg font-semibold">Are you sure you want to delete this task?</h2>

                    <DialogFooter className='md:gap-0 gap-3'>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className='bg-gray-50'>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={deleteTask} className='bg-red-600 hover:bg-red-700'>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Home;