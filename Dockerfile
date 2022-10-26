FROM node:17 as build

WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm install 
COPY . .
RUN npm run build

FROM node:17
ENV NODE_ENV production
COPY --from=build /app/.env ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD [ "npm", "run", "start:prod" ]
