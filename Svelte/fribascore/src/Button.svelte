<script>
  export let disabloitu = false;
</script>

<button on:click disabled={disabloitu}><slot /></button>

<style>
  button {
    background-color: #dac6a3;
    border: 1px solid black;
    border-radius: 5%;
    padding: 0.8em 1.2em;
    font-weight: bold;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  }

  button:hover {
    cursor: pointer;
  }
</style>
