- [GitHub Repository](https://github.com/bsingh6636/Api-Service)
#### **SecureAPI Bypass**

**Overview**  
SecureAPI Bypass is a full-stack application that helps users fetch data securely from different APIs while bypassing CORS issues. It leverages JWT-based authentication and allows users to generate API keys after signing up on the platform.

**Hosted URL**  
[https://cors-proxy.brijeshdev.space](https://cors-proxy.brijeshdev.space)

**Features**
- Secure sign-in and authentication using JWT.
- API key generation for registered users to fetch data.
- Full-stack architecture using ReactJS, Node.js, and MongoDB.
- CORS issue resolution via generated API keys.

**Tech Stack**
- **Frontend**: ReactJS, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)

**How to Use**
1. Sign up on the platform.
2. Generate an API key from your account.
3. Use the API key in requests to fetch data securely.

**Getting Started**
1. Clone the repo: `git clone <repo_url>`
2. Install dependencies:  
   - Backend: `cd backend && npm install`  
   - Frontend: `cd frontend && npm install`
3. Set environment variables for MongoDB, JWT secret, etc.
4. Start the app:  
   - Backend: `npm start`  
   - Frontend: `npm start`