export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const DEFAULT_PORTRAIT = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZTFlN2ViIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiNkZDVkNTQiLz48cGF0aCBkPSJNMjQgMzJjLTggMC0xNC02LTE0LTE0YzAtNiA1LTExIDExLTEyczExIDUgMTEgNWM1IDAgOSAyIDExIDV2OGMwIDUgNCA4IDggOHM4LTMgOC04di04YzAgLTMgNS01IDExLTVzMTEgNSAxMSA1YzYgMCAxNC02IDE0LTE0YzAtOCAtNi0xNC0xNC0xNHoiIGZpbGw9IiNkZTVkNTQiLz48L3N2Zz4=';
