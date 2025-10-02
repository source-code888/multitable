import type {ItemRow, TableActionsConfiguration} from "../interfaces/interfaces";
import type {HandleOnInputEventTxtArea, RowEntry, Schema} from "../types/types";
import {deleteButton} from "./DeleteButton.ts";

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
            const textArea = document.createElement("textarea");
            textArea.className = 'mtb-r-input-cell'
            textArea.setAttribute("data-item-id", id.toString());
            textArea.setAttribute('name', `${key}-${id}`)
            const onValidate: HandleOnInputEventTxtArea = {
                key, id, input: textArea, regex: this.schema[key].regex,
            };
            textArea.oninput = () => this.handleOnInput(onValidate);
            textArea.onchange = () => this.handleOnInput(onValidate);
            textArea.onpaste = () => this.handleOnInput(onValidate);
            if (this.schema[key].calculated) {
                textArea.textContent = '0'
                textArea.disabled = true;
            }
            container.appendChild(textArea);
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

    private handleOnInput({input, key, regex, id: itemId}: HandleOnInputEventTxtArea) {
        const value = input.value;
        if (!this.validateInput(input, regex)) return;
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

    private validateInput(input: HTMLTextAreaElement, regex?: RegExp): boolean {
        if (regex && !regex.test(input.value)) {
            input.classList.add("error");
            input.parentElement?.classList.add("error");
            return false;
        } else if (input.classList.contains("error")) {
            input.classList.remove("error");
            input.parentElement?.classList.remove("error");
        }
        return true;
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