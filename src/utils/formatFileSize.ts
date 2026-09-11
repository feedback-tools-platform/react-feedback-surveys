const UNITS = ['B', 'KB', 'MB', 'GB'];

/** Formats a byte count for the attachment caption (`"2.4 MB"`) */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  let value = bytes / 1024;
  let unitIndex = 1;

  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(value < 10 ? 1 : 0)} ${UNITS[unitIndex]}`;
};
