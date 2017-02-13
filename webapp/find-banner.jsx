import React, { Component } from 'react';
import autoPlay from 'react-swipeable-views/lib/autoPlay';
import SwipeableViews from 'react-swipeable-views';
import Cache from './util/cache.jsx';
import guid from './util/guid';

import ImagePanoramaFishEye from 'material-ui/svg-icons/image/panorama-fish-eye';
import ImageLens from 'material-ui/svg-icons/image/lens';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

class FindBannel extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      sliders: [],
      index: 0,
    }
  }

  componentDidMount() {
    if (Cache.hasItem('find-banner-data') === true) {
      this.state.sliders = Cache.getItem('find-banner-data');
      this.setState(this.state);
    } else {
      let load = loadTips('加载中...');
      $.ajax({
        url: buildURL('find', 'getAllSlider'),
        type: 'POST',
        dataType: 'json',
        data: {param1: 'value1'},
      })
      .done(function(data) {
        this.state.sliders = data;
        Cache.setItem('find-banner-data', data);
      }.bind(this))
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        load.hide();
        this.setState(this.state);
      }.bind(this));
    }
  }

  render() {
    if (this.state.sliders.length <= 0) {
      return null;
    }
    return (
      <div
        style={styles.root}
      >
        <AutoPlaySwipeableViews
          style={styles.slider}
          resistance={true}
          autoplay={true}
          direction={'incremental'}
          interval={2500}
          index={this.state.index}
          onChangeIndex={(index) => {
            this.state.index = index;
            this.setState(this.state);
          }}
        >
          {this.state.sliders.map((slide) => (
            <div
              key={guid()}
              style={{
                boxSizing: 'border-box',
                backgroundImage: `url(${slide.src})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                width: '100%',
                height: 0,
                paddingBottom: 100 / 3 * 2 + '%',
              }}
            />
          ))}
        </AutoPlaySwipeableViews>
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            width: '100%',
            bottom: 16,
            zIndex: 2,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {this.getTouchDOM()}
        </div>
      </div>
    );
  }

  getTouchDOM() {
    let arr = [];
    for (let i = 0; i < this.state.sliders.length; i ++) {
      if (i == this.state.index) {
        arr.push(<ImageLens key={guid()} color={'#fff'} style={{width: 18, height: 18, paddingRignt: 2, paddingLeft: 2}} />);
      } else {
        arr.push(<ImagePanoramaFishEye key={guid()} color={'#fff'} style={{width: 14, height: 14, paddingRignt: 2, paddingLeft: 2}} />)
      }
    }
    return arr;
  }
}

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    height: 0,
    paddingBottom: 100 / 3 * 2 + '%',
    boxSizing: 'border-box',
    backgroundColor: '#ebebeb',
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  }
}

export default FindBannel;
