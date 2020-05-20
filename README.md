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

https://g6.antv.vision/zh

This will automatically open http://localhost:9527


## 镜像运行
修改config.js中的ip和端口
将本机config.js挂载到容器中对应位置
根据情况修改/root/kubeext-dashboard/public/config.js位置
```bash
# 运行
docker run -v /root/kubeext-dashboard/public/config.js:/home/kubeext-dashboard/public/config.js -d -p 9537:9537 -it registry.cn-beijing.aliyuncs.com/cloudplus-lab/kubeext-dashboard:v1.8.2-amd64   
#修改本机host文件
vi /etc/hosts   
[host ip] dashboard.cloudplus.io    
[host ip] monitor.cloudplus.io
[host ip] vm-console.cloudplus.io
[host ip] container-console.cloudplus.io
```

## 插件运行

### 开放端口


```bash
# 开放非安全端口
vi /etc/kubernetes/manifests/kube-apiserver.yaml
    - --insecure-port=8888
    - --insecure-bind-address=0.0.0.0
```

### 镜像运行

- 镜像插件
  - [镜像存储仓库]: docker run -d --restart=always -p 5000:5000 -v /var/lib/registry:/var/lib/registry registry.cn-beijing.aliyuncs.com/cloudplus-mirror/distribution:v2.7.1-arm64
  - ~~[镜像仓库管理]: docker run -d --restart=always -p 5001:8000 -v config.yml:/opt/config.yml:ro registry.cn-beijing.aliyuncs.com/cloudplus-mirror/docker-registry-ui:v0.9.1-arm64[修改本目录下config.yml]~~
  - [镜像冗余分析]：docker run -d --restart=always -v /var/run/docker.sock:/var/run/docker.sock -p 5002:7001 registry.cn-beijing.aliyuncs.com/cloudplus-mirror/dive:v0.9.2-arm64
- Web控制台
  - [物理机web访问]：docker run -d --restart=always -p 7001:2222 registry.cn-beijing.aliyuncs.com/cloudplus-mirror/webssh2:v0.3.1-arm64
  - [容器Web访问]: docker run -d --restart=always -e  "HOST_URL=0.0.0.0" -e "HOST_PORT=7002" --net=host registry.cn-beijing.aliyuncs.com/cloudplus-mirror/docker-terminal:v1.0.0-arm64

## Architecture

We call it ARE-MVC. It is configuration based, analytically driven and Kubernetes oriented system.
We hope it can support various scenario, such as DevOps, Edge and PaaS

![avatar](https://github.com/kubesys/kubeOS/blob/master/imgs/arch.png)

It includes three projects:

- [kubeOS](https://github.com/kubesys/kubeOS): scripts
- [kubeext-system](https://github.com/kubesys/kubeext-system): customized Kubernetes resources
- [kubeext-dashboard](https://github.com/kubesys/kubeext-dashboard): Web UI

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
- DevOps: [team ](https://beta.vilson.xyz/)+ [CI/CD](https://github.com/argoproj/argo-cd)
- PaaS: [Basic](https://demo.kubesphere.io) + [mircoservice](https://github.com/istio/istio) + [bigdata](https://gitee.com/WeBank/Linkis)
- [CMP](https://app.hpcdlab.com)

## License

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)
