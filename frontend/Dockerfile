# frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port your React app uses 
# (Vite uses 5173, Create React App uses 3000)
EXPOSE 5173

# Command to run your frontend
CMD ["npm", "run", "dev", "--", "--host"] 
# Note: The "--host" is required for Vite so it works outside the container!