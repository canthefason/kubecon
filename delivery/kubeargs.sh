#!/usr/bin/env bash

WORKDIR=/root/delivery

alias kubectl="sudo docker run --rm -v /home/core/.kube:/root/.kube -v /home/core/pipelines/delivery/kubecon:$WORKDIR wernight/kubectl kubectl"

