export function appendButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "mtb-r-button-append";
    const icon: HTMLSpanElement = document.createElement("span");
    icon.classList.add('append-icon', 'material-symbols-outlined');
    icon.textContent = 'add_box';
    button.appendChild(icon);
    return button;
}