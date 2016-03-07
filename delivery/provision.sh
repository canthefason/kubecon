#!/usr/bin/env bash
set -e

shopt -s expand_aliases

export KUBE_ENV=e2e-$GO_PIPELINE_LABEL

source delivery/kubeargs.sh

echo "provisioning the test environment"

# PROVISION THE TEST ENVIRONMENT

# create namespace
echo "Creating the namespace: $KUBE_ENV"
sed -i -e "s/\${E2E_ENV}/$KUBE_ENV/g" manifests/namespace.yml

kubectl delete namespace $KUBE_ENV || true

kubeargs="--namespace=$KUBE_ENV"

pwd
ls manifests/
cat manifests/namespace.yml
kubectl create -f $WORKDIR/manifests/namespace.yml

# create mongo
kubectl create -f $WORKDIR/manifests/mongo.yml $kubeargs

# run selenium server
kubectl create -f $WORKDIR/manifests/selenium.yml $kubeargs

# provision and create services for all connected materials
for envvar in `printenv | cut -d" " -f 1`; do
  IFS='=' read -r -a array <<< "$envvar"
  # for integration tests we are not creating any pods/services yet
  if [[ ${array[0]} == "GO_DEPENDENCY_LABEL"* ]]; then
    if [[ ${array[0]} == "GO_DEPENDENCY_LABEL_E2E" ]]; then
      continue
    fi
    image=${array[1]}
    dependency="GO_DEPENDENCY_LOCATOR_${array[0]:20}"
    eval newvar=\$$dependency
    IFS='/' read -r -a locator <<< "$newvar"
    service=${locator[0]}
    echo "Service and image: $service $image"

    # provision file
    sed -i -e "s/\${REPLICAS}/2/g" manifests/"$service".yml
    sed -i -e "s/\${BUILD_TAG}/$image/g" manifests/"$service".yml

    # create service
    kubectl create -f $WORKDIR/manifests/"$service".yml $kubeargs
  fi
done
