package main

import (
	"link-to-social-api/pkg/slice"

	"github.com/davecgh/go-spew/spew"
)

type employee struct {
	Name string
	Num  int
}

func main() {
	var sl []string = []string{"ahmad", "james", "ahmad"}
	employeeAr := slice.
		FromDefault(&sl).
		Filter(func(item string, index int) bool {
			return item == "ahmad"
		})
	spew.Dump(employeeAr)

}
