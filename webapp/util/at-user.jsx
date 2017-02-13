let AtUser = (content, callHandle) => {
  if (typeof content.map == 'function') {
    let q = [];
    content.forEach((data) => {
      if (data) {
        q.push(AtUser(data, callHandle));
      }
    });
    return q;
  }

  if (typeof content == 'string') {
    content = content.split(/(@[\w\-\u4e00-\u9fa5]+)/);
    content.map((val, index) => {
      let one = val[0];
      let two = val[1];
      if (one === '@' && two !== ' ') {
        content[index] = callHandle(val);
      }
    });
  }

  return content;
};

export default AtUser;