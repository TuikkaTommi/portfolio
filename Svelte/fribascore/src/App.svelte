<script>
  // Komponenttien ja storejen importit
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import Button from './Button.svelte';
  import Login from './Login.svelte';
  import tulokset from './scoreStore';
  import radat from './courseStore';
  import kayttaja from './userStore';
  import Tuloslista from './Tuloslista.svelte';
  import UusiTulos from './UusiTulos.svelte';
  import UusiRata from './UusiRata.svelte';

  // tuodaan sovellusInfo main.js-tiedoston propseista
  export let sovellusInfo;

  let naytaLisays = false;

  // Uuden tuloksen lisäämisikkunan näyttämisen muuttaminen
  function vaihdaNakyvyys() {
    if (!naytaLisays) {
      naytaLisays = true;
    } else {
      naytaLisays = false;
    }
  }

  let naytaRadanLisays = false;

  function radanLisaysNakyvyys() {
    if (!naytaRadanLisays) {
      naytaRadanLisays = true;
    } else {
      naytaRadanLisays = false;
    }
  }

  // Uuden tuloksen lisääminen listaan. Funktio päivittää tulokset-storea
  // lisäämällä listaan tuloksen, jonka tiedot tulevat ce.detailin arvoista
  let tulosid = Math.max(0, ...$tulokset.map((t) => t.id)) + 1;
  function lisaaTulos(ce) {
    tulokset.update((tulokset) => [
      ...tulokset,
      {
        id: tulosid,
        rata: ce.detail.rata,
        tulos: ce.detail.uusiTulos,
        pvm: ce.detail.pvm,
        pelaaja: $kayttaja.ktun,
      },
    ]);
    tulosid = Math.max(0, ...$tulokset.map((t) => t.id)) + 1;
    vaihdaNakyvyys();
    alert('Tulos lisätty onnistuneesti!');
  }

  // tuloksen poistofunktio, joka filtteröi tuloksista customeventin
  // parametrinä välitettyä id:tä vastaavan tuloksen
  const poistaTulos = (ce) => {
    $tulokset = $tulokset.filter((tulos) => tulos.id !== ce.detail);
  };

  // Uuden radan lisääminen toimii samalla periaatteella kuin uuden tuloksen lisääminen
  let rataid = Math.max(0, ...$radat.map((t) => t.id)) + 1;
  function lisaaRata(ce) {
    radat.update((radat) => [
      ...radat,
      {
        id: rataid,
        nimi: ce.detail.nimi,
        par: ce.detail.par,
        vaylat: ce.detail.vaylat,
      },
    ]);
    rataid = Math.max(0, ...$radat.map((t) => t.id)) + 1;
    radanLisaysNakyvyys();
    alert('Rata lisätty onnistuneesti!');
  }
</script>

<Header nimi={sovellusInfo.nimi} />

<main>
  <Login />
  <hr />
  <h2>Pelatut kierrokset</h2>

  {#if $kayttaja.ktun}
    <Button on:click={vaihdaNakyvyys}>Lisää uusi tulos</Button>
  {/if}

  <Tuloslista on:poista={poistaTulos} />

  {#if $kayttaja.ktun}
    <Button on:click={vaihdaNakyvyys}>Lisää uusi tulos</Button>
  {/if}

  {#if naytaLisays}
    <UusiTulos
      on:peruuta={vaihdaNakyvyys}
      on:naytaRadanLisays={radanLisaysNakyvyys}
      on:lisaaTulos={lisaaTulos}
    />
  {/if}

  {#if naytaRadanLisays}
    <UusiRata
      on:naytaRadanLisays={radanLisaysNakyvyys}
      on:lisaaRata={lisaaRata}
    />
  {/if}
</main>

<Footer tekija={sovellusInfo.tekija} vuosi={sovellusInfo.vuosi} />

<style>
  main {
    max-width: 90%;
    margin: 9em auto;
    text-align: center;
    padding-bottom: 5em;
  }
</style>
