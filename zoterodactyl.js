'use strict';
/* global Components,AddonManager */
/* global ZoteroOverlay,Zotero_Browser,ZoteroPane,ZutiloChrome */
/* global CommandExMode,group,CommandOption,modes,hints */
var INFO =
['plugin', { name: 'zoterodactyl',
             version: '2.1a',
             href: 'https://github.com/willsALMANJ/Zoterodactyl',
             summary: 'Zoterodactyl',
             xmlns: 'dactyl' },
    ['author', { href: 'https://github.com/willsALMANJ' },
        'Will Shanks'],
    ['license', { href: 'http://www.mozilla.org/MPL/2.0/' },
        'Mozilla Public License 2.0'],
    ['project', { name: 'Pentadactyl', 'min-version': '1.0' }],
    ['p', {},
        'Zoterodactyl implements a set of commands, hints, and key mappings ',
		'for working with Zotero using Pentadactyl without entering ',
		'passthrough mode. Some commands require the Zutilo add-on and are ', 
		'neither added to Pentadactyl nor listed in Pentadactyl\'s ',
		'documentation when Zutilo is not active.']];

Components.utils.import('resource://gre/modules/AddonManager.jsm');

const LOAD_CONTEXT = {
	ALWAYS: 0, // Load command always
	ZUTILO_ACTIVE: 1, // Load command only if Zutilo is active
	ZUTILO_INACTIVE: 2 // Load command only if Zutilo not active
};

/* Actions: object containing all actions (commands and mappings) to be added 
 * to Pentadactyl
 */
var Actions = {};
// Show / focus Zotero
// argument can be used to set focus (1=search, 2=collection pane, 3=items tree)
Actions['zoterofocus'] = {
	description: 'Show or focus Zotero',
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
	mappings: [
		{
			keys: ['zs'],
			openExMode: false
		}
	],
	/* jshint -W106 */
	command: function() {Zotero_Browser.scrapeThisPage();}
	/* jshint +W106 */
};
Actions['zoteronewitemmenu'] = {
	description: 'Open new item menu', 
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
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
	context: LOAD_CONTEXT.ALWAYS,
	mappings: [
		{
			keys: ['zq'],
			openExMode: false
		}
	],
	command: function() {ZoteroPane.copySelectedItemsToClipboard(false);}
};

Actions['zoteroyanktags'] = {
	description: 'Copy ("yank") Zotero item tags', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zy'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.copyTags();}
};
Actions['zoteropastetags'] = {
	description: 'Paste Zotero item tags', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zp'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.pasteTags();}
};
Actions['zoterocopycreators'] = {
	description: 'Copy Zotero item creators',
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zC'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.copyCreators();}
};
Actions['zoteroshowpaths'] = {
	description: 'Show attachment paths', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zP'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.showAttachments();}
};
Actions['zoteromodifypaths'] = {
	description: 'Modify attachment paths', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zM'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.modifyAttachments();}
};
Actions['zoterorelateitems'] = {
	description: 'Relate Zotero items', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zR'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.relateItems();}
};
Actions['zoteroedititem'] = {
	description: 'Edit item info', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['ze'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.editItemInfoGUI();}
};
Actions['zoteroaddnote'] = {
	description: 'Add note to item', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zn'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.addNoteGUI();}
};
Actions['zoteroaddtag'] = {
	description: 'Add tag to item', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zt'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.addTagGUI();}
};
Actions['zoterorelateitemsdialog'] = {
	description: 'Open relate items dialog', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['z-R'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.zoteroOverlay.addRelatedGUI();}
};
Actions['zoteroattachpage'] = {
	description: 'Attach current page to current Zotero item', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['za'],
			openExMode: false
		}
	],
	command: function() {
		ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(
			window.content.location.href);
	}
};
Actions['zoterosaveitemopposite'] = {
	description: 'Save item from page (opposite attachment handling from ' +
		'Zotero preference setting)', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['zS'],
			openExMode: false
		}
	],
	command: function() {ZutiloChrome.firefoxOverlay.scrapeThisPage();}
};
Actions['zoterosaveitemwithattachments'] = {
	description: 'Save item from page with attachments (regardless of ' +
		'Zotero preference)', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['z-s'],
			openExMode: false
		}
	],
	command: function() {
		ZutiloChrome.firefoxOverlay.scrapeThisPage(false, true);
	}
};
Actions['zoterosaveitemnoattachments'] = {
	description: 'Save item from page without attachments (regardless of ' +
		'Zotero preference)', 
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	mappings: [
		{
			keys: ['z-S'],
			openExMode: false
		}
	],
	command: function() {
		ZutiloChrome.firefoxOverlay.scrapeThisPage(false, false);
	}
};

