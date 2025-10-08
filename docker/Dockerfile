#
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Huawei Inc.
#
FROM nginx:1.29.2-alpine
WORKDIR /usr/share/nginx/html
RUN apk add --no-cache bash envsubst
COPY docker/nginx-entrypoint.sh /
# Copy to a different location and later the entry point script will copy it to the nginx folder based on the custom URI.
COPY dist/ /dist
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
ENTRYPOINT [ "bash", "/nginx-entrypoint.sh" ]
