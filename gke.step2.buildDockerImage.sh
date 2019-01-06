export PROJECT_ID=mlpractise

export CLUSTERNAME=peer2peerworkcontract
export SERVICE=financeservice

 

DOCKER_IMAGE_NAME=gcr.io/$PROJECT_ID/$CLUSTERNAME-$SERVICE:v1

docker build -f Dockerfile.financeservice --tag $DOCKER_IMAGE_NAME .

#cp Dockerfile.financeservice Dockerfile

#gcloud  builds submit  --tag $DOCKER_IMAGE_NAME .

gcloud docker -- push $DOCKER_IMAGE_NAME