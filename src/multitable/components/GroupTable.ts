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
                const heading = document.createElement('h6');
                heading.textContent = 'Personalize your footer.';
                heading.style.height = '30px';
                heading.style.lineHeight = '30px';
                heading.style.display = 'block';
                content.append(heading);
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
        container.className = "multitable-child";
        container.append(this.getHeader())
        container.append(this.groupBody.getBody());
        container.append(footer);
        return container;
    }

}