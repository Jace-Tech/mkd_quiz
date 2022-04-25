exports.validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const reStartAndEnd = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g;

  if (re.test(email) && reStartAndEnd.test(email)) {
    return true;
  }
  return false;
};
