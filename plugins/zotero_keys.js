"use strict";
var INFO =
["plugin", { name: "zotero_keys",
             version: "1.0.3",
             href: "https://github.com/willsALMANJ/Zoterodactyl",
             summary: "Key mappings for Zotero",
             xmlns: "dactyl" },
    ["author", { href: "https://github.com/willsALMANJ" },
        "Will Shanks"],
    ["license", { href: "http://www.mozilla.org/MPL/2.0/" },
        "Mozilla Public License 2.0"],
    ["project", { name: "Pentadactyl", "min-version": "1.0" }],
    ["p", {},
        "This plugin implements a set of key mappings for working with ",
        "Zotero with Pentadactyl without entering passthrough mode."]];

let zmaps = [];

// Show/focus Zotero.  
// argument can be used to set focus (1=search, 2=collection pane, 3=items tree)
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["zf"],
	description: "Show or focus Zotero",
	command: function(args) {
		ZoteroOverlay.toggleDisplay(true);
		
		var count;
		if (args.count === null) {
			count = 3;
		} else {
			count = args.count;
		}
		
		window.setTimeout(function() {
			/* This is more concise and will work if the UI changes, but maybe it is 
			safer to just focus the elements directly as done below?
			for (var idx=0; idx<count-1; idx++) {
				document.commandDispatcher.advanceFocus();
			}
			*/
			let doc;
			if (ZoteroOverlay.isTab) {
				doc = window.content.document;
			} else {
				doc = document;
			}
			
			switch (count) {
				case 1:
					// When Zotero is in a tab, this is not focused automatically 
					// (it is for the browser pane).
					doc.getElementById('zotero-tb-search').focus();
					break;
				case 2:
					doc.getElementById('zotero-collections-tree').focus();
					break;
				default:
					doc.getElementById('zotero-items-tree').focus();
			}
		}, 200);
	},
	options: {count: true}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["zc"],
	description: "Hide Zotero",
	command: function() {ZoteroOverlay.toggleDisplay(false)}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["zs"],
	description: "Save item from page", 
	command: function() {Zotero_Browser.scrapeThisPage()}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["zN"],
	description: "Open new item menu", 
	command: function() {document.getElementById("zotero-tb-add").firstChild.showPopup()}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["zw"],
	description: "Create website item for the current page", 
	command: function() {ZoteroPane.addItemFromPage()}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["J"],
	description: "Select next item", 
	command: function() {selectAdjacent(1);}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["K"],
	description: "Select previous item", 
	command: function() {selectAdjacent(-1);}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: [")"],
	description: "Select next item (holding previous selections)", 
	command: function() {selectRangedAdjacent(1)}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["("],
	description: "Select next item (holding previous selections)", 
	command: function() {selectRangedAdjacent(-1)}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["zT"], 
	description: "Toggle current Zotero item's attachments open/closed",
	command: function() {
			var curIdx = ZoteroPane.itemsView.selection.currentIndex;
			if (ZoteroPane.itemsView.isContainer(curIdx)) {
				ZoteroPane.itemsView.toggleOpenState(curIdx);
			}
		}
});
zmaps = zmaps.concat({
	modes: [modes.NORMAL],
	maps: ["zq"],
	description: "QuickCopy selected items to clipboard", 
	command: function() {ZoteroPane.copySelectedItemsToClipboard(false);}
});

zmaps.forEach(function(zmap) {
	group.mappings.add(zmap.modes, zmap.maps, zmap.description, zmap.command,
		zmap.options);
	INFO.push(["item", {},
        ["tags", {}, zmap.maps.join(' ')],
        ['spec', {}, zmap.maps.join(' ')],
        ["description", {short: "true"},
            ['p', {}, zmap.description]]]);
});

function selectAdjacent(sign) {
	var curIdx = ZoteroPane.itemsView.selection.currentIndex;
	// Don't move past ends of list
	if ((sign > 0 && curIdx < ZoteroPane.itemsView.rowCount-1) ||
		(sign < 0 && curIdx > 0)) {
		
		ZoteroPane.itemsView.selection.select(curIdx+sign);
		ZoteroPane.itemsView._treebox.ensureRowIsVisible(curIdx+sign);
	}
}

function selectRangedAdjacent(sign) {

	var curIdx = ZoteroPane.itemsView.selection.currentIndex;
	
	if ((sign > 0 && curIdx == ZoteroPane.itemsView.rowCount-1) || 
		(sign < 0 && curIdx == 0)) return
	
	var low = new Object();
	var high = new Object();
	if (ZoteroPane.itemsView.selection.getRangeCount() > 1) {
		low = {value: curIdx};
		high = {value: curIdx};
	} else {
		ZoteroPane.itemsView.selection.getRangeAt(0, low, high);
	}
	
	var back;
	var front;
	if (sign > 0) {
		back = low.value;
		front = high.value;
	} else {
		back = high.value;
		front = low.value;
	}
	
	var start;
	var end;
	if (curIdx == front && curIdx != back) {
		start = back;
		end = front + sign;
	} else if (curIdx == back && curIdx != front) {
		start = front;
		end = back + sign;
	} else {
		start = curIdx;
		end = curIdx + sign;
	}
		
	ZoteroPane.itemsView.selection.rangedSelect(start, end, false);
}