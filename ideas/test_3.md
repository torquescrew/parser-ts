# Ideas

### Considering

- No special syntax for arrays? Seems like a waste of special syntax
- Consider simplify record syntax (low priority)
- named argument parameters always?

### Macros
```

defMacro! ife(block) {
   if (block[0]) {
      block[1]
   }
   else {
      block[2]
   }
}

ife!(3 == 3, println('true'), println('false'))

```

Detect macro, code passed to macro is parsed into ast. 

Macro is evaluated after parse phase. This involves:
 - macro body code is parsed into ast
 - search macro body ast for identifiers in macro arguments
 - patch args into the ast
 - replace macro ast node with generated ast
 

```
 
 defmacro! class(block) {
    
 }
 
 class! ("Person", {
    
 })
 
 // Allow identifier that doesn't exist yet in macro?
 class! (Person, {
    
 })
 
 // Allow calling macro without paranthesis 
 class! Person, {
    method! name
 }
 
 ife! 3 == 3, println('true'), println('false'))
 
```


### Syntax
```python
data Entities =
  current: Entity[]

data GameState =
  entities: Entities,
  minerals: number,
  gas: number,
  supply: number,
  supplyMax: number,
  time: number

def main =
  let list = []

  let gs = GameState {
    Entities {},
    50,
    0,
    6,
    11,
    0
  }

  run(list, gs)

def incrementTime(gs: GameState): GameState =
  gs.time += 1

# mutation
def incrementTime2(gs: GameState): GameState =
  set gs.time += 1
  gs

def run(list: EntityName[], gs: GameState): void =
  let e = initEntity(list.head)
  # Missing check for empty list or out of time.

  if gs..canMake(e)
    run(list.tail, gs..make(e))
  else
    run(list, gs..incrementTime)

def initEntity(name: EntityName): Entity =
  factory..getEntity(name) # getEntity(factory, name);
```

### How to return modified objects?
```javascript

var obj = {
  a: 5,
  b: 34,
  c: {
    d: 3,
    e: 34
  }
};

// Set obj.b = 35
var obj2 = Object.assign({}, obj);
obj2.b = 35;

// Set obj.c.d = 4
var obj2 = Object.assign({}, obj);
var obj3 = Object.assign({}, obj2.c);
obj2.c = obj3
obj2.c.d = 4;

obj // {a:5, b:34, c:{d:3, e:34}}
obj2 // {a:5, b:34, c:{d:4, e:34}}

```
