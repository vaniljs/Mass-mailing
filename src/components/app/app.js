import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "./app.sass";
import Input from "../input";
import Inputfile from "../input-file";
import InputPhone from "../input-phone/input-phone";

export default class App extends Component {

    state = {
        error: false,
        sending: false,
        sended: false,
        mailToSend: [],
        messages: [],
        pause: false,
        speed: 15
    };

    handleSubmit = async (e) => {
        let arrEmails = this.state.mailToSend,
            speed = this.state.speed;
        e.preventDefault();
        if (!this.state.pause) {
            this.setState({
                sending: true
            });
            arrEmails.forEach((item, i) => {
                setTimeout(() => {
                    this.setState({
                        sending: true
                    });
                    let data = new FormData(document.forms.sendform);
                    data.append('to', item);
                    console.log(item);
                    fetch("http://эваполимер.рф/email-sender/send.php", {
                        method: "POST",
                        body: data
                    }).then( (res) => {
                        if (res.ok) {
                            this.setState({
                                sending: false,
                                sended: true
                            })
                            setTimeout( () => {
                                this.setState({
                                    sended: false
                                })
                            }, 2000)
                        } else if (res.status === 401) {
                            console.log("Oops! ");
                        }
                    }, function (e) {
                        console.log("Error submitting form!");
                    });
                    arrEmails.splice(0, 1);
                    this.setState({
                        mailToSend: arrEmails
                    });
                    console.log(this.state.mailToSend);
                }, speed * 1000 * ++i);
            });
        }
    };

    pauseSubmit = (e) => {
            e.preventDefault();
            this.setState({
                pause: !this.state.pause
            })
    };

    enterSpeed = (e) => {
        this.setState({
            speed: e.target.value
        })
    }

    setEmails = (e) => {
        this.setState({
            mailToSend: e.target.value.replace(' ', '').split(',')
        })
    }

    componentDidUpdate() {
        //console.log(this.state.mailToSend);
    }

    render() {
        let {pause, speed, sending, sended, mailToSend} = this.state;

        return (
            <div className="form_wrapper">
                <form
                    id="sendform"
                    encType="multipart/form-data"
                    method="POST">
                    <h1>Mass Email</h1>
                    <div className="row">
                        <div>
                            <p className="label_input">Кому отправить?</p>
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
                            <p className="label_input">От кого отправить?</p>
                            <Input
                                name="from"
                                placehold="mail@mail.ru"
                                val="a@a.ru"/>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">Тема письма</p>
                            <Input
                                name="theme"
                                placehold="Тема"
                                val="777"/>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">Сообщение</p>
                            <textarea
                                name="message"
                                rows="15"
                                defaultValue="777"
                                >
                            </textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">Файл</p>
                            <Inputfile required/>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <p className="label_input">Скорость отправки, сек</p>
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
                                {!sended && !sending && !pause  ? "Отправить" : false}
                                {sending && !pause ? <img className="img-loader" src="./img/bars.svg" alt=""/> : false}
                                {mailToSend && pause  ? "Пауза" : false}
                                {!mailToSend && sended && !pause ? "Отправлено!" : false}
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
