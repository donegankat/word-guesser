import React from "react";

interface ILetterRevealerProps {
    letters: string[];
}

export default function LetterRevealer(props: ILetterRevealerProps) {
    const [revealedLetters, setRevealedLetters] = React.useState<number[]>([]);

    const handleRevealLetter = (e: React.MouseEvent, letterIndex: number) => {
        setRevealedLetters(prevRevealed => [...prevRevealed, letterIndex]);
    }

    const loadUiElements = () => {
        const letterRevealButtons = [];

        for (var i = 0; i < props.letters.length; i++) {
            if (revealedLetters.indexOf(i) > -1) {
                letterRevealButtons.push(
                    <span key={`spn-reveal-letter${i}`} className="revealed-letter">{props.letters[i]}</span>
                );
            } else {
                letterRevealButtons.push(
                    buildRevealButton(i)
                );
            }
        }

        return letterRevealButtons;
    }

    const buildRevealButton = (letterIndex: number) => {
        return (
            <button key={`btn-reveal-letter${letterIndex}`} className="btn btn-reveal-hint btn-reveal-letter btn-light me-1" onClick={(e) => handleRevealLetter(e, letterIndex)}>Reveal {letterIndex + 1}</button>
        )
    }

    return (
        <>
            {loadUiElements()}
        </>
    )
}