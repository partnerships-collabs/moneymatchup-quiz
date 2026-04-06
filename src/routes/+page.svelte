<script lang="ts">
  import { questions, OUTCOME_MAP, getCard, config as fullConfig } from '$lib/config';

  let { data } = $props();
  const { config, s1, affiliateSlugMap } = data;

  // The affiliate platform's redirect base URL (router backend domain)
  const ROUTER_BASE = 'https://secure.moneymatchup.com';

  let current = $state(0);
  let answers = $state<Record<string, string>>({});
  let selected = $state<string | null>(null);
  let showResult = $state(false);
  let resultOutcome = $state('');
  let slideDirection = $state<'forward' | 'back'>('forward');
  let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;
  let redirectTimer: ReturnType<typeof setTimeout> | null = null;

  let progress = $derived(Math.max(8, Math.round((current / (questions.length - 1)) * 100)));

  let resultDisplay = $derived(config.resultDisplay[resultOutcome] || { name: '', type: '' });

  let redirectUrl = $derived.by(() => {
    if (!resultOutcome) return '';
    // If we have affiliate slug map, use the affiliate redirect
    if (affiliateSlugMap) {
      const configUrl = fullConfig.redirectUrls[resultOutcome];
      const affiliateSlug = affiliateSlugMap[configUrl];
      if (affiliateSlug) {
        return `${ROUTER_BASE}/${affiliateSlug}`;
      }
    }
    // Fallback: direct bankrate URL with s1 param
    const baseUrl = fullConfig.redirectUrls[resultOutcome];
    if (!baseUrl) return '';
    return s1 ? `${baseUrl}&s1=${encodeURIComponent(s1)}` : baseUrl;
  });

  function selectOption(value: string) {
    if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
    selected = value;
    answers[questions[current].id] = value;
    autoAdvanceTimer = setTimeout(() => { autoAdvanceTimer = null; nextQ(); }, 380);
  }

  function nextQ() {
    if (!selected) return;
    answers[questions[current].id] = selected;
    const id = questions[current].id;

    if (id === 'cardtype' && selected === 'business') {
      current = questions.findIndex(q => q.id === 'score');
      slideDirection = 'forward';
      selected = answers[questions[current].id] || null;
      return;
    }
    if (answers.cardtype === 'business' && id === 'score') { doShowResult(); return; }
    if (id === 'payoff' && selected === 'carry') { doShowResult(); return; }
    if (id === 'score' && (selected === 'poor' || selected === 'new')) { doShowResult(); return; }
    if (id === 'goal' && selected === 'build') { doShowResult(); return; }

    if (current < questions.length - 1) {
      current++;
      slideDirection = 'forward';
      selected = answers[questions[current].id] || null;
    } else {
      doShowResult();
    }
  }

  function prevQ() {
    if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
    if (current > 0) {
      if (answers.cardtype === 'business' && questions[current].id === 'score') {
        current = questions.findIndex(q => q.id === 'cardtype');
      } else {
        current--;
      }
      slideDirection = 'back';
      selected = answers[questions[current].id] || null;
    }
  }

  function doShowResult() {
    const cardKey = getCard(answers);
    resultOutcome = OUTCOME_MAP[cardKey] || 'everyday';
    showResult = true;
    if (redirectTimer) clearTimeout(redirectTimer);
    redirectTimer = setTimeout(() => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, 3500);
  }

  function restart() {
    if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
    if (redirectTimer) { clearTimeout(redirectTimer); redirectTimer = null; }
    current = 0;
    answers = {};
    selected = null;
    showResult = false;
    resultOutcome = '';
    slideDirection = 'forward';
  }
</script>

<svelte:head>
  <title>{config.pageTitle}</title>
</svelte:head>

<header class="header">
  <!-- <img src={config.creatorPhoto} alt={config.creatorName} /> -->
  <div>
    <div class="header-name">{config.creatorName}</div>
    <div class="header-tag">{config.creatorTagline}</div>
  </div>
</header>

