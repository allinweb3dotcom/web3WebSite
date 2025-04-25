export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Get time difference in minutes
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  
  // Format date for older news
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};