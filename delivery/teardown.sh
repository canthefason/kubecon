#!/usr/bin/env bash
set -e

shopt -s expand_aliases

export KUBE_ENV=e2e-$GO_PIPELINE_LABEL
source delivery/kubeargs.sh

kubectl delete namespace $KUBE_ENV

