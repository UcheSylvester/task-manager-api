const formatResponse = ({ isSuccess = true, status = 200, data }) => {
  return {
    status,
    ...(isSuccess ? { data } : { error: data }),
  };
};

const checkIsUpdatesValid = (updatesKeys = [], allowedUpdates = []) => {
  return updatesKeys.every((update) => allowedUpdates.includes(update));
};

const JWT_SECRET_KEY = "JWT_AUTH_TOKEN";

module.exports = { formatResponse, checkIsUpdatesValid, JWT_SECRET_KEY };
