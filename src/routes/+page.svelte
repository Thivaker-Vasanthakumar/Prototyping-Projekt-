<script lang="ts">
  import { warrantyInfo } from "$lib/warranty";

  export let data;
</script>

<h1>Warranty Vault</h1>

<p><a href="/new">+ Neues Produkt</a></p>

{#if data.products.length === 0}
  <p>Noch keine Produkte.</p>
{:else}
  <table border="1" cellpadding="8" cellspacing="0">
    <thead>
      <tr>
        <th>Produkt</th>
        <th>Händler</th>
        <th>Kaufdatum</th>
        <th>Garantie bis</th>
        <th>Status</th>
        <th>Aktionen</th>
      </tr>
    </thead>
    <tbody>
      {#each data.products as p}
        {@const info = warrantyInfo(p.purchaseDate, p.warrantyMonths)}
        <tr>
          <td>{p.name}</td>
          <td>{p.retailer}</td>
          <td>{p.purchaseDate}</td>
          <td>{info.endISO}</td>
          <td>{info.status} ({info.daysLeft}d)</td>
          <td style="white-space:nowrap;">
            <a href={`/edit/${p._id}`}>Bearbeiten</a>
            <form method="POST" style="display:inline;">
              <input type="hidden" name="id" value={p._id} />
              <button formaction="?/delete" type="submit">Löschen</button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
