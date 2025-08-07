import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../../helpers/functions';
import { Link } from 'react-router-dom';

function PestPage() {
  const { id } = useParams();

  const [plants, setPlants] = useState(null);
  const [viewedPest, setViewedPest] = useState(null);
  const pathToimg = 'http://localhost:8888/uploads/';
  const [pests, setPests] = useState(null);

  const fetchData = async () => {
    let plants = await getRequest('plants');
    setPlants(plants);
    // console.log(plants);

    let pests = await getRequest('pests');
    //console.log(pests);
    setPests(pests);

    // get the correct plant
    let pest = pests.filter((pest) => pest.id == id);
    setViewedPest(pest[0]);
    console.log(plpestant);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
    <div>
      <div className='container-pest' key={viewedPest?.id}>
        <p className='pest-id'>{viewedPest?.id}</p>
        <div>
          <img
            src={pathToimg + viewedPest?.imageFile}
            alt={viewedPest?.name}
            width={250}
            height={350}
            className='img-pest'
          />
        </div>

        <div className='pest-details'>
          <div className='pest-shortinfo'>
            <h2>{viewedPest?.name}</h2>
          </div>

          <hr />
          <div style={{ display: 'flex' }}>
            <p>
              <u>Todo when this pest occurs</u>
            </p>
            <p>&emsp; {viewedPest?.todo}</p>
          </div>
          <div>
            <p>
              <u>Susceptible plants: </u>
            </p>
            <div>
              {viewedPest?.plantList.length > 0 ? (
                generateSusceptiblePlants(viewedPest?.plantList)
              ) : (
                <div>No susceptible plants.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PestPage;
