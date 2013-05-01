"use strict";
var INFO =
["plugin", { name: "zotero_keys",
             version: "1.0.0",
             href: "https://github.com/willsALMANJ/Zoterodactyl",
             summary: "JavaScript completion enhancements",
             xmlns: "dactyl" },
    ["author", { href: "https://github.com/willsALMANJ" },
        "Will Shanks"],
    ["license", { href: "http://www.mozilla.org/MPL/2.0/" },
        "Mozilla Public License 2.0"],
    ["project", { name: "Pentadactyl", "min-version": "1.0" }],
    ["p", {},
        "This plugin implements a set of key mappings for working with the Zutilo ",
        "plugin for Zotero with Pentadactyl without entering passthrough mode."]];

// Copy ("yank") Zotero item tags
group.mappings.add([modes.NORMAL], ["zy"], "Copy Zotero item tags", 
	function() {ZutiloChrome.zoteroOverlay.copyTags()}
);

// Paste Zotero item tags
group.mappings.add([modes.NORMAL], ["zp"], "Paste Zotero item tags", 
	function() {ZutiloChrome.zoteroOverlay.pasteTags()}
);

// Copy Zotero item creators
group.mappings.add([modes.NORMAL], ["zC"], "Copy Zotero item creators", 
	function() {ZutiloChrome.zoteroOverlay.copyCreators()}
);

// Show attachment paths
group.mappings.add([modes.NORMAL], ["zP"], "Show attachment paths", 
	function() {ZutiloChrome.zoteroOverlay.showAttachments()}
);

// Modify attachment paths
group.mappings.add([modes.NORMAL], ["zM"], "Modify attachment paths", 
	function() {ZutiloChrome.zoteroOverlay.modifyAttachments()}
);

// Relate Zotero items
group.mappings.add([modes.NORMAL], ["zR"], "Relate Zotero items", 
	function() {ZutiloChrome.zoteroOverlay.relateItems()}
);

// Edit item info
group.mappings.add([modes.NORMAL], ["ze"], "Edit item info", 
	function() {ZutiloChrome.zoteroOverlay.editItemInfoGUI()}
);

// Add note to item
group.mappings.add([modes.NORMAL], ["zn"], "Add note to item", 
	function() {ZutiloChrome.zoteroOverlay.addNoteGUI()}
);

// Add tag to item
group.mappings.add([modes.NORMAL], ["zt"], "Add tag to item", 
	function() {ZutiloChrome.zoteroOverlay.addTagGUI()}
);

// Open relate items dialog
group.mappings.add([modes.NORMAL], ["z-R"], "Open relate items dialog", 
	function() {ZutiloChrome.zoteroOverlay.addRelatedGUI()}
);

// Attach current page to current Zotero item
group.mappings.add([modes.NORMAL], ["za"], 
	"Attach current page to current Zotero item", 
	function() {
		ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
			window.content.location.href);
	}
);

// Save item from page (opposite attachment handling from Zotero preference setting)
group.mappings.add([modes.NORMAL], ["zS"], 
	"Save item from page (opposite attachment handling from Zotero preference setting)", 
	function() {ZutiloChrome.firefoxOverlay.scrapeThisPage()}
);

// Save item from page with attachments (regardless of Zotero preference)
group.mappings.add([modes.NORMAL], ["z-s"], 
	"Save item from page with attachments (regardless of Zotero preference)", 
	function() {
		ZutiloChrome.firefoxOverlay.scrapeThisPage(false, true);
	}
);

// Save item from page without attachments (regardless of Zotero preference)
group.mappings.add([modes.NORMAL], ["z-S"], 
	"Save item from page without attachments (regardless of Zotero preference)", 
	function() {
		ZutiloChrome.firefoxOverlay.scrapeThisPage(false, false);
	}
);

hints.addMode('z','Attach link target to current Zotero item',
	function(elem) ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(elem.href)
);