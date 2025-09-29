import type {RowEntry, Schema} from "../types/types";

export interface Entry {
    title: string;
    calculated: boolean;
    regex: RegExp;
    calculateWith?: string[];
    editable: boolean;
}

export interface ItemRow {
    [id: number]: RowEntry<string | number>;
}

export interface InnerItem extends ItemRow {
    count: number;
}

export interface GroupItemRow {
    [id: number]: InnerItem;
}

export interface TableFooterConfiguration {
    personalized: boolean;
    defaultButtonText: string;
    contentIfPersonalized?: () => HTMLElement;
}

export interface TableConfiguration {
    schema: Schema;
    handleAppendItem: boolean;
    handleRemoveItem: boolean;
    footerConfig: TableFooterConfiguration;
    callBackWhenRemoved?: () => void;
    callBackWhenAppend?: () => void;
}

export interface Configuration {
    leftConfig: TableConfiguration;
    rightConfig: TableConfiguration;
}