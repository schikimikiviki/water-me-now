import { useState, useEffect } from 'react';
import './Gallery.css';
import UploadImage from '../UploadImage/UploadImage';

function Gallery({ sendToParent, reset, existingImages }) {
  const [uploadIds, setUploadIds] = useState([Math.random()]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isFirst, setIsFirst] = useState(true);

  // console.log('reset', reset);
  useEffect(() => {
    //console.log('sending to parent..', imageFiles);
    sendToParent(imageFiles.map((f) => f.file));
    if (reset) {
      // we want to clear the existing images
      // console.log('resetting form..');
      setUploadIds([Math.random()]);
      setIsFirst(true);
    }
  }, [imageFiles, reset]);

  // if images exist already, we are in the edit popup
  // we want to display the existing images
  // as if they were just added

  useEffect(() => {
    if (existingImages !== 'no') {
      const initialUploads = existingImages.map((img) => ({
        id: crypto.randomUUID(),
        existingUrl: img,
      }));

      setUploadIds(initialUploads.map((u) => u.id));
      setImageFiles(initialUploads);
      setIsFirst(false);
    }
  }, [existingImages]);

  const handleUpload = (file, id) => {
    setImageFiles((prev) => {
      // Replace file if id already exists, otherwise add new
      const existingIndex = prev.findIndex((f) => f.id === id);
      if (existingIndex !== -1) {
        const newFiles = [...prev];
        newFiles[existingIndex] = { id, file };
        return newFiles;
      } else {
        return [...prev, { id, file }];
      }
    });
  };

  const addAnotherUpload = () => {
    setUploadIds((prev) => [...prev, Math.random()]);
    setIsFirst(false);
  };

  const deleteImage = (idToDelete) => {
    // console.log('isfirst', isFirst);
    // only delete it if there was something added already
    if (!isFirst) {
      // find that id and delete it from the arr
      setUploadIds(uploadIds.filter((id) => id != idToDelete));
    }
  };

  return (
    <div className='gallery-div'>
      {existingImages == 'no' ? (
        <div>
          <div className='upload-container'>
            {uploadIds.map((id) => (
              <div className='gallery-item'>
                <UploadImage
                  key={id}
                  id={id}
                  onUploadImage={(file) => handleUpload(file, id)}
                />
                <button
                  className='button-custom'
                  onClick={() => deleteImage(id)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <div className='box-another-img'>
            <button onClick={() => addAnotherUpload()}>+</button>
          </div>
        </div>
      ) : (
        <div>
          <div className='upload-container'>
            {uploadIds.map((id) => (
              <div className='gallery-item'>
                <UploadImage
                  key={id}
                  id={id}
                  existingImage={
                    imageFiles.find((f) => f.id === id)?.existingUrl
                  }
                  onUploadImage={(file) => handleUpload(file, id)}
                />

                <button
                  className='button-custom'
                  onClick={() => deleteImage(id)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <div className='box-another-img'>
            <button onClick={() => addAnotherUpload()}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
