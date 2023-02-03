# First build the webapp in /app

FROM node:14 
WORKDIR /app

COPY /package.json .

RUN npm install
COPY . .
EXPOSE 3000

CMD ["npm", "start"]

# COPY /public/ ./src/public/
# RUN cd src && npm install && npm run build



# FROM node:14 AS server-build
# WORKDIR /root/
#COPY --from=ui-build ../build ./my-app/build
# COPY /package*.json ./
# RUN npm install
# COPY index.js ./

# EXPOSE 3080

#CMD ["node", "./index.js"]