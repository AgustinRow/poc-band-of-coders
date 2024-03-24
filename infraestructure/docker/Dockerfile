FROM node:18.12.1-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
COPY . .
RUN yarn dlx turbo@1.6.3 prune --scope=@project/api --docker

FROM node:18.12.1-alpine AS installer
RUN apk add --no-cache \
    libc6-compat libxml2 tiff giflib libpng libwebp libavif aom-libs lcms2 \
    libjpeg-turbo libcurl libcrypto1.1 fontconfig freetype ca-certificates \
    msttcorefonts-installer fontconfig pixman lcms2 libgomp \
    && update-ms-fonts \
    && fc-cache -f \
    && rm -rf /tmp/*
RUN apk update

WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml

COPY package.json package.json
RUN yarn install
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=@project/api
RUN yarn cache clean --all

EXPOSE 3001

CMD yarn turbo run start --filter=@project/api
