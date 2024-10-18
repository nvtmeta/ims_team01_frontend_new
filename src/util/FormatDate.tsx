import moment from 'moment';

export const FormatDate = (dateString: string | number | Date, format = 'dd/mm/yyyy') => {
    const date = new Date(dateString || Date.now());
    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

export const FormatDateTimeRange = (dateRange: string) => {
    const [startDate, endDate] = dateRange?.split(" - ");
    const formattedStartDate = moment(startDate)?.format("DD/MM/YYYY HH:mm");
    const formattedEndDate = moment(endDate, "HH:mm:ss")?.format("HH:mm"); // Ensure endDate is parsed as a time string
    return `${formattedStartDate} – ${formattedEndDate}`;
};

export const FormatTime = (time: moment.MomentInput) => {
    return moment(time, 'HH:mm:ss').format('hh:mm A');
};
