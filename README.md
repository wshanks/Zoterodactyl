Zoterodactyl
============
Zoterodactyl implements a set of commands, hints, and key mappings for working with Zotero using Pentadactyl without entering passthrough mode.

__Note:__ Some commands require the [Zutilo](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/) add-on and are neither added to Pentadactyl nor listed in Pentadactyl's documentation when Zutilo is not active. For the most recently updated and complete version of the documentation, see the [Zoterdactyl GitHub page](https://github.com/willsALMANJ/Zoterodactyl).

Commands
--------
__:zoterofocus:__ Show or focus Zotero

__zf:__ Executes `:zoterofocus`

__:zoteroclose:__ Hide Zotero

__zc:__ Executes `:zoteroclose`

__:zoteronewitemmenu:__ Open new item menu

__zN:__ Executes `:zoteronewitemmenu`

__:zoteronewwebitem:__ Create website item for the current page

__zw:__ Executes `:zoteronewwebitem`

__:zoteronextitem:__ Select next item

__J:__ Executes `:zoteronextitem`

__:zoteropreviousitem:__ Select previous item

__K:__ Executes `:zoteropreviousitem`

__:zoteroshiftselectnextitem:__ Select next item (holding previous selections)

__):__ Executes `:zoteroshiftselectnextitem`

__:zoteroshiftselectpreviousitem:__ Select next item (holding previous selections)

__(:__ Executes `:zoteroshiftselectpreviousitem`

__:zoterotoggleitem:__ Toggle current Zotero item's attachments open/closed

__zT:__ Executes `:zoterotoggleitem`

__:zoteroquickcopy:__ QuickCopy selected items to clipboard

__zq:__ Executes `:zoteroquickcopy`

__:zoteroyanktags:__ Copy ("yank") Zotero item tags

Note: Zutilo required

__zy:__ Executes `:zoteroyanktags`

__:zoteropastetags:__ Paste Zotero item tags

Note: Zutilo required

__zp:__ Executes `:zoteropastetags`

__:zoterocopycreators:__ Copy Zotero item creators

Note: Zutilo required

__zC:__ Executes `:zoterocopycreators`

__:zoteroshowpaths:__ Show attachment paths

Note: Zutilo required

__zP:__ Executes `:zoteroshowpaths`

__:zoteromodifypaths:__ Modify attachment paths

Note: Zutilo required

__zM:__ Executes `:zoteromodifypaths`

__:zoterorelateitems:__ Relate Zotero items

Note: Zutilo required

__zR:__ Executes `:zoterorelateitems`

__:zoteroedititem:__ Edit item info

Note: Zutilo required

__ze:__ Executes `:zoteroedititem`

__:zoteroaddnote:__ Add note to item

Note: Zutilo required

__zn:__ Executes `:zoteroaddnote`

__:zoteroaddtag:__ Add tag to item

Note: Zutilo required

__zt:__ Executes `:zoteroaddtag`

__:zoterorelateitemsdialog:__ Open relate items dialog

Note: Zutilo required

__z-R:__ Executes `:zoterorelateitemsdialog`

__:zoteroattachpage:__ Attach current page to current Zotero item

Note: Zutilo required

__za:__ Executes `:zoteroattachpage`

__:zoterosaveitem:__ Save item from page

__zs:__ Executes `:zoterosaveitem`

__zS:__ Executes `:zoterosaveitem -attachments opposite`

__z-s:__ Executes `:zoterosaveitem -attachments add`

__z-S:__ Executes `:zoterosaveitem -attachments skip`

__;z:__ Attach link target to current Zotero item

Note: Zutilo required

Notes
-----
Pentadactyl catches some keystrokes (e.g. `<Down>` and `<Up>`), preventing them from being passed to Zotero (e.g. to select the next or previous item in the case of `<Down>` and `<Up>`).  The Zoterodactyl plugins try to create workarounds for these keystrokes (e.g. `J` and `K` for `<Down>` and `<Up>`).  Other keystrokes (e.g. `<Return>` and `<Del>`) are passed to Zotero when it has focus (e.g. so typing `zf` to focus Zotero allows one to open the currently selected item by pressing `<Return>` and to delete it by pressing `<Del>`).

Two of Zoterodactyl's key mappings conflict with default Pentadactyl key mappings (`zM` and `zR`).  Pentadactyl provides alternate default key mappings that can be used instead (`ZM` and `ZR`).

Keep in mind that in Firefox `<C-Space>` opens context menus.  So once you have used `zf` to focus Zotero and `J` and `K` to navigate items, you can use `<C-Space>` and the `<Up>` and `<Down>` keys to select other operations on items not given mappings above (e.g. "Open in External Viewer" or "Show File").

Install
-------
Install this plugin by copying it to the `~/.pentadactyl/plugins/` directory (or `%USERPROFILE%\pentadactyl\plugins` on Windows).  You have to create this directory if it does not exist. Any plugins in that directory will be loaded on start up. Plugins can also be loaded with the `:lpl` command.  If you modify the plugin and want to load it again, it may be necessary to use `:lpl!` to overwrite the previously loaded version.

The plugin needs to be in a `plugins` directory of a directory in the `runtimepath` setting. If you want to use a different directory than `~/.pentadactyl`, you can add an additional directory to the `runtimepath` setting and save the plugin in a `plugins` subdirectory of it.

Zutilo
------
Zutilo is a Firefox add-on by the same author as Zoterodactyl. It provides keyboard shortcuts to existing Zotero functions as well as some new functions and GUI elements for accessing them. In order to avoid duplication of code, Zoterodactyl calls Zutilo functions where possible. Through Zutilo's preferences, it is possible to disable all of Zutilo's GUI elements if you just want to use Zoterodactyl without any other effects from having Zutilo installed (other than a "Zutilo preferences" entry in the Zotero gear icon menu).

Any Zoterodactyl functionality that simply wraps base Zotero functions is implemented independent of Zutilo. In order to avoid clutter and broken functions, the Zutilo-dependent functions are not defined when Zoterodactyl loads if it does not detect that Zutilo is enabled. If for some reason you are toggling Zutilo's enabled status, you can update Zoterodactyl either by doing a `:rehash` in Pentadactyl or forcing Pentadactyl to reload all plugins with `:lpl!`.

Updates
-------
Currently planned upcoming features are generally listed on [the wiki](https://github.com/willsALMANJ/Zoterodactyl/wiki) or [the issues section](https://github.com/willsALMANJ/Zoterodactyl/issues) of [Zoterodactyl's GitHub page](https://github.com/willsALMANJ/Zoterodactyl). If you think there are other commands that other users would find useful, please suggest them by contacting me or opening issue on GitHub.
