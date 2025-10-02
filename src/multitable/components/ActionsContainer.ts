import type {TableActionsConfiguration} from "../interfaces/interfaces.ts";

export function actionsContainer(
    {
        width,
        height,
        title,
        content,
        className,
    }: TableActionsConfiguration
): HTMLDivElement {
    const container = document.createElement("div");
    container.className = className ? className : 'mtb-r-container';
    if (width) container.style.width = width;
    if (height) container.style.height = height;
    if (content) container.append(content());
    else if (title) container.textContent = title;
    return container;
}