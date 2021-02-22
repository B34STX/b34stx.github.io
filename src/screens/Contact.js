import React from 'react';
import axios from 'axios';
import { API_URL, RECAPTCHA_API_TOKEN } from '../config';
import ReCAPTCHA from "react-google-recaptcha";

const emailexpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Contact extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            reason: 'no-reason',
            message: '',
            submited: false,
            nameClass: 'text',
            emailClass: 'text',
            messageClass: 'message',
            recaptchatoken: 'hold_on'
        }
        this.NameH = this.NameH.bind(this);
        this.EmailH = this.EmailH.bind(this);
        this.ReasonH = this.ReasonH.bind(this);
        this.MessageH = this.MessageH.bind(this);
        this.Submit = this.Submit.bind(this);
    }


    NameH(event) {
        this.setState({
            name: event.target.value,
            nameClass: 'text'
        });
    }
    EmailH(event) {
        this.setState({
            email: event.target.value,
            emailClass: 'text'
        });
    }
    ReasonH(event) {
        this.setState({ reason: event.target.value });
    }
    MessageH(event) {
        this.setState({
            message: event.target.value,
            messageClass: 'message'
        });
    }

    Submit() {
        if (this.state.name === '') {
            this.setState({ nameClass: 'text error' })
        } else if (!emailexpression.test(this.state.email.toLowerCase())) {
            this.setState({ emailClass: 'text error' })
        } else if (this.state.message === '') {
            this.setState({ messageClass: 'message error' })
        } else {
            var getEmailtime = localStorage.getItem('messageCount')
            this.captchaDemo.execute()
                .then(cb => {
                    if (getEmailtime === null) {
                        localStorage.setItem("messageCount", 1)
                    } else {
                        localStorage.setItem("messageCount", Number(getEmailtime) + 1)
                    }
                    this.setState({ submited: true })
                    axios.post(`${API_URL}/contact`, {
                        name: this.state.name,
                        email: this.state.email,
                        message: this.state.message,
                        reason: this.state.reason,
                        recaptcha_token: this.state.recaptchatoken,
                        totalmessage: localStorage.getItem('messageCount')
                    })
                        .then(res => {
                            console.log(res.data);
                            if (res.data.status) {
                                this.setState({ submited: 'sent' })
                            } else if (res.data.msg === "Recaptcha Error") {
                                this.setState({ submited: 're_error' })
                            }
                        })
                })
        }
    }

    componentDidMount() {
        document.title = `Contact | Tuhin`;
    }

    render() {
        return (
            <div className="contact">
                <div className="_form_">
                    <h1>Hello!</h1>
                    <h2>I'm
                </h2>
                    <input className={this.state.nameClass} name="name" type="text" value={this.state.name} onChange={this.NameH} />
                    <h2>and contacting you because,
                </h2>
                    <select name="reason" value={this.state.reason} onChange={this.ReasonH}>
                        <option value="no-reason">I wanted to say Hi</option>
                        <option value="job">I wanted to give you a Job</option>
                        <option value="product-query">Something Product Related</option>
                        <option value="appreciation">To appreciate your work</option>
                    </select>
                    <h2>Here is my email address:
                </h2>
                    <input className={this.state.emailClass} name="email" type="text" value={this.state.email} onChange={this.EmailH} />
                    <h2>I wanted to tell you this:
                </h2>
                    <textarea className={this.state.messageClass} value={this.state.message} onChange={this.MessageH}></textarea>
                    {!this.state.submited ? <button onClick={this.Submit} className="button">Send to Tuhin</button> : this.state.submited === 'sent' ? <button className="actionbutton">Sent 🎉</button> : this.state.submited === 're_error' ? <button className="actionbutton">Failed to Sent (ReCaptcha Error)</button> : <button className="actionbutton">Sending ☁</button>}
                </div>
                <ReCAPTCHA
                    ref={(captcha) => { this.captchaDemo = captcha; }}
                    size="invisible"
                    sitekey={RECAPTCHA_API_TOKEN}
                    onChange={(token) => {
                        this.setState({ recaptchatoken: token })
                    }}
                />
            </div>
        );
    }
}
