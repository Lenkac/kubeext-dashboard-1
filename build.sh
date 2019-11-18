docker pull node:12.0.0
docker build -t kubeext-dashboard:v2 .
mkdir /root/dashboard
docker run -d --net=host -v /root/dashboard:/home/kubeext-dashboard kubeext-dashboard:v2