/*
 * Array of hints to add to Pentadactyl
 */
let zhints=[];
zhints=zhints.concat({hint: 'z',
	description: 'Attach link target to current Zotero item',
	context: LOAD_CONTEXT.ZUTILO_ACTIVE,
	command: function(elem) {
		ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(elem.href);
	}
});

/*
 * Add commands/mappings/hints
 *
 * The rest code below adds all of the commands, mappings, and hints defined 
 * above.
 */

/* Concat description paragraphs */
function extendText(textArray,newTextArray) {
	if (textArray.length===3&&textArray[0]==='p') {
		textArray=[textArray,newTextArray];
	} else {
		textArray=textArray.concat(newTextArray);
	}
}
/* Define the function called by Pentadactyl when a mapping is called. Either 
 * Ex mode is opened starting with the command or the command is called.
 *
 * Note: scoping is a little tricky here. Returning Actions[action].command 
 * directly would not work. It has to be wrapped inside of another 
 * function(args) call.
 */
function mappingFunction(action, mapping) {
	return function(args) {
		if (mapping.openExMode) {
			let cExMode = new CommandExMode();
			cExMode.open(action+' ');
		} else {
			Actions[action].command(args);
		}
	};
}
/* Add mappings related to one action to Pentadactyl */
function addMappings(action) {
	for (let i=0; i<Actions[action].mappings.length; i++) {
		let mapping= Actions[action].mappings[i];
		group.mappings.add([modes.NORMAL], mapping.keys,
			Actions[action].description,
			mappingFunction(action, mapping),
			{}
		);
	}
}
/* (Commented out until commands with arguments are implemented)
function defaultArgDescription(argName, defaultStr) {
	return ['  If ',['oa',{},argName],
		' is omitted, then the default value of ',
		['str',{},defaultStr],' is used.'];
}
*/
/* Currently this function creates the completions for a count option to a 
 * command. It will need to be modified to work with other options when they 
 * are added. 
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
/* Add a command and its mappings and its documentation to Pentadactyl.
 */
function addAction(action) {
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

	if (Actions[action].context === LOAD_CONTEXT.ZUTILO_ACTIVE) {
		description=[description,['p',{},'Note: Zutilo required']];
	}
	INFO.push(['item', {},
		['tags', {}, tagStr],
		specVal,
		['description', {},
			description]]);

	if ('mappings' in Actions[action]) {
		tagStr=Actions[action].mappings[0].keys.join(' ');
		specVal=tagStr;
		description=['p',{},'Executes ',['ex',{},':'+action]];

		INFO.push(['item', {},
			['tags', {}, tagStr],
			['spec',{},specVal],
			['description', {},
				description]]);
	}
}

/* Add a hint and its documentation to Pentadactyl */
function addHint(zhint) {
	hints.addMode(zhint.hint, zhint.description, zhint.command);

	let description=['p',{},zhint.description];
	if (zhint.context === LOAD_CONTEXT.ZUTILO_ACTIVE) {
		description=[description,['p',{},'Note: Zutilo required']];
	}
	INFO.push(['item', {},
        ['tags', {}, ';' + zhint.hint],
  		    ['spec', {}, ';' + zhint.hint],
		    ['description', {short: 'true'},
           	description]]);
}

/* Check that the state of Firefox matches the current state loading given 
 * command or hint. Mainly this makes sure Zutilo-dependent commands are not 
 * loaded when Zutilo is not installed or enabled.
 */
function validateContext(context, zutiloActive) {
	let contextValid = false;
	switch (context) {
		case LOAD_CONTEXT.ALWAYS:
			contextValid = true;
			break;
		case LOAD_CONTEXT.ZUTILO_ACTIVE:
			contextValid = zutiloActive;
			break;
		case LOAD_CONTEXT.ZUTILO_INACTIVE:
			contextValid = !zutiloActive;
			break;
	}

	return contextValid;
}

/* Actually process all of the actions and hints. Processing everything has to 
 * be inside an AddonManager callback since it depends on the state of Zutilo. 
 */
AddonManager.getAddonByID('zutilo@www.wesailatdawn.com',function(aAddon) {
	let zutiloActive = false;
	if (aAddon && (aAddon.isActive === true)) {
		zutiloActive = true;
	}

	for (let action in Actions) {
		if (Actions.hasOwnProperty(action)) {
			if (validateContext(Actions[action].context, zutiloActive)) {
				addAction(action);
			}
		}
	}

	zhints.forEach(function(zhint) {
		if (validateContext(zhint.context, zutiloActive)) {
			addHint(zhint);
		}
	});
});

