import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './Popup.css';

const Popup = ({ onClose, onAdd, plantData }) => {
  // plant states
  const [plantName, setPlantName] = useState(plantData.name);
  const [origin, setPlantOrigin] = useState(plantData.origin);
  const [commonPests, setCommonPests] = useState(plantData.commonPests);
  const [companionPlants, setCompanionPlants] = useState(
    plantData.companionPlants
  );
  const [featureList, setFeatureList] = useState(plantData.featureList);
  const [fertilizationSchedule, setFertilizationSchedule] = useState(
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
  const [watering, setWatering] = useState(plantData.watering);

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

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const dataToSubmit = {
        name: plantName,
      };

      const jsonString = JSON.stringify(dataToSubmit);
      console.log('Data to submit: ', dataToSubmit);
      const authToken = localStorage.getItem('authToken');

      onAdd();

      onClose();
    } catch (error) {
      console.error('Error while editing plant:', error);
    }
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <button className='close-button' onClick={onClose}>
          X
        </button>

        <form className='popup-form' onSubmit={submitForm}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2 className='popup-title'>Edit plant</h2>
          </div>

          <input
            type='text'
            name='name'
            style={{ fontSize: isMobile ? '12px' : '20px', width: '100%' }}
            placeholder='Edit plant name'
            value={plantName}
            onChange={handleNameChange}
          />

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
