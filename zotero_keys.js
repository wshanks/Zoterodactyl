'use strict';
/* global ZoteroOverlay,Zotero_Browser,ZoteroPane,CommandExMode,group */
/* global CommandOption,modes */
var INFO =
['plugin', { name: 'zotero_keys',
             version: '2.0',
             href: 'https://github.com/willsALMANJ/Zoterodactyl',
             summary: 'Key mappings for Zotero',
             xmlns: 'dactyl' },
    ['author', { href: 'https://github.com/willsALMANJ' },
        'Will Shanks'],
    ['license', { href: 'http://www.mozilla.org/MPL/2.0/' },
        'Mozilla Public License 2.0'],
    ['project', { name: 'Pentadactyl', 'min-version': '1.0' }],
    ['p', {},
        'This plugin implements a set of key mappings for working with ',
        'Zotero with Pentadactyl without entering passthrough mode.']];

var Actions = {};
// Show / focus Zotero
// argument can be used to set focus (1=search, 2=collection pane, 3=items tree)
Actions['zoterofocus'] = {
	description: 'Show or focus Zotero',
	mappings: [
		{
			keys: ['zf'],
			openExMode: false
		}
	],
	count: {
		descriptions: ['Focus search box','Focus Collections tree',
			'Focus Items tree']
	},
	command: function(args) {
		ZoteroOverlay.toggleDisplay(true);
		
		var count = args['-n'] || args.count || 3;
		
		window.setTimeout(function() {
			/* This is more concise and will work if the UI changes, but maybe 
			it is safer to just focus the elements directly as done below?
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
					// When Zotero is in a tab, this is not focused 
					// automatically (it is for the browser pane).
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
};

Actions['zoteroclose'] = {
	description: 'Hide Zotero',
	mappings: [
		{
			keys: ['zc'],
			openExMode: false
		}
	],
	
	command: function() {
		ZoteroOverlay.toggleDisplay(false);
	},
	extraInfo: {
		argCount: 0
	}
};

Actions['zoterosaveitem'] = {
	description: 'Save item from page', 
	mappings: [
		{
			keys: ['zs'],
			openExMode: false
		}
	],
	command: function() {Zotero_Browser.scrapeThisPage();}
};
Actions['zoteronewitemmenu'] = {
	description: 'Open new item menu', 
	mappings: [
		{
			keys: ['zN'],
			openExMode: false
		}
	],
	command: function() {
		document.getElementById('zotero-tb-add').firstChild.showPopup();}
};
Actions['zoteronewwebitem'] = {
	description: 'Create website item for the current page', 
	mappings: [
		{
			keys: ['zw'],
			openExMode: false
		}
	],
	command: function() {ZoteroPane.addItemFromPage();}
};
// Utility function for item selection
function selectAdjacent(sign) {
	var curIdx = ZoteroPane.itemsView.selection.currentIndex;
	// Don't move past ends of list
	if ((sign > 0 && curIdx < ZoteroPane.itemsView.rowCount-1) ||
		(sign < 0 && curIdx > 0)) {
		
		ZoteroPane.itemsView.selection.select(curIdx+sign);
		ZoteroPane.itemsView._treebox.ensureRowIsVisible(curIdx+sign);
	}
}
Actions['zoteronextitem'] = {
	description: 'Select next item', 
	mappings: [
		{
			keys: ['J'],
			openExMode: false
		}
	],
	command: function() {selectAdjacent(1);}
};
Actions['zoteropreviousitem'] = {
	description: 'Select previous item', 
	mappings: [
		{
			keys: ['K'],
			openExMode: false
		}
	],
	command: function() {selectAdjacent(-1);}
};
// Utility function for multiple selection
function selectRangedAdjacent(sign) {

	var curIdx = ZoteroPane.itemsView.selection.currentIndex;
	
	if ((sign > 0 && curIdx === ZoteroPane.itemsView.rowCount-1) || 
		(sign < 0 && curIdx === 0)) {
			return;
	}
	
	var low = {};
	var high = {};
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
	if (curIdx === front && curIdx !== back) {
		start = back;
		end = front + sign;
	} else if (curIdx === back && curIdx !== front) {
		start = front;
		end = back + sign;
	} else {
		start = curIdx;
		end = curIdx + sign;
	}
		
	ZoteroPane.itemsView.selection.rangedSelect(start, end, false);
}
Actions['zoteroshiftselectnextitem'] = {
	description: 'Select next item (holding previous selections)', 
	mappings: [
		{
			keys: [')'],
			openExMode: false
		}
	],
	command: function() {selectRangedAdjacent(1);}
};

Actions['zoteroshiftselectpreviousitem'] = {
	description: 'Select next item (holding previous selections)', 
	mappings: [
		{
			keys: ['('],
			openExMode: false
		}
	],
	command: function() {selectRangedAdjacent(-1);}
};
Actions['zoterotoggleitem'] = {
	description: 'Toggle current Zotero item\'s attachments open/closed',
	mappings: [
		{
			keys: ['zT'],
			openExMode: false
		}
	],
	command: function() {
			var curIdx = ZoteroPane.itemsView.selection.currentIndex;
			if (ZoteroPane.itemsView.isContainer(curIdx)) {
				ZoteroPane.itemsView.toggleOpenState(curIdx);
			}
		}
};
Actions['zoteroquickcopy'] = {
	description: 'QuickCopy selected items to clipboard', 
	mappings: [
		{
			keys: ['zq'],
			openExMode: false
		}
	],
	command: function() {ZoteroPane.copySelectedItemsToClipboard(false);}
};

/*
 * Add commands / mappings
 */
function commandFunction(action, mapping) {
	return function(args) {
		if (mapping.openExMode) {
			let cExMode = new CommandExMode();
			cExMode.open(action+' ');
		} else {
			Actions[action].command(args);
		}
	};
}
function addMappings(action) {
	for (let i=0; i<Actions[action].mappings.length; i++) {
		let mapping= Actions[action].mappings[i];
		group.mappings.add([modes.NORMAL], mapping.keys,
			Actions[action].description,
			commandFunction(action, mapping),
			{}
		);
	}
}
/* (Commented out until commands with arguments are implemented
function defaultArgDescription(argName, defaultStr) {
	return ['  If ',['oa',{},argName],
		' is omitted, then the default value of ',
		['str',{},defaultStr],' is used.'];
}
*/
function zCompleter(action) {
	return function (context) {
		let completions = [];
		for (let i=0; i<Actions[action].count.descriptions.length; i++) {
			completions.push(
				[i+1,Actions[action].count.descriptions[i]]);
		}
		context.completions = completions;
	};
}
for (let action in Actions) {
	if (Actions.hasOwnProperty(action)) {
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
					completer: zCompleter(action)
				});
		}	
		
		group.commands.add([action],
			Actions[action].description,
			Actions[action].command,
			Actions[action].extraInfo,
			true);
	
		if ('mappings' in Actions[action]) {
				addMappings(action);
		}
		
		let tagStr=':'+action;
		if ('mappings' in Actions[action]) {
			tagStr+=' '+Actions[action].mappings[0].keys.join(' ');
		}
		let specVal;
		if ('argName' in Actions[action]) {
			specVal=['spec',{},':'+action+' ',
				['oa',{},Actions[action].argName]];
		} else {
			specVal=['spec',{},':'+action];
		}
		let description=['p', {}, Actions[action].description];
		if ('extraDescription' in Actions[action]) {
			description=description.concat(Actions[action].extraDescription());
		}
		INFO.push(['item', {},
			['tags', {}, tagStr],
			specVal,
			['description', {},
				description]]);
	}
}
