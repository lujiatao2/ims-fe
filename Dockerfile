FROM node:15.7.0-alpine
COPY . /app
WORKDIR /app
RUN rm -rf .idea dist node_modules \
    && npm install \
    && npm run build

FROM nginx:1.19.6-alpine
COPY --from=0 /app/dist /ims
COPY nginx.conf /etc/nginx/nginx.conf