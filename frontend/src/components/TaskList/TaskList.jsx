import { useState, useEffect } from 'react';
import getRequest from '../../helpers/functions';

function TaskList() {
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let tasks = await getRequest('plant-tasks');
      setTasks(tasks);
    };

    fetchData();
  }, []);

  return (
    <div className='page-div'>
      <h1>Tasks</h1>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading tasks...</p>
      )}
    </div>
  );
}

export default TaskList;
