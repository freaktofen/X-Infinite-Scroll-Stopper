const statusEl = document.getElementById("status");
const toggleBtn = document.getElementById("toggle");
const reloadBtn = document.getElementById("reload");
const autoChk = document.getElementById("auto");

chrome.storage.local.get(["enabled","auto"], (res) => {
  updateUI(res.enabled ?? false);
  autoChk.checked = res.auto ?? false;
});

toggleBtn.onclick = () => {
  chrome.storage.local.get(["enabled"], (res) => {
    const next = !res.enabled;
    chrome.storage.local.set({ enabled: next });
    chrome.runtime.sendMessage(next ? "enable" : "disable");
    updateUI(next);
  });
};

autoChk.onchange = () => chrome.storage.local.set({ auto: autoChk.checked });

reloadBtn.onclick = async () => {
  const tabs = await chrome.tabs.query({ url: ["*://*.x.com/*","*://*.twitter.com/*"] });
  tabs.forEach(t => chrome.tabs.reload(t.id));
};

function updateUI(enabled) {
  if (enabled) {
    statusEl.textContent = "Status: STOPPED ⛔";
    toggleBtn.textContent = "Disable blocking";
    toggleBtn.className = "on";
  } else {
    statusEl.textContent = "Status: ALLOWED ▶";
    toggleBtn.textContent = "Enable blocking";
    toggleBtn.className = "off";
  }
}