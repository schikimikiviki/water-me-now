import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './Popup.css';
import { patchSomethingWithId } from '../../helpers/functions';
import UploadImage from '../UploadImage/UploadImage';

const Popup = ({ onClose, onAdd, plantData, allPlantsData }) => {
  // plant states
  const [plantName, setPlantName] = useState(plantData.name);
  const [origin, setPlantOrigin] = useState(plantData.origin);
  const [commonPests, setCommonPests] = useState(plantData.commonPests);
  const [companionPlants, setCompanionPlants] = useState(
    plantData.companionPlants
  );
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

  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  //   console.log(plantData);

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
    setFertilization(e.taget.value);
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
    formData.append('name', plantName);
    formData.append('origin', origin);
    formData.append('imageFile', imageFile);
    formData.append('hardiness', hardiness);
    formData.append('hardiness_info', hardinessInfo);
    formData.append('ideal_location', idealLocation);
    formData.append('watering', watering);
    formData.append('soil_type', soilType);
    formData.append('perennial', perennial);
    formData.append('features', JSON.stringify(features));
    formData.append('ideal_placement', idealPlacement);
    formData.append('propagation', propagation);
    formData.append('fertilization_schedule', fertilization);
    formData.append('companionPlants', JSON.stringify(companionPlants));
    formData.append('uses', JSON.stringify(uses));
    selectedPlantTasks.forEach((taskId) =>
      formData.append('plantTasks', taskId)
    ); //TODO: pests are missing

    console.log('Patching with this data :');
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    let response = await patchSomethingWithId('plants', plantData.id, formData);
  };

  const handleUpload = (e) => {
    setImageFile(e);
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
              <UploadImage id='upload3' onUploadImage={handleUpload} />
              <hr className='hr-styled' />
              <label for='hardiness'>Choose hardiness:</label>
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
              <label for='idealLocation'>Choose ideal location:</label>
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
              <label for='watering'>Choose watering schedule:</label>
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
              <label for='soilType'>Choose soil type:</label>
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
              <label for='perennial'>Choose perennial type:</label>
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
              <label for='idealPlacement'>Choose ideal placement:</label>
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
              <label for='fertilization'>Choose fertilization schedule:</label>
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
                onChange={(e) => setCompanionInput(e.target.value)}
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
                <ul>
                  {companionPlants.map((plant, index) => (
                    <li key={index}>
                      {plant}
                      <button
                        className='remove-button'
                        onClick={() => removeCompanionPlant(index)}
                      >
                        ✖
                      </button>
                    </li>
                  ))}
                </ul>
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
                {plantTasks && plantTasks.length > 0 ? (
                  plantTasks.map((task) => (
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
              <div className='plant-tasks-checkboxes'>
                {commonPests && commonPests.length > 0 ? (
                  commonPests.map((task) => (
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
