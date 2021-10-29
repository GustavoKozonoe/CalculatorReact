import React from 'react'
import './Display.css'

const Display = (props) => {
    return(
        <div>
            <div className="display">
                <h2>{props.oldCalculation}</h2>
                <h1>{props.numbers}</h1>
            </div>
        </div>
    )
}

export default Display;