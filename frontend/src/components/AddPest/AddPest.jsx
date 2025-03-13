import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import UploadImage from '../UploadImage/UploadImage';

function AddPest({ plantListFromParent }) {
  const [pestName, setPestName] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [todo, setTodo] = useState('');
  const [allPlants, setAllPlants] = useState([]); // Available plants
  const [plantInput, setPlantInput] = useState('');
  const [relatedPlants, setRelatedPlants] = useState([]);

  useEffect(() => {
    console.log('Received plant list:', plantListFromParent);
    setAllPlants(plantListFromParent);
  }, [plantListFromParent]);

  const handlePestNameChange = (e) => {
    setPestName(e.target.value);
  };

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

  const addCompanionPlant = (e) => {
    e.preventDefault();
    const selectedPlant = allPlants.find((p) => p.name === plantInput);
    if (
      selectedPlant &&
      !relatedPlants.some((p) => p.id === selectedPlant.id)
    ) {
      setRelatedPlants([...relatedPlants, selectedPlant]);
      setPlantInput('');
    }
  };

  const removeCompanionPlant = (index) => {
    setRelatedPlants(relatedPlants.filter((_, i) => i !== index));
  };

  const handleAddPest = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', pestName);
    formData.append('imageFile', imageFile);
    formData.append('todo', todo);

    // Append each plant ID individually
    relatedPlants.forEach((plant) => {
      formData.append('plantList', plant.id); // same key for each entry
    });

    console.log('Posting with this data:');
    for (var pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const authToken = localStorage.getItem('authToken');

      const response = await api.post('/pests/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Basic ${authToken}`,
        },
      });
      console.log('Pest added:', response.data);
    } catch (error) {
      console.error('Error adding pest:', error);
    }
  };

  const handleUpload = (e) => {
    setImageFile(e);
  };

  return (
    <div>
      <h2>✨ Add a new pest ✨</h2>

      <form className='form-add' onSubmit={handleAddPest} role='form'>
        <input
          type='text'
          id='pestName'
          name='pestName'
          placeholder='Enter a pest name'
          value={pestName}
          onChange={handlePestNameChange}
          required
        />
        <UploadImage id='upload3' onUploadImage={handleUpload} />
        <hr className='hr-styled' />
        <input
          type='text'
          id='todo'
          name='todo'
          placeholder='Enter a todo'
          value={todo}
          onChange={handleTodoChange}
          required
        />
        <label htmlFor='companions'>Add susceptible plants:</label>
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
              <button
                className='remove-button'
                onClick={() => removeCompanionPlant(index)}
              >
                ✖
              </button>
            </li>
          ))}
        </ul>

        <button type='submit'>Post</button>
      </form>
    </div>
  );
}

export default AddPest;
