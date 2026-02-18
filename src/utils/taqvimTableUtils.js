import dayjs from "dayjs";

export const weekDays = {
    Mon: 'Dushanba',
    Tue: 'Seshanba',
    Wed: 'Chorshanba',
    Thu: 'Payshanba',
    Fri:'Juma',
    Sat:'Shanba',
    Sun:'Yakshanba'
}
export const months = {
    Mar: 'Mart',
    Apr:'Aprel',
    Feb: 'Fevral'
}
export function getComputedTime (date, filter, {hour, minute}, type) {
    const taqvimTime = dayjs(date).hour(hour).minute(minute)
    const manipulatingMinutes = type === 'MORNING' ? filter?.morning : filter?.evening

    if(filter) {
        if(filter?.addMinute) {
            return taqvimTime.add(manipulatingMinutes, 'minute').format('HH:mm');
        } else {
            return taqvimTime.subtract(manipulatingMinutes, 'minute').format("HH:mm");
        }
    }

    return taqvimTime.format('HH:mm')
}

export function getWeekdayAndMonth(date) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const locale = 'en-US'; // You can change this to your preferred locale

    const formattedDate = new Date(date).toLocaleString(locale, options);

    const [weekday, month, day, year] = formattedDate.replace(',', '').split(' ');
    return { weekday: weekDays[weekday], month: months[month], day: day.replace(',', ' - '), year };
}

