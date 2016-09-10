
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

// mutation
def incrementTime2(gs: GameState): GameState =
  set gs.time += 1
  gs

def run(list: EntityName[], gs: GameState): void =
  let e = initEntity(list.head)
  // Missing check for empty list or out of time.

  if gs..canMake(e)
    run(list.tail, gs..make(e))
  else
    run(list, gs..incrementTime)

def initEntity(name: EntityName): Entity =
  factory..getEntity(name) // getEntity(factory, name);
