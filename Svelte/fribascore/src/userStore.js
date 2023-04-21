import { writable } from 'svelte/store';

// Store käyttäjän tieotjen tallentamista varten
const kayttaja = writable({ ktun: null });

const kayttajaMetodit = {
  subscribe: kayttaja.subscribe,
  // metodi joka "kirjaa käyttäjän sisään" eli asettaa ktun arvoksi parametrin
  kirjauduSisaan: (nimi) => {
    kayttaja.set({
      ktun: nimi,
    });
  },

  // "kirjaa ulos" eli asettaa ktun-arvon nulliksi
  loggauduUlos: () => {
    kayttaja.set({ ktun: null });
  },
};

export default kayttajaMetodit;
