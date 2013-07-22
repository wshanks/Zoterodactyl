"use strict";
var INFO =
["plugin", { name: "zutilo_keys",
             version: "1.0.1",
             href: "https://github.com/willsALMANJ/Zoterodactyl",
             summary: "Key mappings for Zutilo",
             xmlns: "dactyl" },
    ["author", { href: "https://github.com/willsALMANJ" },
        "Will Shanks"],
    ["license", { href: "http://www.mozilla.org/MPL/2.0/" },
        "Mozilla Public License 2.0"],
    ["project", { name: "Pentadactyl", "min-version": "1.0" }],
    ["p", {},
        "This plugin implements a set of key mappings for working with the Zutilo ",
        "plugin for Zotero with Pentadactyl without entering passthrough mode."]];
        
let zmaps = [];

zmaps=zmaps.concat({modes: [modes.NORMAL], 
	maps: ["zy"], 
	description: 'Copy ("yank") Zotero item tags', 
	command: function() {ZutiloChrome.zoteroOverlay.copyTags()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL], 
	maps: ["zp"], 
	description: "Paste Zotero item tags", 
	command: function() {ZutiloChrome.zoteroOverlay.pasteTags()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL], 
	maps: ["zC"],
	description: "Copy Zotero item creators",
	command: function() {ZutiloChrome.zoteroOverlay.copyCreators()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["zP"],
	description: "Show attachment paths", 
	command: function() {ZutiloChrome.zoteroOverlay.showAttachments()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["zM"],
	description: "Modify attachment paths", 
	command: function() {ZutiloChrome.zoteroOverlay.modifyAttachments()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["zR"],
	description: "Relate Zotero items", 
	command: function() {ZutiloChrome.zoteroOverlay.relateItems()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["ze"],
	description: "Edit item info", 
	command: function() {ZutiloChrome.zoteroOverlay.editItemInfoGUI()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["zn"],
	description: "Add note to item", 
	command: function() {ZutiloChrome.zoteroOverlay.addNoteGUI()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["zt"],
	description: "Add tag to item", 
	command: function() {ZutiloChrome.zoteroOverlay.addTagGUI()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["z-R"],
	description: "Open relate items dialog", 
	command: function() {ZutiloChrome.zoteroOverlay.addRelatedGUI()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["za"],
	description: "Attach current page to current Zotero item", 
	command: function() {
		ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
			window.content.location.href);
	}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["zS"],
	description: "Save item from page (opposite attachment handling from Zotero preference setting)", 
	command: function() {ZutiloChrome.firefoxOverlay.scrapeThisPage()}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["z-s"],
	description: "Save item from page with attachments (regardless of Zotero preference)", 
	command: function() {
		ZutiloChrome.firefoxOverlay.scrapeThisPage(false, true);
	}
});
zmaps=zmaps.concat({modes: [modes.NORMAL],
	maps: ["z-S"],
	description: "Save item from page without attachments (regardless of Zotero preference)", 
	command: function() {
		ZutiloChrome.firefoxOverlay.scrapeThisPage(false, false);
	}
});

zmaps.forEach(function(zmap) {
	group.mappings.add(zmap.modes, zmap.maps, zmap.description, zmap.command);
	INFO.push(["item", {},
        ["tags", {}, zmap.maps.join(' ')],
        ['spec', {}, zmap.maps.join(' ')],
        ["description", {short: "true"},
            ['p', {}, zmap.description]]]);
});

let zhints=[];
zhints=zhints.concat({hint: 'z',
	description: 'Attach link target to current Zotero item',
	command: function(elem) ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(elem.href)
});

zhints.forEach(function(zhint) {
	hints.addMode(zhint.hint, zhint.description, zhint.command);
	INFO.push(["item", {},
        ["tags", {}, ';' + zhint.hint],
        ['spec', {}, ';' + zhint.hint],
        ["description", {short: "true"},
            ['p', {}, zhint.description]]]);
});