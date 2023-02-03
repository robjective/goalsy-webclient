
FROM node:14 
WORKDIR /
ENV OPENAI_API_KEY="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"

COPY package.json ./

# COPY ["package*.json","./"]
RUN npm install
COPY . .
EXPOSE 3080

CMD ["node", "index.js"]

