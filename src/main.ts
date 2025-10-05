import {createMultitableWithConfigs} from "./lib.ts";
import type {HTMLInput, Schema, SelectOptions} from "./multitable/types/types.ts";
import type {TableConfiguration} from "./multitable/interfaces/interfaces.ts";
import {createSelectOptions} from "./multitable/utils/utils.ts";

const dataLeft: Schema = {
    "comboId": {
        title: "ID",
        calculated: false,
        regex: /^[0-9]{1,2}$/,
        disabled: false,
        width: '30px',
        visible: true,
        className: 'mtb-r-container-outlined'
    },
    "name": {
        title: "Name",
        calculated: false,
        regex: /^[a-zA-Z0-9]{0,150}$/,
        disabled: false,
        width: '150px',
        visible: true,
        className: 'mtb-r-container-outlined'
    },
    "unitPrice": {
        title: "Unit",
        calculated: false,
        regex: /^[0-9]+([.]?[0-9]+)?$/,
        disabled: false,
        width: '50px',
        visible: true,
        className: 'mtb-r-container-outlined'
    },
    "units": {
        title: "Units",
        calculated: false,
        regex: /^[1-9]+$/,
        disabled: false,
        width: '50px',
        visible: true,
        className: 'mtb-r-container-outlined'
    },
    "subtotal": {
        title: "Subtotal",
        calculated: true,
        regex: /^[0-9]+([.]?[0-9]+)?$/,
        disabled: true,
        width: '80px',
        visible: true,
        className: 'mtb-r-container-outlined'
    }
}
const dataRight: Schema = {
    "productId": {
        title: "#",
        calculated: false,
        regex: /^[0-9]{1,2}$/,
        disabled: false,
        visible: true,
        className: 'mtb-r-container-outlined'
    },
    "name": {
        title: "Name",
        calculated: false,
        regex: /^[a-zA-Z0-9]{0,150}$/,
        disabled: false,
        visible: true,
        className: 'mtb-r-container-outlined'
    },
    "unitPrice": {
        title: "Unit price",
        calculated: false,
        regex: /^[0-9]+([.]?[0-9]+)?$/,
        disabled: false,
        visible: true,
        className: 'mtb-r-container-outlined'
    },
    "units": {
        title: "Units",
        calculated: false,
        regex: /^[1-9]+$/,
        disabled: false,
        visible: true,
        className: 'mtb-r-container-outlined'
    },
    "storeHouse": {
        title: "Almacén",
        calculated: false,
        disabled: false,
        visible: true,
        className: 'mtb-r-container-outlined',
        formElement: (): [HTMLInput | HTMLSelectElement, () => void] => {
            const select: HTMLSelectElement = document.createElement('select');
            const opts: SelectOptions = {
                '--': 'Seleccionar',
                '1': 'Hola',
                '2': 'Idk'
            };
            createSelectOptions(opts).forEach(option => select.options.add(option));
            const callback = () => {
                const value = select.value;
                if (value === '--') {
                    select.classList.add('error');
                    //select.parentElement?.classList.add('error');
                } else {
                    select.classList.remove('error');
                    //select.parentElement?.classList.remove('error');
                }
            };
            select.onchange = callback;
            return [select, callback];
        }
    },
    "subtotal": {
        title: "Subtotal",
        calculated: true,
        disabled: true,
        visible: true,
        className: 'mtb-r-container-outlined'
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
        width: '50px',
        className: 'mtb-r-container-outlined'
    },
    width: '400px',
    id: 'comboTable',
};

const rightConfig: TableConfiguration = {
    schema: dataRight,
    footerConfig: {
        personalized: false
    },
    handleRemoveItem: true,
    handleAppendItem: true,
    actions: {
        visible: true,
        title: 'Act',
        className: 'mtb-r-container-outlined'
    },
    width: '60%',
    id: 'comboTable',
};
createMultitableWithConfigs('#app', leftConfig, rightConfig)