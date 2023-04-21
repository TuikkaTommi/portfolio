import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    // sovelluksen tiedot, jotka voidaan hakea globaalisti
    sovellusInfo: {
      nimi: 'FribaScore',
      tekija: 'Tommi Tuikka',
      vuosi: '2022',
    },
  },
});

export default app;
