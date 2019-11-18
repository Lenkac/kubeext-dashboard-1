docker pull node:12.0.0
docker build -t kubeext-dashboard:v2 .
docker run -d --net=host --env-file ./env.ist kubeext-dashboard:v2