FROM nginx:1.25.1-alpine
ARG ENVIRONMENT=development
# Input argument to for which environment is the build required for. Valid values - Development, Production
ENV NODE_ENV ${ENVIRONMENT}
COPY build/ /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]