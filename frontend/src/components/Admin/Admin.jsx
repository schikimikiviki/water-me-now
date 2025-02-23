import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './Admin.css';

function Admin() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // plant fields
  const [plantName, setPlantName] = useState('');
  const [origin, setOrigin] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [hardiness, setHardiness] = useState('FULLY_HARDY');
  const [hardinessInfo, setHardinessInfo] = useState('');
  const [idealLocation, setIdealLocation] = useState('FULL_SUN');
  const [watering, setWatering] = useState('ONCE_A_WEEK');
  const [soilType, setSoilType] = useState('CULTIVATION_SOIL');
  const [perennial, setPerennial] = useState(false);
  const [features, setFeatures] = useState([]);
  const [idealPlacement, setIdealPlacement] = useState('INDOORS');
  const [propagation, setPropagation] = useState('');
  const [fertilization, setFertilization] = useState('ONCE_A_MONTH');
  const [uses, setUses] = useState([]);
  const [customUse, setCustomUse] = useState('');
  const [allPlants, setAllPlants] = useState([]); // Available plants
  const [companionInput, setCompanionInput] = useState('');
  const [companionPlants, setCompanionPlants] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      const response = await api.get('/plants/all'); // Fetch available plants
      setAllPlants(response.data);
    };
    fetchPlants();
  }, []);

  const addCompanionPlant = (e) => {
    e.preventDefault();
    if (companionInput && !companionPlants.includes(companionInput)) {
      setCompanionPlants([...companionPlants, companionInput]);
      setCompanionInput('');
    }
  };

  const removeCompanionPlant = (index) => {
    setCompanionPlants(companionPlants.filter((_, i) => i !== index));
  };

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(
        '/users/login',
        { username: username, password: password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      // Handle successful login
      console.log('Login successful:', response.data);

      const authToken = btoa(`${username}:${password}`);
      localStorage.setItem('authToken', authToken);

      setLoggedIn(true);
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error.message || error);
    }
  };

  // TODO: you should be able to select multiple uses
  // TODO: compagnion plants auto fill is missing
  // TODO: fix input fields color

  const handleAddPlant = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('plantName', plantName);
    formData.append('origin', origin);
    formData.append('image', imageFile);
    formData.append('hardiness', hardiness);
    formData.append('hardinessInfo', hardinessInfo);
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
    try {
      const response = await api.post('/plants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Plant added:', response.data);
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  const handlePlantNameChange = (e) => {
    setPlantName(e.target.value);
  };

  const handlePlantOriginChange = (e) => {
    setOrigin(e.target.value);
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

  const handleUsesChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setUses(selectedOptions);
  };

  const addCustomUse = (e) => {
    e.preventDefault();
    if (customUse && !uses.includes(customUse)) {
      setUses([...uses, customUse]);
      setCustomUse('');
    }
  };

  return (
    <div className='page-div'>
      {loggedIn ? (
        <div>
          <h1>Login</h1>
          <form onSubmit={handleLogin} role='form'>
            <input
              type='text'
              id='username'
              name='username'
              placeholder='Enter your Username'
              value={username}
              onChange={handleUserNameChange}
              required
            />
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your Password'
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <br /> <br />
            <button type='submit'>Login</button>
          </form>
        </div>
      ) : (
        <div>
          <h1>Hello, admin!</h1>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className='post-box'>
              <h2> Add a new plant</h2>

              <form className='form-add' onSubmit={handleAddPlant} role='form'>
                <input
                  type='text'
                  id='plantName'
                  name='plantName'
                  placeholder='Enter a plant name'
                  value={plantName}
                  onChange={handlePlantNameChange}
                  required
                />
                <input
                  type='text'
                  id='origin'
                  name='origin'
                  placeholder='Enter a plant origin'
                  value={origin}
                  onChange={handlePlantOriginChange}
                  required
                />
                <input
                  type='file'
                  id='plantImage'
                  name='plantImage'
                  accept='image/*'
                  onChange={(e) => setImageFile(e.target.files[0])}
                  required
                />
                <label for='hardiness'>Choose hardiness:</label>
                <select
                  value={hardiness}
                  onChange={handleHardinessChange}
                  name='hardiness'
                  id='hardiness'
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
                <label for='watering'>Choose watering schedule:</label>
                <select
                  value={watering}
                  onChange={handleWateringChange}
                  name='watering'
                  id='watering'
                >
                  <option value='ONCE_A_WEEK'>Once a week</option>
                  <option value='ONCE_EVERY_TWO_WEEKS'>
                    Once every 2 weeks
                  </option>
                  <option value='EVERY_FEW_DAYS'>Every few days</option>
                </select>
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
                        {feature.replace(/_/g, ' ')}
                      </label>
                    </div>
                  ))}
                </div>
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
                <label for='fertilization'>
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
                <label htmlFor='companions'>Add Companion Plants:</label>
                <input
                  type='text'
                  list='plant-suggestions'
                  value={companionInput}
                  onChange={(e) => setCompanionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCompanionPlant(e)}
                  placeholder='Type plant name...'
                />
                <datalist id='plant-suggestions'>
                  {allPlants.map((plant) => (
                    <option key={plant.id} value={plant.name} />
                  ))}
                </datalist>
                <ul>
                  {companionPlants.map((plant, index) => (
                    <li key={index}>
                      {plant}
                      <button onClick={() => removeCompanionPlant(index)}>
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
                <label htmlFor='uses'>Select Uses:</label>
                <select
                  multiple
                  value={uses}
                  onChange={handleUsesChange}
                  name='uses'
                  id='uses'
                >
                  <option value='Ornamental'>Ornamental</option>
                  <option value='Medicinal'>Medicinal</option>
                  <option value='Culinary'>Culinary</option>
                  <option value='Air Purifier'>Air Purifier</option>
                  <option value='Pollinator Friendly'>
                    Pollinator Friendly
                  </option>
                </select>
                <input
                  type='text'
                  placeholder='Add custom use'
                  value={customUse}
                  onChange={(e) => setCustomUse(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomUse(e)}
                />
                <ul>
                  {uses.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
                <br /> <br />
                <button type='submit'>Post</button>
              </form>
            </div>
            <div className='post-box'>
              <h2>Add a new pest</h2>
            </div>
            <div className='post-box'>
              <h2>Add a new task</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
