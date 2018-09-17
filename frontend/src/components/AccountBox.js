import React, {Component} from 'react';
import Report from './Report';

class AccountBox extends Component {

    state = {
        active: false
    }
    
    toggleActive = () => {
        this.setState({
            active: !this.state.active
        })
    }

    render () {

        const brandLogo = {
            'Neteller': <img src={require('../assets/images/neteller_logo.jpeg')} alt="Neteller Logo"/>,
            'Skrill': <img src={require('../assets/images/skrill_logo.jpeg')} alt="Skrill Logo"/>,
            'Ecopayz': <img src={require('../assets/images/skrill_logo.jpeg')} alt="Skrill Logo"/>,
        }

        return (
            <div className="box">
                <article className="media">
                    <div className="media-left is-hidden-mobile">
                        <figure className="image is-64x64">
                           {brandLogo[this.props.brand]}
                        </figure>
                    </div>
                    <div className="media-content">
                        <div className="content">
                            <p>
                            <strong>{this.props.accountId}</strong>  <small>{this.props.country !== 'N/A' ? this.props.country: ''}</small>
                            <br />
                            {this.props.brand} account registered on {this.props.regDate}. Please note cashback is only valid from the time that you successfully joined the eWalletBooster scheme. Click below to view your monthly stats for this account.
                            </p>
                        </div>
                        <button className='button is-primary is-small ' style={{marginBottom: '1rem'}} onClick={this.toggleActive}>View stats</button>   
                        {
                            this.state.active ? 
                            <Report belongsTo={this.props.id} />
                            :
                            null
                        } 
                    </div>
                </article>
            </div>
        )
    }
}

export default AccountBox;