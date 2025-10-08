import { useState } from 'react';
import { pathToUploads } from '../../helpers/constants';
import './GalleryView.css';
import PicturePopup from '../PicturePopup/PicturePopup';

function GalleryView({ images }) {
  const [viewedId, setViewedId] = useState(0);

  console.log(images);

  return (
    <>
      <div className='gallery-block'>
        {images &&
          images.map((imageFile) => {
            return (
              <img
                src={pathToUploads + imageFile}
                onClick={() => setViewedId(imageFile)}
                alt={`gallery-${imageFile}`}
                width={100}
              ></img>
            );
          })}
      </div>
      <PicturePopup fileName={viewedId} />
    </>
  );
}

export default GalleryView;
