FROM nginx:alpine
COPY static-output/ /usr/share/nginx/html/
