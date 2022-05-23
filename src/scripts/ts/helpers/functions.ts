export default function formatDate(date:number) {
    if(date) {
        const formattedDate = new Date(date);

        return `${formattedDate.getHours()}:${('0' + formattedDate.getMinutes()).slice(-2)}`;
    } else {
        return false;
    }
}
