let formatURL2DOM = (content, callHandle) => {
  if (typeof content.map == 'function') {
    return content.map((val) => formatURL2DOM(val, callHandle));
  }

  if (typeof content == 'string') {
    if (content.match(/^https?:\/\/[^\s]+/ig) != null) {
      return callHandle(content);
    } else {
      content = content.split(/(https?:\/\/[^\s]+)/ig);
      if (content.length > 1) {
        return formatURL2DOM(content, callHandle);
      }
      return content[0];
    }
  }
  return content;
};

export default formatURL2DOM;