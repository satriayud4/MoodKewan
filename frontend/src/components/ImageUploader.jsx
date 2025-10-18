import React, { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

function ImageUploader({ onImageSelect, image }) {
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && isValidImage(file)) {
      onImageSelect(file);
    } else {
      alert('Silakan pilih file gambar (JPG, PNG, GIF)');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const file = e.dataTransfer.files?.[0];
    if (file && isValidImage(file)) {
      onImageSelect(file);
    } else {
      alert('Silakan drag file gambar (JPG, PNG, GIF)');
    }
  };

  const isValidImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  };

  const getPreviewUrl = () => {
    if (image) {
      return URL.createObjectURL(image);
    }
    return null;
  };

  return (
    <div className="uploader-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${image ? 'has-image' : ''}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {image ? (
          <div className="preview">
            <img src={getPreviewUrl()} alt="Preview" />
            <button
              className="change-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Ganti Gambar
            </button>
          </div>
        ) : (
          <div className="upload-content">
            <FiUpload size={48} />
            <h3>Pilih atau drag gambar hewan</h3>
            <p>Supported: JPG, PNG, GIF</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;