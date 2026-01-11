<script lang="ts">
  export let status: "aktiv" | "läuft bald ab" | "abgelaufen";
</script>

<span class="badge {status}">
  {status}
</span>

<style>
  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    border: 1px solid;
  }
  .aktiv { border-color: #2e7d32; }
  .läuft\ bald\ ab { border-color: #f9a825; }
  .abgelaufen { border-color: #c62828; }
</style>
