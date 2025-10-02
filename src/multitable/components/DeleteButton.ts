export function deleteButton(): HTMLButtonElement {
    const button: HTMLButtonElement = document.createElement("button");
    button.className = "mtb-r-button-delete";
    const icon: HTMLSpanElement = document.createElement("span");
    icon.classList.add('delete-icon', 'material-symbols-outlined');
    icon.textContent = 'delete';
    button.appendChild(icon);
    return button;
}