import {createMultitableWithConfigs} from "./lib.ts";
import type {Schema} from "./multitable/types/types.ts";
import type {TableConfiguration} from "./multitable/interfaces/interfaces.ts";
const dataLeft: Schema = {
    "comboId": {
        title: "ID",
        calculated: false,
        regex: /^[0-9]{1,2}$/,
        editable: true,
        width: '30px',
    },
    "name": {
        title: "Name",
        calculated: false,
        regex: /^[a-zA-Z0-9]{0,150}$/,
        editable: true,
        width: '150px',
    },
    "unitPrice": {
        title: "Unit",
        calculated: false,
        regex: /^[0-9]+([.]?[0-9]+)?$/,
        editable: true,
        width: '50px',
    },
    "units": {
        title: "Units",
        calculated: false,
        regex: /^[1-9]+$/,
        editable: true,
        width: '50px',
    },
    "subtotal": {
        title: "Subtotal",
        calculated: true,
        regex: /^[0-9]+([.]?[0-9]+)?$/,
        editable: true,
        width: '80px',
    }
}
const dataRight: Schema = {
    "productId": {
        title: "#",
        calculated: false,
        regex: /^[0-9]{1,2}$/,
        editable: true
    },
    "name": {
        title: "Name",
        calculated: false,
        regex: /^[a-zA-Z0-9]{0,150}$/,
        editable: true
    },
    "unitPrice": {
        title: "Unit price",
        calculated: false,
        regex: /^[0-9]+([.]?[0-9]+)?$/,
        editable: true
    },
    "units": {
        title: "Units",
        calculated: false,
        regex: /^[1-9]+$/,
        editable: true,
    },
    "subtotal": {
        title: "Subtotal",
        calculated: true,
        regex: /^[0-9]+([.]?[0-9]+)?$/,
        editable: true,
    }
}
const leftConfig: TableConfiguration = {
    schema: dataLeft,
    footerConfig: {
        personalized: false
    },
    handleRemoveItem: true,
    handleAppendItem: true,
    actions: {
        visible: true,
        title: 'Act',
        width: '50px'
    },
    width: '400px',
    id: 'comboTable',
};
const rightConfig: TableConfiguration = structuredClone(leftConfig);
rightConfig.width = '50%';
rightConfig.schema = dataRight;
createMultitableWithConfigs('#app', leftConfig, rightConfig)