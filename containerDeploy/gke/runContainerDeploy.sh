gcloud compute --project=peer2peerworkcontract-234006 addresses create web-static-ip --global --network-tier=PREMIUM
kubectl create -f deployment.yaml

kubectl create -f Service.yaml

read -p "Press [Enter] key to start ingress deployment..."
kubectl apply -f fanout.ingress.yaml