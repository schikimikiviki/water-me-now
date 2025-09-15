import { useState } from 'react';
import './Gallery.css';
import UploadImage from '../UploadImage/UploadImage';

function Gallery() {
  const [imageFiles, setImageFiles] = useState([]);
  const [imageId, setImageId] = useState(null);

  const handleUpload = (e, id) => {
    setImageFiles([...imageFiles, { id: e }]);
    // TODO: hier noch nach oben schicken
  };

  const addAnotherUploadComponent = () => {
    // when this is executed, the user wants to upload another image
    id = Math.random();
    setImageId(id);

    return <UploadImage id={id} onUploadImage={() => handleUpload(e, id)} />;
  };

  return (
    <>
      <div className='gallery-div'>
        <div className='box-another-img'>
          <button onClick={() => addAnotherUploadComponent()}>Add image</button>
        </div>
      </div>
    </>
  );
}

export default Gallery;
