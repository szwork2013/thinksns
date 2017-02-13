let TagBuild2DOM = (content, callHandle) => {
  if (typeof content.map == 'function') {
    let q = [];
    content.forEach((data) => {
      if (data) {
        q.push(TagBuild2DOM(data, callHandle));
      }
    });
    return q;
  }

  if (typeof content == 'string') {
    content = content.split(/(\#[^#]\S*?\#)/ig);
    content = content.map((data) => {
      if (data.match(/\#[^#](\S*?)\#/ig) != null) {
        data = callHandle(data);
      }
      return data;
    });
  }

  return content;
};
export default TagBuild2DOM;