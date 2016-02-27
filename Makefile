all: buildClient runServer
.PHONY: all

install:
	cd client && npm i

buildClient:
	cd client && webpack

runServer:
	go run go/src/github.com/canthefason/todo/cmd/todo/main.go -mongo-url=$(shell docker-machine ip kubecon)
