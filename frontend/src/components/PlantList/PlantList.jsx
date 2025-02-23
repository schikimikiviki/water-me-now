import { useState, useEffect } from 'react';
import getRequest from '../../helpers/functions';

function PlantList() {
  const [plants, setPlants] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let plants = await getRequest('plants');
      setPlants(plants);
    };

    fetchData();
  }, []);

  return (
    <div className='page-div'>
      <h1>Plants</h1>
      {plants && plants.length > 1 ? (
        <ul>
          {plants.map((plant) => (
            <li key={plant.id}>{plant.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading plants...</p>
      )}
    </div>
  );
}

export default PlantList;
