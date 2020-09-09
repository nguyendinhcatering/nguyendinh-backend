const formatNumber = (number, delimiter = ".") => {
  if (!number) {
    return number;
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
};

module.exports = exports = {
  formatNumber,
};
