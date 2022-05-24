export function formatDate(date:number) {
    if(date) {
        const formattedDate = new Date(date);

        return `${formattedDate.getHours()}:${('0' + formattedDate.getMinutes()).slice(-2)}`;
    } else {
        return false;
    }
}

/**
 * Create a duration string based on the given seconds.
 * In case you have a number that you're working towards, you can pass the
 *  second argument to determine whether the hours should be shown.
 *
 * Example: current second is 10, withHoursIf is a number bigger than 1 hour in seconds,
 *  the output will be 0:00:10.
 *
 * @param forSeconds The seconds that should be calculated
 * @param withHoursIf Optional seconds that determines if hours should be output (they will if the number is bigger than 1 hour). Uses first param if left empty.
 */
export function formatDurationString(forSeconds: number, withHoursIf?: number): string {
    const calculateHoursFor = withHoursIf === undefined ? forSeconds : withHoursIf;

    const seconds = forSeconds % 60;
    const minutesInSeconds = ( forSeconds % ( 60 * 60 ) ) - seconds;
    const minutes = minutesInSeconds / 60;
    const hours = Math.floor( forSeconds / (60 * 60) )
    const showHours = calculateHoursFor > (60 * 60);
    const hoursString = showHours ? hours + ':' : '';

    return hoursString + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}
