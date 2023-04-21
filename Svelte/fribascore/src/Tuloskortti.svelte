<script>
  import Button from './Button.svelte';
  import kayttaja from './userStore';
  import radat from './courseStore';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // customeventti, joka lähettää id:n parametrinä oikean tuloksen poistamiseksi
  const poista = () => dispatch('poista', id);

  // esitellään tarvittavat muuttujat
  export let rata;
  export let tulos;
  export let pvm;
  export let id;
  export let pelaaja;

  // lasketaan kierrokset tulos eli heittojen määrä - radan par.
  let erotus = tulos - $radat.find((obj) => obj.nimi === rata).par;
</script>

<div class="tulokset">
  <h2>Kierroksen tunniste: {id}</h2>
  <!-- Kuvituskuva joka haetaan automaattisesti loremflickr-palvelusta -->
  <img
    src="https://loremflickr.com/320/240/discgolf?id={id}"
    alt="kuvituskuva"
  />
  <hr />
  <!-- Näytetään kierroksen tiedot kortissa -->
  <p>Rata: {rata}</p>
  <p>Heittojen määrä: {tulos}</p>
  <p>
    Tulos: {#if erotus > 0}
      +{erotus}
    {:else}
      {erotus}
    {/if}
  </p>
  <p>Päivämäärä: {pvm}</p>
  <p>Pelaaja: {pelaaja}</p>
  <!-- Poistonappi näkyy vain sisäänkirjautuneille. Kannattaisi toki 
  näkyä vain admin-käyttäjille... -->
  {#if $kayttaja.ktun}
    <Button on:click={poista}>Poista</Button>
  {/if}
</div>

<style>
  .tulokset {
    border: 1px solid black;
    border-radius: 1em;
    padding: 0.5em;
    margin: 1em auto;
    box-shadow: 2px 2px 10px;
    max-width: 50%;
    text-align: center;
    font-weight: bold;
  }

  p {
    text-align: left;
    margin-left: 1em;
  }

  img {
    max-width: 90%;
    margin: 0 auto;
  }

  @media (max-width: 650px) {
    .tulokset {
      max-width: 75%;
    }
  }
</style>
