export PROJECT_ID=peer2peerworkcontract
export CLUSTERNAME=peer2peerworkcontractcluster


export SERVICE=financeservice
DOCKER_IMAGE_NAME=gcr.io/$PROJECT_ID/$CLUSTERNAME-$SERVICE:v4

docker build -f Dockerfile.financeservice --tag $DOCKER_IMAGE_NAME .
gcloud docker -- push $DOCKER_IMAGE_NAME
#cp Dockerfile.financeservice Dockerfile
#gcloud  builds submit  --tag $DOCKER_IMAGE_NAME .


export SERVICE=peer2peerfrontend
DOCKER_IMAGE_NAME=gcr.io/$PROJECT_ID/$CLUSTERNAME-$SERVICE:v4

docker build -f Dockerfile.PeerToPeerFrontEnd --tag $DOCKER_IMAGE_NAME .
gcloud docker -- push $DOCKER_IMAGE_NAME

#cp Dockerfile.financeservice Dockerfile
#gcloud  builds submit  --tag $DOCKER_IMAGE_NAME .
