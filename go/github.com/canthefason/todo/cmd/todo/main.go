package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/canthefason/todo"

	"github.com/ant0ine/go-json-rest/rest"
	mgo "gopkg.in/mgo.v2"
)

type MongoMiddl struct {
	Session *mgo.Session
	DBName  string
}

func (m MongoMiddl) MiddlewareFunc(handler rest.HandlerFunc) rest.HandlerFunc {
	return func(w rest.ResponseWriter, r *rest.Request) {
		sess := m.Session.Copy()
		defer sess.Close()

		r.Env["todo"] = todo.NewTodoService(
			todo.NewMongoService(sess.DB(m.DBName)),
		)

		handler(w, r)
	}
}

type Config struct {
	MongoUrl  string
	MongoName string
}

func loadConfig() Config {
	var c Config
	flag.StringVar(&c.MongoUrl, "mongo-url", "192.168.99.100:27017/kubecon", "Mongo connection url")
	flag.StringVar(&c.MongoName, "mongo-dbname", "kubecon", "MondoDB database name")

	return c
}

func MustInitMongo(c Config) *mgo.Session {
	session, err := mgo.Dial(c.MongoUrl)
	if err != nil {
		log.Fatal("Could not connect to MongoDB: %s", err)
	}

	return session
}

func main() {
	config := loadConfig()

	sess := MustInitMongo(config)

	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)
	api.Use(MongoMiddl{
		Session: sess,
		DBName:  config.MongoName,
	})

	router, err := rest.MakeRouter(
		rest.Post("/todo", todo.UpdateHandler),
		rest.Get("/todo", todo.GetHandler),
	)
	if err != nil {
		panic(err)
	}

	api.SetApp(router)

	log.Println("Listening :8000")
	log.Fatal(http.ListenAndServe(":8000", api.MakeHandler()))
}
