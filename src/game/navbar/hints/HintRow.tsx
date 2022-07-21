import React from "react";
import HintRevealer from "./HintRevealer";

import styles from './Hints.module.scss';

interface IHintRowProps {
    label: string;
    hintValue: string | number;
}

export default function HintRow(props: IHintRowProps) {
    return (
        <>
            {
                props.hintValue &&
                <div className={`${styles.hintRow} my-2`}>
                    <span className={styles.hintLabel}>{props.label}:&nbsp;</span>
                    <span className={styles.hintValue}><HintRevealer value={props.hintValue}></HintRevealer></span>
                </div>
            }
        </>
    );
}