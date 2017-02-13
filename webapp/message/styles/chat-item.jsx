const style = {
  body: {
    display: 'flex',
    width: '100%',
    height: 'auto',
    boxSizing: 'border-box',
    flexDirection: 'row',
    paddingTop: 12,
    paddingRight: 62,
    paddingLeft: 12,
  },
  AvatarBox: {
    paddingRight: 16,
    minWidth: 40,
  },
  textBox: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    position: 'relative',
    maxWidth: '100%',
  },
  AvPlayArrow: {
    position: 'absolute',
    transform: 'rotateZ(180deg)',
    top: 8,
    left: -14,
  },
  AvPlayArrowColor: '#fff',
  content: {
    width: '100%',
    // overflow: 'hidden',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
  }
};
export default style;