#!/usr/bin/env bash

export PROJECT_ID=mlpractise
export CLUSTERNAME=peer2peerworkcontract
export ZONE=us-central1-c
#export ZONE=$2
export NUMPOD=1



gcloud beta container --project "$PROJECT_ID" clusters create "$CLUSTERNAME" --zone "$ZONE" --username "admin" --cluster-version "1.10.9-gke.5" --machine-type "n1-standard-1" --image-type "COS" --disk-type "pd-standard" --disk-size "100" --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" --num-nodes "$NUMPOD" --enable-cloud-logging --enable-cloud-monitoring --no-enable-ip-alias --network "projects/mlpractise/global/networks/default" --subnetwork "projects/mlpractise/regions/us-central1/subnetworks/default" --addons HorizontalPodAutoscaling,HttpLoadBalancing --enable-autoupgrade --enable-autorepair