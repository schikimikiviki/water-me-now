import './PestList.css';
import { useState, useEffect } from 'react';
import { getRequest } from '../../helpers/functions';
import api from '../../api/axiosConfig';
import { deleteSomethingWithId } from '../../helpers/functions';
import PestPopup from '../PestPopup/PestPopup';
import { Link } from 'react-router-dom';

function PestList() {
  const [pests, setPests] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [chosenPest, setChosenPest] = useState();
  const [plants, setPlants] = useState();

  const fetchData = async () => {
    let pests = await getRequest('pests');
    console.log('GOT: ', pests);
    setPests(pests);

    let plants = await getRequest('plants');
    console.log('GOT: ', plants);
    setPlants(plants);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await api.get('/auth/check', { withCredentials: true });
        setLoggedIn(true);
        //console.log('User is logged in ');
      } catch (err) {
        setLoggedIn(false);
        console.error('Check login failed:', err);
      }
    };

    fetchData();
    checkLoginStatus();
  }, []);

  const handlePestDelete = async (id) => {
    console.log('Deleting pest with id: ', id);

    try {
      const response = await deleteSomethingWithId('pests', id);
      console.log(response);

      // If the delete is successful, refresh the  list
      if (response.success) {
        fetchData();
      } else {
        console.log('Failed to delete pest');
      }
    } catch (error) {
      console.error('Error deleting pest:', error);
    }
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    fetchData();
  };

  const handlePestEdit = (id) => {
    console.log('Editing pest with id', id);
    setChosenPest(pests.find((pest) => pest.id === id));
    openPopup();
  };

  const pathToimg = 'http://localhost:8888/uploads/';

  const generateSusceptiblePlants = (plantIds) => {
    if (!plants || plants.length === 0) return null;

    return plantIds.map((id) => {
      const plant = plants.find((plant) => plant.id == id);
      if (!plant) return null;

      return (
        <div className='plant-div' key={id}>
          <div className='inner-plant'>
            <div className='plant-name'>
              <ul>
                <Link to={`/plants/${plant.id}`}>
                  <li>{plant.name}</li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className='page-div'>
      <h1>Pests</h1>
      {pests && pests.length > 0 ? (
        <ul>
          {pests.map((pest) => (
            <div className='container-pest' key={pest.id}>
              <p className='pest-id'>{pest.id}</p>
              <div>
                <img
                  src={pathToimg + pest.imageFile}
                  alt={pest.name}
                  width={250}
                  height={350}
                  className='img-pest'
                />
                {isLoggedIn ? (
                  <div className='admin-functions'>
                    <div
                      onClick={() => {
                        handlePestEdit(pest.id);
                      }}
                    >
                      🖊️
                    </div>
                    <div
                      onClick={() => {
                        handlePestDelete(pest.id);
                      }}
                    >
                      🗑️
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              <div className='pest-details'>
                <div className='pest-shortinfo'>
                  <Link to={`/pests/${pest.id}`}>
                    <h2>{pest.name}</h2>
                  </Link>
                </div>

                <hr />
                <div>
                  <p>
                    <u>Todo when this pest occurs</u>: {pest.todo}
                  </p>
                </div>
                <div>
                  <p>
                    <u>Susceptible plants: </u>
                  </p>
                  <div>
                    {pest.plantList.length > 0 ? (
                      generateSusceptiblePlants(pest.plantList)
                    ) : (
                      <div>No susceptible plants.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isPopupOpen && (
            <PestPopup
              pestData={chosenPest}
              onClose={closePopup}
              allPestsData={pests}
              allPlantsData={plants}
            />
          )}
        </ul>
      ) : (
        <p>Loading pests...</p>
      )}
    </div>
  );
}

export default PestList;
