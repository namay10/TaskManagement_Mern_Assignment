import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import api from '../../components/utils/api';
import TasksGrid from './components/TasksGrid';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const { data } = await api.get('/api/tasks');
      setTasks(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const [username, setUsername] = useState();
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('mern-task-management/user'))?.accessToken;
    setUsername(jwt_decode(token)?.username);
    getTasks();
  }, [navigate]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Find the task being dragged
    const task = tasks.find(t => t._id === result.draggableId);
    
    // Determine new status based on destination droppableId
    const newStatus = destination.droppableId === 'completed'
      ? 'Completed'
      : destination.droppableId === 'pending'
      ? 'Pending'
      : 'To Do';
    
    // Update task status if it has changed
    if (task && task.status !== newStatus) {
      try {
        const updatedTask = { ...task, status: newStatus };
        await api.put(`/api/tasks/${task._id}`, { task: updatedTask });
        setTasks(tasks.map(t => (t._id === task._id ? updatedTask : t)));
      } catch (err) {
        console.error('Failed to update task status:', err);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h3>Greetings {username}</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/new_task')}
        >
          Add Task
        </button>
      </div>
      <div>
        <p className="text-dark-2">
          Here are your tasks for today. Best of luck!
        </p>
        <TasksGrid tasks={tasks} loading={loading} onDragEnd={onDragEnd} />
      </div>
    </div>
  );
};

export default Home;
