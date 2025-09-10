import { useState } from 'react';

const UploadImage = ({ id, onUploadImage, postCompleted }) => {
  const [imgText, setImgText] = useState('');
  const [imageFile, setImageFile] = useState('');

  const TARGET_WIDTH = 546;
  const TARGET_HEIGHT = 672;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImgText(file.name);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const ctx = canvas.getContext('2d');

        // Compute scale to fill target size (like CSS "cover")
        const scale = Math.max(
          TARGET_WIDTH / img.width,
          TARGET_HEIGHT / img.height
        );

        const x = TARGET_WIDTH / 2 - (img.width / 2) * scale;
        const y = TARGET_HEIGHT / 2 - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Convert canvas back to a File
        canvas.toBlob(
          (blob) => {
            if (!blob) return;

            const croppedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            if (typeof onUploadImage === 'function') {
              onUploadImage(croppedFile);
            } else {
              console.warn('onUploadImage is not a function', onUploadImage);
            }
          },
          'image/jpeg',
          0.9 // quality
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <label htmlFor={id} className='custom-file-upload'>
        {imgText.length > 0
          ? postCompleted
            ? 'Choose Image'
            : imgText
          : 'Choose Image'}
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
