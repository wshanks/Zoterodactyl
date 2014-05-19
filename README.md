Zoterodactyl
============
Zoterodactyl is a set of Pentadactyl plugins that provide key mappings for [Zotero](http://www.zotero.org), so that common operations can be performed without entering passthrough mode.  `zotero_keys.js` provides mappings that work with basic Zotero.  `zutilo_keys.js` provides keys for the [Zutilo](https://github.com/willsALMANJ/Zutilo) plugin for Zotero.  

__Note:__ the documentation below is currently a bit out of date. The most up to date documentation is contained in `:help plugins` inside Pentadactyl. All of the commands listed below still exist but they now are also available as ex commands for easy remapping. Once I find any way to convert Pentadactyl's documentation XML into markdown, this README file will be updated.

zotero_keys.js
--------------
* __<count>zf:__ Open the Zotero pane (if it is closed) and focus it.  If `<count>` is not given, focus the items pane.  For `<count>==1`, focus the search box.  For `<count>==2`, focus the collection pane (Mnemonic: "focus").

* __zc:__ Hide the Zotero pane (Mnemonic: "close").

* __zs:__ Create an item based on the content of the current page (Mnemonic: "save").

* __zN:__ Open the new item menu (to select the item type to create).

* __zw:__ Create a website item for the current page.

* __J:__ Select the next item in the collection (equivalent to `<Up>` in passthrough mode.).

* __K:__ Select the previous item in the collection (equivalent to `<Down>` in passthrough mode.).

* __):__ Select the next item in the collection while holding previous selection (equivalent to `<S-Up>` in passthrough mode.).

* __(:__ Select the previous item in the collection while holding previous selection (equivalent to `<S-Down>` in passthrough mode.).

* __zT:__ Toggle current Zotero item's children (attachments and notes) open and closed.

* __zq:__ Use Zotero's [Quick Copy](http://www.zotero.org/support/creating_bibliographies) on selected items.

zutilo_keys.js
--------------
### Key mappings ###
* __zy:__ Copy selected Zotero items' tags to the clipboard (Mnemonic: "yank").

* __zp:__ Paste tags from clipboard to selected Zotero items.

* __zC:__ Copy selected Zotero items' creators to the clipboard.

* __zP:__ Show paths of all attachments of selected Zotero items.

* __zM:__ Modify paths of all attachments of selected Zotero items.

* __zR:__ Relate selected Zotero items.

* __ze:__ Focus the info pane of selected Zotero item and then focus its first text box (Mnemonic: "edit").

* __zn:__ Add a new note to the current Zotero item.

* __zt:__ Focus the tags pane of selected Zotero item and then focus a new tag entry box.

* __z-R:__ Open the relate items dialog window for the currently selected Zotero item.

* __za:__ Attach the current page to the currently selected Zotero item.

* __zS:__ Create an item based on the content of the current page, using the opposite behavior for attaching associated files as is set in Zotero's preferences.

* __z-s:__ Create an item based on the content of the current page and attach associated files regardless of Zotero's preferences.

* __z-S:__ Create an item based on the content of the current page and do not attach associated files regardless of Zotero's preferences.

### Hints ###
* __z:__ Attach link target to the currently selected Zotero item.

Notes
-----
Pentadactyl catches some keystrokes (e.g. `<Down>` and `<Up>`), preventing them from being passed to Zotero (e.g. to select the next or previous item in the case of `<Down>` and `<Up>`).  The Zoterodactyl plugins try to create workarounds for these keystrokes (e.g. `J` and `K` for `<Down>` and `<Up>`).  Other keystrokes (e.g. `<Return>` and `<Del>`) are passed to Zotero when it has focus (e.g. so typing `zf` to focus Zotero allows one to open the currently selected item by pressing `<Return>` and to delete it by pressing `<Del>`).

Two of Zoterodactyl's key mappings conflict with default Pentadactyl key mappings (`zM` and `zR`).  Pentadactyl provides alternate default key mappings that can be used instead (`ZM` and `ZR`).

Keep in mind that in Firefox `<C-Space>` opens context menus.  So once you have used `zf` to focus Zotero and `J` and `K` to navigate items, you can use `<C-Space>` and the `<Up>` and `<Down>` keys to select other operations on items not given mappings above (e.g. "Open in External Viewer" or "Show File").

Install
-------
Install these plugins by copying them to the `~/.pentadactyl/plugins/` directory (or `%USERPROFILE%\pentadactyl\plugins` on Windows).  You have to create this directory if it does not exist. Any plugins in that directory will be loaded on start up. Plugins can also be loaded with the `:lpl` command.  If you modify the plugin and want to load it again, it may be necessary to use `:lpl!` to overwrite the previously loaded version.

The plugins need to be in a `plugins` directory of a directory in the `runtimepath` setting. If you want to use a different directory than `~/.pentadactyl`, you can add an additional directory to the `runtimepath` setting and save the plugins in a `plugins` subdirectory of it.

Updates
-------
So far, these are the commands I have found it useful to have key mappings for.  If you think there are other commands that other users would find useful, please suggest them by contacting me or opening issue on GitHub.
