#
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Huawei Inc.
#
FROM nginx:1.27.4-alpine
WORKDIR /usr/share/nginx/html
RUN apk add --no-cache bash envsubst
COPY docker/nginx-entrypoint.sh /
COPY dist/ /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
ENTRYPOINT [ "bash", "/nginx-entrypoint.sh" ]