<div class="page">
  {#if !showResult}
    <!-- Quiz Screen -->
    <div class="hero">
      <!-- <img src={config.creatorPhoto} alt={config.creatorName} class="hero-photo" /> -->
      <div class="hero-copy">
        <h1>{config.heroH1[0]}<span>{config.heroH1[1]}</span>{config.heroH1[2]}</h1>
        <p>{config.heroSubtext}</p>
        <div class="trust-pills">
          {#each config.trustPills as pill}
            <span class="trust-pill">{pill}</span>
          {/each}
        </div>
      </div>
    </div>

    <div class="progress-wrap">
      <div class="progress-fill" style="width: {progress}%"></div>
    </div>

    <div class="quiz-card">
      {#key current}
        <div class={slideDirection === 'back' ? 'q-slide-back' : 'q-slide'}>
          <div class="q-number">Question {current + 1}</div>
          <div class="q-text">{questions[current].text}</div>
          <div class="options">
            {#each questions[current].options as opt}
              <button
                class="option"
                class:selected={selected === opt.value}
                onclick={() => selectOption(opt.value)}
              >
                <div class="option-check"></div>
                <div class="option-label">{opt.label}</div>
              </button>
            {/each}
          </div>
        </div>
      {/key}
      <div class="nav">
        <button class="btn-back" style:visibility={current === 0 ? 'hidden' : 'visible'} onclick={prevQ}>
          ← Back
        </button>
      </div>
    </div>
  {:else}
    <!-- Result Screen -->
    <div class="result-hero">
      <!-- <img src={config.creatorPhoto} alt={config.creatorName} class="result-photo" /> -->
      <div><div class="result-badge">Your Match</div></div>
      <div class="result-card-name">{resultDisplay.name}</div>
      <div class="result-card-type">{resultDisplay.type}</div>
    </div>

    <div class="creator-take">
      <div class="creator-take-header">
        <!-- <img src={config.creatorPhoto} alt={config.creatorName} /> -->
        <span class="creator-take-name">{config.voiceLabel}</span>
      </div>
      <p>{config.redirectMessage}</p>
    </div>

    <div style="text-align:center; margin-top: 24px;">
      <div class="redirect-status">Taking you there now...</div>
    </div>
  {/if}
</div>

<footer class="powered-by">
  <a href="https://moneymatchup.com" target="_blank" rel="noopener">Powered by MoneyMatchup</a>
</footer>

<style>
  .header {
    width: 100%;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--accent);
  }
  .header-name {
    font-family: 'Inter Tight', sans-serif;
    font-weight: 800;
    font-size: 1rem;
    color: #111111;
    letter-spacing: -0.02em;
  }
  .header-tag {
    font-size: 0.72rem;
    color: var(--label);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .page {
    max-width: 760px;
    margin: 0 auto;
    padding: 48px 20px 80px;
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 48px;
    gap: 24px;
  }
  .hero-photo {
    width: 108px;
    height: 108px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--accent);
    box-shadow: 0 0 40px rgba(var(--accent-rgb), 0.1);
    flex-shrink: 0;
  }
  .hero h1 {
    font-family: 'Inter Tight', sans-serif;
    font-weight: 900;
    font-size: 2.6rem;
    line-height: 1.05;
    letter-spacing: -0.04em;
    color: var(--white);
    margin-bottom: 14px;
  }
  .hero h1 span { color: var(--label); }
  .hero p {
    font-size: 1rem;
    color: var(--muted);
    line-height: 1.65;
    max-width: 480px;
    margin: 0 auto;
  }

  @media (min-width: 600px) {
    .hero {
      flex-direction: row;
      text-align: left;
      align-items: center;
    }
    .hero p { margin: 0; }
  }

  .progress-wrap {
    height: 4px;
    background: var(--border-light);
    border-radius: 99px;
    margin-bottom: 32px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 99px;
    transition: width 0.35s ease;
  }

  .quiz-card {
    background: var(--card-bg);
    border: 1px solid var(--border-light);
    border-radius: 20px;
    padding: 36px;
    overflow: hidden;
  }

  .q-slide { animation: slideIn 0.28s ease forwards; }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .q-slide-back { animation: slideInBack 0.28s ease forwards; }
  @keyframes slideInBack {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .q-number {
    font-size: 0.72rem;
    color: var(--label);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 10px;
  }
  .q-text {
    font-family: 'Inter Tight', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    line-height: 1.25;
    color: var(--white);
    margin-bottom: 28px;
    letter-spacing: -0.025em;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 15px 18px;
    background: var(--dark3);
    border: 1.5px solid var(--border-light);
    border-radius: 12px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
    user-select: none;
    font-family: inherit;
    font-size: inherit;
    text-align: left;
    width: 100%;
  }
  .option:hover {
    border-color: var(--accent);
    background: rgba(var(--accent-rgb), 0.05);
    transform: translateY(-1px);
  }
  .option:active { transform: translateY(0); }
  .option.selected {
    border-color: var(--accent);
    background: var(--accent);
  }

  .option-check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--muted);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .option.selected .option-check {
    background: #000000;
    border-color: #000000;
  }
  .option.selected .option-check::after {
    content: '';
    width: 9px;
    height: 6px;
    border-left: 2.5px solid var(--accent);
    border-bottom: 2.5px solid var(--accent);
    transform: rotate(-45deg) translateY(-1px);
    display: block;
  }
  .option-label {
    font-size: 0.96rem;
    color: var(--text);
    line-height: 1.5;
    font-weight: 400;
  }
  .option.selected .option-label {
    color: var(--accent-text);
    font-weight: 600;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 28px;
  }
  .btn-back {
    background: none;
    border: 1.5px solid var(--border-light);
    color: var(--muted);
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 0.88rem;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .btn-back:hover {
    border-color: var(--muted);
    color: var(--text);
  }

  .result-hero {
    text-align: center;
    margin-bottom: 36px;
  }
  .result-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid var(--accent);
    margin-bottom: 20px;
  }
  .result-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(var(--accent-rgb), 0.1);
    border: 1px solid rgba(var(--accent-rgb), 0.35);
    color: var(--label);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 99px;
    margin-bottom: 20px;
  }
  .result-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }
  .result-card-name {
    font-family: 'Inter Tight', sans-serif;
    font-weight: 900;
    font-size: 2.4rem;
    line-height: 1.05;
    letter-spacing: -0.04em;
    color: var(--white);
    margin-bottom: 8px;
  }
  .result-card-type {
    font-size: 0.9rem;
    color: var(--label);
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .creator-take {
    background: rgba(var(--accent-rgb), 0.05);
    border: 1px solid rgba(var(--accent-rgb), 0.1);
    border-radius: 16px;
    padding: 22px 24px;
    margin-bottom: 20px;
  }
  .creator-take-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .creator-take-header img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid var(--accent);
  }
  .creator-take-name {
    font-family: 'Inter Tight', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    color: var(--label);
    letter-spacing: 0.02em;
  }
  .creator-take p {
    font-size: 0.94rem;
    color: #444444;
    line-height: 1.7;
  }

  .redirect-status {
    font-size: 0.85rem;
    color: var(--muted);
  }

  .trust-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .trust-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent);
    border: 1px solid var(--accent);
    color: var(--accent-text);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 99px;
    letter-spacing: 0.02em;
  }
  .trust-pill::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-text);
    flex-shrink: 0;
  }
  @media (min-width: 600px) {
    .trust-pills { justify-content: flex-start; }
  }
  @media (max-width: 599px) {
    .trust-pills { justify-content: center; }
  }

  .powered-by {
    text-align: center;
    padding: 24px 20px 40px;
    margin-top: 8px;
  }
  .powered-by a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #E03A3A;
    text-decoration: none;
    letter-spacing: 0.02em;
    opacity: 0.75;
    transition: opacity 0.15s;
  }
  .powered-by a:hover { opacity: 1; }
  .powered-by a::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #E03A3A;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    .page { padding: 32px 16px 60px; }
    .hero h1 { font-size: 2rem; }
    .quiz-card { padding: 24px 18px; }
    .q-text { font-size: 1.2rem; }
    .result-card-name { font-size: 1.9rem; }
  }
</style>
