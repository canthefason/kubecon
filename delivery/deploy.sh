#!/usr/bin/env bash
set -e

shopt -s expand_aliases

source delivery/kubeargs.sh

KUBE_STAGE_NAMESPACE=${KUBE_STAGE_NAMESPACE:-"stage"}
kubeargs="--namespace=$KUBE_STAGE_NAMESPACE"

for envvar in `printenv | cut -d" " -f 1`; do
  IFS='=' read -r -a array <<< "$envvar"
  if [[ ${array[0]} == "GO_DEPENDENCY_LABEL"* ]]; then
    if [[ ${array[0]} == "GO_DEPENDENCY_LABEL_E2E" ]]; then
      continue
    fi
    if [ "${array[0]}" == "GO_DEPENDENCY_LABEL_NGINX" ]; then
      echo "  type: LoadBalancer" >> manifests/nginx.yml
    fi

    image=${array[1]}
    dependency="GO_DEPENDENCY_LOCATOR_${array[0]:20}"
    eval newvar=\$$dependency
    IFS='/' read -r -a locator <<< "$newvar"
    service=${locator[0]}
    echo "Service and image: $service $image"

    currentImage=$(kubectl get rc $service $kubeargs | awk -v registry=$REGISTRY '/registry/ {print $3}')
    if [ "$currentImage" == "$REGISTRY/$service:$image" ]; then
      continue
    fi

    rcExist=$(kubectl get -o template rc $service --template={{.kind}} $kubeargs) || true
    if [ "$rcExist" != "ReplicationController" ]; then
      echo "creating $service with image: $image"
      sed -i -e "s/\${REPLICAS}/2/g" manifests/"$service".yml
      sed -i -e "s/\${BUILD_TAG}/$image/g" manifests/"$service".yml

      kubectl create -f $WORKDIR/manifests/"$service".yml $kubeargs
    else
      echo "updating $service with image: $image"
      kubectl rolling-update $service --image=$REGISTRY/$service:$image --update-period=20s $kubeargs
    fi
  fi
done

