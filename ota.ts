import { CapacitorUpdater } from '@capgo/capacitor-updater';

export const OtaService = {
  async checkForUpdates(): Promise<boolean> {
    try {
      console.log('[OTA] Checking for updates...');
      const result = await CapacitorUpdater.download({
        url: 'https://github.com/JaviDev-01/Wishly/releases/latest/download/update.zip',
        version: '' 
      });

      console.log('[OTA] Download result:', result);

      if (result.version) {
        await CapacitorUpdater.set(result);
        return true; // Update ready
      }
      return false;
    } catch (err) {
      console.error('[OTA] Error:', err);
      return false;
    }
  },

  async applyUpdate() {
    try {
      await CapacitorUpdater.reload();
    } catch (err) {
      console.error('[OTA] Failed to reload:', err);
    }
  }
};
