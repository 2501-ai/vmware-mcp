import Fuse from 'fuse.js';
import { GOVC_COMMAND_INDEX, type GovcCommandEntry } from './commands';

const fuse = new Fuse<GovcCommandEntry>(GOVC_COMMAND_INDEX, {
  keys: [
    { name: 'name', weight: 6 },
    { name: 'description', weight: 4 },
    { name: 'category', weight: 2 },
  ],
  threshold: 0.4,
  includeScore: true,
});

export const searchCommands = (query: string, limit = 15): GovcCommandEntry[] =>
  fuse.search(query, { limit }).map((r) => r.item);

export { fuse };
