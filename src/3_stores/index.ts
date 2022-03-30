import { createPinia } from 'pinia';
import { useAppState } from './app-state';
import { useUser } from './user-state';
import { useLocal } from './local-data';
import { useCloud } from './cloud-functions';
import { useSpellCasting } from './spell-casting';
import { useSpellSolving } from './spell-solving';

const store = createPinia(),
  app = useAppState(store),
  user = useUser(store),
  local = useLocal(store),
  cloud = useCloud(store),
  casting = useSpellCasting(store),
  solving = useSpellSolving(store);

export { store, app, user, local, cloud, casting, solving };
