import * as migration_20261011_154539_initial from './20261011_154539_initial';
import * as migration_20261011_170738_schematic_circuits from './20261011_170738_schematic_circuits';

export const migrations = [
  {
    up: migration_20261011_154539_initial.up,
    down: migration_20261011_154539_initial.down,
    name: '20261011_154539_initial',
  },
  {
    up: migration_20261011_170738_schematic_circuits.up,
    down: migration_20261011_170738_schematic_circuits.down,
    name: '20261011_170738_schematic_circuits'
  },
];
