FROM node:12-alpine
RUN apk add --no-cache python2 g++ make
WORKDIR /inventory_bkend
COPY . .
RUN yarn install --production
CMD ["node", "./bin/www"]
EXPOSE 3000