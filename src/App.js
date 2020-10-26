import React, { Component } from "react";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
  }

  componentWillMount() {
    const pc_config = null;

    // const pc_config1 = {
    //   "iceServers": [
    //     {
    //       urls: 'stun:[STUN_IP]:[PORT]',
    //       'credentials': '[YOR CREDENTIALS]',
    //       'username': '[USERNAME]'
    //     }
    //   ]
    // }
    // create rtc connection between the peers
    this.pc = new RTCPeerConnection(pc_config);
    // triggered when a new candidate is returned
    this.pc.onicecandidate = (e) => {
      // send the candidates to the remote peer
      // see addCandidate below to be triggered on the remote peer
      if (e.candidate) console.log(JSON.stringify(e.candidate));
    };

    // triggered when there is a change in connection state
    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    // triggered when a stream is added to pc, see below - this.pc.addStream(stream)
    // this.pc.onaddstream = (e) => {
    //   this.remoteVideoref.current.srcObject = e.stream
    // }

    this.pc.ontrack = (e) => {
      this.remoteVideoref.current.srcObject = e.streams[0];
    };

    const constraints = { video: true };
    const success = (stream) => {
      this.localVideoRef.current.srcObject = stream;
    };

    const failure = (e) => {
      console.log(" media error", e);
    };

    // navigator.getUserMedia(constraints, success, failure);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure);
  }

  /* ACTION METHODS FROM THE BUTTONS ON SCREEN */

  createOffer = () => {
    console.log("Offer");

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
    // initiates the creation of SDP
    this.pc.createOffer({ offerToReceiveVideo: 1 }).then((sdp) => {
      console.log(JSON.stringify(sdp));

      // set offer sdp as local description
      this.pc.setLocalDescription(sdp);
    });
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
  // creates an SDP answer to an offer received from remote peer
  createAnswer = () => {
    console.log("Answer");
    this.pc.createAnswer({ offerToReceiveVideo: 1 }).then((sdp) => {
      console.log(JSON.stringify(sdp));

      // set answer sdp as local description
      this.pc.setLocalDescription(sdp);
    });
  };

  setRemoteDescription = () => {
    // retrieve and parse the SDP copied from the remote peer
    const desc = JSON.parse(this.textref.value);

    // set sdp as remote description
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  addCandidate = () => {
    // retrieve and parse the Candidate copied from the remote peer
    const candidate = JSON.parse(this.textref.value);
    console.log("Adding candidate:", candidate);

    // add the candidate to the peer connection
    this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  render() {
    return (
      <div>
        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: "black",
          }}
          ref={this.localVideoRef}
          autoPlay
        ></video>
        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: "black",
          }}
          ref={this.remoteVideoRef}
          autoPlay
        ></video>
        <br />

        <button onClick={this.createOffer}>Offer</button>
        <button onClick={this.createAnswer}>Answer</button>

        <br />
        <textarea
          ref={(ref) => {
            this.textref = ref;
          }}
        />

        <br />
        <button onClick={this.setRemoteDescription}>Set Remote Desc</button>
        <button onClick={this.addCandidate}>Add Candidate</button>
      </div>
    );
  }
}

export default App;
