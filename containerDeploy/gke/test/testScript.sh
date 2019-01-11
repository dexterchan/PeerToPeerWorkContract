kubectl run web --image=gcr.io/google-samples/hello-app:1.0 --port=8080


kubectl expose deployment web --target-port=8080 --type=NodePort
kubectl apply -f basic-ingress.yaml

kubectl get ingress basic-ingress
