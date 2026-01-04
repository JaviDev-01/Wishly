import { CapacitorUpdater } from '@capgo/capacitor-updater';

export const OtaService = {
  async checkForUpdates() {
    try {
      console.log('[OTA] Checking for updates...');
      // alert('Buscando actualización...'); // Debug

      const result = await CapacitorUpdater.download({
        url: 'https://github.com/JaviDev-01/Wishly/releases/latest/download/update.zip',
        version: '' // Empty version allows the plugin to decide/generate one based on the zip content
      });

      console.log('[OTA] Download result:', result);

      if (result.version) {
        // alert(`Actualización encontrada: ${result.version}`); // Debug
        await CapacitorUpdater.set(result);
        
        // Force reload to apply the new version immediately
        // alert('Instalando actualización...'); // Debug
        // window.location.reload(); 
        // OR better:
        await CapacitorUpdater.reload();
      } else {
        // alert('No se encontró versión nueva en el ZIP.');
      }
    } catch (err) {
      console.error('[OTA] Error:', err);
      // alert(`Error OTA: ${JSON.stringify(err)}`);
    }
  }
};
