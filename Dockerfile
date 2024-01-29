# 使用Nginx的基础镜像  
FROM nginx:latest as nginx-stage

# 复制当前目录下的nginx.conf文件到容器中的/etc/nginx/conf.d目录下，并重命名为default.conf  
COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM alpine:3.19.0 AS base

COPY --from=nginx-stage /app/dist /app

ENV NODE_ENV=production \
    APP_PATH=/www/node-server

WORKDIR $APP_PATH

# 使用apk命令安装 nodejs
RUN apk add --no-cache --update nodejs
RUN apk add --no-cache --update npm

# 基于基础镜像安装项目依赖
FROM base AS install

# 将当前目录的package.json 拷贝到工作目录下
COPY package.json $APP_PATH/

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

# 基于基础镜像进行最终构建
FROM base

# 拷贝 上面生成的 node_modules 文件夹复制到最终的工作目录下
# COPY命令复制文件夹的时候，不是直接复制该文件夹，而是将文件夹中的内容复制到目标路径
COPY --from=install $APP_PATH/node_modules $APP_PATH/node_modules
# 拷贝当前目录的文件到工作目录(除了.dockerignore中忽略的)
COPY . $APP_PATH/

EXPOSE 5510

CMD ["npm", "run", "server"]
