"use strict";
var INFO =
["plugin", { name: "zotero_keys",
             version: "1.0.0",
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
        "Zotero with Pentadactyl without entering passthrough mode.  See ",
        "the zotero_keys site for the list of keymappings."]];

// Show/focus Zotero.  
// argument can be used to set focus (1=search, 2=collection pane, 3=items tree)
group.mappings.add([modes.NORMAL], ["zf"], "Show or focus Zotero",
	function(args) {
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
			switch (count) {
				case 1:
					// Leave focus on first element
					break;
				case 2:
					document.getElementById('zotero-collections-tree').focus();
					break;
				default:
					document.getElementById('zotero-items-tree').focus();
			}
		}, 200);
	},
	{count: true}
);

// Hide Zotero
group.mappings.add([modes.NORMAL], ["zc"], "Hide Zotero",
	function() {ZoteroOverlay.toggleDisplay(false)}
);

// Save item from current page
group.mappings.add([modes.NORMAL], ["zs"], "Save item from page", 
	function() {Zotero_Browser.scrapeThisPage()}
);

// New item
group.mappings.add([modes.NORMAL], ["zN"], "Open new item menu", 
	function() {document.getElementById("zotero-tb-add").firstChild.showPopup()}
);

// New item from current webpage
group.mappings.add([modes.NORMAL], ["zw"], "Create website item for the current page", 
	function() {ZoteroPane.addItemFromPage()}
);

// Select next item
group.mappings.add([modes.NORMAL], ["J"], "Select next item", 
	function() {
		selectAdjacent(1);
	}
);

// Select previous item
group.mappings.add([modes.NORMAL], ["K"], "Select previous item", 
	function() {
		selectAdjacent(-1);
	}
);

// Select next item (holding previous selections)
group.mappings.add([modes.NORMAL], [")"], 
	"Select next item (holding previous selections)", 
	function() {
		selectRangedAdjacent(1)
	}
);

// Select next item (holding previous selections)
group.mappings.add([modes.NORMAL], ["("], 
	"Select next item (holding previous selections)", 
	function() {
		selectRangedAdjacent(-1)
	}
);

group.mappings.add([modes.NORMAL], ["zT"], 
	"Toggle current Zotero item's attachments open/closed",
	function() {
		var curIdx = ZoteroPane.itemsView.selection.currentIndex;
		if (ZoteroPane.itemsView.isContainer(curIdx)) {
     		ZoteroPane.itemsView.toggleOpenState(curIdx);
     	}
	}
);

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