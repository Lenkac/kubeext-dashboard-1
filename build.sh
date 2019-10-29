docker build -t kubeext-dashboard:v1 .
docker run -d -p 9527:9527 kubeext-dashboard:v1