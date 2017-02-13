const style = {
  body: {
    display: 'flex',
    width: '100%',
    height: 'auto',
    boxSizing: 'border-box',
    flexDirection: 'row-reverse',
    paddingTop: 12,
    paddingRight: 12,
    paddingLeft: 62,
  },
  AvatarBox: {
    paddingLeft: 16,
    minWidth: 40,
  },
  textBox: {
    backgroundColor: '#0096e5',
    borderRadius: 6,
    padding: 10,
    position: 'relative',
    maxWidth: '100%',
    color: '#fff'
  },
  AvPlayArrow: {
    position: 'absolute',
    top: 8,
    right: -14,
  },
  AvPlayArrowColor: '#0096e5',
  content: {
    width: '100%',
    // overflow: 'hidden',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
  }
};
export default style;