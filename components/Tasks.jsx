"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const Tasks = () => {
    const [tasks,setTasks] = useState([]);

    useEffect(() => {
        (async function() {
            try {
                const resposne = await axios.get("/api/tasks");
                console.log(resposne);
            } catch (error) {
                console.log(error);
            }
        })()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData =  new FormData(e.currentTarget);

        const task = {
            title: formData.get("title"),
            priority: formData.get("priority"),
            date: formData.get("date"),
            userId: formData.get("userId")
        }         

        const response = await axios.post("/api/tasks", JSON.stringify(task), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response);
        

        setTasks((prev) => {
            return [
                ...prev,
                {...response.data.tasks}
            ]
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" />
            <input type="text" name="priority" />
            <input type="date" name="date" />
            <select name="userId" style={{ width: '100px' }}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="9">9</option>
            </select>

            <button>Submit</button>
            {tasks.map((task) => (
                <div key={task.id}>

                </div>
            ))}
        </form>
    );
};

export default Tasks;