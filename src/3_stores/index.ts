import { createPinia } from 'pinia';
import { useAppState } from './app-state';
import { useUser } from './user-state';
import { useLocal } from './local-data';
import { useSpellData } from './spell-data';
import { useSpellCasting } from './spell-casting';
import { useSpellSolving } from './spell-solving';

const store = createPinia(),
  app = useAppState(store),
  user = useUser(store),
  local = useLocal(store),
  spells = useSpellData(store),
  casting = useSpellCasting(store),
  solving = useSpellSolving(store);

export { store, app, user, local, spells, casting, solving };
