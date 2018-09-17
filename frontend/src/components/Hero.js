import React from 'react';

export const Hero = (props) => { 
    return (       
        <section className={`hero ${props.color} is-bold`}>
            <div className="hero-body">
                <div className="container">
                <h1 className="title is-info">
                    {props.title}
                </h1>
                <h2 className="subtitle is-primary" >
                    {props.subtitle}
                </h2>                        
                </div>
            </div>
        </section>        
    )  
}



// style={{background: 'linear-gradient(to right bottom, #77C9D4, #57BC90)'}}