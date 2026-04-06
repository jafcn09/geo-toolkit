import { ExportOptions } from './interfaces';

export async function captureMapElement(element: HTMLElement, scale?: number): Promise<HTMLCanvasElement> {
  const html2canvas = (await import('html2canvas')).default;
  return html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    logging: false,
    ...(scale ? { scale } : {}),
  } as any);
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string, options?: Partial<ExportOptions>): void {
  const format = options?.format ?? 'png';
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpeg' ? (options?.quality ?? 90) / 100 : undefined;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, mimeType, quality);
}

export function canvasToDataUrl(canvas: HTMLCanvasElement, format?: 'png' | 'jpeg', quality?: number): string {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  return canvas.toDataURL(mimeType, quality);
}
