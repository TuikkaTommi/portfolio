// Store, jonne tallennetaan pelatut kierrokset

import { writable } from 'svelte/store';

const tulokset = writable([
  // yksi kierros valmiina, jotta sivulla on jotain dataa jo käynnistettäessä
  { id: 1, rata: 'Hiiska DG', tulos: 58, pvm: '2022-04-20', pelaaja: 'Tommi' },
]);

export default tulokset;
