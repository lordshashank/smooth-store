export function formatFileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB"];
  return `${(size / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
