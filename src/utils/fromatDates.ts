const formatDate = (date: Date): string => {
  const d = new Date(date);
  return Intl.DateTimeFormat('pt').format(d);
};

export default formatDate;
