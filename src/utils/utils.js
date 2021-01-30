const formatResponse = ({ isSuccess = true, status = 200, data }) => {
  return {
    status,
    ...(isSuccess ? { data } : { error: data }),
  };
};

const checkIsUpdatesValid = (updatesKeys = [], allowedUpdates = []) => {
  return updatesKeys.every((update) => allowedUpdates.includes(update));
};

module.exports = { formatResponse, checkIsUpdatesValid };
