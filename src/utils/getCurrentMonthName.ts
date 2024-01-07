const getCurrentMonthName = () => {
  const date = new Date();
  const month = date.getMonth();
  return ([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ] as const)[month];
};

export default getCurrentMonthName;
