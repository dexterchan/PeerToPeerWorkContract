kubectl delete deployment financeservice-deployment 
kubectl delete deployment peer2peerfrontend-deployment
kubectl delete deployment customerservice-deployment
#kubectl delete deployment web-deployment 

kubectl delete service financeservice-service 
kubectl delete service peer2peerfrontend-service 
kubectl delete service customerservice-service 
#kubectl delete service web-service 

kubectl delete ingress fanout-ingress 
