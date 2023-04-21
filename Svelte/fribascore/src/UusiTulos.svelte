<script>
  import Modal from './Modal.svelte';
  import Button from './Button.svelte';
  import radat from './courseStore';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // lisaaTulos lähettää custom-tapahtuman, jonka parametreinä on lomakkeeseen syötetyt tiedot
  const lisaaTulos = () =>
    dispatch('lisaaTulos', {
      uusiTulos: uusiTulos,
      rata: valittuRata.value,
      pvm: pvm,
    });
  const peruuta = () => dispatch('peruuta');
  const naytaRadanLisays = () => dispatch('naytaRadanLisays');

  // Asetetaan datepickerin defaultiksi nykyinen päivämäärä ja muotoillaan se käytettävään muotoon
  const date = new Date();
  let datestring;
  if (date.getMonth() > 9) {
    datestring = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  } else {
    datestring = `${date.getFullYear()}-0${
      date.getMonth() + 1
    }-${date.getDate()}`;
  }
  let pvm = datestring.toString();

  let uusiTulos = 0;
  let valittuRata = 'Hiiska DG';

  // lomakkeen validoinnit. minVaylienMaara ottaa radat-storesta pienimmän väylien määrän
  let ekaVierailu = true;
  // Tehdään mappi, jossa on radat-storen väylien arvot ja valitaan niistä pienin arvo
  let minVaylienMaara = Math.min(...$radat.map((r) => r.vaylat));

  $: lomakeValidi = uusiTulos >= minVaylienMaara;

  /*
  Miten tämän validoinnin saisi toimimaan?
  Tämä olisi parempi validointi, koska silloin heittojen määrän pitäisi olla vähintään
  valitun radan väylien määrän, eikä vain sen radan, jolla on vähiten väyliä.
  let minVaylienMaara = $radat.find((obj) => obj.nimi === valittuRata).vaylat;

  $: lomakeValidi = uusiTulos >= vaylienMaara;
  */
</script>

<!--Uuden tuloksen syöttämiseen tarkoitettu lomake-->
<Modal>
  <div slot="header">
    <div class="sulje" on:click={peruuta}>X</div>
    <h2>Syötä kierroksen tiedot</h2>
  </div>
  <hr />
  <label for="tulos">Heittojen määrä</label>
  <input
    type="number"
    id="tulos"
    bind:value={uusiTulos}
    on:blur={() => (ekaVierailu = false)}
    class:inputerror={!lomakeValidi && !ekaVierailu}
  />

  <!-- Jos lomake ei ole validi, näytetään error-teksti -->
  {#if !lomakeValidi && !ekaVierailu}
    <p class="error">Heittojen määrä ei voi olla alle radan väylien määrän</p>
  {/if}

  <label for="pvm">Päivämäärä</label>
  <input type="date" id="pvm" bind:value={pvm} />

  <label for="rata">Rata</label>

  <select>
    {#each $radat as rata}
      <option bind:this={valittuRata}>{rata.nimi}</option>
    {/each}
  </select>
  <p class="info" on:click={peruuta} on:click={naytaRadanLisays}>
    Eikö rataa näy listassa? Lisää se täältä!
  </p>

  <div slot="footer">
    <Button on:click={lisaaTulos} disabloitu={!lomakeValidi}>Lisää tulos</Button
    >
    <Button on:click={peruuta}>Peruuta</Button>
  </div>
</Modal>

<style>
  .info {
    font-size: small;
    color: blue;
    margin-top: 0;
  }

  .info:hover {
    cursor: pointer;
    color: aqua;
  }

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
