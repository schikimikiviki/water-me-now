import { useState, useEffect } from 'react';
import './PicturePopup.css';
import { pathToUploads } from '../../helpers/constants';
import CloseIcon from '../../assets/images/close.png';

const PicturePopup = ({ fileName, onClose }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  console.log(fileName);
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

  return (
    <div className='popup-overlay'>
      <div className='popup-file'>
        <img src={CloseIcon} className='close-btn' onClick={onClose} />
        {/* <h1>{fileName}</h1> */}
        <img src={pathToUploads + fileName} alt={fileName} />
      </div>
    </div>
  );
};

export default PicturePopup;
