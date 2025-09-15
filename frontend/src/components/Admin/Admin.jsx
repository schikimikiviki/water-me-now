import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './Admin.css';
import { getRequest, patchSomethingWithId } from '../../helpers/functions';
import AddPest from '../AddPest/AddPest';
import AddTask from '../AddTask/AddTask';
import UploadImage from '../UploadImage/UploadImage';
import DatabaseButton from '../DatabaseButton/DatabaseButton';
import { useAuth } from '../../AuthContext.jsx';
import Gallery from '../Gallery/Gallery.jsx';

function Admin() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [warning, setWarning] = useState('');
  const [message, setMessage] = useState('');
  const { isLoggedIn, setLoggedIn } = useAuth();
  const [formKey, setFormKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [postCompleted, setIsPostCompleted] = useState(false);

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
  const [allPlants, setAllPlants] = useState(null); // Available plants
  const [companionInput, setCompanionInput] = useState('');
  const [companionPlants, setCompanionPlants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedPlantTasks, setSelectedPlantTasks] = useState([]);
  const [commonPests, setCommonPests] = useState([]);
  const [selectedPests, setSelectedPests] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [isAlive, setIsAlive] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);

  // vegetable fields
  const [isVegetable, setIsVegetable] = useState(false);
  const [areVegetableFieldsOpen, setAreVegetableFieldsOpen] = useState(false);
  const [seedTime, setSeedTime] = useState(
    'END_OF_JANUARY_BEGINNING_OF_FEBRUARY'
  );
  const [trimmingTimes, setTrimmingTimes] = useState([]);
  const [harvestTimes, setHarvestTimes] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      const response = await getRequest('plants');
      setAllPlants(response);
    };

    const fetchPests = async () => {
      const response = await getRequest('pests');
      setCommonPests(response);
      console.log(response);
    };

    const fetchTasks = async () => {
      const response = await getRequest('tasks');
      console.log(response);
      setTasks(response);
    };

    const checkLoginStatus = async () => {
      try {
        await api.get('/auth/check', { withCredentials: true });
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        console.error('Check login failed:', err);
      }
    };

    checkLoginStatus();
    fetchPlants();

    fetchPests();
    fetchTasks();
  }, []);

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
      setCompanionPlants([...companionPlants, validPlant.id]);

      console.log('This was set to the ID array: ', validPlant.id);
    } else {
      console.warn('Invalid plant name or already added');

      // also tell the user
      setMessage('Invalid plant name or already added');
    }

    setCompanionInput(''); // Clear input after adding
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
        '/auth/login',
        { email: username, password: password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      console.log('Login successful:', response.data);

      setLoggedIn(true);
    } catch (error) {
      setWarning('Wrong login data entered.');
      console.error('Login failed:', error);
    }
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();

    console.log(galleryImages);

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
    formData.append('featureList', features);
    formData.append('ideal_placement', idealPlacement);
    formData.append('propagation', propagation);
    formData.append('fertilization_schedule', fertilization);
    formData.append('companionPlants', companionPlants);
    formData.append('uses', uses);
    formData.append('commonPests', selectedPests);
    formData.append('isAlive', isAlive);
    formData.append('extraInfo', extraInfo);

    if (isVegetable) {
      formData.append('isVegetable', isVegetable);
      formData.append('seedTime', seedTime);
      formData.append('harvestTimes', harvestTimes);
      formData.append('trimmingTimes', trimmingTimes);
    }

    console.log('Posting with this data :');
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await api.post('/plants/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('Plant added:', response.data);
      setMessage('Plant added successfully! 🌷');

      setTimeout(() => {
        document.querySelector('.message').classList.add('fade-out');
        setTimeout(() => setMessage(''), 500);
      }, 4500);

      // patch the plant with the plantTask - id because we could not do that earlier
      // because the plantID is created at POST
      // also, patch the companionPlants, so that they also have
      // our freshly created plant as compagnion
      let plantJustCreatedID = response.data.plant.id;

      setTimeout(() => {
        patchCompanionPlants(companionPlants, plantJustCreatedID);
        patchPlantTasks(plantJustCreatedID);
      }, 1000);
    } catch (error) {
      console.error('Error adding plant:', error);
      setMessage('Error posting to the database. ❌');
      setTimeout(() => {
        document.querySelector('.message').classList.add('fade-out');
        setTimeout(() => setMessage(''), 500);
      }, 4500);
    }
  };

  const patchCompanionPlants = async (companionPlants, plantJustCreatedId) => {
    // to each plant in the companionList, we need to do a patch request
    console.log(companionPlants);
    console.log(plantJustCreatedId);

    for (let i = 0; i < companionPlants.length; i++) {
      const formData = new FormData();

      const plantBody = {
        companionPlants: [plantJustCreatedId],
      };
      // Verify the final payload
      console.log('Final payload:', JSON.stringify(plantBody, null, 2));

      console.log(companionPlants[i]);

      // Create the Blob with proper type
      const jsonBlob = new Blob([JSON.stringify(plantBody)], {
        type: 'application/json',
      });
      formData.append('plantBody', jsonBlob);

      try {
        let response = await patchSomethingWithId(
          'plants',
          companionPlants[i],
          formData
        );
        console.log(response);
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
  };

  const patchPlantTasks = async (plantToPatchId) => {
    const formData = new FormData();

    // Now update plantId in all tasks
    const updatedTasks = selectedPlantTasks.map((t) => ({
      ...t,
      plantId: plantToPatchId,
    }));
    setSelectedPlantTasks(updatedTasks);

    console.log(selectedPlantTasks);

    const plantBody = {
      plantTasks: updatedTasks,
    };

    // Verify the final payload
    console.log('Final payload:', JSON.stringify(plantBody, null, 2));

    // Create the Blob with proper type
    const jsonBlob = new Blob([JSON.stringify(plantBody)], {
      type: 'application/json',
    });
    formData.append('plantBody', jsonBlob);

    // only do this if necessary
    if (updatedTasks.length > 0) {
      try {
        let response = await patchSomethingWithId(
          'plants',
          plantToPatchId,
          formData
        );
        console.log(response);
      } catch (error) {
        console.error('Request failed:', error);
      }
    }

    // clear fields after post
    setPlantName('');
    setOrigin('');
    setImageFile('');
    setHardiness('FULLY_HARDY');
    setHardinessInfo('');
    setIdealLocation('FULL_SUN');
    setWatering('ONCE_A_WEEK');
    setSoilType('CULTIVATION_SOIL');
    setPerennial(false);
    setFeatures([]);
    setIdealPlacement('INDOORS');
    setPropagation('');
    setFertilization('ONCE_A_MONTH');
    setUses([]);
    setCustomUse('');
    setCompanionInput('');
    setSelectedPlantTasks([]);
    setSelectedPests([]);
    setCompanionPlants([]);
    setExtraInfo('');
    setIsAlive(true);
    setIsVegetable(false);
    setSeedTime('END_OF_JANUARY_BEGINNING_OF_FEBRUARY');
    setTrimmingTimes([]);
    setHarvestTimes([]);
    setFormKey((prev) => prev + 1); // ===> we need this to clearly reset the form fields like plantTasks
    setIsPostCompleted(true); // ===> we need this state so that the UploadImage component knwos to clear the text
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

  const handleIdealSeedChange = (e) => {
    setSeedTime(e.target.value);
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

  const handleIsAliveChange = (e) => {
    setIsAlive(e.target.value);
  };

  const handleIsVegetableChange = (e) => {
    if (e.target.value == 'true') {
      setAreVegetableFieldsOpen(true);
    } else {
      setAreVegetableFieldsOpen(false);
    }
    setIsVegetable(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFeatures((prev) =>
      checked ? [...prev, value] : prev.filter((f) => f !== value)
    );
  };

  const handleHarvestTimeChange = (e) => {
    const { value, checked } = e.target;
    setHarvestTimes((prev) =>
      checked ? [...prev, value] : prev.filter((f) => f !== value)
    );
  };

  const handleTrimmingTimeChange = (e) => {
    const { value, checked } = e.target;
    setTrimmingTimes((prev) =>
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
      setSelectedPlantTasks([
        ...selectedPlantTasks,
        {
          // no plantId because the plant does not exist yet lol
          taskId: taskId,
          todo: '', // todo is initially empty
        },
      ]);
    } else {
      setSelectedPlantTasks(
        selectedPlantTasks.filter((t) => !(t.taskId === taskId))
      );
    }
  };

  const handlePestChange = (e, taskId) => {
    if (e.target.checked) {
      setSelectedPests([...selectedPests, taskId]);
    } else {
      setSelectedPests(selectedPests.filter((id) => id !== taskId));
    }
  };

  const handleUpload = (e) => {
    setImageFile(e);
    setIsPostCompleted(false);
  };

  const generateCompanionList = (idList) => {
    const companions = allPlants.filter((plant) => idList.includes(plant.id));

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

  return (
    <div className='page-div'>
      {!isLoggedIn ? (
        <div>
          <h1>Login</h1>

          {warning.length > 0 && (
            <div id='warning'>
              <b>{warning}</b>
            </div>
          )}

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>Hello, admin!</h1>
            <DatabaseButton />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className='post-box'>
              <div className='message-container'>
                {message.length > 0 && (
                  <div
                    className={`message ${
                      message.length > 0 ? 'fade-in' : 'fade-out'
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
              <h2>✨ Add a new plant ✨</h2>

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
                <UploadImage
                  id='upload1'
                  onUploadImage={handleUpload}
                  postCompleted={postCompleted}
                />
                <hr className='hr-styled' />
                <label htmlFor='hardiness'>Choose hardiness:</label>
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
                <label htmlFor='watering'>Choose watering schedule:</label>
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
                  <option value='SANDY_MIX'>Sandy mix</option>
                  <option value='POTTING_MIX'>Potting mix</option>
                </select>
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
                <hr className='hr-styled' />
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
                  onChange={(e) => handleFertilizationChange(e)}
                  name='fertilization'
                  id='fertilization'
                >
                  <option value='ONCE_A_WEEK'>Once a week</option>
                  <option value='ONCE_A_MONTH'>Once a month</option>
                </select>
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
                <ul>
                  {companionPlants && companionPlants.length > 0 ? (
                    generateCompanionList(companionPlants)
                  ) : (
                    <p>Currently no compagnion plants added</p>
                  )}
                </ul>
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
                <div key={formKey} className='plant-tasks-checkboxes'>
                  {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                      <div key={task.id}>
                        <input
                          type='checkbox'
                          id={`task-${task.id}`}
                          value={task.id}
                          checked={selectedPlantTasks.some(
                            (t) => t.taskId === task.id
                          )}
                          onChange={(e) => handleTaskChange(e, task.id)}
                        />
                        <label htmlFor={`task-${task.id}`}>{task.name}</label>
                        <input
                          type='text'
                          name={task.todo}
                          style={{ fontSize: isMobile ? '12px' : '20px' }}
                          placeholder='Edit task for this plant'
                          defaultValue={task.todo}
                          // wir gehen davon aus, dass der Task bereits existiert --> checkbox
                          // dh wir suchen ihn und setzen das todo
                          onChange={(e) => {
                            const updatedTasks = selectedPlantTasks.map((t) => {
                              if (t.taskId === task.id) {
                                return {
                                  ...t,
                                  todo: e.target.value,
                                };
                              }
                              return t;
                            });

                            setSelectedPlantTasks(updatedTasks);
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No plant tasks found</p>
                  )}
                </div>
                <hr className='hr-styled' />
                <input
                  type='text'
                  name={extraInfo}
                  style={{ fontSize: isMobile ? '12px' : '20px' }}
                  placeholder='Edit extra info for this plant'
                  defaultValue={''}
                  onChange={(e) => {
                    setExtraInfo(e.target.value);
                  }}
                />
                <label htmlFor='isAlive'>Choose alive status:</label>
                <select
                  value={isAlive}
                  onChange={handleIsAliveChange}
                  name='isAlive'
                  id='isAlive'
                >
                  <option value='true'>yes</option>
                  <option value='false'>no</option>
                </select>
                <hr className='hr-styled' />
                <label htmlFor='isVegetable'>Is this plant a vegetable?:</label>
                <select
                  value={isVegetable}
                  onChange={handleIsVegetableChange}
                  name='isVegetable'
                  id='isVegetable'
                >
                  <option value='true'>yes</option>
                  <option value='false'>no</option>
                </select>
                {areVegetableFieldsOpen && (
                  <>
                    <u style={{ paddingBottom: '10px' }}>
                      Enter vegetable values
                    </u>
                    <label htmlFor='seedTime'>Choose best planting time:</label>
                    <select
                      value={seedTime}
                      onChange={handleIdealSeedChange}
                      name='seedTime'
                      id='seedTime'
                    >
                      <option value='END_OF_JANUARY_BEGINNING_OF_FEBRUARY'>
                        End of january - beginning of february
                      </option>
                      <option value='ICE_SAINTS'>Ice Saints</option>
                      <option value='MARCH_TO_APRIL'>March - April</option>
                      <option value='APRIL_TO_MAY'>April - May</option>
                      <option value='MAY_TO_JUNE'>May - June</option>
                      <option value='JUNE_TO_JULY'>June - July</option>
                      <option value='AUGUST_TO_SEPTEMBER'>
                        August - September
                      </option>
                    </select>
                    <hr className='hr-styled' />
                    <label>Choose time for harvesting:</label>
                    <div className='feature-checkboxes'>
                      {[
                        'THROUGHOUT_THE_SUMMER',
                        'APRIL_TO_JUNE', //Asparagus
                        'MAY_TO_JULY', // beans
                        'JUNE_TO_AUGUST', // Peas

                        'SEPTEMBER_TO_NOVEMBER', // Spinach
                        'MAY_TO_SEPTEMBER', // Lettuce & Salad Greens
                        'SEPTEMBER_TO_OCTOBER', //Radishes, Pumpkins & Squash
                        'JUNE_TO_OCTOBER', // Carrots, beetroot, Cauliflower

                        'JUNE_TO_JULY', //Potatoes
                        'AUGUST_TO_OCTOBER', // Potatoes (maincrop)
                        'MAY_TO_JUNE', //Cabbage
                        'AUGUST_TO_NOVEMBER', //Cabbage

                        'JULY_TO_OCTOBER', // Broccoli , Tomatoes
                        'SEPTEMBER_TO_MARCH', // Kale
                        'JULY_TO_SEPTEMBER', // Zucchini , Cucumbers

                        'AUGUST_TO_SEPTEMBER', //Sweetcorn, Onions
                        'JULY_TO_AUGUST', //Garlic

                        'SEPTEMBER_TO_FEBRUARY', // Leeks
                        'OCTOBER_TO_FEBRUARY', // Brussels sprouts , Parsnips
                      ].map((time) => (
                        <div key={time}>
                          <input
                            type='checkbox'
                            id={time}
                            value={time}
                            checked={harvestTimes.includes(time)}
                            onChange={handleHarvestTimeChange}
                          />
                          <label htmlFor={harvestTimes}>
                            {time
                              .replace(/_/g, ' ')
                              .toLowerCase()
                              .replace(/^\w|\s\w/g, (c) => c.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                    <hr className='hr-styled' />
                    <label>Choose time for trimming:</label>
                    <div className='feature-checkboxes'>
                      {[
                        'MAY_TO_SEPTEMBER', // Tomatoes
                        'JUNE_TO_SEPTEMBER', // Courgettes / Zucchini
                        'JUNE_TO_AUGUST', // Cucumbers
                        'AUGUST_TO_SEPTEMBER', // Peas, Beans , Sweetcorn
                        'JUNE_TO_OCTOBER', // Carrots, Beets, Radishes, Cabbage, Cauliflower, Broccoli
                        'SEPTEMBER_TO_OCTOBER', //   Pumpkins & Squash
                        'AUGUST_TO_OCTOBER', // Potatoes
                        'SEPTEMBER_TO_MARCH', // Leeks, Kale
                        'JULY_TO_AUGUST', // Onions / Garlic
                        'OCTOBER_TO_FEBRUARY', // Brussels sprouts
                        'JUNE_TO_JULY', // Asparagus
                      ].map((time) => (
                        <div key={time}>
                          <input
                            type='checkbox'
                            id={time}
                            value={time}
                            checked={trimmingTimes.includes(time)}
                            onChange={handleTrimmingTimeChange}
                          />
                          <label htmlFor={trimmingTimes}>
                            {time
                              .replace(/_/g, ' ')
                              .toLowerCase()
                              .replace(/^\w|\s\w/g, (c) => c.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <hr className='hr-styled' />
                <Gallery />
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
                <button style={{ marginTop: '20px' }} type='submit'>
                  Post
                </button>
              </form>
            </div>
            <div className='post-box'>
              <AddPest plantListFromParent={allPlants} />
            </div>
            <div className='post-box'>
              <AddTask />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
