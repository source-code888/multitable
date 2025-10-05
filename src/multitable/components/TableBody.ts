import type {ItemRow, TableActionsConfiguration} from "../interfaces/interfaces";
import type {HandleOnInputEventProps, HTMLInput, RowEntry, Schema} from "../types/types";
import {deleteButton} from "./DeleteButton.ts";
import {validateInput} from "../utils/utils.ts";

export class TableBody {
    private rows: ItemRow = {};
    private itemCount: number = 0;
    private readonly schema: Schema;
    private readonly cellWidth: string;
    private readonly handleRemoveItem: boolean;
    private readonly handleAppendItem: boolean;
    private readonly body: HTMLDivElement;
    private readonly actions: TableActionsConfiguration;
    private readonly callBackWhenAppend?: () => void;
    private readonly callBackWhenRemoved?: () => void;
    private lastRemoved: number = -1;
    private lastAppend: number = -1;

    public constructor(
        schema: Schema,
        cellWidth: string,
        handleRemoveItem: boolean,
        handleAppendItem: boolean,
        actions: TableActionsConfiguration,
        callBackWhenAppend?: () => void,
        callBackWhenRemoved?: () => void
    ) {
        this.schema = schema;
        this.cellWidth = cellWidth;
        this.handleRemoveItem = handleRemoveItem;
        this.handleAppendItem = handleAppendItem;
        this.body = document.createElement('div');
        this.body.className = 'multitable-body';
        this.callBackWhenAppend = callBackWhenAppend;
        this.callBackWhenRemoved = callBackWhenRemoved;
        this.actions = actions;
    }

    public appendRow() {
        if (!this.handleAppendItem) return;
        this.itemCount++;
        const id = this.itemCount;
        const row = document.createElement("div");
        row.className = "mtb-row";
        row.setAttribute("data-item-id", id.toString());
        for (const key in this.schema) {
            const container = document.createElement("div");
            container.className = this.schema[key].className ? this.schema[key].className : "mtb-r-container";
            container.style.width = this.schema[key].width ? this.schema[key].width : this.cellWidth;
            if (this.schema[key].height) container.style.height = this.schema[key].height;
            if (!this.schema[key].visible) container.style.display = 'none';
            let formElement: HTMLInput | HTMLSelectElement;
            if (this.schema[key].formElement) {
                const [input] = this.schema[key].formElement();
                formElement = input;
            } else{
                formElement = document.createElement('textarea');
            }
            formElement.className = 'mtb-r-input-cell';
            formElement.setAttribute("data-item-id", id.toString());
            formElement.setAttribute('name', `${key}-${id}`)
            formElement.disabled = this.schema[key].disabled || this.schema[key].calculated;
            if (formElement instanceof HTMLInputElement || formElement instanceof HTMLTextAreaElement) {
                if (this.schema[key].calculated) {
                    formElement.textContent = '0';
                }
                formElement.oninput = () => this.handleOnInput({input: formElement, key, id, regex: this.schema[key].regex});
            }
            container.appendChild(formElement);
            row.appendChild(container);
        }
        if (this.actions.visible) {
            const container: HTMLDivElement = document.createElement("div");
            container.className = this.actions.className ? this.actions.className : 'mtb-r-container';
            container.style.width = this.actions.width ? this.actions.width : this.cellWidth;
            if (this.actions.height) container.style.height = this.actions.height;
            if (this.actions.content) container.appendChild(this.actions.content());
            else {
                const button: HTMLButtonElement = deleteButton();
                button.onclick = () => this.removeRow(id);
                container.appendChild(button);
            }
            row.appendChild(container);
        }
        this.body.appendChild(row);
        this.lastAppend = id;
        this.callBackWhenAppend?.()
    }

    private handleOnInput({input, key, regex, id: itemId}: HandleOnInputEventProps) {
        const value = input.value;
        if (regex && !validateInput(input, regex)) return;
        if (!this.rows[itemId]) {
            const item: RowEntry<string | number> = {};
            item[key] = value;
            this.rows[itemId] = item;
            return;
        }
        this.rows[itemId][key] = value;
    }

    public getBodyHeight(): number {
        return this.body.clientHeight;
    }

    public setBodyHeight(value: number) {
        this.body.style.height = `${value}px`;
    }

    public removeRow(itemId: number): void {
        if (!this.handleRemoveItem) return;
        this.body.querySelector(`[data-item-id="${itemId}"]`)?.remove()
        if (this.rows[itemId]) {
            delete this.rows[itemId];
        }
        this.lastRemoved = itemId;
        this.callBackWhenRemoved?.()
    }

    public getLastRemoved(): number {
        return this.lastRemoved;
    }

    public getLastAppend(): number {
        return this.lastAppend;
    }

    public getBody(): HTMLDivElement {
        return this.body;
    }

    public getEachRowHeight(): number[] {
        const heights: number[] = [];
        const rows: NodeListOf<HTMLDivElement> = this.body.querySelectorAll('.mtb-row');
        rows.forEach(row => {
            heights.push(row.clientHeight)
        })
        return heights;
    }

    public setEachRowHeight(values: number[]) {
        const heights: number[] = values.reverse();
        const rows: NodeListOf<HTMLDivElement> = this.body.querySelectorAll('.mtb-row');
        rows.forEach(row => {
            const nextHeight = heights.pop();
            if (!nextHeight) return;
            row.style.height = `${nextHeight}px`;
        })
    }
}