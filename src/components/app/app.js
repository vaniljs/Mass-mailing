import React, {Component} from 'react';
import "./app.sass";
import Input from "../input";
import Inputfile from "../input-file";

export default class App extends Component {

    state = {
        error: false,
        sending: false,
        sended: false,
        mailToSend: [],
        messages: [],
        pause: false,
        speed: 45
    };

    // sending message
    handleSubmit = async (e) => {
        e ? e.preventDefault() : false; // checking e if started from the pause button
        this.setState({
            sending: true
        });
        let arrEmails = this.state.mailToSend, // all email to send, we take it as a variable because then we delete the first element
            data = new FormData(document.forms.sendform);
        if (arrEmails.length && !this.state.pause) {
            data.append('to', arrEmails[0]); // append first email for sending
            fetch("./send.php", { // php script for mailing
                method: "POST",
                body: data
            }).then((res) => {
                if (res.ok) { // success sending
                    let dateTime = new Date(),
                    minit = dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes(),
                    second = dateTime.getSeconds() < 10 ? "0" + dateTime.getSeconds() : dateTime.getSeconds();
                    console.log(dateTime.getHours() + ":" + minit + ":" + second + "  " +  arrEmails[0]);
                    arrEmails.splice(0, 1); // delete first email
                    this.setState({
                        mailToSend: arrEmails,
                        sending: false,
                        sended: true
                    });
                    if (!this.state.pause && this.state.mailToSend.length) { // if have email, then sending following
                        this.setState({
                            sending: true,
                            sended: false
                        });
                        setTimeout(() => {
                            this.handleSubmit();
                        }, this.state.speed * 1000) // speed sending message
                    } else {
                        setTimeout(() => {
                            this.setState({
                                sended: false
                            })
                        }, 1000)
                    }
                }
            }, () => {
                console.log("Error submitting form!");
            });
        } else { // if there are no more email recipients
            this.setState({
                sending: false,
                sended: false
            })
        }
    };

    // pause sending messages
    pauseSubmit = (e) => {
        e.preventDefault();
            if (this.state.pause) {
                this.setState({
                    pause: false // for the sake of brevity can be done !this.state.pause, but I decided to specify more clearly
                })
            } else {
                this.setState({
                    pause: true
                })
                this.handleSubmit()
            }
    };

    enterSpeed = (e) => {
        this.setState({
            speed: e.target.value
        })
    }

    // set email list
    setEmails = (e) => {
        this.setState({
            mailToSend: e.target.value.replace(' ', '').split(',') // deleting spaces and slicing the array by commas
        })
    }

    render() {
        let {pause, speed, sending, sended, mailToSend} = this.state; // destructurization

        return (
            <div className="form_wrapper">
                <form
                    id="sendform"
                    encType="multipart/form-data"
                    method="POST">
                    <h1>Mass Email</h1>
                    <div className="row">
                        <div>
                            <p className="label_input">Who?</p>
                            <textarea
                                name="to" rows="7"
                                value={mailToSend}
                                onChange={this.setEmails}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">From?</p>
                            <Input
                                name="from"
                                placehold="mail@mail.ru"/>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">Theme</p>
                            <Input
                                name="theme"
                                placehold="Theme"/>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">Message</p>
                            <textarea
                                name="message"
                                rows="7"
                                defaultValue=""
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">File's</p>
                            <Inputfile required/>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">Speed sending, sec</p>
                            <Input
                                name="speed"
                                val={speed}
                                onChange={this.enterSpeed}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <button className="btn btn_send" onClick={this.handleSubmit}>
                                {!sending && !sended && !pause ? "Send" : false}
                                {sending && !sended && !pause ?
                                    <img className="img-loader" src="./img/bars.svg" alt=""/> : false}
                                {pause ? "Pause" : false}
                                {!sending && sended && !pause ? "Sended!" : false}
                            </button>
                            <button className="btn" onClick={this.pauseSubmit}>
                                {pause ? (
                                    <img src="./img/start.svg" className="pause-active" alt="" width="20px"/>
                                ) : (
                                    <img src="./img/stop.svg" alt="" width="20px"/>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
