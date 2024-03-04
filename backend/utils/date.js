// Function to get date one month ago
export const getLastMonthDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  };