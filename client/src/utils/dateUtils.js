export const fullNameDate = (date) => {
  const createdAt = new Date(date);

  const formattedDate = createdAt.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return formattedDate
};
