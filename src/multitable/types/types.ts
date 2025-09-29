import type {Entry} from "../interfaces/interfaces";

export type Schema = {
    [key: string]: Entry;
}

export type RowEntry<T> = {
    [key: string]: T;
}
export type HandleOnInputEventTxtArea = {
    id: number;
    input: HTMLTextAreaElement;
    key: string,
    regex?: RegExp;
};
