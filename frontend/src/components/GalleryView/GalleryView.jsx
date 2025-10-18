import { useEffect, useState } from 'react';
import { pathToUploads } from '../../helpers/constants';
import './GalleryView.css';
import PicturePopup from '../PicturePopup/PicturePopup';

function GalleryView({ images }) {
  const [viewedId, setViewedId] = useState('none');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  console.log(images);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const chooseFile = (fileName) => {
    setViewedId(fileName);
    setIsPopupOpen(true);
  };

  return (
    <>
      <div className='gallery-block'>
        {images &&
          images.map((imageFile) => {
            return (
              <img
                src={pathToUploads + imageFile}
                onClick={() => chooseFile(imageFile)}
                alt={`gallery-${imageFile}`}
                width={90}
              ></img>
            );
          })}
      </div>
      {isPopupOpen && <PicturePopup fileName={viewedId} onClose={closePopup} />}
    </>
  );
}

export default GalleryView;
