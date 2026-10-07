window.DebtCG = (() => {
  const key = 'debt-daylight.godot-save.v1';
  let loaded = '{}';
  const domReady = document.readyState === 'loading'
    ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
    : Promise.resolve();
  const start = domReady.then(() => window.CrazyGamesIntegration.initialize()).then(() => {
    loaded = window.CrazyGames.SDK.data.getItem(key) || '{}';
    return true;
  });
  const integration = window.CrazyGamesIntegration;
  return {
    start,
    read: () => loaded,
    muted: () => window.CrazyGames.SDK.game.settings?.muteAudio === true || document.hidden,
    ready: () => { document.documentElement.dataset.cgReady = 'true'; integration.platform.sendMessage('game_ready'); },
    playing: active => { document.documentElement.dataset.cgGameplay = String(active); integration.platform.sendMessage(active ? 'level_resumed' : 'level_paused'); },
    save: value => { loaded = JSON.stringify(value); window.CrazyGames.SDK.data.setItem(key, loaded); }
  };
})();
