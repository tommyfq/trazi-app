FROM node:18

WORKDIR /trazi-app
COPY package.json .
RUN npm install
RUN npm install -g nodemon 
COPY . .
CMD npm start
