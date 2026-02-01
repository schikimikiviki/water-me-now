import { useState, useEffect } from 'react';
import './UploadImage.css';

const UploadImage = ({ id, onUploadImage, existingImage, postCompleted }) => {
  const [imgText, setImgText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const TARGET_WIDTH = 546;
  const TARGET_HEIGHT = 672;

  // Hydrate UI with existing image
  useEffect(() => {
    if (existingImage) {
      setImagePreview(existingImage);
      setImgText('Image selected');
    }
  }, [existingImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImgText(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const ctx = canvas.getContext('2d');

        const scale = Math.max(
          TARGET_WIDTH / img.width,
          TARGET_HEIGHT / img.height,
        );

        const x = TARGET_WIDTH / 2 - (img.width / 2) * scale;
        const y = TARGET_HEIGHT / 2 - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        canvas.toBlob(
          (blob) => {
            if (!blob) return;

            const croppedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            setImagePreview(URL.createObjectURL(croppedFile));

            onUploadImage?.(croppedFile);
          },
          'image/jpeg',
          0.9,
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='upload-image'>
      <label htmlFor={id} className='custom-file-upload'>
        {postCompleted ? 'Choose Image' : imgText || 'Choose Image'}
      </label>

      <input
        type='file'
        id={id}
        accept='image/*'
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UploadImage;
