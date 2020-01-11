import React from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import './FormStyle.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: [],
      name: "",
      message: "",
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  componentDidMount() {
    const socket = socketIOClient("wss://chatforum-server.herokuapp.com/");
    socket.on('message', (msg) => {
      console.log(msg);
      this.setState({ value: this.state.value.concat(msg) });
      var obj = document.getElementById("cboard");
      obj.scrollTop = obj.scrollHeight;
    });
  }

  submit = () => {
    if (this.state.name === "") {
      console.log("code here");
      const response = axios.post('https://chatforum-server.herokuapp.com/api/postData', {
        name: "anon",
        message: this.state.message,
      })
    }
    else {
      const response = axios.post('https://chatforum-server.herokuapp.com/api/postData', {
        name: this.state.name,
        message: this.state.message,
      })
    }
    this.setState({ message: "" });
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.submit();
    }
  }

  render() {
    return (
      <div>
        <div style={{ height: "5vh" }}>
          <center>
            <h2>
              IRC
            </h2>
          </center>
        </div>

        <div id="cboard" className="chatboard" style={{ overflow: "auto", color: "green"}}>
          {this.state.value.map(ids => (
            <div key={ids._id} style={{ fontSize: "20px" }}>
              {ids.name}>> {ids.message}
            </div>
          ))}
        </div>

        <div style={{ position: "fixed", bottom: "0", paddingBottom: "10px" }} onSubmit={() => this.submit()}>
          <input style={{ width: "15vw" }} autoFocus="true" type="text" placeholder="name" name="name" value={this.state.name} onChange={this.handleChange} />
          <input style={{ width: "55vw" }} autoFocus="true" onKeyDown={this._handleKeyDown} type="text" placeholder="message" name="message" value={this.state.message} onChange={this.handleChange} />
          <button type="submit" onClick={() => this.submit()}>
            Submit
          </button>
        </div>

      </div>
    );
  }
}

export default App;