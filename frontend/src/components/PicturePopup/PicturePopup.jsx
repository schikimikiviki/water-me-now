import { useState, useEffect } from 'react';
import './PicturePopup.css';

const PicturePopup = ({ fileName, onClose }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  //   useEffect(() => {
  //     window.addEventListener('resize', handleWindowSizeChange);
  //     return () => {
  //       window.removeEventListener('resize', handleWindowSizeChange);
  //     };
  //   }, []);

  //   useEffect(() => {
  //     setIsMobile(width <= 768 ? true : false);
  //   }, [width]);

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <button className='close-button' onClick={onClose}>
          X
        </button>
        <h1>{fileName}</h1>
      </div>
    </div>
  );
};

export default PicturePopup;
