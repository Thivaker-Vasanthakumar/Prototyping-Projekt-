<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<slot />

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: #f6f7fb;
    color: #111827;
  }

  :global(a) { color: #2563eb; text-decoration: none; }
  :global(a:hover) { text-decoration: underline; }

  :global(input, select, button) {
    font: inherit;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 12px;
    background: white;
  }

  :global(button) {
    cursor: pointer;
    font-weight: 600;
  }

  :global(button:hover) {
    filter: brightness(0.98);
  }
</style>
