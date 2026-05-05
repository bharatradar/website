FROM node:lts as build
WORKDIR /src
ADD . .
RUN npm install
RUN npx hugo --gc --minify --buildFuture

FROM nginx:alpine
COPY --from=build /src/public /usr/share/nginx/html
COPY --from=build /src/landing.html /usr/share/nginx/html/index.html
COPY --from=build /src/css/style.css /usr/share/nginx/html/css/style.css
COPY --from=build /src/favicon.ico /usr/share/nginx/html/favicon.ico
