import React, {Component} from 'react';
import SwipeableViews from 'react-swipeable-views';
import guid from '../../util/guid';

class FeedContentImage extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      show: false,
    }
  }

  render() {
    let images = this.props.images;
    let count = images.length;
    let dom;

    if (count < 1) {
      return null;
    }

    switch (count) {
      case 1:
        dom = this.getImageDOM2One(images[0]);
        break;
      case 2:
        dom = this.getImageDOM2Tow(images);
        break;
      default :
        dom = this.getImages(images);
        break;
    }
    return (
      <div style={style.root}>
        {dom}
        <div
          style={this.state.show ? showImageStyle.root : {display: 'none'}}
          onTouchTap={() => {
            this.state.show = false;
            this.setState(this.state);
          }}
        >
          <SwipeableViews
            index={this.state.index}
            resistance={true}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
            containerStyle={{
              height: '100%',
              alignItems: 'center',
            }}
            threshold={10}
          >
            {images.map((image) => {
              let maxWidth = document.body.clientWidth;
              let maxHeight = document.body.clientHeight;
              let hRatio;
              let wRatio;
              let Ratio = 1;
              let w = image.width;
              let h = image.height;
              wRatio = maxWidth / w;
              hRatio = maxHeight / h;
              if (wRatio < 1 || hRatio < 1) {
                if (wRatio <= hRatio) {
                  Ratio = wRatio;
                } else {
                  Ratio = hRatio;
                }
              }
              if (Ratio < 1){
                w = w * Ratio;
                h = h * Ratio;
              }

              return (
                <div key={guid()} style={showImageStyle.itemBox}>
                  <img
                    src={this.state.show ? image.src : image.small}
                    style={{
                      width: w,
                      height: h,
                      backgroundImage: 'url("' + image.small + '")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>
              );
            })}
          </SwipeableViews>
        </div>
      </div>
    );
  }

  getImageDOM2One(image) {
    return (
      <div style={ontStyles.root}>
        <img style={ontStyles.img} src={image.small} onTouchTap={this.handleShowImages.bind(this, 0)} />
      </div>
    );
  }

  getImageDOM2Tow(images) {
    return (
      <div style={twoStyles.root}>
        {images.map((image, index) => (
          <div key={guid()} style={twoStyles.imgItem} onTouchTap={this.handleShowImages.bind(this, index)}>
            <img style={twoStyles.img} src={image.small} />
          </div>
        ))}
      </div>
    );
  }

  getImages(images) {
    return (
      <div style={imageStyle.root}>
        {images.map((image, index) => (
          <div key={guid()} style={imageStyle.imgItem} onTouchTap={this.handleShowImages.bind(this, index)}>
            <img style={twoStyles.img} src={image.small} />
          </div>
        ))}
      </div>
    );
  }

  handleShowImages(index) {
    if (this.state.show == true) {
      this.state.show = false;
    } else {
      this.state.show = true;
      this.state.index = index ? index : 0
    }
    this.setState(this.state);
  }

}

const showImageStyle = {
  root: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: '#000',
    padding: 0,
  },
  itemBox: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImg: {
    maxWidth: '100%',
    maxHeight: '100%',
  }
};

let _100_3 = 100 / 3;
const imageStyle = {
  root: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 12,
    boxSizing: 'border-box',
    paddingRight: 11,
    paddingLeft: 11,
  },
  imgItem: {
    width: _100_3 + '%',
    height: 0,
    paddingBottom: _100_3 + '%',
  }
}

const twoStyles = {
  root: {
    width: '100%',
    display: 'flex',
    marginBottom: 12,
    boxSizing: 'border-box',
    paddingRight: 11,
    paddingLeft: 11,
  },
  imgItem: {
    width: '50%',
    height: 0,
    paddingBottom: '50%',
  },
  img: {
    width: '100%',
    minHeight: '100%',
    boxSizing: 'border-box',
    padding: 1,
  }
}

const ontStyles = {
  root: {
    width: '100%',
    height: 0,
    overflow: 'hidden',
    paddingBottom: '56.25%',
    marginBottom: 12,
  },
  img: {
    width: '100%',
  }
}

const style = {
  root: {
    width: '100%',
    height: 'auto',
  },
}

export default FeedContentImage;
