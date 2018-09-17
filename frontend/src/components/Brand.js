import React from 'react';
import Steps from './Steps';
import {Hero} from './Hero';
import * as helpers from '../utils/api.queries';


export const Brand = (props) => {  
    
    const brandProperties = {
        'skrill': {
            accLength: '8-9',
            accountImg: <img src={require('../assets/images/skrill_acc_id.png')} alt="eWalletBooster" />,
            color: 'is-danger',
            link: 'https://www.skrill.com/en/'            
        },
        'neteller': {
            accLength: '12',
            accountImg: <img src={require('../assets/images/neteller_acc_id.png')} alt="eWalletBooster"/>,
            color: 'is-black',
            link: 'https://www.neteller.com/en'
        },
        'ecopayz': {
            accLength: '10',
            accountImg: <img src={require('../assets/images/ecopayz_acc_id.png')} alt="eWalletBooster"/>,
            color: 'is-dark',
            link: 'https://www.ecopayz.com/en/'
        }
    }

    const brandName = helpers.formatBrandName(props.match.params.brand_name); 
    const lowerBrandName = props.match.params.brand_name;   
    
    return (
        <div className='container'>
        <Hero title={brandName} subtitle={'Application'} color={`${brandProperties[lowerBrandName].color}`}  />
            <article className={`message ${brandProperties[lowerBrandName].color}`} style={{marginTop: '0.5rem'}}>
                <div className="message-body">
                    <Steps brand={brandName} brandProps={brandProperties[lowerBrandName]} />
                </div>
            </article>
        </div>
    )
}