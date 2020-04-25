FROM node:12.16.2
RUN mkdir /code
WORKDIR /code
COPY package.json package-lock.json /code/
RUN npm install
COPY . /code/
RUN npm run build
RUN ls
RUN pwd