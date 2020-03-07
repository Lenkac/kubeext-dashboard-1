## Preparation

You need to install [node](https://nodejs.org/) and [git](https://git-scm.com/) locally. The project is based on [ES2015+](https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [axios](https://github.com/axios/axios) and [element-ui](https://github.com/ElemeFE/element), all request data is simulated using [Mock.js](https://github.com/nuysoft/Mock).
node版本v12.x

## 本机运行

```bash
# clone the project
git clone https://github.com/kubesys/kubeext-dashboard.git

# enter the project directory
cd kubeext-dashboard

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9527

## 镜像运行

```bash
# 运行
./build.sh   
#修改本机host文件
vi /etc/hosts   
[host ip] dashboard.cloudplus.io    
[host ip] monitor.cloudplus.io
[host ip] vm-console.cloudplus.io
[host ip] container-console.cloudplus.io
```

## docker-terminal    
### 镜像运行

```bash
# 运行
docker run -d -e "HOST_URL=[host ip]" --net=host registry.cn-hangzhou.aliyuncs.com/cloudplus-lab/docker-terminal:v1.5.0-arm8 

# 开放非安全端口
vi /etc/kubernetes/manifests/kube-apiserver.yaml
    - --insecure-port=8888
    - --insecure-bind-address=0.0.0.0
```

## Online Demo

[Preview](https://panjiachen.github.io/vue-element-admin)
[Demo](http://39.106.124.113:9537/), (admin/admin)

## vm-terminal    
### 镜像运行    

```  
yum -y install tigervnc-server   

docker run -d --net=host registry.cn-hangzhou.aliyuncs.com/cloudplus-lab/kubeext-vnclet:v1.5.0-arm8 
```     
### 直接运行
```
yum -y install tigervnc-server  

cd /home/iscas/VM-terminal/websockify
./websockify.py --web ../ --target-config=./token/token.conf 6080
```

## 支持界面

- [Kubernetes UI](https://github.com/kubernetes/dashboard)
- [DevOps]()
- [PaaS](https://demo.kubesphere.io): demo1/Demo123
- [CMP](https://app.hpcdlab.com)

## License

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)
