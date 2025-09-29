import type {Schema} from "../types/types";
import type {TableConfiguration, TableFooterConfiguration} from "../interfaces/interfaces";
import {TableBody} from "./TableBody";

export class Table {
    protected readonly schema: Schema;
    protected readonly cellWidth: string;
    protected readonly handleAppendItem: boolean;
    protected readonly handleRemoveItem: boolean;
    protected readonly footerConfig: TableFooterConfiguration;
    protected getLastAppend?: () => number;
    protected getLastRemove?: () => number;
    protected callBackWhenAppend?: () => void;
    protected callBackWhenRemoved?: () => void;
    public getBodyHeight?: () => number;
    public setBodyHeight?: (height: number) => void;
    public setEachRowHeight?: (values: number[]) => void;
    public getEachRowHeight?: () => number[];
    public constructor(
        {
            schema,
            handleAppendItem,
            handleRemoveItem,
            footerConfig,
            callBackWhenAppend,
            callBackWhenRemoved,
        }: TableConfiguration
    ) {
        this.schema = schema;
        this.cellWidth = `${100 / Object.keys(this.schema).length}%`;
        this.handleAppendItem = handleAppendItem;
        this.handleRemoveItem = handleRemoveItem;
        this.footerConfig = footerConfig;
        this.callBackWhenAppend = callBackWhenAppend;
        this.callBackWhenRemoved = callBackWhenRemoved;
    }

    protected getHeader(): HTMLElement {
        const header = document.createElement("div");
        header.className = "multitable-header";
        for (const heading in this.schema) {
            const child: HTMLElement = document.createElement("div");
            child.innerHTML = this.schema[heading].title;
            child.style.width = this.cellWidth;
            child.className = "mtb-h-itm";
            header.appendChild(child)
        }
        const actions = document.createElement("div");
        actions.className = "mtb-h-itm";
        actions.style.width = this.cellWidth;
        actions.innerHTML = 'Actions';
        header.appendChild(actions);
        return header
    }
    protected getFooter(): HTMLElement {
        const footer = document.createElement("div");
        footer.className = "mtb-footer";
        if (this.footerConfig.personalized && this.footerConfig.contentIfPersonalized) {
            footer.append(this.footerConfig.contentIfPersonalized());
        } else {
            const button = document.createElement("button");
            button.className = "mtb-r-button";
            button.textContent = "Append element";
            button.setAttribute('id', 'appendItem')
            footer.appendChild(button);
        }
        return footer
    }

    public callLastAppend(): number{
        if (this.getLastAppend) {
            return this.getLastAppend();
        }
        return -1;
    }

    public callLastRemove(): number{
        if (this.getLastRemove) {
            return this.getLastRemove();
        }
        return -1;
    }


    public render(): HTMLElement {
        const tableBody: TableBody = new TableBody(
            this.schema,
            this.cellWidth,
            this.handleRemoveItem,
            this.handleAppendItem,
            this.callBackWhenAppend,
            this.callBackWhenRemoved,
        );
        this.getLastAppend = () => tableBody.getLastAppend();
        this.getLastRemove = () => tableBody.getLastRemoved();
        this.getBodyHeight = () => tableBody.getBodyHeight();
        this.setBodyHeight = (height: number) => tableBody.setBodyHeight(height);
        this.setEachRowHeight = (values: number[]) => tableBody.setEachRowHeight(values);
        this.getEachRowHeight = () => tableBody.getEachRowHeight();
        const container: HTMLElement = document.createElement("div");
        const footer: HTMLElement = this.getFooter();
        container.className = "multitable-child";
        container.append(this.getHeader())
        container.append(tableBody.getBody());
        container.append(footer);
        if (!this.footerConfig.personalized) {
            const button: HTMLButtonElement | null = footer.querySelector('#appendItem');
            if (button) button.onclick = () => tableBody.appendRow()
        }
        return container;
    }
}