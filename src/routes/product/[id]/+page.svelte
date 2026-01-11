<script lang="ts">
  import { warrantyInfo } from "$lib/warranty";
  import StatusBadge from "$lib/components/StatusBadge.svelte";

  export let data;

  const p: any = data.product; // <- TS fix
  const info = warrantyInfo(p.purchaseDate, p.warrantyMonths);
</script>

<div class="container">
  <div class="topbar">
    <div>
      <h1 style="margin:0;">{p.name}</h1>
      <p style="margin:6px 0 0; color:#6b7280;">Details zur Garantie.</p>
    </div>

    <div class="topActions">
      <a href="/"><button type="button" class="ghost">Zur Übersicht</button></a>
      <a href={`/edit/${p._id}`}><button type="button">Bearbeiten</button></a>
    </div>
  </div>

  <div class="card">
    <div class="row">
      <div class="label">Händler</div>
      <div class="value">{p.retailer}</div>
    </div>

    <div class="row">
      <div class="label">Kaufdatum</div>
      <div class="value">{p.purchaseDate}</div>
    </div>

    <div class="row">
      <div class="label">Garantie (Monate)</div>
      <div class="value">{p.warrantyMonths}</div>
    </div>

    <div class="row">
      <div class="label">Garantie bis</div>
      <div class="value">{info.endISO}</div>
    </div>

    <div class="row">
      <div class="label">Status</div>
      <div class="value"><StatusBadge status={info.status} /></div>
    </div>

    <div class="row">
      <div class="label">Beleg</div>
      <div class="value">
        {#if p.receiptUrl}
          <a href={p.receiptUrl} target="_blank" rel="noreferrer">Beleg öffnen</a>
        {:else}
          <span style="color:#6b7280;">Kein Link hinterlegt</span>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .container { max-width: 720px; margin: 32px auto; padding: 0 16px; }
  .topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
  .topActions { display:flex; gap:10px; align-items:center; }
  .card { background:white; border:1px solid #e5e7eb; border-radius:16px; padding:16px; box-shadow: 0 6px 24px rgba(17,24,39,0.06); }
  .row { display:grid; grid-template-columns: 160px 1fr; gap: 12px; padding: 12px 0; border-bottom: 1px solid #eef2f7; }
  .row:last-child { border-bottom: none; }
  .label { color:#6b7280; font-size: 13px; font-weight: 600; }
  .value { font-size: 14px; }
  .ghost { background:white; }
  @media (max-width: 560px){ .row { grid-template-columns: 1fr; } }
</style>
