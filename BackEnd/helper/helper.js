export function timeGenerator() {
    const now = new Date();

    // Get individual date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    // Format as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;
    return { formattedDate, year, month, day }
}