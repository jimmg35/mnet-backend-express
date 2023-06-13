FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY . .

RUN yarn
RUN yarn add ts-node@10.8.1
RUN ["chmod", "+x", "/app/entrypoints/entrypoint.sh"]

EXPOSE 8080
CMD ["ts-node", "./src/service.ts", "--env=production"]