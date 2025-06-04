import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './PestPopup.css';
import { patchSomethingWithId } from '../../helpers/functions';
import UploadImage from '../UploadImage/UploadImage';

const PestPopup = ({
  onClose,
  onAdd,
  pestData,
  allPestsData,
  allPlantsData,
}) => {
  // pest states
  const [pestName, setPestName] = useState(pestData.name);
  const [todo, setTodo] = useState(pestData.todo);
  const [plantList, setPlantList] = useState(pestData.plantList);
  const [imageFile, setImageFile] = useState(pestData.imageFile);

  // other states
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    setIsMobile(width <= 768 ? true : false);
  }, [width]);

  const handleToDo = (e) => {
    setTodo(e.target.value);
  };

  const handleNameChange = (e) => {
    setPestName(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const pestBody = {
      name: pestName,
      todo: todo,
      plantList: plantList.map((p) => p.id),
    };

    const formData = new FormData();
    formData.append('imageFile', imageFile);
    formData.append(
      'pestBody',
      new Blob([JSON.stringify(pestBody)], { type: 'application/json' })
    );

    console.log('Sending PATCH with:');
    for (var pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    let response = await patchSomethingWithId('pests', pestData.id, formData);
    console.log('response: ', response);
  };

  const handleUpload = (e) => {
    setImageFile(e);
  };

  const removePlant = (id) => {
    setPlantList(
      plantList.filter(function (item) {
        return item !== id;
      })
    ),
      () => {
        console.log('removed item from plantList arr .. ', plantList);
      };
  };

  const getPlantObjects = (plantList) => {
    // this will be an array with ids
    //console.log(allPlantsData);

    for (let i = 0; i < plantList.length; i++) {
      // search for the plant with that id
      let plant = allPlantsData.find((plant) => plant.id == plantList[i]);
      console.log('Displaying plant: ', plant);

      return (
        <div className='plant-div' key={plantList[i]}>
          <div className='inner-plant'>
            <div className='plant-name'>
              <ul>
                <li>{plant.name}</li>
              </ul>
            </div>
            <button onClick={() => removePlant(plant.id)}>✖</button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <button className='close-button' onClick={onClose}>
          X
        </button>

        <form className='popup-form' onSubmit={submitForm} noValidate>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2 className='popup-title'>Edit pest with id: {pestData.id}</h2>
          </div>
          <div className='popup-body'>
            <div>
              <div>Pest name:</div>
              <input
                type='text'
                name='name'
                style={{ fontSize: isMobile ? '12px' : '20px' }}
                placeholder='Edit pest name'
                value={pestName}
                onChange={handleNameChange}
              />
              <br />
              <br />
              <UploadImage id='upload3' onUploadImage={handleUpload} />
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
              <label>Choose susceptible plants for this pest:</label>
              <br></br>
              <br></br>
              <div>
                {plantList && plantList.length > 0 ? (
                  getPlantObjects(plantList)
                ) : (
                  <p>No plants found</p>
                )}
              </div>
              <br /> <br />
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

export default PestPopup;
