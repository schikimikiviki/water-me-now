import { useState, useEffect } from 'react';
import { getRequest, deleteSomethingWithId } from '../../helpers/functions';
import api from '../../api/axiosConfig';
import './PlantList.css';
import SunIcon from '../../assets/images/sun.svg';
import SunCloudIcon from '../../assets/images/suncloud.svg';
import CloudIcon from '../../assets/images/cloudy.svg';
import SnowflakeIcon from '../../assets/images/snowflake.svg';
import NoSlowFlakeIcon from '../../assets/images/no-snowflake.svg';
import PerennialIcon from '../../assets/images/perennial.svg';
import NotPerennialIcon from '../../assets/images/not-perennial.svg';
import Popup from '../Popup/Popup';
import { Link } from 'react-router-dom';

function PlantList() {
  const [plants, setPlants] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [chosenPlant, setChosenPlant] = useState(null);
  const [pests, setPests] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [relevantTaskObject, setRelevantTaskObject] = useState({});

  const fetchData = async () => {
    let tasks = await getRequest('tasks');
    //console.log(tasks);
    setTasks(tasks);

    let plants = await getRequest('plants');
    setPlants(plants);
    // console.log(plants);

    let pests = await getRequest('pests');
    //console.log(pests);
    setPests(pests);

    const taskMap = {};
    plants.forEach((plant) => {
      const relevantTasks = tasks.filter((task) =>
        task.plantTasks.some((pt) => pt.plantId === plant.id)
      );
      taskMap[plant.id] = { relevantTasks };
    });

    //console.log(taskMap);

    setRelevantTaskObject(taskMap);
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

  useEffect(() => {
    fetchData();
    checkLoginStatus();
  }, []);

  const pathToimg = 'http://localhost:8888/uploads/';

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    fetchData();
  };

  const handlePlantDelete = async (id) => {
    console.log('Deleting plant with id: ', id);

    try {
      const response = await deleteSomethingWithId('plants', id);
      console.log(response);

      // If the delete is successful, refresh the plant list
      if (response.success) {
        fetchData();
      } else {
        console.log('Failed to delete plant');
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  const handlePlantEdit = (id) => {
    console.log('Editing plant with id', id);
    setChosenPlant(plants.find((plant) => plant.id === id));
    console.log(
      'this is the data we work with: ',
      plants.find((plant) => plant.id === id)
    );

    openPopup();
  };

  const getCompanionList = (idList) => {
    const companions = plants.filter((plant) => idList.includes(plant.id));

    return (
      <ul>
        {companions.map((plant, index) => (
          <li key={plant.id}>{plant.name}</li>
        ))}
      </ul>
    );
  };

  const generateCommonPestList = (idList) => {
    if (pests?.length > 0) {
      const pestsFiltered = pests.filter((pest) => idList.includes(pest.id));

      return (
        <ul>
          {pestsFiltered.map((pest) => (
            <li key={pest.id}>{pest.name}</li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className='page-div'>
      <h1>Plants</h1>
      {plants && plants.length > 0 ? (
        <ul>
          {plants.map((plant) => (
            <div className='container-plant' key={plant.id}>
              <div>
                <p className='plant-id'>{plant.id}</p>
                <img
                  src={pathToimg + plant.imageFile}
                  alt={plant.name}
                  width={250}
                  height={350}
                  className='img-plant'
                />
                {isLoggedIn ? (
                  <div className='admin-functions'>
                    <div
                      onClick={() => {
                        handlePlantEdit(plant.id);
                      }}
                    >
                      🖊️
                    </div>
                    <div
                      onClick={() => {
                        handlePlantDelete(plant.id);
                      }}
                    >
                      🗑️
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className='plant-details'>
                <div className='plant-shortinfo'>
                  <Link to={`/plants/${plant.id}`}>
                    <h2>{plant.name}</h2>
                  </Link>
                  <div className='plant-emojis'>
                    {plant.hardiness == 'HARDY' ||
                    plant.hardiness == 'PARTIALLY_HARDY' ? (
                      <img
                        src={SnowflakeIcon}
                        alt='Snowflake'
                        width={40}
                        height={40}
                        className='snowflake'
                      />
                    ) : (
                      <img
                        src={NoSlowFlakeIcon}
                        alt='Snowflake'
                        width={40}
                        height={40}
                        className='snowflake'
                      />
                    )}
                    {plant.ideal_location == 'FULL_SUN' ? (
                      <img src={SunIcon} alt='Sun' width={50} height={50} />
                    ) : plant.ideal_location == 'INDIRECT_SUN' ? (
                      <img
                        src={SunCloudIcon}
                        alt='Clouds'
                        width={50}
                        height={50}
                      />
                    ) : (
                      <img
                        src={CloudIcon}
                        alt='Clouds'
                        width={50}
                        height={50}
                      />
                    )}
                    {plant.perennial ? (
                      <img
                        src={PerennialIcon}
                        alt='Clouds'
                        width={35}
                        height={35}
                        className='perennial-icon'
                      />
                    ) : (
                      <img
                        src={NotPerennialIcon}
                        alt='Clouds'
                        width={35}
                        height={35}
                        className='perennial-icon'
                      />
                    )}
                  </div>
                </div>

                <hr />
                <div>
                  🌿 <u className='space'>Origin:</u> {plant.origin}
                </div>
                <div>
                  🌿 <u className='space'>Hardiness:</u>{' '}
                  {plant.hardiness.replace('_', ' ').toLowerCase()} -{' '}
                  {plant.hardiness_info}
                </div>
                <div>
                  🌿 <u className='space'>Ideal location:</u>{' '}
                  {plant.ideal_location.replace('_', ' ').toLowerCase()}
                </div>
                <div>
                  🌿 <u className='space'>Watering:</u>{' '}
                  {plant.watering.replace(/_/g, ' ').toLowerCase()}
                </div>
                <div>
                  🌿 <u className='space'>Soil type:</u>{' '}
                  {plant.soil_type.replace('_', ' ').toLowerCase()}
                </div>
                <div>
                  🌿 <u className='space'>Perennial:</u>{' '}
                  {plant.perennial ? 'Yes' : 'No'}
                </div>
                {plant.featureList.length > 0 && (
                  <div>
                    🌿 <u className='space'>Features:</u>{' '}
                    {plant.featureList
                      .join(', ')
                      .replaceAll('_', ' ')
                      .toLowerCase()}
                  </div>
                )}
                <div>
                  🌿 <u className='space'>Ideal placement:</u>{' '}
                  {plant.ideal_placement.replace('_', ' ').toLowerCase()}
                </div>
                <div>
                  🌿 <u className='space'>Propagation:</u> {plant.propagation}
                </div>
                <div>
                  🌿 <u className='space'>Fertilization schedule:</u>{' '}
                  {plant.fertilization_schedule
                    .replace(/_/g, ' ')
                    .toLowerCase()}
                </div>
                {plant.companionPlants && plant.companionPlants.length > 0 && (
                  <div>
                    🌿 <u className='space'>Companion plants:</u>{' '}
                    {getCompanionList(plant.companionPlants)}
                  </div>
                )}
                {plant.uses.length > 0 && (
                  <div>
                    🌿 <u className='space'>Uses:</u>
                    <ul>
                      {plant.uses.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {plant.commonPests.length > 0 && (
                  <div>
                    🌿 <u className='space'>Common pests:</u>
                    {generateCommonPestList(plant.commonPests)}
                  </div>
                )}

                {plant.plantTasks.length > 0 && (
                  <div>
                    🌿 <u className='space'>Plant tasks:</u>
                    <ul>
                      {relevantTaskObject[plant.id]?.relevantTasks.map((task) =>
                        task.plantTasks
                          ?.filter((pt) => pt.plantId === plant.id)
                          .map((pt, index) => (
                            <li key={`${task.id}-${index}`}>
                              {task.name}: {pt.todo}
                            </li>
                          ))
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isPopupOpen && (
            <Popup
              plantData={chosenPlant}
              onClose={closePopup}
              allPlantsData={plants}
              allPestsData={pests}
              plantRelevantTasks={relevantTaskObject[chosenPlant.id]}
              allTasksData={tasks}
            />
          )}
        </ul>
      ) : (
        <p>Loading plants...</p>
      )}
    </div>
  );
}

export default PlantList;
