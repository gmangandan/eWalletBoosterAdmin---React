import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';


class ReportChart extends Component {
    
    formatCurrency = (val) => {        
        return `$${val}`
    }

    formatPercent = (val) => {       
        return `${val}%`
    }

	render () {
   
      const data = this.props.data;
    
        return (
           <ResponsiveContainer width='95%' height={400}>
            <LineChart width={800} height={300} data={data}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}} >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month" padding={{left: 30, right: 30}}/>
                <YAxis yAxisId="left" tickFormatter={this.formatCurrency} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={this.formatPercent} />
                <Tooltip/>
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="cashback" stroke="#8884d8" activeDot={{r: 8}}/>
                <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#82ca9d" />
            </LineChart>
           </ResponsiveContainer>
        );
    }
}

export default ReportChart;