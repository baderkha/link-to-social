package slice

type Operations[T any, E any] struct {
	slice *[]T
}

// From : Array Operations factory with support for maps with fixed type
func From[T any, E any](sliceOfAny *[]T) *Operations[T, E] {
	return &Operations[T, E]{
		slice: sliceOfAny,
	}
}

// FromDefault: Array Operations factory without support for mapping with fixed types
func FromDefault[T any](sliceOfAny *[]T) *Operations[T, any] {
	return &Operations[T, any]{
		slice: sliceOfAny,
	}
}

func (o *Operations[T, E]) IsEmpty() bool {
	return len(*o.slice) == 0
}

func (o *Operations[T, E]) IsNilOrEmpty() bool {
	return o.slice == nil || len(*o.slice) == 0
}

func (o *Operations[T, E]) Map(f func(item T, index int) E) []E {
	var res []E
	for index, item := range *o.slice {
		res = append(res, f(item, index))
	}
	return res
}

func (o *Operations[T, E]) Filter(f func(item T, index int) bool) []T {
	var res []T
	for index, item := range *o.slice {
		if f(item, index) {
			res = append(res, item)
		}
	}
	return res
}

func (o *Operations[T, E]) Pop() T {
	var poppedItem T
	var res []T
	leng := len(*o.slice)
	if leng > 0 {
		for i := 0; i < leng-1; i++ {
			item := (*o.slice)[i]
			res = append(res, item)
		}
		poppedItem = (*o.slice)[leng-1]
		o.slice = &res
	}
	return poppedItem
}

func (o *Operations[T, E]) GetBackSlice() []T {
	return *o.slice
}

func (o *Operations[T, E]) GetBackSlicePtr() *[]T {
	return o.slice
}

func (o *Operations[T, E]) Shift() T {
	var shiftedItem T
	var res []T
	leng := len(*o.slice)

	if leng > 0 {
		for i := 1; i < leng; i++ {
			item := (*o.slice)[i]
			res = append(res, item)
		}
		shiftedItem = (*o.slice)[0]
		o.slice = &res
	}

	return shiftedItem
}
