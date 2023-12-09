import TimeAgo from 'javascript-time-ago';

// English
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

timeAgo.format(new Date());

const humanizeTimeAgo = (timestamp: string | Date) => timeAgo.format(new Date(timestamp));

export default humanizeTimeAgo;
