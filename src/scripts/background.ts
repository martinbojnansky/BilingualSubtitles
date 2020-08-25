import { onMessage } from './shared/extension-helpers';

// Background.js file is used to provide communication between
// content_scripts of tabs.
chrome.runtime.onInstalled.addListener(() => {
  onMessage((m) => {});
});
