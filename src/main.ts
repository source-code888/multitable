import {createMultitableWithSchemas} from "./lib.ts";
import type {Schema} from "./multitable/types/types.ts";


const dataLeft: Schema = {
    "comboId": {
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
        title: "Units price",
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
createMultitableWithSchemas('#app', dataLeft, dataRight)