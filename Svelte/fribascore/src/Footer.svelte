<script>
  export let tekija;
  export let vuosi;
</script>

<!-- Footer ottaa tiedoikseen sovellusInfon propsit main.js-tiedostosta -->
<footer>{tekija}, {vuosi}</footer>

<style>
  footer {
    background-color: #0f3551;
    color: #af291e;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3em;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
