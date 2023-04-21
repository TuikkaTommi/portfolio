<script>
  import kayttaja from './userStore';
  import Button from './Button.svelte';
  let userElem = '';
</script>

{#if !$kayttaja.ktun}
  <p>Kirjaudu sisään muokataksesi listaa</p>
{/if}

<!-- Jos userStoren ktun-arvo on tyhjä, näytetään sisäänkirajutuminen.
Jos ktun arvo ei ole tyhjä, näytetään sisäänkirajtutunut käyttäjä sekä uloskirjaus -->
<div class="container">
  {#if !$kayttaja.ktun}
    <input
      type="text"
      value={$kayttaja.ktun}
      bind:this={userElem}
      placeholder="Syötä käyttäjänimesi"
      id="ktun"
    />
  {:else}
    <p>Sisäänkirjautunut nimellä {$kayttaja.ktun}</p>
  {/if}

  {#if !$kayttaja.ktun}
    <!-- Nappula suorittaa userStoressa olevan kirjaudusisään-metodin // jolle
    parametriksi annetaan userElemin arvo -->
    <Button on:click={kayttaja.kirjauduSisaan(userElem.value)}
      >Kirjaudu sisään</Button
    >
  {:else}
    <!-- Tämä nappula taas suorittaa userStoren loggauduUlos-metodin -->
    <Button on:click={kayttaja.loggauduUlos}>Kirjaudu ulos</Button>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    gap: 1em;
    max-width: 100%;
    text-align: center;
    justify-content: center;
    align-items: center;
    z-index: -10;
  }

  input {
    height: 3em;
  }

  @media (max-width: 450px) {
    .container {
      flex-direction: column;
    }
  }
</style>
