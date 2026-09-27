import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { reportFilename, reportHtml } from './report-document.mjs';

async function reportAsset(source, mime) {
  const asset = Asset.fromModule(source);
  if (Platform.OS === 'web') return new URL(asset.uri, window.location.href).href;
  await asset.downloadAsync();
  const uri = asset.localUri || asset.uri;
  // Android release assets may be resource names; the legacy reader resolves these.
  const bytes = Platform.OS === 'android'
    ? await readAsStringAsync(uri, { encoding: EncodingType.Base64 })
    : await new File(uri).base64();
  return `data:${mime};base64,${bytes}`;
}

export async function shareReport(records, shopName) {
  const date = new Date();
  const filename = reportFilename(shopName, date);
  const preview = Platform.OS === 'web' ? window.open('', '_blank') : null;
  if (Platform.OS === 'web' && !preview) throw new Error('Allow pop-ups to open and save your shop report.');
  try {
    const [logo, font] = await Promise.all([
      reportAsset(require('../assets/refurbtrack-logo.png'), 'image/png'),
      reportAsset(require('@expo-google-fonts/comfortaa/700Bold/Comfortaa_700Bold.ttf'), 'font/ttf'),
    ]);
    const html = reportHtml(records, shopName, { logo, font, date });
    if (preview) {
      preview.document.write(html);
      preview.document.close();
      await preview.document.fonts.ready;
      await Promise.all(Array.from(preview.document.images, image => image.decode()));
      preview.focus();
      preview.print();
      return;
    }
    const { uri } = await Print.printToFileAsync({ html, width: 595, height: 842 });
    const generated = new File(uri);
    // Keep each export separate so a second save cannot replace a file being shared.
    const folder = new Directory(Paths.cache, generated.name.replace(/\.pdf$/i, ''));
    folder.create({ idempotent: true });
    const report = new File(folder, filename);
    await generated.move(report);
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(report.uri, { mimeType: 'application/pdf', dialogTitle: 'Save shop report', UTI: 'com.adobe.pdf' });
    else await Print.printAsync({ uri: report.uri });
  } catch (error) {
    preview?.close();
    throw Object.assign(new Error('Could not save your shop report. Please try again. If it keeps happening, share the technical details with your developer.'), { cause: error, operation: 'Save shop report' });
  }
}
