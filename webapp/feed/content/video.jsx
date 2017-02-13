import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AVPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';

class FeedContentVideo extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    if (!this.props.video) {
      return null;
    } else if (this.props.video.type == 'ts') {
      return (
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            height: 0,
            paddingBottom: '56.25%',
            marginBottom: 12,
            backgroundColor: '#333',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <video
            controls="controls"
            poster={this.props.video.image}
            src={this.props.video.src}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            <source src={this.props.video.src} type={'video/mp4'} />
          </video>
        </div>
      );
    }
    return (
      <div
        style={{
          boxSizing: 'border-box',
          width: '100%',
          height: 0,
          paddingBottom: '56.25%',
          marginBottom: 12,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#333',
          backgroundImage: `url(${this.props.video.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        onTouchTap={this.handleOpen.bind(this)}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, .5)',
          }}
        >
          <AVPlayCircleOutline
            color={'#ebebeb'}
            style={{
              width: 64,
              height: 64,
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -32,
              marginLeft: -32,
            }}
          />
        </div>
        <Dialog
          open={this.state.open}
          modal={false}
          onRequestClose={this.handleClose.bind(this)}
          actions={[
            <FlatButton
              label="点击跳转"
              primary={true}
              href={this.props.video.link}
              target={'_blank'}
              onTouchTap={this.handleClose.bind(this)}
            />,
            <FlatButton
              label="不想去看"
              primary={true}
              onTouchTap={this.handleClose.bind(this)}
            />
          ]}
        >
          视频由第三方提供内容，是否要到第三方网站观看？
        </Dialog>
      </div>
    );
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  handleOpen() {
    this.setState({
      open: true
    });
  }
}

export default FeedContentVideo;