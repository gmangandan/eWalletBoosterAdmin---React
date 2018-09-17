import React, { Component } from 'react';
import Gauge from 'react-svg-gauge';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import axios from 'axios';
import 'rc-slider/assets/index.css';
const Handle = Slider.Handle;
class StepSlider extends Component {
    state = {
        value: 0,
        vipBonus: 0,
        membership_level: '',
        className: '',
        showText: true,
        staticText: '',
        staticTextHtml: '',
        className: '',
        color: '',
        couponBonus: 0,
        couBonus:0,
        vipPercentage: 0,
        totalBonus: 0,
        maxCashbackValue:1375
    }

    componentDidMount = () => {

        if (this.props.brand === 'Skrill') {
            this.setState({ color: '#811e68',maxCashbackValue:1375, couponBonus: 0.55,className : 'vip-level-1', membership_level: 'Not eligible for Skrill VIP' });
        } else if (this.props.brand === 'Neteller') {
            this.setState({ color: '#83ba3b',maxCashbackValue:1375, couponBonus: 0.55,className : 'vip-level-1', membership_level: 'Not eligible for NETELLER  VIP' });
        } else if (this.props.brand === 'Ecopayz') {
            this.setState({ color: '#1191cf',maxCashbackValue:3125, couponBonus: 0.65,className : 'vip-level-1', membership_level: 'Gold' });
        }    
        axios.get(`http://localhost:3000/api/statictext/${this.props.brand}`)
            .then(res => {
                this.setState({
                    staticText: res.data.accounts
                })
            })
            .catch(() => {
                this.setState({
                    hasError: true
                })
            })

    }

    handleChange(value) {
        let { membership_level, className, color, couponBonus, vipPercentage } = this.state;
        membership_level = 'Not eligible for Skrill VIP';
        className = 'vip-level-1'
        if (this.props.brand === 'Skrill') {
            couponBonus = 0.55;
            
            if (value >= 6000 && value < 15000) {
                membership_level = 'Bronze';
                className = 'vip-level-2'
            } else if (value >= 15000 && value < 45000) {
                membership_level = 'Silver';
                className = 'vip-level-3'
            } else if (value >= 45000 && value < 90000) {
                membership_level = 'Gold';
                className = 'vip-level-4'
            } else if (value >= 90000) {
                membership_level = 'Diamond';
                className = 'vip-level-5'
            }
        } else if (this.props.brand === 'Neteller') {
            if (value >= 825 && value < 4200) {
                membership_level = 'Bronze';
                className = 'vip-level-2';
                vipPercentage = 0.2;
            } else if (value >= 4200 && value < 8250) {
                membership_level = 'Silver';
                className = 'vip-level-3';
                vipPercentage = 0.2;
            } else if (value >= 8250 && value < 42200) {
                membership_level = 'Gold';
                className = 'vip-level-4';
                vipPercentage = 0.2;
            } else if (value >= 42200 && value < 170000) {
                membership_level = 'Platinum';
                className = 'vip-level-6';
                vipPercentage = 0.25;
            } else if (value >= 170000) {
                membership_level = 'Diamond';
                className = 'vip-level-5';
                vipPercentage = 0.50;
            }
        } else if (this.props.brand === 'Ecopayz') {
            if (value >= 0 && value < 50000) {
                membership_level = 'Gold';
                className = 'ecopayz-vip-level-2';
                couponBonus = 0.65;
            } else if (value >= 50000 && value < 100000) {
                membership_level = 'Platinum';
                className = 'ecopayz-vip-level-3';
                couponBonus = 0.85;
            } else if (value >= 100000 && value < 200000) {
                membership_level = 'Platinum';
                className = 'ecopayz-vip-level-4';
                couponBonus = 1.20;
            } else if (value >= 200000) {
                membership_level = 'Platinum';
                className = 'ecopayz-vip-level-5';
                couponBonus = 1.25;
            }
        }


        var vipBonus = (value * vipPercentage) / 100;
        var couBonus = (value * couponBonus) / 100;
        var totalBonus = (couBonus + vipBonus);
        this.setState({
            value: couBonus.toFixed(0),
            vipBonus: vipBonus.toFixed(0),
            staticTextHtml: this.generateRange(value),
            membership_level: membership_level,
            className: className, totalBonus: totalBonus.toFixed(2), couBonus: couBonus.toFixed(2)
        });

    }

