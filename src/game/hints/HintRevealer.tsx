import * as React from 'react';

interface IHintRevealer {
    value: string | number;
}

export default function HintRevealer(props: IHintRevealer) {
    const [isHintRevealed, setIsHintRevealed] = React.useState(false);
    
    return (isHintRevealed ?
        <span>{props.value}</span>
        :
        <button className="btn btn-reveal-hint" onClick={() => {setIsHintRevealed(true)}}>Reveal</button>
    );
}