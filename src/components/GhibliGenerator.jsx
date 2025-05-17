
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import OpenAIAuth from './OpenAIAuth';
import ResultDisplay from './ResultDisplay';
import { generateGhibliPortrait, uploadImages } from '../services/api';
import '../styles/main.css';

function GhibliGenerator() {
  const [instagramId, setInstagramId] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleImageUpload = (files) => {
    setImages(files);
  };

  const handleAuthSuccess = () => {
    setIsAuthorized(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // First upload the images to get URLs
      const imageUrls = await uploadImages(images);
      
      // Then generate the Ghibli portrait
      const data = await generateGhibliPortrait({
        instagramId,
        imageUrls
      });
      
      setResultImage(data.imageUrl);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create Your Ghibli Portrait</h1>
      <p className="description">
        Transform your photos into a beautiful Studio Ghibli style portrait
      </p>

      {!isAuthorized && (
        <div className="auth-section">
          <h2>Step 1: Authorize with OpenAI</h2>
          <OpenAIAuth onAuthSuccess={handleAuthSuccess} />
        </div>
      )}

      {isAuthorized && (
        <form onSubmit={handleSubmit} className="form">
          <h2>Step {!isAuthorized ? "2" : "1"}: Enter Your Details</h2>
          
          <div className="form-group">
            <label htmlFor="instagram-id">Instagram ID:</label>
            <input
              id="instagram-id"
              type="text"
              value={instagramId}
              onChange={(e) => setInstagramId(e.target.value)}
              placeholder="@yourusername"
              required
            />
          </div>
          
          <h2>Step {!isAuthorized ? "3" : "2"}: Upload Your Photos</h2>
          <ImageUploader onImagesSelected={handleImageUpload} />
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || images.length === 0}
          >
            {isLoading ? 'Generating...' : 'Create Ghibli Portrait'}
          </button>
        </form>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      {resultImage && <ResultDisplay imageUrl={resultImage} />}
    </div>
  );
}

export default GhibliGenerator;
