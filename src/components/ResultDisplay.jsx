import React from 'react';

function ResultDisplay({ imageUrl }) {
  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'ghibli-portrait.png'; // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Ghibli Portrait',
        text: 'Check out my Studio Ghibli style portrait!',
        url: imageUrl
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(imageUrl)
        .then(() => alert('Image URL copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  return (
    <div className="result-display">
      <h2>Your Ghibli Portrait</h2>
      <div className="result-image-container">
        <img src={imageUrl} alt="Ghibli Style Portrait" className="result-image" />
      </div>
      <div className="result-actions">
        <button onClick={handleDownload} className="download-button">
          Download
        </button>
        <button onClick={handleShare} className="share-button">
          Share
        </button>
      </div>
    </div>
  );
}

export default ResultDisplay;
