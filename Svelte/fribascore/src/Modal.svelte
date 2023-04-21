<script>
  import { fly, scale } from 'svelte/transition';
</script>

<div class="backdrop" />

<!-- Modaali-ikkunan ilmestyminen ja poistuminen animoitu -->
<div
  class="modal"
  in:fly={{ duration: 1000, y: -300 }}
  out:scale={{ duration: 300 }}
>
  <!-- Slotien avulla voidaan asettaa asioita haluttuun kohtaan modaali-ikkunassa -->
  <header>
    <slot name="header" />
  </header>
  <slot />
  <footer>
    <slot name="footer" />
  </footer>
</div>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }

  .modal {
    padding: 1rem;
    position: fixed;
    top: 10vh;
    left: 10vw;
    width: 80%;
    max-height: 80vh;
    background: white;
    border-radius: 5px;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    overflow: scroll;
  }
</style>
