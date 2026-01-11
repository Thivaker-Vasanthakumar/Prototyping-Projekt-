<script lang="ts">
  import { warrantyInfo } from "$lib/warranty";
  import StatusBadge from "$lib/components/StatusBadge.svelte";

  export let data;

  let q = "";
  let statusFilter: "alle" | "aktiv" | "läuft bald ab" | "abgelaufen" = "alle";
  let sortMode: "neueste" | "läuft_am_nächsten_ab" = "neueste";

  $: enriched = (data.products ?? []).map((p) => {
    const info = warrantyInfo(p.purchaseDate, p.warrantyMonths);
    return { ...p, info };
  });

  $: filtered = enriched.filter((p) => {
    const text = `${p.name} ${p.retailer}`.toLowerCase();
    const matchesQuery = text.includes(q.toLowerCase());
    const matchesStatus = statusFilter === "alle" ? true : p.info.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  $: sorted = [...filtered].sort((a, b) => {
    if (sortMode === "läuft_am_nächsten_ab") return a.info.daysLeft - b.info.daysLeft;
    const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bT - aT;
  });
</script>

<div class="container">
  <div class="topbar">
    <div>
      <h1 style="margin:0;">Warranty Vault</h1>
      <p style="margin:6px 0 0; color:#6b7280;">Behalte Garantien & Belege im Blick.</p>
    </div>

    <a href="/new">
      <button type="button">+ Neues Produkt</button>
    </a>
  </div>

  <div class="card">
    <div class="filters">
      <input placeholder="Suche (Produkt / Händler)" bind:value={q} />

      <select bind:value={statusFilter}>
        <option value="alle">Status: alle</option>
        <option value="aktiv">aktiv</option>
        <option value="läuft bald ab">läuft bald ab</option>
        <option value="abgelaufen">abgelaufen</option>
      </select>

      <select bind:value={sortMode}>
        <option value="neueste">Sortierung: neueste</option>
        <option value="läuft_am_nächsten_ab">Sortierung: läuft am nächsten ab</option>
      </select>
    </div>

    {#if sorted.length === 0}
      <p style="color:#6b7280; margin: 12px 0 0;">Keine Treffer.</p>
    {:else}
      <div class="tableWrap">
        <table>
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
            {#each sorted as p}
              <tr>
                <td class="strong">{p.name}</td>
                <td>{p.retailer}</td>
                <td>{p.purchaseDate}</td>
                <td>{p.info.endISO}</td>
                <td><StatusBadge status={p.info.status} /></td>
                <td class="actions">
                  <a href={`/edit/${p._id}`}>Bearbeiten</a>
                  <form method="POST" style="margin:0;">
                    <input type="hidden" name="id" value={p._id} />
                    <button class="danger" formaction="?/delete" type="submit">Löschen</button>
                  </form>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 980px;
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

  .filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .filters input {
    min-width: 240px;
  }

  .tableWrap {
    overflow: auto;
    border-radius: 16px;
    border: 1px solid #eef2f7;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  th {
    text-align: left;
    font-size: 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #6b7280;
    background: #f9fafb;
  }

  th,
  td {
    padding: 12px 14px;
    border-bottom: 1px solid #eef2f7;
    vertical-align: middle;
  }

  tbody tr:hover td {
    background: #fafafa;
  }

  .strong {
    font-weight: 600;
  }

  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
    white-space: nowrap;
  }

  .danger {
    border-color: #fecaca;
    background: #fff1f2;
  }
</style>
