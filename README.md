# Instagram to Ghibli Portrait Generator

This web application transforms user photos into Studio Ghibli-style portraits using OpenAI's DALL-E 3 model. Users can upload multiple images along with their Instagram ID, and the application will generate a beautiful Ghibli-style portrait.

## Features

- User-friendly image upload interface
- OpenAI integration for generating Ghibli-style portraits
- Email notifications for site owner
- Database storage of user requests
- Responsive design

## Tech Stack

### Frontend
- React.js
- CSS3

### Backend
- Node.js with Express
- MongoDB for data storage
- Multer for file uploads
- OpenAI API integration
- Nodemailer for email notifications

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- OpenAI API key

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ghibli-portrait-generator.git
   cd ghibli-portrait-generator
   ```

2. Install the backend dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/ghibli-portrait-generator

   # Session Secret 
   SESSION_SECRET=your_session_secret_key_here

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Email Configuration for Notifications
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=notifications@ghibliportraits.com
   ADMIN_EMAIL=admin@ghibliportraits.com
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install the frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Authorize with OpenAI" to connect with your OpenAI account
3. Enter your Instagram ID
4. Upload 2-5 photos of yourself
5. Click "Create Ghibli Portrait"
6. Wait for the AI to generate your Ghibli-style portrait
7. Download or share your generated image

## Deployment

### Heroku Deployment

1. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```

2. Add MongoDB Atlas add-on or configure with your own MongoDB URL:
   ```
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   ```

3. Set other environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set SESSION_SECRET=your_session_secret
   heroku config:set EMAIL_HOST=your_email_host
   # Set other email-related environment variables
   ```

4. Deploy to Heroku:
   ```
   git push heroku main
   ```

## Important Notes

- This application requires an OpenAI API key with access to DALL-E 3.
- Make sure to comply with OpenAI's usage policies.
- Consider the costs associated with using the DALL-E API before deploying to production.
- Implement proper user authentication and rate limiting for production use.

## License