    generateRange(value) {

        const { staticText } = this.state;
        let staticTextHtml = [];
        if (staticText.length > 0) {
            staticText.map(function (staticRow, i) {
                if ((staticRow.static_text_max_val === 0 || staticRow.static_text_max_val >= value) && (staticRow.static_text_min_val <= value || staticRow.static_text_min_val === 0)) {
                    staticTextHtml.push(<li className="rect-item  limit-visibility is-visible" data-min="45000" data-max="250000">
                        <div className="rect-content">{staticRow.static_text}</div>
                    </li>);
                }
            })
        }
        return (staticTextHtml)
    }

    handleTooltipChange = (props) => {

        const { value, dragging, index, ...restProps } = props;
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={`EUR ${value}`}
                visible={dragging}
                placement="top"
                key={index}
            >
                <Handle value={value} {...restProps} />
            </Tooltip>
        );

    }


    render() {
        const marks = {
            0: <strong>EUR 0</strong>,
            250000: {
                style: {
                    color: this.state.color,
                },
                label: <strong>EUR 250000</strong>,
            },
        };
        return (
    
                <div className="columns"   style={{ 'paddingTop': '3rem' }}>
                <div className="column"> 
                <div className="columns is-centered">
                <div className="column is-three-quarters gauge-sec"> 
                <Slider
                    marks={marks}
                    max={250000}
                    step={1}
                    onChange={this.handleChange.bind(this)}
                    handle={this.handleTooltipChange.bind(this)}
                    defaultValue={30}
                    trackStyle={{ backgroundColor: this.state.color, height: 10 }}
                    handleStyle={{
                        borderColor: this.state.color,
                        height: 28,
                        width: 28,
                        marginLeft: -14,
                        marginTop: -9,
                        backgroundColor: this.state.color,
                    }}
                    railStyle={{ backgroundColor: '#b8bdbd', height: 10 }}
                />

                <Gauge
                    value={this.state.value}
                    topLabelStyle={{ fontSize: 14, marginTop:500 }}
                    valueLabelStyle={{ fontSize: 50,color:this.state.color }}
                    width={400}
                    height={290}                   
                    max={this.state.maxCashbackValue}
                    minMaxLabelStyle={{color:this.state.color}}
                    color={this.state.color}
                    label="eWalletBooster  Cashback (EUR) " />

                    

                {
                    this.props.brand === 'Neteller' ?
                        <Gauge
                            value={this.state.vipBonus}
                            topLabelStyle={{ fontSize: 14 }}
                            valueLabelStyle={{ fontSize: 50 }}
                            width={400}
                            height={290}
                            max={2500}
                            color="#5c6478"
                            label="NETELLER VIP Rewards (EUR)" />
                        : ''
                }
                 </div>
                 </div>
                </div>
                <div className="column">

                <div className="fwid values-list">
                    <div className="mem-level">{this.props.brand} VIP Membership Level: <span className={`valuebox ${this.state.className}`}>{this.state.membership_level}</span></div>
                    <div className="mem-bonus-1">Monthly Bonus From eWalletBooster : <span className="valuebox prime-1" >{this.state.couBonus} EUR</span></div>
                    {
                        this.props.brand === 'Neteller' ?
                            <div className="mem-bonus-1">Monthly VIP Rewards Bonus From NETELLER : <span className="valuebox prime-2" >{this.state.vipBonus} EUR</span></div>
                            : ''
                    }

                    <div className="mem-bonus-total">Total Monthly eWalletBooster  & {this.props.brand} Bonus: <span className="valuebox" >{this.state.totalBonus} EUR</span></div>
                </div>
                <div className="fwid values-benefits">
                    <div className="mem-head-text"><h4>Your Benefits with Us</h4></div>
                    <div className="boxslist">
                        <ul className="no-style rect-list">
                            {this.state.staticTextHtml !== '' ? this.state.staticTextHtml : this.generateRange(0)}
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        )

    }
}




export default StepSlider;


