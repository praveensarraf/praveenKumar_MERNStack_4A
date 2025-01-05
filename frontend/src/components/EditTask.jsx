import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TODOS_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/tasksSlice";

const EditTask = () => {

    const { id } = useParams();
    const tasks = useSelector((store) => store.tasks.tasks);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [task, setTask] = useState("");
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch the task to edit
    const fetchTask = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${TODOS_API_END_POINT}/${id}`);
            setTask(data.task.task);
            setCompleted(data.task.completed);
        } catch (error) {
            alert("Failed to fetch task details!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    // Update the task
    const updateTask = async (e) => {
        e.preventDefault();

        if (!task.trim()) {
            toast.error("Task name cannot be empty!");
            return;
        }

        if (task.length > 50) {
            toast.error("Task cannot exceed 50 characters!");
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.put(`${TODOS_API_END_POINT}/${id}`, { task, completed });

            const updatedTasks = tasks.map((t) =>
                t._id === id ? { ...t, task, completed } : t
            );

            dispatch(setTasks(updatedTasks));
            navigate("/");
            toast.success("Task updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update the task.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-1">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-slate-400 shadow-md">
                <Button onClick={() => navigate(-1)} variant='outline' className='bg-gray-50 px-2'><ArrowLeft />Back</Button>
                <h1 className="text-2xl text-center font-bold my-2">Edit Task</h1>
                {
                    loading ? (
                        <p className="text-center">Loading task details...</p>
                    ) : (
                        <form onSubmit={updateTask} className="space-y-4">
                            <div>
                                <Label htmlFor="taskInput" className="block text-base font-medium mb-1 pl-1">
                                    Task
                                </Label>
                                <Input
                                    id="taskInput"
                                    type="text"
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                    className="py-6 font-medium border-gray-400 focus-visible:ring-2 focus-visible:ring-blue-700"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="completedCheckbox"
                                    type="checkbox"
                                    checked={completed}
                                    onChange={() => setCompleted(!completed)}
                                    className="mr-2 mt-1"
                                />
                                <label htmlFor="completedCheckbox" className="text-base">
                                    Completed
                                </label>
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full ${isSubmitting ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
                                    }`}
                            >
                                {isSubmitting ? "Updating..." : "Update Task"}
                            </Button>
                        </form>
                    )
                }
            </div>
        </div>
    );
};

export default EditTask;