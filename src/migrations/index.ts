import * as migration_20261011_154539_initial from './20261011_154539_initial';
import * as migration_20261011_170738_schematic_circuits from './20261011_170738_schematic_circuits';
import * as migration_20261011_193856_map_stats_analytics from './20261011_193856_map_stats_analytics';

export const migrations = [
  {
    up: migration_20261011_154539_initial.up,
    down: migration_20261011_154539_initial.down,
    name: '20261011_154539_initial',
  },
  {
    up: migration_20261011_170738_schematic_circuits.up,
    down: migration_20261011_170738_schematic_circuits.down,
    name: '20261011_170738_schematic_circuits',
  },
  {
    up: migration_20261011_193856_map_stats_analytics.up,
    down: migration_20261011_193856_map_stats_analytics.down,
    name: '20261011_193856_map_stats_analytics'
  },
];
