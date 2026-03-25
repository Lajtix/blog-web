# backend/Dockerfile
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npx prisma generate
# Your Express server runs on 5003!
EXPOSE 5003

# Command to run your app
CMD ["npm", "run", "dev"]
