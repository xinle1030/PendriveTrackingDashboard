# Introduction 
This is a pendrive on loan tracking system.

# Functionalities
1. User is allowed to create a request to loan the pendrives
2. View pendrive details dashboard, update pendrive status
3. View loan request details dashboard, update and delete the request

# Goal  
The goal is to streamline the process of pendrive allocation, ensuring a clear and efficient response to each request, whether by assigning available resources or by providing timely feedback when resources are unavailable.

# Tech Stack
1. Frontend
Vue3.js (TypeScript) with Pinia

2. Backend
NodeJS with Express (TypeScript)
Sequelize for ORM

3. DB
PostgreSQL

# How to Set Up Project
## Backend

1. Clone the project.
2. Download NodeJS LTS version v16.15.1 from the NodeJS official page.
3. Navigate to `./backend` folder.
4. Create a .env file and put it in `./backend`. Put in the following environment variables with the database details:

   ```plaintext
   | Variable | Value  |
   |----------|--------|
   | PORT     |        |
   | DB_HOST  |        |
   | DB_USER  |        |
   | DB_PASS  |        |
   | DB_NAME  |        |

   ```

5. Create a file at `src/config/auth.config.ts`
6. Put in the secret key as follows:

   ```typescript
   export default {
       secret: <<SECRET_KEY>>
   };

   ```

7. Run in terminal `npm i`
8. Run in terminal `npm run start`
9. Navigate to http://localhost:3000
10. Refer to postman json file at `./backend/Pendrive Loan Tracking System.postman_collection.json` for more API documentation details by importing it into Postman.

## Frontend

1. Clone the project.
2. Download NodeJS LTS version v16.15.1 from NodeJS official page
3. Navigate to `./frontend` folder
4. Run in terminal `npm i`
5. Run in terminal `npm run dev` or `vite` if vite has been installed globally
6. Navigate to http://127.0.0.1:5173
