import { useState, useEffect } from 'react';
import './TaskPopup.css';
import { patchSomethingWithId } from '../../helpers/functions';
import UploadImage from '../UploadImage/UploadImage';

const TaskPopup = ({ onClose, taskData, allPlants }) => {
  const [taskName, setTaskName] = useState(taskData.name);
  const [todo, setTodo] = useState(taskData.todo);
  const [imageFile, setImageFile] = useState(taskData.imageFile);
  const [date, setDate] = useState(taskData.date);
  const [plantInput, setPlantInput] = useState('');
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [plantObjectWithTodo, setPlantObjectWithTodo] = useState(
    taskData.plantTasks
  );
  const [plantTodos, setPlantTodos] = useState({});

  // other states
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    loadRelatedPlants();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    setIsMobile(width <= 768 ? true : false);
  }, [width]);

  // [ {"plantId": 152, "todo": "some shit"}, {"plantId": 1, "todo": "some other shit"}]
  const loadRelatedPlants = () => {
    const newRelatedPlants = [];
    const newPlantTodos = {};

    for (let i of plantObjectWithTodo) {
      const plant = allPlants.find((plant) => plant.id == i.plantId);
      if (plant) {
        newRelatedPlants.push(plant);
        newPlantTodos[plant.id] = i.todo;
      }
    }

    setRelatedPlants(newRelatedPlants);
    setPlantTodos(newPlantTodos);
  };

  const handleToDo = (e) => {
    setTodo(e.target.value);
  };

  const handleNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDateChange = (e) => {
    console.log(e.target.value);
    setDate(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    console.log(plantObjectWithTodo);
    console.log(date);

    const taskBody = {
      name: taskName,
      todo: todo,
      date: date,
      plantTasks: plantObjectWithTodo,
    };

    // Verify the final payload
    console.log('Final payload:', JSON.stringify(taskBody, null, 2));

    const formData = new FormData();
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    // Create the Blob with proper type
    const jsonBlob = new Blob([JSON.stringify(taskBody)], {
      type: 'application/json',
    });
    formData.append('taskBody', jsonBlob);

    try {
      let response = await patchSomethingWithId('tasks', taskData.id, formData);
      console.log('Response:', response);
      onClose();
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleUpload = (e) => {
    setImageFile(e);
  };

  const addCompanionPlant = (e) => {
    e.preventDefault();
    const selectedPlant = allPlants.find((p) => p.name === plantInput);
    console.log('Selected plant : ', selectedPlant);
    console.log('plant input', plantInput);
    if (
      selectedPlant &&
      !relatedPlants.some((p) => p.id === selectedPlant.id)
    ) {
      setRelatedPlants([...relatedPlants, selectedPlant]);
      setPlantInput('');
    }
  };

  const addTodoForPlant = (e, id) => {
    const newTodo = e.target.value;

    setPlantTodos((prev) => ({
      ...prev,
      [id]: newTodo,
    }));

    setPlantObjectWithTodo((prev) => {
      const exists = prev.some((item) => item.plantId === id);

      if (exists) {
        return prev.map((item) =>
          item.plantId === id ? { ...item, todo: newTodo } : item
        );
      } else {
        return [...prev, { plantId: id, todo: newTodo }];
      }
    });

    console.log('Saved plant obj with todo: ', {
      plantId: id,
      todo: newTodo,
    });
  };

  const removeCompanionPlant = (index) => {
    setRelatedPlants(relatedPlants.filter((_, i) => i !== index));

    setPlantObjectWithTodo(plantObjectWithTodo.filter((_, i) => i !== index));
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <button className='close-task' onClick={onClose}>
          X
        </button>

        <form
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          className='popup-form'
          onSubmit={submitForm}
          noValidate
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2 className='popup-title'>Edit task with id: {taskData.id}</h2>
          </div>
          <div className='popup-body'>
            <div>
              <div>Task name:</div>
              <input
                type='text'
                name='name'
                style={{ fontSize: isMobile ? '12px' : '20px' }}
                placeholder='Edit task name'
                value={taskName}
                onChange={handleNameChange}
              />
              <br />
              <br />
              <div style={{ display: 'flex', gap: '10px' }}>
                <UploadImage id='upload3' onUploadImage={handleUpload} />
                <p>
                  {
                    typeof imageFile === 'string'
                      ? imageFile // existing filename
                      : imageFile?.name || '' // new File object
                  }
                </p>
              </div>
              <hr className='hr-styled' />
              <div>Todo:</div>
              <input
                type='text'
                id='todo'
                name='todo'
                onChange={handleToDo}
                required
                placeholder='Enter todo'
                value={todo}
              />
              <hr className='hr-styled' />
              <label>Select a Date 📅</label>
              <input type='date' value={date} onChange={handleDateChange} />
              <hr className='hr-styled' />
              <p htmlFor='companions'>Add plants for this task:</p>

              <input
                type='text'
                list='plant-suggestions'
                value={plantInput}
                onChange={(e) => setPlantInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCompanionPlant(e)}
                placeholder='Type plant name...'
              />
              <datalist id='plant-suggestions'>
                {allPlants?.length > 0 &&
                  allPlants.map((plant) => (
                    <option key={plant.id} value={plant.name} />
                  ))}
              </datalist>
              <ul>
                {relatedPlants.map((plant, index) => (
                  <li key={index}>
                    {plant.name}
                    <input
                      value={plantTodos[plant.id] || ''}
                      onChange={(e) => addTodoForPlant(e, plant.id)}
                    />
                    <button
                      className='remove-button'
                      onClick={() => removeCompanionPlant(index)}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <button type='submit' className='submit-button'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskPopup;
