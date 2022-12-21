
Hooks.once("setup", async function () {

    if (game.system.id === "dnd5e") {
        Hooks.on("renderActorSheet5e", renderInjectionHook);
        Hooks.on("renderActorSheet5eNew", renderInjectionHook);
    }

    console.log("CloneItems | Loaded");
});

const generateCloneButton = (sheetClasses) => {

    if (sheetClasses.includes("tidy5e")) {
        return $(
            `<a class="item-control item-clone" title="${ game.i18n.localize("CloneItems.ButtonTitle") }">
                <i class="fas fa-clone"></i>
                <span class="control-label">${ game.i18n.localize("CloneItems.ButtonTitle") }</span>
            </a>`
        )[0];
    }

    return $(`<a class="item-control item-clone" title="${ game.i18n.localize("CloneItems.ButtonTitle") }"><i class="fas fa-clone"></i></a>`)[0];
}

async function renderInjectionHook(sheet, element, character) {
    try {

        const actor = game.actors.get(character.actor._id);

        const itemElements = $(".items-list.inventory-list>.item-list>.item", element);
        for (const itemElement of itemElements) {
            for (const itemControlsElement of $(".item-controls", itemElement)) {

                const item = actor.items.get(itemElement.dataset?.itemId);
                if (item && !["race", "background", "class", "subclass"].includes(item.type)) {

                    const cloneButton = generateCloneButton(sheet.options.classes);

                    cloneButton.addEventListener(
                        "click",
                        async() => {
                            try {
                                return actor.createEmbeddedDocuments("Item", [item])
                            } catch(error) {
                                console.error("CloneItems | https://github.com/RossGosling/foundryvtt-cloneitems/issues\nError during button press\n", error);
                            }
                        }
                    );

                    itemControlsElement.insertBefore(
                        cloneButton,
                        Array.from(itemControlsElement.children)
                            .find((itemControl) => itemControl.classList.contains("item-delete"))
                    );
                }
            }
        }

    } catch(error) {
        console.error("CloneItems | https://github.com/RossGosling/foundryvtt-cloneitems/issues\nError during sheet load\n", error);
    }
}
