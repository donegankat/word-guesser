import * as React from 'react';

import styles from './Hints.module.scss';

interface IHintRevealer {
    value: string | number;
}

export default function HintRevealer(props: IHintRevealer) {
    const [isHintRevealed, setIsHintRevealed] = React.useState(false);
    
    return (isHintRevealed ?
        <span>{props.value}</span>
        :
        <button className={`btn ${styles.btnRevealHint} btn-light`} onClick={() => {setIsHintRevealed(true)}}>Reveal</button>
    );
}