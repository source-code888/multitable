import type {Configuration} from "../interfaces/interfaces";
import {Table} from "./Table";
import {GroupTable} from "./GroupTable";

export class MultiTable {
    private target: string;
    private leftTable: Table;
    private rightTable: GroupTable;

    public constructor({target, leftConfig, rightConfig}: Configuration) {
        this.target = target;
        leftConfig.callBackWhenAppend = () => {
            this.appendToRight();
            if (this.rightTable.getEachRowHeight)
                this.leftTable.setEachRowHeight?.(this.rightTable.getEachRowHeight());
        }
        leftConfig.callBackWhenRemoved = () => this.removeToLeft();
        rightConfig.callBackWhenAppend = () => {
            if (this.rightTable.getEachRowHeight) {
                this.leftTable.setEachRowHeight?.(this.rightTable.getEachRowHeight())
            }
        }
        rightConfig.callBackWhenRemoved = () => {
            if (this.rightTable.getEachRowHeight)
                this.leftTable.setEachRowHeight?.(this.rightTable.getEachRowHeight())
        }
        this.rightTable = new GroupTable(rightConfig);
        this.leftTable = new Table(leftConfig);
    }

    private appendToRight() {
        this.rightTable.appendRow(this.leftTable.callLastAppend())
    }

    private removeToLeft() {
        this.rightTable.removeRow(this.leftTable.callLastRemove())
    }

    public render(): void {
        const container: HTMLElement = document.createElement("div");
        container.className = "multitable";
        container.append(this.leftTable.render());
        container.append(this.rightTable.render());
        document.querySelector<HTMLElement>(this.target)?.replaceWith(container);
        const height = Math.max(this.leftTable.getHeaderHeight(), this.rightTable.getHeaderHeight());
        this.leftTable.setHeaderHeight(height);
        this.rightTable.setHeaderHeight(height);
    }
}
