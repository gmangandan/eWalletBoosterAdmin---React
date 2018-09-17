import React, {Component} from 'react';
import axios from 'axios';

class ContactBox extends Component {

    state = {
        name: '',
        email: '',
        subject: '',
        message: '',
        submitted: false
    }

    componentDidMount = () => {
        if (this.props.name && this.props.email) {
            this.setState({
                name: this.props.name,
                email: this.props.email
            })
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps !== this.props) {
            if (this.props.name && this.props.email) {
                this.setState({
                    name: this.props.name,
                    email: this.props.email
                })
            }
        }        
    }

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {name, email, subject, message} = this.state;
        axios.post('http://localhost:3000/email/contact', {name, email, subject, message})
        .then((res) => {
            if (res.data.success) {
                this.setState({
                    submitted: true
                })
            }            
        })
    }

    render () {

        const defaultName = this.props.name ? this.props.name : null;
        const defaultEmail = this.props.email ? this.props.email : null;

        return (
            <div>
                {
                    this.state.submitted === false &&
                    <div>
                    <div className="field">
                        <label className="label">Name</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="text" placeholder="Your name" defaultValue={defaultName} name='name' onChange={this.handleInputChange} />
                            <span className="icon is-small is-left">
                                <i className="fa fa-user"></i>
                            </span>
                        </div>
                    </div>            

                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="email" placeholder="Your email address" defaultValue={defaultEmail} name='email' onChange={this.handleInputChange} />
                            <span className="icon is-small is-left">
                            <i className="fa fa-envelope"></i>
                            </span>
                        </div>                
                    </div>

                    <div className="field">
                    <label className="label">Subject</label>
                    <div className="control">
                        <div className="select">
                        <select name='subject' onChange={this.handleInputChange} >
                            <option>Select</option>
                            <option>Account</option>
                            <option>Payment</option>
                            <option>Application</option>
                            <option>General</option>
                            <option>Feedback</option>                       
                        </select>
                        </div>
                    </div>
                    </div>

                    <div className="field">
                        <label className="label">Message</label>
                        <div className="control">
                            <textarea className="textarea" placeholder="Please enter your message" name='message' onChange={this.handleInputChange} ></textarea>
                        </div>
                    </div>

                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button is-primary" onClick={this.handleSubmit}>Submit</button>
                        </div>
                        <div className="control">
                            <button className="button is-text">Cancel</button>
                        </div>
                    </div>
                    </div>
                }
                
                {
                    this.state.submitted === true &&
                    <div className='notification is-link' style={{ display: 'flex', alignItems: 'center', padding: '2rem', marginTop: '1rem'}}>                
                        <div>
                            <p>Thank you for submitting your enquiry. We aim to respond to all enquiries within 24-48 hours. Please contact us via livechat for a faster response.</p> 
                        </div>                           
                    </div>
                }        

            </div>
        )
    }
}

export default ContactBox;