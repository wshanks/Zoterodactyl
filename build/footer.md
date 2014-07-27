Notes
-----
Pentadactyl catches some keystrokes (e.g. `<Down>` and `<Up>`), preventing them from being passed to Zotero (e.g. to select the next or previous item in the case of `<Down>` and `<Up>`).  The Zoterodactyl plugins try to create workarounds for these keystrokes (e.g. `J` and `K` for `<Down>` and `<Up>`).  Other keystrokes (e.g. `<Return>` and `<Del>`) are passed to Zotero when it has focus (e.g. so typing `zf` to focus Zotero allows one to open the currently selected item by pressing `<Return>` and to delete it by pressing `<Del>`).

Two of Zoterodactyl's key mappings conflict with default Pentadactyl key mappings (`zM` and `zR`).  Pentadactyl provides alternate default key mappings that can be used instead (`ZM` and `ZR`).

Keep in mind that in Firefox `<C-Space>` opens context menus.  So once you have used `zf` to focus Zotero and `J` and `K` to navigate items, you can use `<C-Space>` and the `<Up>` and `<Down>` keys to select other operations on items not given mappings above (e.g. "Open in External Viewer" or "Show File").

Install
-------
Install this plugin by copying it to the `~/.pentadactyl/plugins/` directory (or `%USERPROFILE%\pentadactyl\plugins` on Windows).  You have to create this directory if it does not exist. Any plugins in that directory will be loaded on start up. Plugins can also be loaded with the `:lpl` command.  If you modify the plugin and want to load it again, it may be necessary to use `:lpl!` to overwrite the previously loaded version.

The plugin needs to be in a `plugins` directory of a directory in the `runtimepath` setting. If you want to use a different directory than `~/.pentadactyl`, you can add an additional directory to the `runtimepath` setting and save the plugin in a `plugins` subdirectory of it.

Updates
-------
So far, these are the commands I have found it useful to have key mappings for.  If you think there are other commands that other users would find useful, please suggest them by contacting me or opening issue on GitHub.
