const formatResponse = ({ isSuccess = true, status = 200, data }) => {
  return {
    status,
    ...(isSuccess ? { data } : { error: data }),
  };
};

module.exports = { formatResponse };
