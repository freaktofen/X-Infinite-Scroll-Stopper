/*!
 * X Infinite Scroll Stopper
 * © 2026 freaktofen
 * License: AGPL-3.0
 */

const RULE_ID = 1;

const BLOCK_RULE = {
  id: RULE_ID,
  priority: 1,
  action: { type: "block" },
  condition: {
    urlFilter: "/graphql/",
    domains: ["x.com", "twitter.com"]
  }
};

async function enableBlock() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [BLOCK_RULE],
    removeRuleIds: []
  });
}

async function disableBlock() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [],
    removeRuleIds: [RULE_ID]
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg === "enable") enableBlock();
  if (msg === "disable") disableBlock();
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["auto", "enabled"], (res) => {
    if (res.auto && !res.enabled) {
      chrome.storage.local.set({ enabled: true });
      enableBlock();
    }
  });
});