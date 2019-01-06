#!/usr/bin/env bash

export PROJECT_ID=mlpractise
export CLUSTERNAME=peer2peerworkcontract
export ZONE=us-central1-c
gcloud container clusters get-credentials $CLUSTERNAME --zone $ZONE --project $PROJECT_ID
kubectl delete deployment financeservice
read -p "Press [Enter] key to start deployment..."
kubectl create -f ./containerDeploy/gke/financeService.deploy.yaml

kubectl create -f ./containerDeploy/gke/peertopeerfrontend.deploy.yaml

kubectl get deployments


#kubectl expose deployment financeservice --target-port=8888 --type=NodePort
kubectl delete service peer2peercontract
read -p "Press [Enter] key to continue to create service..."
kubectl create -f ./containerDeploy/gke/LoadBalance.yaml
kubectl get services