<script>
  import Modal from './Modal.svelte';
  import Button from './Button.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let uusiNimi = '';
  let par = 50;
  let vaylat = 18;

  // lisaaRata lähettää custom-tapahtuman, jonka parametreinä on lomakkeeseen syötetyt tiedot
  const lisaaRata = () =>
    dispatch('lisaaRata', {
      nimi: uusiNimi,
      par: par,
      vaylat: vaylat,
    });

  const naytaRadanLisays = () => dispatch('naytaRadanLisays');

  // lomakkeen validoinnit
  let ekaVierailu = true;
  $: nimiValidi = uusiNimi.trim().length > 2;
  $: parValidi = par > vaylat;
  $: vaylatValidi = vaylat >= 0;

  $: lomakeValidi = nimiValidi && parValidi && vaylatValidi;
</script>

<!--Uuden radan syöttämiseen tarkoitettu lomake-->
<Modal>
  <div slot="header">
    <div class="sulje" on:click={naytaRadanLisays}>X</div>
    <h2>Syötä radan tiedot</h2>
  </div>
  <hr />
  <label for="nimi">Radan nimi</label>
  <input
    type="text"
    id="nimi"
    bind:value={uusiNimi}
    on:blur={() => (ekaVierailu = false)}
    class:inputerror={!nimiValidi && !ekaVierailu}
  />

  <!-- Jos nimi ei ole validi, näytetään error-teksti -->
  {#if !nimiValidi && !ekaVierailu}
    <p class="error">Radan nimen täytyy olla vähintään 3 merkkiä pitkä</p>
  {/if}

  <label for="par">Radan par</label>
  <input
    type="number"
    id="par"
    bind:value={par}
    on:blur={() => (ekaVierailu = false)}
    class:inputerror={!parValidi && !ekaVierailu}
  />

  {#if !parValidi && !ekaVierailu}
    <p class="error">Par ei voi olla pienempi kuin väylien lukumäärä</p>
  {/if}

  <label for="vaylat">Väylien määrä</label>
  <input
    type="number"
    id="vaylat"
    bind:value={vaylat}
    on:blur={() => (ekaVierailu = false)}
    class:inputerror={!vaylatValidi && !ekaVierailu}
  />

  {#if !vaylatValidi && !ekaVierailu}
    <p class="error">Radalla täytyy olla vähintään yksi väylä</p>
  {/if}

  <div slot="footer">
    <Button on:click={lisaaRata} disabloitu={!lomakeValidi}>Lisää rata</Button>
    <Button on:click={naytaRadanLisays}>Peruuta</Button>
  </div>
</Modal>

<style>
  .error {
    color: red;
    font-size: small;
    margin: 0;
  }

  .inputerror {
    border: 1px solid red;
  }

  .sulje {
    font-weight: bolder;
    font-size: large;
    text-align: right;
    margin: 0;
  }

  .sulje:hover {
    cursor: pointer;
  }

  label {
    font-weight: bold;
    margin-top: 1em;
  }
</style>
