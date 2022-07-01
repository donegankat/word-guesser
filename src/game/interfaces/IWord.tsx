interface IWordResultDetails {
    definition: string;
    partOfSpeech: string;

    typeOf?: string[];
    derivation?: string[];
    synonyms?: string[];
    antonyms?: string[];
    hasTypes?: string[];
    examples?: string[];
    inCategory?: string[];
    attribute?: string[];
    hasSubstances?: string[];
    usageOf?: string[];
}

interface IWordSyllableDetails {
    count: number;
    list: string[];
}

export default interface IWord {
    word: string;
    frequency?: number;
    results: IWordResultDetails[];
    syllables: IWordSyllableDetails;
    pronunciation?: {};
}