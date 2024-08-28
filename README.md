# About Project

A real-time chat application built using React, Socket.io, Redux, Node.js and MongoDB. 

# Key Features

* **Real-Time Messaging:** Users can chat in real-time thanks to the integration of Socket.io.
* **User Authentication:** Secure login and registration with encrypted passwords.
* **Redux for State Management:** Efficient and scalable state management using Redux.
* **MongoDB for Data Storage:** Persistent storage of user data and chat messages.
* **Responsive UI:** Fully responsive design for seamless usage on both desktop and mobile devices.

# Technologies Used

* **Frontend:** React, Redux, Socket.io-client, CSS
* **Backend:** Node.js, Express, Socket.io
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Token) for secure authentication

# Setup and Installation

**1. Clone the repository:**
* git clone https://github.com/yourusername/chat-app.git  
* cd chat-app

**2. Install dependencies:**

For the server:  
* cd server  
* npm install  

For the client:  
* cd client  
* npm install  

**3. Environment Variables:**

Create a .env file in both the server and client directories with the required environment variables:  
Server .env: 
* FRONTEND_URL=your_frontend_url  
* MONGODB_URI=your_mongodb_uri  
* JWT_SECRET_KEY=your_jwt_secret  
* SOCKET_PORT=your_socket_port  

Client .env:  
* REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name  
* REACT_APP_BACKEND_URL=your_backend_url  

**4. Run the application:**

Start the server:  
* cd server
* npm run dev   

Start the client:
* cd client  
* npm start  

**5. Access the application:**

Open your browser and go to http://localhost:3000.

# Usage

* Register a new account or log in with existing credentials.
* Start a new chat by selecting a user or group from the list.
* Send and receive messages in real-time.
* Create group chats and add participants.
