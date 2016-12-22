### Ideas

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

```javascript

var a = 5;

if (a == 5) {
   console.log('hi');
}

a == 5 ? console.log('hi') : undefined;


if (a == 5) {
   console.log('a');
}
else if (a == 6) {
   console.log('b');
}

a == 5 ? console.log('a') : (a == 6 ? console.log('b') : undefined);



if (a == 5) {
   console.log('a');
}
else if (a == 6) {
   console.log('b');
}
else {
   console.log('c');
}

a == 5 ? console.log('a') : (a == 6 ? console.log('b') : console.log('c'));



if (a == 5) {
   console.log('a');
}
else if (a == 6) {
   console.log('b');
}
else if (a == 7) {
   console.log('d');
}
else {
   console.log('c');
}

a == 5 ? 
  console.log('a') : (a == 6 ? 
    console.log('b') : (a == 7 ? 
      console.log('d') : console.log('c')));

```