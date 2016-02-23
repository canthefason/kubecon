package todo

import (
	"errors"
	"time"

	"github.com/satori/go.uuid"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var ErrInvalidId = errors.New("invalid id")

var ErrNotFound = errors.New("not found")

type Service interface {
	Upsert(*Todo) error
	Get() ([]Todo, error)
}

type MongoService struct {
	*mgo.Collection
}

func NewMongoService(db *mgo.Database) *MongoService {
	return &MongoService{
		Collection: db.C("todo"),
	}
}

func (ms *MongoService) Upsert(t *Todo) error {
	_, err := ms.UpsertId(t.Id, t)

	return err
}

func (ms *MongoService) Get() ([]Todo, error) {
	var todos []Todo
	err := ms.Find(bson.M{}).All(&todos)
	if err == mgo.ErrNotFound {
		return todos, ErrNotFound
	}

	return todos, err
}

type Todo struct {
	Id        uuid.UUID `bson:"_id" json:"id"`
	Title     string    `bson:"title" json:"title"`
	Completed bool      `bson:"completed" json:"completed"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
	//UserId    bson.ObjectId `bson:"userId" json:"userId"`
}

type TodoService struct {
	Service
	emptyId uuid.UUID
}

func NewTodoService(s Service) *TodoService {
	emptyId, _ := uuid.FromString("00000000-0000-0000-0000-000000000000")
	return &TodoService{
		Service: s,
		emptyId: emptyId,
	}
}

func (ts *TodoService) Upsert(t *Todo) error {
	// Check user id
	if uuid.Equal(t.Id, ts.emptyId) {
		return ErrInvalidId
	}
	t.UpdatedAt = time.Now()

	return ts.Service.Upsert(t)
}
