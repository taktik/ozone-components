FROM nginx:stable-alpine

# jsonpatch
RUN apk add --no-cache bash jq
COPY docker/jsonpatch.sh /usr/bin/jsonpatch.sh

# nginx
RUN apk add --no-cache nginx-mod-http-headers-more
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/

# cmd
CMD /usr/bin/jsonpatch.sh /usr/share/nginx/html/conf.ozone.json && exec nginx -g 'daemon off;'
