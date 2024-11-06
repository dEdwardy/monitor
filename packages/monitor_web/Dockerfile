FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
RUN ["mkdir","-p","/usr/local/nginx/html"]
COPY dist/ /usr/local/nginx/html
ENTRYPOINT ["nginx","-c","/etc/nginx/nginx.conf","-g","daemon off;"]
EXPOSE 5004
