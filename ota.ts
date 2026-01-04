import { CapacitorUpdater } from '@capgo/capacitor-updater';

export const OtaService = {
  async checkForUpdates() {
    try {
      console.log('[OTA] Checking for updates from GitHub releases...');
      // Direct download from the 'latest' release tag. 
      // The plugin handles version checking internally by comparing the zip content or metadata if provided.
      // However, for this simple 'download' method, it generally just downloads. 
      // The robust way in the tutorial suggests download -> set.
      const result = await CapacitorUpdater.download({
        url: 'https://github.com/JaviDev-01/Wishly/releases/latest/download/update.zip'
      });

      if (result.version) {
        console.log(`[OTA] Update downloaded: ${result.version}`);
        await CapacitorUpdater.set(result);
        
        // Optional: Reload to apply immediately. 
        // Without this, it applies on next app restart.
        // await CapacitorUpdater.reload(); 
        console.log('[OTA] Update set as active.');
      }
    } catch (err) {
      console.log('[OTA] No update available or check failed', err);
    }
  }
};
