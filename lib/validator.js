// 用户校验
const userValidate = {
  phone_number: { type: "string", required: true, allowEmpty: false },
  password: {
    type: "string",
    min: "6",
    max: "12",
    required: true,
    allowEmpty: false,
  },
  nick_name: { type: "string", min: "2", max: "10", required: false },
  real_name: { type: "string", max: "10", required: true, allowEmpty: false },
  age: { type: "int", max: 100, required: false },
  gender: { type: "enum", values: [0, 1, 2] },
  height: { type: "string", max: "10", required: false },
  school: { type: "string", max: "10", required: false },
  avatar: { type: "string", required: false },
  description: { type: "string", max: "120", required: false },
  experience: { type: "string", max: "120", required: false },
  autograph: { type: "string", max: "120", required: false },
};
// 用户反馈校验
const feedBackValidate = {
  image: { type: "string", required: false, allowEmpty: true },
  feedback: { type: "string", max: "120", required: true, allowEmpty: false },
};

// 宝典
const courseValidate = {
  title: { type: "string", required: true, allowEmpty: false, max: "20" },
  content: { type: "string", required: true, allowEmpty: false, max: "1500" },
};

// 门任务
const doorTaskValidate = {
  title: { type: "string", required: true, allowEmpty: false, max: "20" },
  task_detail: {
    type: "string",
    required: true,
    allowEmpty: false,
    max: "1500",
  },
  price: { type: "int", required: true, allowEmpty: false },
  surplus: { type: "int", required: true, allowEmpty: false },
  task_catetory: { type: "enum", values: [1, 2, 3, 4, 5] },
  content: { type: "string", required: true, allowEmpty: false, max: "30" },
  images: { type: "string", required: false, allowEmpty: true },
};

// 实习
const pricitceValidate = {
  category: {
    type: "enum",
    values: [
      "软件",
      "客服",
      "行政",
      "运营",
      "翻译",
      "销售",
      "人力",
      "导购",
      "传单",
      "礼仪",
      "仓管",
      "物流",
      "模特",
      "音乐",
      "咨询",
      "美术",
      "设计",
      "培训",
      "教育",
      "法律",
      "助理",
      "其他",
    ],
  },
  salary: { type: "int", required: true, allowEmpty: false },
  begin_time: { type: "int", required: true, allowEmpty: false },
  end_time: { type: "int", required: true, allowEmpty: false },
  shop_img: { type: "string", required: true, allowEmpty: false },
  shop_name: { type: "string", required: true, allowEmpty: false, max: "20" },
  post: { type: "string", required: true, allowEmpty: false, max: "10" },
  // 兼职模块与实习模块共用一张表
  company_auth: { type: "enum", values: [0, 1], required: false },
  address: { type: "string", required: false, allowEmpty: false },
};

module.exports = {
  userValidate,
  feedBackValidate,
  courseValidate,
  doorTaskValidate,
  pricitceValidate,
};
