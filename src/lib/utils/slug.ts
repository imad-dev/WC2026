export function slugify(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric with underscores
    .replace(/(^_|_$)/g, ''); // Remove leading or trailing underscores
}

export function createMatchSlug(home: string, away: string): string {
  if (!home || !away) return 'tbd_vs_tbd';
  return `${slugify(home)}_vs_${slugify(away)}`;
}
