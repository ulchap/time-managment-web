export const getDateAfterAWeek = () => {
    const today = new Date();
    let nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); 
    nextWeek.setHours(0,0,0,0);


    return nextWeek;

    // const day = nextWeek.getDate();
    // const month = nextWeek.getMonth() + 1;
    // const year = nextWeek.getFullYear();

    // return `${day}.${month}.${year}`;
}
