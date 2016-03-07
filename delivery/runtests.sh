#!/usr/bin/env bash
set -e

shopt -s expand_aliases

export KUBE_ENV=e2e-$GO_PIPELINE_LABEL
source delivery/kubeargs.sh
kubeargs="--namespace=$KUBE_ENV"
if [ "${E2E_IMAGE_TAG}" == "" ]; then
  E2E_IMAGE_TAG="latest"
fi

result=$(kubectl delete po nightwatch $kubeargs) || true

E2E_IMAGE_TAG=${GO_DEPENDENCY_LABEL_E2E:-$E2E_IMAGE_TAG}

echo "Test started using $E2E_IMAGE_TAG tag"

# docker-secret support
#kubectl run -i -tty nightwatch --env=PAUSE=${E2E_PAUSE} --env=MONGOADDR=mongo --env=URL=http://nginx --image=launchpadcentral/e2e:${E2E_IMAGE_TAG} --restart=Never --overrides='{"apiVersion":"v1","kind":"Pod","spec":{"imagePullSecrets":[{"name":"docker-secret"}]}}' $kubeargs

kubectl run -i -tty nightwatch --env=PAUSE=${E2E_PAUSE} --env=URL=http://nginx --image=$REGISTRY/integration-tests:${E2E_IMAGE_TAG} --restart=Never $kubeargs


state=$(kubectl get -o template po nightwatch $kubeargs --template={{.status.phase}})
while [ "$state" == "Running" ]; do
  sleep 8
  echo "waiting for the state"
  state=$(kubectl get -o template po nightwatch $kubeargs --template={{.status.phase}})
done

echo "State: $state"
if [ "$state" == "Failed" ]; then
  exit 1
fi
