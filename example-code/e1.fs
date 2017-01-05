let a = (3 / 5) + 3 - 5

a..times(2)

def myFunc (a, c) {
  let a = 5
  let b = 6
  a..times(2)
}

if true {
  let c = 5
}
else if (false) {
  let c = 2
}
else {
  let c = 9
}

myFunc(5, 3)

def char(c) {
  (input) => {
    let r = input..nextChar()

    if r == c {
      input..advance()
      c
    }
    else {
      null
    }
  }
}

def charInner(input) {
  let r = input..nextChar()

  if r == c {
    input..advance()
    c
  }
  else {
    null
  }
}
