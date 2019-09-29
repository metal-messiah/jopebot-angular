const errorHandler = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => {
      return [err, null];
    });
};

export default errorHandler;
