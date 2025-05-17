import React, { useState } from 'react';

function App() {
  const [step, setStep] = useState(1);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [instagramId, setInstagramId] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  const handleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthorized(true);
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Sample Ghibli style portrait image
      setResultImage("/api/placeholder/400/600");
      setIsLoading(false);
      setStep(4);
    }, 3000);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Instagram to Ghibli Portrait</h1>
      </header>
      
      <main>
        <div className="container">
          <h1>Create Your Ghibli Portrait</h1>
          <p className="description">
            Transform your photos into a beautiful Studio Ghibli style portrait
          </p>
          
          <div className="steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Authorize</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Enter Details</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Upload Photos</div>
            <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Get Results</div>
            <div className={`step ${step >= 5 ? 'active' : ''}`}>5. Instagram Upload</div>
          </div>
          
          {step === 1 && (
            <div className="auth-section">
              <h2>Step 1: Authorize with OpenAI</h2>
              <button 
                onClick={handleAuth} 
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? 'Authorizing...' : 'Authorize with OpenAI'}
              </button>
              
              <div className="auth-info">
                <p>We need your permission to generate images using OpenAI's DALL-E 3.</p>
                <p>This will use your OpenAI credits.</p>
              </div>
            </div>
          )}
          
          {step >= 2 && step < 4 && (
            <form onSubmit={handleSubmit} className="form">
              {step === 2 && (
                <>
                  <h2>Step 2: Enter Your Details</h2>
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
                  <button 
                    type="button" 
                    className="next-button"
                    onClick={() => setStep(3)}
                    disabled={!instagramId}
                  >
                    Next
                  </button>
                </>
              )}
              
              {step === 3 && (
                <>
                  <h2>Step 3: Upload Your Photos</h2>
                  <div className="image-uploader">
                    <div className="upload-area">
                      <label htmlFor="image-upload" className="upload-label">
                        <div className="upload-prompt">
                          <span className="upload-icon">📷</span>
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
                        <h3>Selected Images ({previewUrls.length})</h3>
                        <div className="image-previews">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="image-preview">
                              <img src="/api/placeholder/100/100" alt={`Preview ${index + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading || previewUrls.length === 0}
                  >
                    {isLoading ? 'Generating...' : 'Create Ghibli Portrait'}
                  </button>
                </>
              )}
            </form>
          )}
          
          {step === 4 && resultImage && (
            <div className="result-display">
              <h2>Your Ghibli Portrait</h2>
              <div className="result-image-container">
                <img src="/api/placeholder/400/600" alt="Ghibli Style Portrait" className="result-image" />
              </div>
              <div className="result-info">
                <p>Your Studio Ghibli portrait has been created!</p>
                <p>We've also sent the result to the site owner.</p>
              </div>
              <div className="result-actions">
                <button className="download-button">
                  Download
                </button>
                <button className="share-button">
                  Share
                </button>
              </div>
              <button 
                onClick={() => {
                  setStep(5);
                }}
                className="next-button"
              >
                Next
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="instagram-upload">
              <h2>Instagram Upload</h2>
              <p>Your image will be uploaded on Instagram in a creative way!</p>
              <button 
                onClick={() => {
                  setStep(1);
                  setIsAuthorized(false);
                  setInstagramId('');
                  setImages([]);
                  setPreviewUrls([]);
                  setResultImage(null);
                }}
                className="start-over-button"
              >
                Create Another Portrait
              </button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="app-footer">
        <p>© 2025 Ghibli Portrait Generator</p>
      </footer>
    </div>
  );
}
