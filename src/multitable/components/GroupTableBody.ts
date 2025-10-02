import type {GroupItemRow, InnerItem, TableActionsConfiguration} from "../interfaces/interfaces";
import type {Schema} from "../types/types";
import {deleteButton} from "./DeleteButton.ts";
import {appendButton} from "./AppendButton.ts";

export class GroupTableBody {
    private readonly body: HTMLDivElement;
    private rows: GroupItemRow = {};
    private readonly schema: Schema;
    private readonly cellWidth: string;
    private readonly handleRemoveItem: boolean;
    private readonly handleAppendItem: boolean;
    private readonly callBackWhenRemoved?: () => void;
    private readonly callBackWhenAppend?: () => void;
    private readonly actions: TableActionsConfiguration;

    public constructor(
        schema: Schema,
        cellWidth: string,
        handleRemoveItem: boolean,
        handleAppendItem: boolean,
        actions: TableActionsConfiguration,
        callBackWhenRemoved?: () => void,
        callBackWhenAppend?: () => void,
    ) {
        this.body = document.createElement("div");
        this.body.className = 'multitable-body';
        this.schema = schema;
        this.cellWidth = cellWidth;
        this.handleRemoveItem = handleRemoveItem;
        this.handleAppendItem = handleAppendItem;
        this.actions = actions;
        this.callBackWhenRemoved = callBackWhenRemoved;
        this.callBackWhenAppend = callBackWhenAppend;
    }

    private getNextItemId(id: number): number {
        let itemId = 1;
        if (!this.rows[id]) {
            const inner: InnerItem = {
                count: itemId
            };
            inner[itemId] = {}
            this.rows[id] = inner;
        } else {
            this.rows[id].count++;
            itemId = this.rows[id].count;
            this.rows[id][itemId] = {};
        }
        return itemId;
    }

    private getRowInputs(id: number): HTMLDivElement {
        const subItemId: number = this.getNextItemId(id);
        const row: HTMLDivElement = document.createElement("div");
        row.className = 'mtb-row';
        row.setAttribute('data-sub-item-id', subItemId.toString());
        for (const key in this.schema) {
            const container: HTMLDivElement = document.createElement("div");
            container.className = 'mtb-r-container';
            container.style.width = this.cellWidth;
            const textArea: HTMLTextAreaElement = document.createElement("textarea");
            textArea.className = 'mtb-r-input-cell';
            textArea.setAttribute('data-sub-item-id', subItemId.toString());
            textArea.setAttribute('name', `item-${id}-${key}-${subItemId}`);
            if (this.schema[key].calculated) {
                textArea.textContent = '0';
                textArea.disabled = true;
            }
            textArea.oninput = () => this.handleOnInput(textArea, id, subItemId, key, this.schema[key].regex);
            container.appendChild(textArea);
            row.appendChild(container);
        }
        if (this.actions.visible) {
            const container = document.createElement("div");
            container.className = this.actions.className ? this.actions.className : 'mtb-r-container';
            container.style.width = this.actions.width ? this.actions.width : this.cellWidth;
            if (this.actions.height) container.style.height = this.actions.height;
            if (this.actions.content) container.append(this.actions.content())
            else {
                const button: HTMLButtonElement = deleteButton();
                button.onclick = () => this.removeSubItem(id, subItemId);
                container.appendChild(button);
                row.appendChild(container);
            }
        }
        return row;
    }

    public appendRow(id: number) {
        if (!this.handleAppendItem) return;
        const container: HTMLDivElement = document.createElement("div");
        container.setAttribute('data-item-id', id.toString());
        container.className = 'mtb-outer-row';
        const row: HTMLDivElement = this.getRowInputs(id);
        const footer: HTMLDivElement = document.createElement("div");
        footer.className = 'mtb-row-footer';
        container.appendChild(row);
        container.appendChild(footer);
        this.body.appendChild(container);
        const button: HTMLButtonElement = appendButton();
        button.style.width = '100%';
        footer.appendChild(button);
        button.onclick = () => {
            const item: HTMLDivElement = this.getRowInputs(id);
            container.insertBefore(item, footer);
            this.callBackWhenAppend?.()
        };
    }


    public handleOnInput(input: HTMLTextAreaElement, itemId: number, subId: number, key: string, regex?: RegExp,) {
        if (!this.validateInput(input, regex)) return;
        this.rows[itemId][subId][key] = input.value;
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

    public removeRow(id: number) {
        if (!this.handleRemoveItem) return;
        this.body.querySelector(`div[data-item-id="${id}"]`)?.remove();
        if (this.rows[id]) {
            delete this.rows[id];
        }
    }

    private removeSubItem(itemId: number, subItemId: number) {
        if (!this.handleRemoveItem || !this.rows[itemId]) return;
        if (this.rows[itemId][subItemId]) {
            delete this.rows[itemId][subItemId];
        }
        this.body.querySelector(`div[data-item-id="${itemId}"] .mtb-row[data-sub-item-id="${subItemId}"]`)?.remove()
        this.callBackWhenRemoved?.()
    }

    public getBody(): HTMLDivElement {
        return this.body;
    }

    public getBodyHeight(): number {
        return this.body.clientHeight;
    }

    public getEachRowHeight(): number[] {
        const heights: number[] = [];
        const rows: NodeListOf<HTMLDivElement> = this.body.querySelectorAll('.mtb-outer-row');
        rows.forEach(row => {
            heights.push(row.clientHeight);
        })
        return heights;
    }

    public setBodyHeight(height: number): void {
        this.body.style.height = `${height}px`;
    }
}