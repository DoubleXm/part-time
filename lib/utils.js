const isPhone = (phone) => {
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
  return reg.test(phone);
};

module.exports = {
  isPhone,
};
