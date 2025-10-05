import type {Entry} from "../interfaces/interfaces";
export type Schema = {
    [key: string]: Entry;
}
export type RowEntry<T> = {
    [key: string]: T;
}
export type HandleOnInputEventProps = {
    id: number;
    input: HTMLInput;
    key: string,
    regex?: RegExp;
};

export type HTMLInput = HTMLInputElement | HTMLTextAreaElement;

export type SelectOptions = {
    [value: string]: string
};