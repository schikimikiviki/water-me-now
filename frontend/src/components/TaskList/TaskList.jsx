import { useState, useEffect } from 'react';
import { getRequest } from '../../helpers/functions';
import './TaskList.css';
import api from '../../api/axiosConfig';
import TaskPopup from '../TaskPopup/TaskPopup';

function TaskList() {
  const [tasks, setTasks] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [chosenTask, setChosenTask] = useState(null);
  const [plants, setPlants] = useState(null);

  const pathToimg = 'http://localhost:8888/uploads/';

  const fetchData = async () => {
    let tasks = await getRequest('tasks');
    console.log(tasks);
    setTasks(tasks);

    let plants = await getRequest('plants');
    console.log(plants);
    setPlants(plants);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const checkLoginStatus = async () => {
    try {
      await api.get('/auth/check', { withCredentials: true });
      setLoggedIn(true);
    } catch (err) {
      setLoggedIn(false);
      console.error('Check login failed:', err);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleTaskEdit = (id) => {
    console.log('Editing task with id', id);
    setChosenTask(tasks.find((task) => task.id === id));
    console.log(
      'this is the data we work with: ',
      tasks.find((task) => task.id === id)
    );
    openPopup();
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    fetchData();
  };

  const handleTaskDelete = async (id) => {
    console.log('Deleting task with id: ', id);
    try {
      const response = await deleteSomethingWithId('tasks', id);
      console.log(response);
      // If the delete is successful, refresh the task list
      if (response.success) {
        fetchData();
      } else {
        console.log('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const generateDate = (dateString) => {
    let year = dateString[0];
    let month = dateString[1];
    let day = dateString[2];

    return (
      <div>
        On the {day}.{month}.{year}
      </div>
    );
  };

  return (
    <div className='page-div'>
      <h1>Tasks</h1>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <div key={task.id} className='container-plant'>
              <div>
                <p className='plant-id'>{task.id}</p>
                <img
                  src={pathToimg + task.imageFile}
                  alt={task.name}
                  width={250}
                  height={350}
                  className='img-plant'
                />
                {isLoggedIn ? (
                  <div className='admin-functions'>
                    <div
                      onClick={() => {
                        handleTaskEdit(task.id);
                      }}
                    >
                      🖊️
                    </div>
                    <div
                      onClick={() => {
                        handleTaskDelete(task.id);
                      }}
                    >
                      🗑️
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className='plant-details'>
                <div className='plant-shortinfo'>
                  <h2>{task.name}</h2>
                </div>

                <hr />
                <div>
                  🌿 <u className='space'>Todo:</u> {task.origin}
                </div>
                <div className='flex'>
                  🌿 <u className='space'>Due date:</u>{' '}
                  {generateDate(task.date)}
                </div>
              </div>
            </div>
          ))}
          {isPopupOpen && (
            <TaskPopup
              taskData={chosenTask}
              onClose={closePopup}
              allPlants={plants}
            />
          )}
        </ul>
      ) : (
        <p>Loading tasks...</p>
      )}
    </div>
  );
}

export default TaskList;
