<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

{@render children()}

<style>
  :global(:root) {
    --accent: #E03A3A;
    --accent-text: #ffffff;
    --accent-rgb: 224, 58, 58;
    --label: #E03A3A;
    --green: #1a9e1a;
    --dark: #ffffff;
    --dark2: #f8f8f8;
    --dark3: #f2f2f2;
    --card-bg: #ffffff;
    --border: rgba(0,0,0,0.08);
    --border-light: rgba(0,0,0,0.11);
    --text: #111111;
    --muted: #666666;
    --white: #111111;
  }

  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(html) { scroll-behavior: smooth; }
  :global(body) {
    background: #f5f5f5;
    background-attachment: fixed;
    color: var(--text);
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }
</style>
