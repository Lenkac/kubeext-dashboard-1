FROM node:12.0.0
MAINTAINER ISCAS {tangting17,xuyuanjia2017}@otcaix.iscas.ac.cn
ENV TZ Asia/Shanghai
COPY . /home/kubeext-dashboard
WORKDIR /home/kubeext-dashboard
EXPOSE 9527
RUN npm config set registry https://registry.npm.taobao.org \
    && npm install
CMD ["npm", "run", "dev"]

