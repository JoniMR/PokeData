import { StatRange } from '../shared/models/pokemon.interface';

export const TABLE_CONFIG = {
  showFirstLastButtons: true,
  initialLength: 1025,
  initialPageSize: 10,
  initialPageIndex: 0,
  pageSizeOptions: [10, 25, 100],
  displayedColumns: ['id', 'imgUrl', 'name', 'type', 'height', 'weight'],
};

export const STAT_RANGES: { [key: string]: StatRange } = {
  hp: { min: 1, max: 255 },
  attack: { min: 5, max: 190 },
  defense: { min: 5, max: 190 },
  'special-attack': { min: 10, max: 194 },
  'special-defense': { min: 10, max: 194 },
  speed: { min: 5, max: 180 },
};
