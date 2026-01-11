<script lang="ts">
  export let form;
</script>

<h1>Neues Produkt</h1>

<form method="POST" style="display:grid; gap:12px; max-width:420px;">
  <label>
    Produktname
    <input name="name" value={form?.values?.name ?? ""} />
    {#if form?.errors?.name}<div style="color:red">{form.errors.name}</div>{/if}
  </label>

  <label>
    Händler
    <input name="retailer" value={form?.values?.retailer ?? ""} />
    {#if form?.errors?.retailer}<div style="color:red">{form.errors.retailer}</div>{/if}
  </label>

  <label>
    Kaufdatum
    <input type="date" name="purchaseDate" value={form?.values?.purchaseDate ?? ""} />
    {#if form?.errors?.purchaseDate}<div style="color:red">{form.errors.purchaseDate}</div>{/if}
  </label>

  <label>
    Garantie (Monate)
    <input type="number" name="warrantyMonths" min="1" value={form?.values?.warrantyMonths ?? "24"} />
    {#if form?.errors?.warrantyMonths}<div style="color:red">{form.errors.warrantyMonths}</div>{/if}
  </label>

  <div style="display:flex; gap:10px;">
    <button type="submit">Speichern</button>
    <a href="/">Abbrechen</a>
  </div>
</form>
