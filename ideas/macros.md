### Macros


#### Types:
 - Compile time execution of macro body. Is it actually needed? What context and functions are available?
   - Rust has a mini language that executes to solve this
   - Compile time execution can be used for optimisation
   - Required for macros with unknown number of arguments? e.g list!(1, 2, 3)
     - probably not a problem since targeting js
 - Compile time generating of ast by substitution
 - Nested macros? 

```

// Note: no support for arrays yet

defMacro! ife(block) {
   if ($block[0]) {
      $block[1]
   }
   else {
      $block[2]
   }
}

ife!(3 == 3, println('true'), println('false'))



if 1==1.0 { nothing } else { throw new Error(`Assert error: 1==1.0`) }


defMacro! assert(block) {
   quote(if $block { nothing } else { throw new Error(`Assert error: ${block}`) })
}

assert!(1 == 1.0)


defMacro! list(block: Expr[]) {
   let ls = List()
   
   $block.forEach((e) => {
      ls.push(e)
   })
   
   ls
}

list!(1, 2, 3)

```

#### Quoted macro only?
Detect macro, code passed to macro is parsed into ast. 

Macro is evaluated after parse phase. This involves:
 - macro body code is parsed into ast
 - search macro body ast for identifiers in macro arguments
 - patch args into the ast
 - inline macro expr body(replacing macro call)
 

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
