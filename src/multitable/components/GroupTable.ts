import {Table} from "./Table";
import type {TableConfiguration} from "../interfaces/interfaces";
import {GroupTableBody} from "./GroupTableBody";

export class GroupTable extends Table {

    private readonly groupBody: GroupTableBody;

    public constructor(config: TableConfiguration) {
        if (!config.footerConfig.personalized) {
            config.footerConfig.personalized = true;
            config.footerConfig.contentIfPersonalized = () => {
                const content = document.createElement('div');
                content.style.height = 'fit-content';
                content.style.width = '100%';
                content.style.maxHeight = '30px';
                content.style.display = 'flex';
                content.style.justifyContent = 'center';
                return content;
            }
        }
        super(config);
        this.groupBody = new GroupTableBody(
            this.schema,
            this.cellWidth,
            this.handleRemoveItem,
            this.handleAppendItem,
            this.actions,
            this.callBackWhenRemoved,
            this.callBackWhenAppend
        );
        this.setBodyHeight = (height: number) => {
            this.groupBody.setBodyHeight(height);
        }
        this.getBodyHeight = () => this.groupBody.getBodyHeight();
        this.getEachRowHeight = () => this.groupBody.getEachRowHeight();
    }

    public appendRow(id: number) {
        this.groupBody.appendRow(id);
    }

    public removeRow(id: number) {
        this.groupBody.removeRow(id);
    }

    render(): HTMLElement {
        const container: HTMLElement = document.createElement("div");
        const footer: HTMLElement = this.getFooter();
        container.className = this.className ? this.className : "multitable-child";
        if (this.width) container.style.width = this.width;
        if (this.height) container.style.height = this.height;
        if (this.id) container.setAttribute("id", this.id);
        container.append(this.getHeader())
        container.append(this.groupBody.getBody());
        container.append(footer);
        return container;
    }

}