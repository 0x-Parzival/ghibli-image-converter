
// API service to handle all backend communication

/**
 * Upload multiple images to the server
 * @param {File[]} images - Array of image files
 * @returns {Promise<string[]>} - Array of URLs for the uploaded images
 */
export async function uploadImages(images) {
  const formData = new FormData();
  
  // Append each image to the form data
  images.forEach((image, index) => {
    formData.append('images', image);
  });
  
  try {
    const response = await fetch('/api/upload-images', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.imageUrls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

/**
 * Generate a Ghibli-style portrait using the provided images
 * @param {Object} params - Generation parameters
 * @param {string} params.instagramId - User's Instagram ID
 * @param {string[]} params.imageUrls - Array of image URLs to use for generation
 * @returns {Promise<Object>} - Contains the URL of the generated image
 */
export async function generateGhibliPortrait({ instagramId, imageUrls }) {
  try {
    const response = await fetch('/api/generate-ghibli', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instagramId,
        imageUrls,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Generation failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      imageUrl: data.imageUrl,
      requestId: data.requestId
    };
  } catch (error) {
    console.error('Error generating portrait:', error);
    throw error;
  }
}

/**
 * Check the authorization status with OpenAI
 * @returns {Promise<boolean>} - Whether the user is authorized
 */
export async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/openai/status');
    const data = await response.json();
    return data.isAuthorized;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
