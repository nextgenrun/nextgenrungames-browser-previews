/* Native CrazyGames v3 integration for the two Basic Launch submission copies. */
(() => {
  'use strict';
  const listeners = new Map();
  const events = { PAUSE_STATE_CHANGED: 'pause_state_changed', AUDIO_STATE_CHANGED: 'audio_state_changed' };
  let sdk, initialization, playing = false, requestedPlaying = false, loading = false;
  let lastGameplayStart = -Infinity, gameplayTimer;

  function emit(name, value) {
    for (const listener of listeners.get(name) || []) listener(value);
  }
  function audioState() { return sdk?.game.settings?.muteAudio !== true; }
  function gameplay(active) {
    if (!sdk || requestedPlaying === active) return;
    requestedPlaying = active;
    clearTimeout(gameplayTimer);
    if (active) {
      const start = () => {
        if (!requestedPlaying) return;
        sdk.game.gameplayStart();
        lastGameplayStart = Date.now();
        playing = true;
        document.documentElement.dataset.cgGameplay = 'playing';
      };
      // Native SDK throttles gameplayStart calls made less than one second apart.
      const delay = Math.max(0, 1000 - (Date.now() - lastGameplayStart));
      if (delay) gameplayTimer = setTimeout(start, delay);
      else start();
    } else {
      if (playing) sdk.game.gameplayStop();
      playing = false;
      document.documentElement.dataset.cgGameplay = 'stopped';
    }
  }
  function loadingState(active) {
    if (!sdk || loading === active) return;
    if (active) sdk.game.loadingStart();
    else sdk.game.loadingStop();
    loading = active;
  }
  function sendMessage(name) {
    if (name === 'level_started' || name === 'level_resumed') gameplay(true);
    else if (['level_completed', 'level_failed', 'level_paused'].includes(name)) gameplay(false);
    else if (name === 'in_game_loading_started') loadingState(true);
    else if (name === 'in_game_loading_stopped' || name === 'game_ready') loadingState(false);
    else if (name === 'player_got_achievement' && sdk) sdk.game.happytime();
  }
  const platform = {
    id: 'crazy_games',
    // These builds ship English text; other host locales fall back to English.
    language: 'en',
    get sdk() { return sdk; },
    get isAudioEnabled() { return audioState(); },
    on(name, listener) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(listener);
    },
    off(name, listener) { listeners.get(name)?.delete(listener); },
    sendMessage
  };
  const integration = {
    EVENT_NAME: events,
    platform,
    initialize() {
      if (initialization) return initialization;
      initialization = (async () => {
        const native = window.CrazyGames?.SDK;
        if (!native) throw new Error('CrazyGames SDK failed to load.');
        await native.init();
        if (native.environment === 'disabled') throw new Error('Open this build in the CrazyGames preview or on localhost.');
        sdk = native;
        document.documentElement.dataset.cgSdk = native.environment;
        document.documentElement.dataset.cgGameplay = 'stopped';
        loadingState(true);
        sdk.game.addSettingsChangeListener(() => emit(events.AUDIO_STATE_CHANGED, audioState()));
        document.addEventListener('visibilitychange', () => {
          emit(events.PAUSE_STATE_CHANGED, document.hidden);
          emit(events.AUDIO_STATE_CHANGED, audioState());
        });
        console.info('[CrazyGames] Native SDK ready:', native.environment);
        return true;
      })();
      return initialization;
    },
    storage: {
      async get(keys) {
        await integration.initialize();
        return keys.map(key => sdk.data.getItem(key));
      },
      async set(keys, values) {
        await integration.initialize();
        keys.forEach((key, index) => sdk.data.setItem(key, String(values[index])));
      },
      async delete(keys) {
        await integration.initialize();
        keys.forEach(key => sdk.data.removeItem(key));
      }
    },
    // Basic Launch has no advertising. Gameplay and normal rewards remain available.
    advertisement: {
      isInterstitialSupported: false,
      isRewardedSupported: false,
      showInterstitial: async () => false,
      showRewarded: () => false
    },
    // CrazyGames measures engagement through the native gameplay events above.
    analytics: { send: () => false }
  };
  // Preserve the games' existing adapter interface without importing Playgama Bridge.
  window.bridge = integration;
  window.CrazyGamesIntegration = integration;
})();
