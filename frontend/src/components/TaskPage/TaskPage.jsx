import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../../helpers/functions';

function TaskPage() {
  const { id } = useParams();
  const [plants, setPlants] = useState(null);
  const [viewedTask, setViewedTask] = useState(null);
  const pathToimg = 'http://localhost:8888/uploads/';
  const [tasks, setTasks] = useState(null);

  const fetchData = async () => {
    let tasks = await getRequest('tasks');
    //console.log(tasks);
    setTasks(tasks);

    let plants = await getRequest('plants');
    setPlants(plants);
    // console.log(plants);

    // get the correct plant
    let task = tasks.filter((task) => task.id == id);
    setViewedTask(task[0]);
    console.log(task);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const generateDate = (dateString) => {
    if (!dateString) {
      return <div>Date not available</div>;
    }

    //console.log(dateString);
    dateString = dateString.split('-');
    let year = dateString[0];
    let month = dateString[1];
    let day = dateString[2];
    return (
      <div>
        On the {day}.{month}.{year}
      </div>
    );
  };

  const generatePlantForPlantId = (plantID, todo) => {
    if (plants?.length > 0) {
      let chosenPlant = plants?.find((plant) => plant.id == plantID);

      return (
        <p>
          {chosenPlant.name} : {todo}
        </p>
      );
    }
  };

  return (
    <div>
      <div key={viewedTask?.id} className='container-plant'>
        <div>
          <p className='plant-id'>{viewedTask?.id}</p>
          <img
            src={pathToimg + viewedTask?.imageFile}
            alt={viewedTask?.name}
            width={250}
            height={350}
            className='img-plant'
          />
        </div>
        <div className='plant-details'>
          <div className='plant-shortinfo'>
            <h2>{viewedTask?.name}</h2>
          </div>

          <hr />
          <div>
            🌿 <u className='space'>Todo:</u> {viewedTask?.todo}
          </div>
          <div className='flex'>
            🌿 <u className='space'>Due date:</u>{' '}
            {viewedTask?.date && generateDate(viewedTask.date)}
          </div>

          {viewedTask?.plantTasks.length > 0 && (
            <div>
              🌿 <u className='space'>Plants for task:</u>
              <ul>
                {viewedTask?.plantTasks.map((task, index) => (
                  <li key={index}>
                    {generatePlantForPlantId(task.plantId, task.todo)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
