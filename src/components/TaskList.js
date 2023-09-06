import { useEffect, useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";



const TaskList = () => {
    //Add task to DB
    const [tasks , setTasks] = useState([]);
    const [completedTasks , setcompletedTasks] = useState([]);
    const [isEditing , setIsEditing] = useState(false);
    const [TaskID , setTaskID] = useState("");
    const [IsLoading , setIsLoading] = useState(false);
    const [formData,setFormData] = useState({
        name: "",
        completed: false,
    });
    const {name} = formData;

    const handleInputChange = (e) => {
        const {name , value} = e.target
        setFormData({ ...formData, [name]: value })
    };

    const getTasks = async () => {
        setIsLoading(true)
        try {
           const {data} = await axios.get(`${URL}/api/tasks`);
           setTasks(data);
           setIsLoading(false);
        } catch (error) {
            toast.error(error.message);
            setIsLoading(false);
            
        }
    };

    useEffect(() => {
        getTasks()
    } , []);

    const getSingleTask = async (task) => {
        setFormData ({name: task.name, completed : false});
        setTaskID(task._id);
        setIsEditing(true);
    };

    // Function to create Tasks and added to DB 

    const createTask = async (e) => {
        e.preventDefault();
        if (name === ""){
            return toast.error("Input field cannot be empty");
        }
    try {
        await axios.post(`${URL}/api/tasks` , formData);
        toast.success("Task added successfully");
        setFormData({...formData, name: ""});
    } catch (error) {
        toast.error(error.message);
    }
    };
    const deleteTask = async (id) => {
        try { 
            await axios.delete(`${URL}/api/tasks/${id}`);
            getTasks();
            
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateTask = async (e) => {
        e.preventDefault()
        if (name ===""){
            return toast.error("Input field cannot be empty.");
        }
        try {
            await axios.put(`${URL}/api/tasks/${TaskID}` , formData);
            setFormData({...formData , name: ""});
            setIsEditing(false);
            getTasks();
        } catch (error) {
            toast.error(error.message);   
        }
    };


    return (
    <div>
      <h2> Task Manager </h2>
      <TaskForm name={name} 
      handleInputChange={handleInputChange}
      createTask={createTask}
      isEditing={isEditing}
      updateTask={updateTask}
      />
      <div className="--flex-between --pb">
        <p>
            <b>Total Tasks: </b> 0
        </p>
        <p>
            <b>Completed Tasks: </b> 0
        </p>
      </div>
      <hr/>
      {
            !IsLoading && tasks.length === 0 ? (
                <p className="--py">
                    No Task added. Please add a task </p>
            ) : (
                <>
                {tasks.map((task, index) => {
                    return (
                        <Task key={task._id}
                          task={task}
                          index={index} 
                          deleteTask={deleteTask}
                          getSingleTask={getSingleTask}
                        />
                    )
                })}
                </>
            )
        }
    </div>
  );
};

export default TaskList;
