import React, {Component} from 'react';
import signalhub from 'signalhub';
import createSwarm from 'webrtc-swarm';
import './App.css';

class App extends Component {

    constructor() {
        super();
        this.state = {
            videoSubs: {},
        };
        this.videoRef = React.createRef()
    }

    subDisconnect = (swarm, videoSubs, callback) => {
        swarm.on('disconnect', function (peer, id) {
            if (videoSubs[id]) {
                delete videoSubs[id]
                callback(videoSubs)
            }
        })
    };

    subConnection = (swarm, videoSubs, callback) => {
        swarm.on('connect', function (peer, id) {
            if (!videoSubs[id]) {
                videoSubs[id] = {stream: peer.stream}
                callback(videoSubs)
            }
        });
    };

    addConnectionToState = (videoSubs) => {
        this.setState({videoSubs})
    };

    componentDidMount() {
        const location = window.location.pathname;
        // const hub = signalhub('my-game', [
        const hub = signalhub(location, [
            'https://signalhub-jccqtwhdwc.now.sh'
        ]);

        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
            this.videoRef.current.srcObject = stream
            const swarm = createSwarm(hub, {
                stream: stream
            });

            let {videoSubs} = this.state;
            this.subConnection(swarm, videoSubs, (newSubState) => this.addConnectionToState(newSubState));
            this.subDisconnect(swarm, videoSubs, (newSubState) => this.addConnectionToState(newSubState));

        });
    }

    render() {

        const videoSubList = Object.keys(this.state.videoSubs).map((id) => {
            const data = this.state.videoSubs[id];
            return <VideoSub {...data}/>
        });

        return (
            <div className="App">

                <div className="app__sublist">
                    {videoSubList}

                </div>

                <div className="app__selfvid">

                    <video className="app__videostream__self" ref={this.videoRef} autoPlay></video>
                </div>

            </div>
        );
    }
}


class VideoSub extends Component {
    constructor(props) {
        super(props)
        this.subRef = React.createRef()
    }

    componentDidMount() {
        this.subRef.current.srcObject = this.props.stream;
    }

    render() {
        return (

            <video className="app__videostream" ref={this.subRef} autoPlay></video>
        )
    }
}

export default App;
