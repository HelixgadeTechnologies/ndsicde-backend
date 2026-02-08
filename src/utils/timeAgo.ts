export function getTimeAgo(date: Date | string): string {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) > 1 ? 's' : ''} ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} week${Math.floor(seconds / 604800) > 1 ? 's' : ''} ago`;
    return `${Math.floor(seconds / 2592000)} month${Math.floor(seconds / 2592000) > 1 ? 's' : ''} ago`;
}
