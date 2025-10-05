import type {Schema} from "../types/types";
import type {TableActionsConfiguration, TableConfiguration, TableFooterConfiguration} from "../interfaces/interfaces";
import {TableBody} from "./TableBody";
import {appendButton} from "./AppendButton.ts";

export class Table {
    protected readonly schema: Schema;
    protected readonly cellWidth: string;
    protected readonly handleAppendItem: boolean;
    protected readonly handleRemoveItem: boolean;
    protected readonly footerConfig: TableFooterConfiguration;
    protected readonly id?: string;
    protected readonly className?: string;
    protected readonly width?: string;
    protected readonly height?: string;
    protected readonly actions: TableActionsConfiguration;
    protected header?: HTMLDivElement;
    protected footer?: HTMLDivElement;
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
            width,
            height,
            className,
            id,
            actions
        }: TableConfiguration
    ) {
        this.schema = schema;
        this.cellWidth = `${100 / Object.keys(this.schema).length}%`;
        this.handleAppendItem = handleAppendItem;
        this.handleRemoveItem = handleRemoveItem;
        this.footerConfig = footerConfig;
        this.className = className;
        this.width = width;
        this.height = height;
        this.id = id;
        this.actions = actions;
        this.callBackWhenAppend = callBackWhenAppend;
        this.callBackWhenRemoved = callBackWhenRemoved;
    }

    protected createHeader(): void {
        this.header = document.createElement("div");
        this.header.className = "multitable-header";
        for (const key in this.schema) {
            const child: HTMLElement = document.createElement("div");
            child.textContent = this.schema[key].title.toUpperCase();
            child.style.width = this.schema[key].width ? this.schema[key].width : this.cellWidth;
            if (this.schema[key].height) child.style.height = this.schema[key].height;
            child.className = "mtb-h-itm";
            if (!this.schema[key].visible) child.style.display = 'none';
            this.header.appendChild(child);
        }
        if (this.actions.visible) {
            const actions = document.createElement("div");
            actions.className = "mtb-h-itm";
            actions.style.width = this.actions.width ? this.actions.width : this.cellWidth;
            if (this.actions.height) actions.style.height = this.actions.height;
            actions.textContent = this.actions.title ? this.actions.title.toUpperCase() : 'ACTIONS';
            this.header.appendChild(actions);
        }
    }

    protected createFooter(): void {
        this.footer = document.createElement("div");
        this.footer.className = "mtb-footer";
        if (this.footerConfig.personalized && this.footerConfig.contentIfPersonalized) {
            this.footer.append(this.footerConfig.contentIfPersonalized());
        } else {
            const button = appendButton();
            button.style.width = '100%';
            button.setAttribute('id', 'appendItem')
            this.footer.appendChild(button);
        }
    }

    public callLastAppend(): number {
        if (this.getLastAppend) {
            return this.getLastAppend();
        }
        return -1;
    }

    public callLastRemove(): number {
        if (this.getLastRemove) {
            return this.getLastRemove();
        }
        return -1;
    }

    public getHeaderHeight(): number {
        return this.header ? this.header.clientHeight : 0;
    }

    public setHeaderHeight(height: number): void {
        if (this.header)
            this.header.style.height = `${height}px`;
    }

    public getFooterHeight(): number {
        return this.footer ? this.footer.clientHeight : 0;
    }

    public setFooterHeight(height: number): void {
        if (this.footer)
            this.footer.style.height = `${height}px`;
    }


    public render(): HTMLElement {
        const tableBody: TableBody = new TableBody(
            this.schema,
            this.cellWidth,
            this.handleRemoveItem,
            this.handleAppendItem,
            this.actions,
            this.callBackWhenAppend,
            this.callBackWhenRemoved
        );
        this.createHeader();
        this.createFooter();
        this.getLastAppend = () => tableBody.getLastAppend();
        this.getLastRemove = () => tableBody.getLastRemoved();
        this.getBodyHeight = () => tableBody.getBodyHeight();
        this.setBodyHeight = (height: number) => tableBody.setBodyHeight(height);
        this.setEachRowHeight = (values: number[]) => tableBody.setEachRowHeight(values);
        this.getEachRowHeight = () => tableBody.getEachRowHeight();
        const container: HTMLElement = document.createElement("div");
        container.className = this.className ? this.className : "multitable-child";
        if (this.id) container.id = this.id;
        if (this.width) container.style.width = this.width;
        if (this.height) container.style.height = this.height;
        container.append(this.header!);
        container.append(tableBody.getBody());
        container.append(this.footer!);
        if (!this.footerConfig.personalized) {
            const button: HTMLButtonElement | null = this.footer!.querySelector('#appendItem');
            if (button) button.onclick = () => tableBody.appendRow()
        }
        return container;
    }
}