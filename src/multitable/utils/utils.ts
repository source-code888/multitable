import type {HTMLInput, SelectOptions} from "../types/types.ts";

export function validateInput(input: HTMLInput, regex: RegExp): boolean {
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



export function createSelectOptions(
    opt: SelectOptions
): HTMLOptionElement[] {
    const options: HTMLOptionElement[] = [];
    for (const value in opt) {
        const option: HTMLOptionElement = document.createElement("option");
        option.value = value;
        option.textContent = opt[value];
        options.push(option);
    }
    return options.reverse();
}