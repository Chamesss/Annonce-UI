export function calculateTimeAgo(dateString) {
    const currentDate = new Date();
    const createdDate = new Date(dateString);

    const timeDifference = currentDate.getTime() - createdDate.getTime();

    const yearsDifference = Math.floor(timeDifference / (1000 * 3600 * 24 * 365));
    const monthsDifference = Math.floor(timeDifference / (1000 * 3600 * 24 * 30));
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    const hoursDifference = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutesDifference = Math.floor((timeDifference / (1000 * 60)) % 60);

    if (yearsDifference >= 1) {
        return formatTimeAgo(yearsDifference, 'année', monthsDifference, 'moi');
    } else if (monthsDifference >= 1) {
        return formatTimeAgo(monthsDifference, 'moi', daysDifference, 'jour');
    } else if (daysDifference >= 1) {
        return formatTimeAgo(daysDifference, 'jour', hoursDifference, 'heure');
    } else if (hoursDifference >= 1) {
        return formatTimeAgo(hoursDifference, 'heure', minutesDifference, 'minute');
    } else {
        return formatTimeAgo(minutesDifference, 'minute');
    }
}

function formatTimeAgo(value, unit, nextValue, nextUnit) {
    const formattedValue = `${value} ${unit}${value !== 1 ? 's' : ''}`;
    if (nextValue !== undefined && nextUnit !== undefined) {
        const formattedNextValue = `${nextValue} ${nextUnit}${nextValue !== 1 ? 's' : ''}`;
        return `Il y a ${formattedValue}, ${formattedNextValue}`;
    }
    return `${formattedValue} ago`;
}
