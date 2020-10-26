import React, { Component } from "react";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.localVideoRef = React.createRef();
  }

  render() {
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

    return (
      <div>
        <video ref={this.localVideoRef} autoPlay></video>
      </div>
    );
  }
}

export default App;
