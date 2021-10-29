import React from 'react';
import './Button.css'

const Button = (props) => {
    return(
        <div>
            <button onClick={() => 
                {
                    props.onClicar(props.symbol)
                }} style={{backgroundColor: props.backgroundColor || '#BBBBF2', width: props.width,}}>
                <p style={{color: props.color || '#745FF2'}}>{props.symbol}</p>
            </button>
        </div>
    )
}

export default Button;