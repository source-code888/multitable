import type {RowEntry, Schema} from "../types/types";

export interface Entry {
    title: string;
    calculated: boolean;
    regex: RegExp;
    calculateWith?: string[];
    editable: boolean;
    className?: string;
    width?: string;
    height?: string;
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
    defaultButtonText?: string;
    contentIfPersonalized?: () => HTMLElement;
}

export interface TableActionsConfiguration {
    visible: boolean;
    width?: string;
    height?: string;
    className?: string;
    content?: () => HTMLElement;
    title?: string;
}

export interface TableConfiguration {
    schema: Schema;
    handleAppendItem: boolean;
    handleRemoveItem: boolean;
    footerConfig: TableFooterConfiguration;
    callBackWhenRemoved?: () => void;
    callBackWhenAppend?: () => void;
    actions: TableActionsConfiguration;
    width?: string;
    height?: string;
    className?: string;
    id?: string;
}

export interface Configuration {
    leftConfig: TableConfiguration;
    rightConfig: TableConfiguration;
}