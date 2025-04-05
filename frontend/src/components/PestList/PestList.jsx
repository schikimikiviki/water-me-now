import './PestList.css';
import { useState, useEffect } from 'react';
import { getRequest } from '../../helpers/functions';

function PestList() {
  const [pests, setPests] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let pests = await getRequest('pests');
      console.log('GOT: ', pests);
      setPests(pests);
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

    fetchData();
    checkLoginStatus();
  }, []);

  return (
    <div className='page-div'>
      <h1>Pests</h1>
      {pests && pests.length > 0 ? (
        <ul>
          {pests.map((pest) => (
            <div className='container-plant' key={pest.id}>
              <div>
                <p className='plant-id'>{pest.id}</p>
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
                <div className='plant-details'>
                  <div className='plant-shortinfo'>
                    <h2>{pest.name}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p>Loading pests...</p>
      )}
    </div>
  );
}

export default PestList;
