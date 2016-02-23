package todo

import (
	"net/http"

	"github.com/ant0ine/go-json-rest/rest"
)

func UpdateHandler(w rest.ResponseWriter, r *rest.Request) {
	t := new(Todo)
	if err := r.DecodeJsonPayload(t); err != nil {
		rest.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	serv := r.Env["todo"].(*TodoService)

	err := serv.Upsert(t)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetHandler(w rest.ResponseWriter, r *rest.Request) {
	serv := r.Env["todo"].(*TodoService)
	todos, err := serv.Get()
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err == ErrNotFound {
			statusCode = http.StatusNotFound
		}
		rest.Error(w, err.Error(), statusCode)
		return
	}

	w.WriteJson(todos)
}
