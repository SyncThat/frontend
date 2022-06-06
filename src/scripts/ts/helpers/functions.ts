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

    forSeconds = Math.floor(forSeconds);

    const seconds = forSeconds % 60;
    const minutesInSeconds = ( forSeconds % ( 60 * 60 ) ) - seconds;
    const minutes = minutesInSeconds / 60;
    const hours = Math.floor( forSeconds / (60 * 60) )
    const showHours = calculateHoursFor > (60 * 60);
    const hoursString = showHours ? hours + ':' : '';

    return hoursString + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

export function encodeHTML(html: string):string {
    const textArea = document.createElement('div');
    textArea.innerText = html;
    
    return textArea.innerHTML;
}


/**
 * Highlight certain tags
 * @param tags
 * @param message
 */
 export enum ReplaceTag {
	BRACKETS,
	UNDERSCORES,
	ASTERISKS,
}

function getRegexForTag(tag: ReplaceTag): RegExp {
    switch(tag) {
        case ReplaceTag.BRACKETS:
            return /\[(.+?)\]/g;
        case ReplaceTag.UNDERSCORES:
            return /_(.+?)_/g;
        case ReplaceTag.ASTERISKS:
            return /\*(.+?)\*/g;
        default:
            throw new Error("Invalid state");
    }
}

function getReplaceHtmlForTag(tag: ReplaceTag): string {
    switch (tag) {
        case ReplaceTag.BRACKETS:
            return '<span class="highlight">$1</span>'
        case ReplaceTag.UNDERSCORES:
            return '<span class="italic">$1</span>'
        case ReplaceTag.ASTERISKS:
            return '<span class="font-bold">$1</span>'
        default:
            throw new Error("Invalid state");
    }
}

 export function highlight(tags: ReplaceTag, message: string): string {
	const regex = getRegexForTag(tags);
	return message.replaceAll(regex, getReplaceHtmlForTag(tags));
}
