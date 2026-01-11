<script lang="ts">
  export let form;
</script>

<div class="container">
  <div class="topbar">
    <div>
      <h1 style="margin:0;">Neues Produkt</h1>
      <p style="margin:6px 0 0; color:#6b7280;">Erfasse Kaufdatum und Garantiedauer.</p>
    </div>
    <a href="/"><button type="button" class="ghost">Zur Übersicht</button></a>
  </div>

  <div class="card">
    <form method="POST" class="form">
      <div class="field">
        <label for="name">Produktname</label>
        <input id="name" name="name" placeholder="z.B. Apple AirPods" value={form?.values?.name ?? ""} />
        {#if form?.errors?.name}<div class="error">{form.errors.name}</div>{/if}
      </div>

      <div class="field">
        <label for="retailer">Händler</label>
        <input id="retailer" name="retailer" placeholder="z.B. Digitec" value={form?.values?.retailer ?? ""} />
        {#if form?.errors?.retailer}<div class="error">{form.errors.retailer}</div>{/if}
      </div>

      <div class="grid2">
        <div class="field">
          <label for="purchaseDate">Kaufdatum</label>
          <input
            id="purchaseDate"
            type="date"
            name="purchaseDate"
            value={form?.values?.purchaseDate ?? ""}
          />
          {#if form?.errors?.purchaseDate}<div class="error">{form.errors.purchaseDate}</div>{/if}
        </div>

        <div class="field">
          <label for="warrantyMonths">Garantie (Monate)</label>
          <input
            id="warrantyMonths"
            type="number"
            name="warrantyMonths"
            min="1"
            placeholder="z.B. 24"
            value={form?.values?.warrantyMonths ?? "24"}
          />
          {#if form?.errors?.warrantyMonths}<div class="error">{form.errors.warrantyMonths}</div>{/if}
        </div>
      </div>

      <div class="actions">
        <button type="submit">Speichern</button>
        <a href="/" class="link">Abbrechen</a>
      </div>
    </form>
  </div>
</div>

<style>
  .container {
    max-width: 640px;
    margin: 32px auto;
    padding: 0 16px;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 6px 24px rgba(17, 24, 39, 0.06);
  }

  .form {
    display: grid;
    gap: 14px;
  }

  .field {
    display: grid;
    gap: 6px;
  }

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  .grid2 {
    display: grid;
    gap: 14px;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 560px) {
    .grid2 {
      grid-template-columns: 1fr;
    }
  }

  .actions {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 6px;
  }

  .link {
    color: #6b7280;
    text-decoration: none;
    font-weight: 600;
  }
  .link:hover {
    text-decoration: underline;
  }

  .error {
    color: #b91c1c;
    font-size: 12px;
  }

  .ghost {
    background: white;
  }
</style>
