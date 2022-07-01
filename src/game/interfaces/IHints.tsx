interface IHintDefinition {
    definition: string;
    partOfSpeech: string;
    
    synonyms?: string[];
    antonyms?: string[];
}

export default interface IHints {
    syllableCount: number;
    definitions: IHintDefinition[];

    frequencyOfOccurrence?: number;
}