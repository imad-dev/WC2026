export function getPlayerPhoto(player: any): string {
  // 1. Use stored URL if it exists
  if (player?.photo_url && player.photo_url.startsWith('http')) {
    return player.photo_url;
  }
  
  // 2. Fallback to country flag avatar based on nationality or team if passed
  const countryCode = player?.country_code || player?.nationality || 'xx';
  return `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
}
