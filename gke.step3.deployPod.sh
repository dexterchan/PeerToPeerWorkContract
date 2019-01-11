#!/usr/bin/env bash

export PROJECT_ID=peer2peerworkcontract
export CLUSTERNAME=peer2peerworkcontractcluster
export ZONE=us-central1-b
gcloud container clusters get-credentials $CLUSTERNAME --zone $ZONE --project $PROJECT_ID
kubectl delete deployment financeservice
kubectl delete deployment peer2peerfrontend
read -p "Press [Enter] key to start deployment..."
#kubectl create -f ./containerDeploy/gke/financeService.deploy.yaml
#kubectl create -f ./containerDeploy/gke/peertopeerfrontend.deploy.yaml
kubectl create -f ./containerDeploy/gke/deployment.yaml

#kubectl run financeservice --image=gcr.io/mlpractise/peer2peerworkcontract-financeservice:v1 --port=8888
#kubectl expose deployment financeservice --target-port=8888 --type=NodePort

kubectl get deployments


#kubectl expose deployment financeservice --target-port=8888 --type=NodePort
#kubectl expose deployment peer2peerfrontend --target-port=8080 --type=NodePort
#kubectl apply -f ./containerDeploy/gke/PeerToPeer.ingressservice.yaml 
kubectl delete service peer2peercontract
read -p "Press [Enter] key to continue to create service..."
kubectl create -f ./containerDeploy/gke/Finance.LoadBalance.yaml
kubectl get services