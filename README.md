# VSCode Operation Tracker

This is a super simple, rough extension to record local editing logs while working in vscode. I'm writing this to help record traces to benchmark collaborative editing software; but you can use it for whatever.

Each editing session is stored in a file (by default in `~/vscodelogs/`). Each line in the output file contains an event represented in JSON. Eg here I opened vscode with a previously open project (pushpin) and had *DESIGN.md* open. Then I typed 3 characters ("dfs") in line 80. The location is recorded both in line/character notation via `range` and character position via `rangeOffset`. The `rangeLength` field specifies the number of deleted characters in a change, and `text` the inserted text at that location.

The extension also records files created and files deleted.

By default the text content of each file is recorded to the log when the file is opened and closed. This can be turned off via the settings. The log files can get large - but its better to err on the side of recording too much than not enough.

```
➭ cat ~/vscodelogs/actions_10_09_2020_DFKAeZ2h.json 
{"type":"open","time":"2020-09-10T03:20:12.853Z","fileName":"/Users/josephg/3rdparty/pushpin/DESIGN.md"}
{"type":"initialized","time":"2020-09-10T03:20:12.853Z"}
{"type":"change","time":"2020-09-10T03:19:39.658Z","fileName":"/Users/josephg/3rdparty/pushpin/DESIGN.md","change":[{"range":[{"line":80,"character":1},{"line":80,"character":1}],"rangeOffset":4092,"rangeLength":0,"text":"d"}]}
{"type":"change","time":"2020-09-10T03:19:39.708Z","fileName":"/Users/josephg/3rdparty/pushpin/DESIGN.md","change":[{"range":[{"line":80,"character":2},{"line":80,"character":2}],"rangeOffset":4093,"rangeLength":0,"text":"f"}]}
{"type":"change","time":"2020-09-10T03:19:39.818Z","fileName":"/Users/josephg/3rdparty/pushpin/DESIGN.md","change":[{"range":[{"line":80,"character":3},{"line":80,"character":3}],"rangeOffset":4094,"rangeLength":0,"text":"s"}]}
```

## Extension Settings

This extension contributes the following settings:

* `operationtracker.outputDirectory`: Directory to store log files
* `operationtracker.storeContents`: Store full file contents on open / close

