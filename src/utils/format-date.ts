export function formatDate(dateInput: Date) {
    const date = new Date(dateInput);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const time = date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    let prefix = '';
    if (isToday) {
        prefix = 'Hoy';
    } else if (isYesterday) {
        prefix = 'Ayer';
    } else {
        prefix = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
    }
    return `${prefix} · ${time}`;
}
