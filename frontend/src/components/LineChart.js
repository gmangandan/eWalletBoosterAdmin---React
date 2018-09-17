// import React, {Component} from 'react';
// import '../../node_modules/react-vis/dist/style.css';
// import {XYPlot, LineSeries} from 'react-vis';

// class LineChart extends Component {
    
//     formatCurrency = (val) => {        
//         return `$${val}`
//     }

//     formatPercent = (val) => {       
//         return `${val}%`
//     }

// 	render () {
   
//       const data = this.props.data;

//       const monthNames = ["January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//       ];

//       const today = new Date();
//       const m1 = monthNames[today.getMonth()-1] + ' ' + today.getFullYear();
//       const m2 = monthNames[today.getMonth()-2] + ' ' + today.getFullYear();
//       const m3 = monthNames[today.getMonth()-3] + ' ' + today.getFullYear();
//       const m4 = monthNames[today.getMonth()-4] + ' ' + today.getFullYear();
    
       

//         const myData = [            
//             {month: m1, data: [

//             ]},
//             {month: m2, data: [
                
//             ]},
//             {month: m3, data: [
                
//             ]},
//             {month: m4, data: [
                
//             ]},
//         ]
//         // console.log(m1)
//         // console.log(m2)
//         // console.log(m3)
//         // console.log(m4)
//        console.log(data)
        
//        // foreach month, map through data
//        // if data.month matches month, push the report to mydata.month

//        myData.forEach(obj => {
           
//           return data.map(report => {
//                if(report.month === obj.month) {
//                 //    console.log(obj)
//                     obj.data.push(report)                   
//                }
//                return report;
//            })
           
//        });

//         console.log(myData)

        
    

//       return (
//         <div>
//           <XYPlot height={300} width={800}>
//             {myData.map(month => {
//                 console.log(month)
//             })}
//             <LineSeries
//                 curve={null}
//                 data={[               
//                     {
//                         x: 1,
//                         y: 9.65425553300075
//                     },
//                     {
//                         x: 2,
//                         y: 9.576715203281763
//                     },
//                     {
//                         x: 3,
//                         y: 9.898355262116933
//                     },
//                     {
//                         x: 4,
//                         y: 9.764556714052867
//                     }
//                     ]}
//                 opacity={1}
//                 strokeStyle="solid"
//                 style={{}}
//             />
//             <LineSeries
//                 curve={null}
//                 data={[               
//                     {
//                         x: 1,
//                         y: 5.65425553300075
//                     },
//                     {
//                         x: 2,
//                         y: 6.576715203281763
//                     },
//                     {
//                         x: 3,
//                         y: 9.898355262116933
//                     },
//                     {
//                         x: 4,
//                         y: 7.764556714052867
//                     }
//                     ]}
//                 opacity={1}
//                 strokeStyle="solid"
//                 style={{}}
//             />
//             <LineSeries
//                 curve={null}
//                 data={[               
//                     {
//                         x: 1,
//                         y: 9.65425553300075
//                     },
//                     {
//                         x: 2,
//                         y: 9.576715203281763
//                     },
//                     {
//                         x: 3,
//                         y: 9.898355262116933
//                     },
//                     {
//                         x: 4,
//                         y: 9.764556714052867
//                     }
//                     ]}
//                 opacity={1}
//                 strokeStyle="solid"
//                 style={{}}
//             />
//           </XYPlot>
//         </div>
//       );
//     }
// }

// export default LineChart;

