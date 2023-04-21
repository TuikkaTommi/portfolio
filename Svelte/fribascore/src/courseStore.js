// Store, jonne tallennetaan ratojen tiedot

import { writable } from 'svelte/store';

const radat = writable([
  { id: 1, nimi: 'Hiiska DG', par: 61, vaylat: 18 },
  {
    id: 2,
    nimi: 'Liikuntapuiston Frisbeegolfrata Äänekoski',
    par: 57,
    vaylat: 18,
  },
  {
    id: 3,
    nimi: 'Suolahden Frisbeegolfrata',
    par: 55,
    vaylat: 18,
  },
  {
    id: 4,
    nimi: 'Laajalahden Frisbeegolfrata',
    par: 32,
    vaylat: 10,
  },
]);

export default radat;
