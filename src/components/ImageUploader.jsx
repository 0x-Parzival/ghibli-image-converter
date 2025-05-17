import React, { useState } from 'react';

function ImageUploader({ onImagesSelected }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Update the selected files
    setSelectedFiles(files);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    // Clean up old preview URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Set new preview URLs
    setPreviewUrls(newPreviewUrls);
    
    // Pass the files up to the parent component
    onImagesSelected(files);
  };

  return (
    <div className="image-uploader">
      <div className="upload-area">
        <label htmlFor="image-upload" className="upload-label">
          <div className="upload-prompt">
            <i className="upload-icon">📷</i>
            <span>Drop your photos here or click to browse</span>
            <small>Select 2-5 photos for best results</small>
          </div>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
      </div>
      
      {previewUrls.length > 0 && (
        <div className="preview-container">
          <h3>Selected Images</h3>
          <div className="image-previews">
            {previewUrls.map((url, index) => (
              <div key={index} className="image-preview">
                <img src={url} alt={`Preview ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
