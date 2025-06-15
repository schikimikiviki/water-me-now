import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './Popup.css';
import { patchSomethingWithId } from '../../helpers/functions';
import UploadImage from '../UploadImage/UploadImage';

const Popup = ({
  onClose,
  plantData,
  allPlantsData,
  allPestsData,
  plantRelevantTasks,
  allTasksData,
}) => {
  // plant states
  const [plantName, setPlantName] = useState(plantData.name);
  const [origin, setPlantOrigin] = useState(plantData.origin);
  const [commonPests, setCommonPests] = useState(plantData.commonPests);

  const [companionPlants, setCompanionPlants] = useState(
    plantData.companionPlants || []
  );
  // const [compagnionPlantIds, setCompagnionPlantIds] = useState([]);

  const [companionInput, setCompanionInput] = useState('');
  const [allPlants, setAllPlants] = useState(allPlantsData);
  const [features, setFeatures] = useState(plantData.featureList);
  const [fertilization, setFertilization] = useState(
    plantData.fertilization_schedule
  );
  const [hardiness, setHardiness] = useState(plantData.hardiness);
  const [hardinessInfo, setHardinessInfo] = useState(plantData.hardiness_info);
  const [idealLocation, setIdealLocation] = useState(plantData.ideal_location);
  const [idealPlacement, setIdealPlacement] = useState(
    plantData.ideal_placement
  );
  const [imageFile, setImageFile] = useState(plantData.imageFile);
  const [perennial, setPerennial] = useState(plantData.perennial);
  const [plantTasks, setPlantTasks] = useState(plantData.plantTasks);
  const [propagation, setPropagation] = useState(plantData.propagation);
  const [soilType, setSoilType] = useState(plantData.soil_type);
  const [uses, setUses] = useState(plantData.uses);
  const [customUse, setCustomUse] = useState('');
  const [watering, setWatering] = useState(plantData.watering);
  const [selectedPlantTasks, setSelectedPlantTasks] = useState([]);
  const [selectedPests, setSelectedPests] = useState(commonPests);

  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);
  const [imageFileName, setImageFileName] = useState(plantData.imageFile);

  //console.log('selcted pests: ', selectedPests);
  console.log('relevant tasks for this plant: ', plantRelevantTasks);

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

  const handleNameChange = (e) => {
    setPlantName(e.target.value);
  };

  const handleOriginChange = (e) => {
    setPlantOrigin(e.target.value);
  };

  const handleHardinessChange = (e) => {
    setHardiness(e.target.value);
  };

  const handleHardinessInfoChange = (e) => {
    setHardinessInfo(e.target.value);
  };

  const handleIdealLocationChange = (e) => {
    setIdealLocation(e.target.value);
  };

  const handleWateringChange = (e) => {
    setWatering(e.target.value);
  };

  const handleSoilTypeChange = (e) => {
    setSoilType(e.target.value);
  };

  const handlePerennialChange = (e) => {
    setPerennial(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFeatures((prev) =>
      checked ? [...prev, value] : prev.filter((f) => f !== value)
    );
  };

  const handleIdealPlacementChange = (e) => {
    setIdealPlacement(e.target.value);
  };

  const handlePropagationChange = (e) => {
    setPropagation(e.target.value);
  };

  const handleFertilizationChange = (e) => {
    setFertilization(e.target.value);
  };

  const removeUse = (index) => {
    setUses(uses.filter((_, i) => i !== index));
  };

  const handleTaskChange = (e, taskId) => {
    if (e.target.checked) {
      setSelectedPlantTasks([...selectedPlantTasks, taskId]);
    } else {
      setSelectedPlantTasks(selectedPlantTasks.filter((id) => id !== taskId));
    }
  };

  const handlePestChange = (e, taskId) => {
    if (e.target.checked) {
      setSelectedPests([...selectedPests, taskId]);
    } else {
      setSelectedPests(selectedPests.filter((id) => id !== taskId));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const plantBody = {
      name: plantName,
      origin: origin,
      companionPlants: companionPlants,
      hardiness: hardiness,
      uses: uses,
      hardiness_info: hardinessInfo,
      ideal_location: idealLocation,
      watering: watering,
      soil_type: soilType,
      perennial: perennial,
      featureList: features,
      ideal_placement: idealPlacement,
      propagation: propagation,
      fertilization_schedule: fertilization,
      commonPests: selectedPests,
      plantTasks: [{ taskId: 52, todo: 'idk' }],
    };

    // Verify the final payload
    console.log('Final payload:', JSON.stringify(plantBody, null, 2));

    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    // Create the Blob with proper type
    const jsonBlob = new Blob([JSON.stringify(plantBody)], {
      type: 'application/json',
    });
    formData.append('plantBody', jsonBlob);

    try {
      let response = await patchSomethingWithId(
        'plants',
        plantData.id,
        formData
      );
      console.log(response);
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
    const trimmedInput = companionInput.trim();

    // Check if input matches a valid plant name
    const validPlant = allPlants.find((plant) => plant.name === trimmedInput);
    console.log('valid plant: ', validPlant);
    //console.log(companionPlants);

    if (
      validPlant &&
      !companionPlants.some((plant) => plant.name === validPlant.name)
    ) {
      // setCompagnionPlantIds([...compagnionPlantIds, validPlant.id]);
      setCompanionPlants([...companionPlants, validPlant]);

      console.log('This was set to the ID array: ', validPlant.id);
    } else {
      console.warn('Invalid plant name or already added');
    }

    setCompanionInput(''); // Clear input after adding
  };

  const generateCompanionList = (idList) => {
    const companions = allPlantsData.filter((plant) =>
      idList.includes(plant.id)
    );

    return (
      <ul>
        {companions.map((plant, index) => (
          <li key={plant.id}>
            {plant.name}
            <button
              className='remove-button'
              onClick={() => removeCompanionPlant(plant.id)}
              type='button'
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const removeCompanionPlant = (idToRemove) => {
    console.log('removing plant with id: ', idToRemove);
    setCompanionPlants(companionPlants.filter((id) => id !== idToRemove));
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
            <h2 className='popup-title'>Edit plant with id: {plantData.id}</h2>
          </div>
          <div className='popup-body'>
            <div>
              <input
                type='text'
                name='name'
                style={{ fontSize: isMobile ? '12px' : '20px' }}
                placeholder='Edit plant name'
                value={plantName}
                onChange={handleNameChange}
              />
              <input
                type='text'
                name='origin'
                style={{ fontSize: isMobile ? '12px' : '20px' }}
                placeholder='Edit plant origin'
                value={origin}
                onChange={handleOriginChange}
              />
              <br />
              <br />
              <div style={{ display: 'flex' }}>
                <UploadImage id='upload4' onUploadImage={handleUpload} />
                <p>{imageFileName}</p>
              </div>
              <hr className='hr-styled' />
              <label htmlFor='hardiness'>Choose hardiness:</label>
              <select
                value={hardiness}
                onChange={handleHardinessChange}
                name='hardiness'
                id='hardiness-label'
              >
                <option value='FULLY_HARDY'>Fully hardy</option>
                <option value='PARTIALLY_HARDY'>Partially hardy</option>
                <option value='NOT_HARDY'>Not hardy</option>
              </select>
              <input
                type='text'
                id='hardinessInfo'
                name='hardinessInfo'
                onChange={handleHardinessInfoChange}
                required
                placeholder='Enter hardiness info'
                value={hardinessInfo}
              />
              <hr className='hr-styled' />
              <label htmlFor='idealLocation'>Choose ideal location:</label>
              <select
                value={idealLocation}
                onChange={handleIdealLocationChange}
                name='idealLocation'
                id='idealLocation'
              >
                <option value='FULL_SUN'>Full Sun</option>
                <option value='INDIRECT_SUN'>Indirect Sun</option>
                <option value='SHADOW'>Shadow</option>
              </select>
              <br />
              <label htmlFor='watering'>Choose watering schedule:</label>
              <select
                value={watering}
                onChange={handleWateringChange}
                name='watering'
                id='watering'
              >
                <option value='ONCE_A_WEEK'>Once a week</option>
                <option value='ONCE_EVERY_TWO_WEEKS'>Once every 2 weeks</option>
                <option value='EVERY_FEW_DAYS'>Every few days</option>
              </select>{' '}
              <br />
              <label htmlFor='soilType'>Choose soil type:</label>
              <select
                value={soilType}
                onChange={handleSoilTypeChange}
                name='soilType'
                id='soilType'
              >
                <option value='CULTIVATION_SOIL'>Cultivation soil</option>
                <option value='PALM_SOIL'>Palm soil</option>
                <option value='POTTING_SOIL'>Potting soil</option>
                <option value='CACTUS_SOIL'>Cactus soil</option>
                <option value='RHODODENDRON_SOIL'>Rhododendron soil</option>
                <option value='CITRUS_SOIL'>Citrus soil</option>
                <option value='ORCHID_SOIL'>Orchid soil</option>
                <option value='TOMATO_SOIL'>Tomato soil</option>
                <option value='COMPOST'>Compost</option>
              </select>
              <br />
              <label htmlFor='perennial'>Choose perennial type:</label>
              <select
                value={perennial}
                onChange={handlePerennialChange}
                name='perennial'
                id='perennial'
              >
                <option value='true'>yes</option>
                <option value='false'>no</option>
              </select>
              <hr className='hr-styled' />
              <label>Choose features:</label>
              <div className='feature-checkboxes'>
                {[
                  'CLIMBING_HABIT',
                  'FRAGRANT',
                  'LOW_MAINTENANCE',
                  'EASY_TO_PROPAGATE',
                  'DROUGHT_TOLERANT',
                  'FAST_GROWER',
                  'EDIBLE',
                  'PET_FRIENDLY',
                ].map((feature) => (
                  <div key={feature}>
                    <input
                      type='checkbox'
                      id={feature}
                      value={feature}
                      checked={features.includes(feature)}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={feature}>
                      {feature
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/^\w|\s\w/g, (c) => c.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor='idealPlacement'>Choose ideal placement:</label>
              <select
                value={idealPlacement}
                onChange={handleIdealPlacementChange}
                name='idealPlacement'
                id='idealPlacement'
              >
                <option value='INDOORS'>Indoors</option>
                <option value='OUTDOORS'>Outdoors</option>
                <option value='INDOORS_AND_OUTDOORS'>
                  Indoors and outdoors
                </option>
              </select>
              <input
                type='text'
                id='propagation'
                name='propagation'
                placeholder='Enter propagation instructions'
                value={propagation}
                onChange={handlePropagationChange}
                required
              />
              <hr className='hr-styled' />
              <label htmlFor='fertilization'>
                Choose fertilization schedule:
              </label>
              <select
                value={fertilization}
                onChange={handleFertilizationChange}
                name='fertilization'
                id='fertilization'
              >
                <option value='ONCE_A_WEEK'>Once a week</option>
                <option value='ONCE_A_MONTH'>Once a month</option>
              </select>
              <br />
              <label htmlFor='companions'>Add companion plants:</label>
              <input
                type='text'
                list='plant-suggestions'
                value={companionInput}
                onChange={(e) => {
                  //console.log(e.target.value);
                  setCompanionInput(e.target.value);
                }}
                onKeyDown={(e) => e.key === 'Enter' && addCompanionPlant(e)}
                placeholder='Type plant name...'
              />
              <datalist id='plant-suggestions'>
                {allPlants?.length > 0 &&
                  allPlants.map((plant) => (
                    <option key={plant.id} value={plant.name} />
                  ))}
              </datalist>
              {companionPlants && companionPlants.length > 0 ? (
                generateCompanionList(companionPlants)
              ) : (
                <p>Currently no compagnion plants added</p>
              )}
              <hr className='hr-styled' />
              <label htmlFor='uses'>Enter Uses:</label>
              <input
                type='text'
                placeholder='Type a use and press Enter'
                value={customUse}
                onChange={(e) => setCustomUse(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customUse.trim() !== '') {
                    e.preventDefault();
                    setUses([...uses, customUse.trim()]);
                    setCustomUse(''); // Clear input after adding
                  }
                }}
              />
              <ul className='uses-list'>
                {uses &&
                  uses.map((use, index) => (
                    <li key={index} className='use-tag'>
                      {use}{' '}
                      <button
                        className='remove-button'
                        type='button'
                        onClick={() => removeUse(index)}
                      >
                        ✖
                      </button>
                    </li>
                  ))}
              </ul>
              <hr className='hr-styled' />
              <label>Choose Plant Tasks:</label>
              <div className='plant-tasks-checkboxes'>
                {allTasksData && allTasksData.length > 0 ? (
                  allTasksData.map((task) => (
                    <div key={task.id}>
                      <input
                        type='checkbox'
                        id={`task-${task.id}`}
                        value={task.id}
                        checked={selectedPlantTasks.includes(task.id)}
                        onChange={(e) => handleTaskChange(e, task.id)}
                      />
                      <label htmlFor={`task-${task.id}`}>{task.name}</label>
                    </div>
                  ))
                ) : (
                  <p>No plant tasks found</p>
                )}
              </div>
              <hr className='hr-styled' />
              <label>Choose common pests:</label>
              <div className='feature-checkboxes'>
                {allPestsData && allPestsData.length > 0 ? (
                  allPestsData.map((task) => (
                    <div key={task.id}>
                      <input
                        type='checkbox'
                        id={`task-${task.id}`}
                        value={task.id}
                        checked={selectedPests.includes(task.id)}
                        onChange={(e) => handlePestChange(e, task.id)}
                      />
                      <label htmlFor={`task-${task.id}`}>{task.name}</label>
                    </div>
                  ))
                ) : (
                  <p>No pests found</p>
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

export default Popup;
