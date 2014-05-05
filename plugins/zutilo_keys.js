"use strict";
var INFO =
["plugin", { name: "zutilo_keys",
             version: "2.0",
             href: "https://github.com/willsALMANJ/Zoterodactyl",
             summary: "Key mappings for Zutilo",
             xmlns: "dactyl" },
    ["author", { href: "https://github.com/willsALMANJ" },
        "Will Shanks"],
    ["license", { href: "http://www.mozilla.org/MPL/2.0/" },
        "Mozilla Public License 2.0"],
    ["project", { name: "Pentadactyl", "min-version": "1.0" }],
    ["p", {},
        "This plugin implements a set of key mappings for working with the ",
		"Zutilo plugin for Zotero with Pentadactyl without entering ",
		"passthrough mode."]];
        
var Actions = new Object();

Actions['zoteroyanktags'] = {
	description: 'Copy ("yank") Zotero item tags', 
	mappings: [
		{
			keys: ["zy"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.copyTags()}
};
Actions['zoteropastetags'] = {
	description: "Paste Zotero item tags", 
	mappings: [
		{
			keys: ["zp"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.pasteTags()}
};
Actions['zoterocopycreators'] = {
	description: "Copy Zotero item creators",
	mappings: [
		{
			keys: ["zC"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.copyCreators()}
};
Actions['zoteroshowpaths'] = {
	description: "Show attachment paths", 
	mappings: [
		{
			keys: ["zP"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.showAttachments()}
};
Actions['zoteromodifypaths'] = {
	description: "Modify attachment paths", 
	mappings: [
		{
			keys: ["zM"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.modifyAttachments()}
};
Actions['zoterorelateitems'] = {
	description: "Relate Zotero items", 
	mappings: [
		{
			keys: ["zR"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.relateItems()}
};
Actions['zoteroedititem'] = {
	description: "Edit item info", 
	mappings: [
		{
			keys: ["ze"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.editItemInfoGUI()}
};
Actions['zoteroaddnote'] = {
	description: "Add note to item", 
	mappings: [
		{
			keys: ["zn"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.addNoteGUI()}
};
Actions['zoteroaddtag'] = {
	description: "Add tag to item", 
	mappings: [
		{
			keys: ["zt"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.addTagGUI()}
};
Actions['zoterorelateitemsdialog'] = {
	description: "Open relate items dialog", 
	mappings: [
		{
			keys: ["z-R"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.addRelatedGUI()}
};
Actions['zoteroattachpage'] = {
	description: "Attach current page to current Zotero item", 
	mappings: [
		{
			keys: ["za"],
			openExMode: false
		}
	],
	command: function() {
		ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
			window.content.location.href);
	}
};
Actions['zoterosaveitemopposite'] = {
	description: "Save item from page (opposite attachment handling from Zotero preference setting)", 
	mappings: [
		{
			keys: ["zS"],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.firefoxOverlay.scrapeThisPage()}
};
Actions['zoterosaveitemwithattachments'] = {
	description: "Save item from page with attachments (regardless of Zotero preference)", 
	mappings: [
		{
			keys: ["z-s"],
			openExMode: false
		}
	],
	command: function() {
		ZutiloChrome.firefoxOverlay.scrapeThisPage(false, true);
	}
};
Actions['zoterosaveitemnoattachments'] = {
	description: "Save item from page without attachments (regardless of Zotero preference)", 
	mappings: [
		{
			keys: ["z-S"],
			openExMode: false
		}
	],
	command: function() {
		ZutiloChrome.firefoxOverlay.scrapeThisPage(false, false);
	}
};

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

/*
 * Add commands / mappings
 */
function addMapping(action, mapping) {
	let command;
	let actionStr=action; //Needed for scoping/evaluation reasons
	if (mapping.openExMode) {
		command=(function(args) {
			CommandExMode().open(actionStr+" ")
		});
	} else {
		command=(function(args) {
			(Actions[actionStr].command(args));
		});
	}

	group.mappings.add([modes.NORMAL], mapping.keys,
		Actions[action].description,
		(command),
		{}
	);
}

function defaultArgDescription(argName, defaultStr) {
	return ['  If ',['oa',{},argName],
		' is omitted, then the default value of ',
		['str',{},defaultStr],' is used.']
}

for (let action in Actions) {
	if (!('extraInfo' in Actions[action])) {
		Actions[action].extraInfo = {};
	}
	
	if ('count' in Actions[action]) {
		if (!('options' in Actions[action].extraInfo)) {
			Actions[action].extraInfo.options = [];
		}

		Actions[action].extraInfo.options.push(
			{
				names: ['-n'],
				description: 'Quick modes',
				type: CommandOption.INT,
				completer: function (context) {
					context.completions = [];
					for (let i=0; i<Actions[action].count.descriptions; i++) {
						context.completions.push(
							[i+1,Actions[action].count.descriptions[i]]);
					}
				},
				validator: Option.validateCompleter
			});
	}	
	
	group.commands.add([action],
		Actions[action].description,
				Actions[action].command,
		Actions[action].extraInfo,
		true);

	if ('mappings' in Actions[action]) {
		for (let i=0; i<Actions[action].mappings.length; i++) {
			addMapping(action, Actions[action].mappings[i]);
		}
	}
	
	let tagStr=":"+action;
	if ('mappings' in Actions[action]) {
			tagStr+=' '+Actions[action].mappings[0].keys.join(' ');
	}
	let specVal;
	if ('argName' in Actions[action]) {
		specVal=['spec',{},":"+action+' ',
			['oa',{},Actions[action].argName]];
	} else {
		specVal=['spec',{},":"+action];
	}
	let description=["p", {}, Actions[action].description];
	if ('extraDescription' in Actions[action]) {
			description=description.concat(Actions[action].extraDescription());
	}
	INFO.push(["item", {},
		["tags", {}, tagStr],
		specVal,
		["description", {},
			description]]);
}
