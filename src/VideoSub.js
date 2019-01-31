import React, {Component} from 'react';

class VideoSub extends Component {
    render(){
        return (
            <video src={this.props.stream}></video>
        )
    } 
    
}

export default VideoSub;