import { useState, useEffect } from 'react';
import './Gallery.css';
import UploadImage from '../UploadImage/UploadImage';

import { useRef } from 'react';

function Gallery({ sendToParent, reset, existingImages }) {
  const [items, setItems] = useState([]);

  const initializedRef = useRef(false);

  // if images exist already, we are in the edit popup
  // we want to display the existing images
  // as if they were just added

  useEffect(() => {
    if (initializedRef.current) return;
    if (!existingImages || existingImages.length === 0) return;

    setItems(
      existingImages.map((img) => ({
        id: crypto.randomUUID(),
        name: typeof img === 'string' ? img : img.name,
        previewUrl: img,
        file: null,
      })),
    );

    initializedRef.current = true;
  }, [existingImages]);

  useEffect(() => {
    if (!reset) return;

    setItems([]);
    initializedRef.current = false;
  }, [reset]);

  useEffect(() => {
    if (!items.length) return;
    sendToParent(items);
  }, [items]);

  const handleUpload = (file, id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name: file.name,
              previewUrl: URL.createObjectURL(file),
              file,
            }
          : item,
      ),
    );
  };

  const addAnotherUpload = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        previewUrl: '',
        file: null,
      },
    ]);
  };

  const deleteImage = (idToDelete) => {
    // console.log('isfirst', isFirst);

    // find that id and delete it from the arr
    setItems((prev) => prev.filter((item) => item.id !== idToDelete));
  };

  return (
    <div className='gallery-div'>
      <div>
        <div className='upload-container'>
          {items.map((item) => (
            <div key={item.id} className='gallery-item'>
              {item.name && <p>{item.name}</p>}
              <UploadImage
                id={item.id}
                existingImage={item.previewUrl}
                onUploadImage={(file) => handleUpload(file, item.id)}
              />
              <button type='button' onClick={() => deleteImage(item.id)}>
                x
              </button>
            </div>
          ))}
        </div>
        <div className='box-another-img'>
          <button type='button' onClick={() => addAnotherUpload()}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
