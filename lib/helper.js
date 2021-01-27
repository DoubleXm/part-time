class JSONResolve {
  success(msg = "success", code = 200) {
    return {
      msg,
      code,
    };
  }

  json(data, msg = "success", code = 200) {
    return {
      msg,
      code,
      data,
    };
  }
}

module.exports = new JSONResolve();
