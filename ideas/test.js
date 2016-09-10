
interface Entities {
  current: Entity[];
}

interface GameState {
  entities: Entities;
  minerals: number;
  gas: number;
  supply: number;
  supplyMax: number;
  time: number;
}

function main() {
  let list = [];

  let gs = GameState {
    Entities {},
    50,
    0,
    6,
    11,
    0
  }

  run(list, gs);
}
main();

function incrementTime(gs: GameState): GameState {
  gs.time += 1;
}

// mutation
function incrementTime2(gs: GameState): GameState {
  set gs.time += 1;
  return gs;
}

function run(list: EntityName[], gs: GameState): void {
  const e = initEntity(list.head);

  // Missing check for empty list or out of time.

  if (gs..canMake(e)) {
    run(list.tail, gs..make(e));
  }
  else {
    run(list, gs..incrementTime);
  }
}

function initEntity(name: EntityName): Entity {
  return factory..getEntity(name); // getEntity(factory, name);
}
