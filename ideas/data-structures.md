### Arrays/Lists

 - Comma separation required?
 - Merge syntax with object literals?
 - How to parse a[0]? How to distinguish it from a definition?
   - Using type info?
   - try parsing this first?
   
 
```

and(expr, listIndex)

let a = [0]

a [ 0 ] // Not allowed

let a = List(1, 2, 3)

a(0)

defMacro! list(block) {
   
}

```


### Object Literals/Records

```

let input = {
   position: 0
   code: 'let a = 5'
}

def times[a: number b: number] {
  a * b
}

times[a: a b: b]
or
times(a, b)



```

