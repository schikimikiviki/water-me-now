import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../../helpers/functions';
import SunIcon from '../../assets/images/sun.svg';
import SunCloudIcon from '../../assets/images/suncloud.svg';
import CloudIcon from '../../assets/images/cloudy.svg';
import SnowflakeIcon from '../../assets/images/snowflake.svg';
import NoSlowFlakeIcon from '../../assets/images/no-snowflake.svg';
import PerennialIcon from '../../assets/images/perennial.svg';
import NotPerennialIcon from '../../assets/images/not-perennial.svg';
import { Link } from 'react-router-dom';
import './PlantPage.css';
import { pathToUploads } from '../../helpers/constants';

function PlantPage() {
  const { id } = useParams();
  const [plants, setPlants] = useState(null);
  const [viewedPlant, setViewedPlant] = useState(null);
  const [pests, setPests] = useState(null);
  const [relevantTaskObject, setRelevantTaskObject] = useState({});
  const [tasks, setTasks] = useState(null);

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

    // get the correct plant
    let plant = plants.filter((plant) => plant.id == id);
    setViewedPlant(plant[0]);
    console.log(plant);

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

  useEffect(() => {
    fetchData();
  }, [id]);

  const getCompanionList = (idList) => {
    const companions = plants.filter((plant) => idList.includes(plant.id));

    return (
      <ul className='companion-list'>
        {companions.map((plant, index) => (
          <Link to={`/plants/${plant.id}`}>
            <li key={plant.id}>{plant.name}</li>
          </Link>
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
            <Link to={`/pests/${pest.id}`}>
              <li key={pest.id}>{pest.name}</li>
            </Link>
          ))}
        </ul>
      );
    }
  };

  return (
    <div>
      <h1>{viewedPlant?.name}</h1>

      <div
        className='container-plant container-plant-page'
        key={viewedPlant?.id}
      >
        <div>
          <p className='plant-id'>{viewedPlant?.id}</p>
          <img
            src={pathToUploads + viewedPlant?.imageFile}
            alt={viewedPlant?.name}
            width={250}
            height={350}
            className='img-plant'
          />
        </div>
        <div className='plant-details'>
          <div className='plant-shortinfo'>
            <div className='plant-emojis'>
              {viewedPlant?.hardiness == 'HARDY' ||
              viewedPlant?.hardiness == 'PARTIALLY_HARDY' ? (
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
              {viewedPlant?.ideal_location == 'FULL_SUN' ? (
                <img src={SunIcon} alt='Sun' width={50} height={50} />
              ) : viewedPlant?.ideal_location == 'INDIRECT_SUN' ? (
                <img src={SunCloudIcon} alt='Clouds' width={50} height={50} />
              ) : (
                <img src={CloudIcon} alt='Clouds' width={50} height={50} />
              )}
              {viewedPlant?.perennial ? (
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
            🌿 <u className='space'>Origin:</u> {viewedPlant?.origin}
          </div>
          <div>
            🌿 <u className='space'>Hardiness:</u>{' '}
            {viewedPlant?.hardiness.replace('_', ' ').toLowerCase()} -{' '}
            {viewedPlant?.hardiness_info}
          </div>
          <div>
            🌿 <u className='space'>Ideal location:</u>{' '}
            {viewedPlant?.ideal_location.replace('_', ' ').toLowerCase()}
          </div>
          <div>
            🌿 <u className='space'>Watering:</u>{' '}
            {viewedPlant?.watering.replace(/_/g, ' ').toLowerCase()}
          </div>
          <div>
            🌿 <u className='space'>Soil type:</u>{' '}
            {viewedPlant?.soil_type.replace('_', ' ').toLowerCase()}
          </div>
          <div>
            🌿 <u className='space'>Perennial:</u>{' '}
            {viewedPlant?.perennial ? 'Yes' : 'No'}
          </div>
          {viewedPlant?.featureList.length > 0 && (
            <div>
              🌿 <u className='space'>Features:</u>{' '}
              {viewedPlant?.featureList
                .join(', ')
                .replaceAll('_', ' ')
                .toLowerCase()}
            </div>
          )}
          <div>
            🌿 <u className='space'>Ideal placement:</u>{' '}
            {viewedPlant?.ideal_placement.replace('_', ' ').toLowerCase()}
          </div>
          <div>
            🌿 <u className='space'>Propagation:</u> {viewedPlant?.propagation}
          </div>
          <div>
            🌿 <u className='space'>Fertilization schedule:</u>{' '}
            {viewedPlant?.fertilization_schedule
              .replace(/_/g, ' ')
              .toLowerCase()}
          </div>
          {viewedPlant?.companionPlants &&
            viewedPlant?.companionPlants.length > 0 && (
              <div>
                🌿 <u className='space'>Companion plants:</u>{' '}
                {getCompanionList(viewedPlant.companionPlants)}
              </div>
            )}
          {viewedPlant?.uses.length > 0 && (
            <div>
              🌿 <u className='space'>Uses:</u>
              <ul>
                {viewedPlant?.uses.map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </div>
          )}
          {viewedPlant?.commonPests.length > 0 && (
            <div>
              🌿 <u className='space'>Common pests:</u>
              {generateCommonPestList(viewedPlant?.commonPests)}
            </div>
          )}

          {viewedPlant?.plantTasks.length > 0 && (
            <div>
              🌿 <u className='space'>Plant tasks:</u>
              <ul>
                {relevantTaskObject[viewedPlant?.id]?.relevantTasks.map(
                  (task) =>
                    task.plantTasks
                      ?.filter((pt) => pt.plantId === viewedPlant?.id)
                      .map((pt, index) => (
                        <Link to={`/tasks/${task.id}`}>
                          <li key={`${task.id}-${index}`}>
                            {task.name}: {pt.todo}
                          </li>
                        </Link>
                      ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantPage;
