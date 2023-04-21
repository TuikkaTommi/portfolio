<script>
  import Tuloskortti from './Tuloskortti.svelte';
  import tulokset from './scoreStore';
</script>

<div class="tulokset" class:lista={$tulokset.length > 2}>
  <!-- Jos tulostaulukko ei ole tyhjä, asetetaan jokainen tulostaulukon alkio
  omaan tuloskorttiinsa -->
  {#if $tulokset.length > 0}
    {#each $tulokset as tulos}
      <Tuloskortti
        on:poista
        id={tulos.id}
        rata={tulos.rata}
        tulos={tulos.tulos}
        pvm={tulos.pvm}
        pelaaja={tulos.pelaaja}
      />
    {/each}
  {:else}
    <h2>Ei vielä merkittyjä tuloksia</h2>
  {/if}
</div>

<style>
  .tulokset {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    margin-bottom: 2em;
  }
</style>
