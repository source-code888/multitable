import type {Schema} from "./multitable/types/types";
import type {TableConfiguration} from "./multitable/interfaces/interfaces";
import {MultiTable} from "./multitable/components/MultiTable";

export function createMultitableWithSchemas(
    target: string,
    leftSchema: Schema,
    rightSchema: Schema,
) {
    const leftConfig: TableConfiguration = {
        schema: leftSchema,
        handleRemoveItem: true,
        handleAppendItem: true,
        actions: {
            visible: true,
        },
        footerConfig: {
            personalized: false,
            defaultButtonText: "Delete kit",
        }
    }
    const rightConfig: TableConfiguration = structuredClone(leftConfig);
    rightConfig.schema = rightSchema;
    const multiTable: MultiTable = new MultiTable({target, leftConfig, rightConfig});
    multiTable.render();
}

export function createMultitableWithConfigs(
    target: string,
    leftConfig: TableConfiguration,
    rightConfig: TableConfiguration,
) {
    const multiTable: MultiTable = new MultiTable({target, leftConfig, rightConfig});
    multiTable.render();
}