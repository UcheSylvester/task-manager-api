const formatResponse = ({ isSuccess = true, status = 200, data }) => {
  return {
    status,
    ...(isSuccess ? { data } : { error: data }),
  };
};

const checkIsUpdatesValid = (body = {}, allowedUpdates = []) => {
  const updatesKeys = Object.keys(body);

  return updatesKeys.every((update) => allowedUpdates.includes(update));
};

module.exports = { formatResponse, checkIsUpdatesValid };
