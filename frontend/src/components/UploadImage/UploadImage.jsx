import { useState } from 'react';

const UploadImage = ({ id, onUploadImage }) => {
  const [imgText, setImgText] = useState('');
  const [imageFile, setImageFile] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name);
    setImgText(file.name);
    setImageFile(file);

    if (typeof onUploadImage !== 'function') {
      console.warn('onUploadImage is not a function', onUploadImage);
      return;
    }

    onUploadImage(file);
  };

  return (
    <>
      <label htmlFor={id} className='custom-file-upload'>
        {imgText.length > 0 ? imgText : 'Choose Image'}
      </label>
      <input
        type='file'
        id={id}
        name='plantImage'
        accept='image/*'
        onChange={handleImageUpload}
        required
        style={{ display: 'none' }}
      />
    </>
  );
};

export default UploadImage;
