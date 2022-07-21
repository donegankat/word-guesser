interface IHintDefinition {
    definition: string;
    partOfSpeech: string;
    
    synonyms?: string[];
    antonyms?: string[];
}

export interface IHintWordFrequency {
    frequencyOfOccurrence: number;
    frequencyDescription: string;
}

export default interface IHints {
    syllableCount: number;
    definitions: IHintDefinition[];

    wordFrequency?: IHintWordFrequency;
}