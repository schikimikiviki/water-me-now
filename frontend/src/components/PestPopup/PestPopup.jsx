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
  const [plantInput, setPlantInput] = useState('');
  const [relatedPlants, setRelatedPlants] = useState([]);

  // other states
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddPlantThere, setIsAddPlantThere] = useState(false);
  const [isAddPlantThereSecond, setIsAddPlantThereSecond] = useState(false);
  const [isPlantListEmpty, setIsPlantListEmpty] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    if (!plantList || plantList.length === 0) {
      setIsAddPlantThere(false);
      setIsPlantListEmpty(true);
    } else {
      setIsPlantListEmpty(false);
    }
  }, [plantList]);

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

    console.log('PlantList original', plantList);

    // if there is relatedPlants (user added new plant id), we need to consider this

    console.log('Currently we have a related plant added: ', relatedPlants);
    let combinedPlantIds;

    if (relatedPlants.length > 0) {
      // add ids
      for (let i of relatedPlants) {
        console.log(i.id);
        const newPlantIds = relatedPlants.map((plant) => plant.id);

        combinedPlantIds = [...plantList, ...newPlantIds];
      }

      console.log('Combined Plant IDs:', combinedPlantIds);
    }

    const pestBody = {
      name: pestName,
      todo: todo,
      plantList: relatedPlants.length > 0 ? combinedPlantIds : plantList,
    };

    // Verify the final payload
    console.log('Final payload:', JSON.stringify(pestBody, null, 2));

    const formData = new FormData();
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    // Create the Blob with proper type
    const jsonBlob = new Blob([JSON.stringify(pestBody)], {
      type: 'application/json',
    });
    formData.append('pestBody', jsonBlob);

    // Debug the FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        console.log(key, '(Blob)');
      } else {
        console.log(key, value);
      }
    }

    try {
      let response = await patchSomethingWithId('pests', pestData.id, formData);
      console.log('Response:', response);
      onClose();
    } catch (error) {
      console.error('Request failed:', error);
    }
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

  const displayAddPlant = () => {
    setIsAddPlantThereSecond(true);
  };

  const getPlantObjects = (plantList) => {
    // this will be an array with ids

    if (!plantList || plantList.length === 0) return null;

    return (
      <div>
        {isAddPlantThereSecond && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button type='button' onClick={displayAddPlant}>
                +
              </button>
              <input
                type='text'
                list='plant-suggestions'
                value={plantInput}
                onChange={(e) => setPlantInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCompanionPlant(e)}
                placeholder='Type plant name...'
              />
            </div>

            <datalist id='plant-suggestions'>
              {allPlantsData?.length > 0 &&
                allPlantsData.map((plant) => (
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
          </div>
        )}

        {!isAddPlantThereSecond && (
          <button type='button' onClick={displayAddPlant}>
            +
          </button>
        )}

        {plantList.map((id) => {
          const plant = allPlantsData.find((plant) => plant.id == id);
          if (!plant) {
            console.log('No plant found');
            return null;
          }

          return (
            <div className='plant-div' key={id}>
              <div className='inner-plant'>
                <div className='plant-name'>
                  <ul>
                    <li>{plant.name}</li>
                  </ul>
                </div>
                <button
                  className='small-button'
                  onClick={() => removePlant(plant.id)}
                >
                  ✖
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const addPlantToPest = () => {
    setIsAddPlantThere(!isAddPlantThere);
  };

  const addCompanionPlant = (e) => {
    e.preventDefault();
    const selectedPlant = allPlantsData.find((p) => p.name === plantInput);
    console.log('Selected plant : ', selectedPlant);
    console.log('plant input', plantInput);
    if (
      selectedPlant &&
      !relatedPlants.some((p) => p.id === selectedPlant.id)
    ) {
      setRelatedPlants([...relatedPlants, selectedPlant]);
      setPlantInput('');
    }

    // also, hide the "no input sign"
    setIsPlantListEmpty(false);
  };

  const removeCompanionPlant = (index) => {
    setRelatedPlants(relatedPlants.filter((_, i) => i !== index));
    setIsPlantListEmpty(true);
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <button className='close-button' onClick={onClose}>
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
                  <div className='no-plants'>
                    <p>{isPlantListEmpty ? 'No plants found' : ''}</p>
                    <button
                      onClick={addPlantToPest}
                      type='button'
                      className='plus-button'
                    >
                      +
                    </button>
                  </div>
                )}
                {isAddPlantThere && (
                  <div>
                    <p htmlFor='companions'>Add susceptible plants:</p>
                    <input
                      type='text'
                      list='plant-suggestions'
                      value={plantInput}
                      onChange={(e) => setPlantInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && addCompanionPlant(e)
                      }
                      placeholder='Type plant name...'
                    />
                    <datalist id='plant-suggestions'>
                      {allPlantsData?.length > 0 &&
                        allPlantsData.map((plant) => (
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
                  </div>
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
