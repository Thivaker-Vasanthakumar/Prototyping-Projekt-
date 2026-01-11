<script lang="ts">
  import { warrantyInfo } from "$lib/warranty";
  import StatusBadge from "$lib/components/StatusBadge.svelte";

  export let data;

  let q = "";
  let statusFilter: "alle" | "aktiv" | "läuft bald ab" | "abgelaufen" = "alle";
  let sortMode: "neueste" | "läuft_am_nächsten_ab" = "neueste";

  // Modal state
  let showDeleteModal = false;
  let deleteId: string | null = null;
  let deleteName: string | null = null;

  $: enriched = (data.products ?? []).map((p) => {
    const info = warrantyInfo(p.purchaseDate, p.warrantyMonths);
    return { ...p, info };
  });

  $: countAktiv = enriched.filter((p) => p.info.status === "aktiv").length;
  $: countBald = enriched.filter((p) => p.info.status === "läuft bald ab").length;
  $: countAbgelaufen = enriched.filter((p) => p.info.status === "abgelaufen").length;

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

  function openDeleteModal(id: string, name: string) {
    deleteId = id;
    deleteName = name;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    deleteId = null;
    deleteName = null;
  }
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

  <div class="stats">
    <div class="stat">
      <div class="label">Aktiv</div>
      <div class="value">{countAktiv}</div>
    </div>
    <div class="stat">
      <div class="label">Läuft bald ab</div>
      <div class="value">{countBald}</div>
    </div>
    <div class="stat">
      <div class="label">Abgelaufen</div>
      <div class="value">{countAbgelaufen}</div>
    </div>
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

                  <!-- Delete trigger (no submit) -->
                  <button
                    type="button"
                    class="danger"
                    on:click={() => openDeleteModal(p._id, p.name)}
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  {#if showDeleteModal}
  <div
    class="overlay"
    role="button"
    tabindex="0"
    aria-label="Modal schließen"
    on:click={closeDeleteModal}
    on:keydown={(e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") closeDeleteModal();
    }}
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      tabindex="0"
      on:click|stopPropagation
      on:keydown={(e) => {
        if (e.key === "Escape") closeDeleteModal();
      }}
    >
      <div class="modalTitle">Produkt löschen?</div>
      <div class="modalText">
        Willst du <span class="bold">"{deleteName}"</span> wirklich löschen?
        <div style="margin-top:6px; color:#6b7280; font-size:13px;">
          Diese Aktion kann nicht rückgängig gemacht werden.
        </div>
      </div>

      <div class="modalActions">
        <button type="button" class="ghost" on:click={closeDeleteModal}>Abbrechen</button>

        <form method="POST" style="margin:0;">
          <input type="hidden" name="id" value={deleteId ?? ""} />
          <button class="danger" formaction="?/delete" type="submit">Ja, löschen</button>
        </form>
      </div>
    </div>
  </div>
{/if}

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

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .stat {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 14px 16px;
    box-shadow: 0 6px 24px rgba(17, 24, 39, 0.06);
  }

  .stat .label {
    color: #6b7280;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
  }

  .stat .value {
    font-size: 26px;
    font-weight: 700;
  }

  @media (max-width: 560px) {
    .stats {
      grid-template-columns: 1fr;
    }
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
    border: 1px solid #fecaca;
    background: #fff1f2;
    border-radius: 12px;
    padding: 10px 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .ghost {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 10px 12px;
    font-weight: 700;
    cursor: pointer;
  }

  /* Modal */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 50;
    border: 0;
  }

  .modal {
    width: 100%;
    max-width: 460px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    box-shadow: 0 20px 60px rgba(17, 24, 39, 0.2);
    padding: 16px;
  }

  .modalTitle {
    font-weight: 800;
    font-size: 18px;
    margin-bottom: 8px;
  }

  .modalText {
    color: #111827;
    font-size: 14px;
    line-height: 1.4;
  }

  .bold {
    font-weight: 800;
  }

  .modalActions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 14px;
    align-items: center;
  }
</style>
