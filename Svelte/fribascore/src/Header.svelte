<script>
  export let nimi;
</script>

<!-- Otsikko hakee sovelluksen nimen main.js-tiedoston propseista -->
<div class="header">
  <h1>{nimi}</h1>
</div>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5em;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0f3551;
    color: #af291e;
    text-shadow: 2px 2px 2px rgba(230, 230, 230, 0, 3);
    box-shadow: 0px 5px 10px rgba(000, 000, 000, 0.4);
    font-size: 1.5em;
  }
</style>
