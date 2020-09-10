// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {createWriteStream, promises as fs} from 'fs'
import * as path from 'path'
import {randomBytes} from 'crypto'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration("operationtracker")
	const outputDir = path.join(...(config.get('outputDirectory') as string)
		.split(path.sep)
		.map(entry => entry === '~'
			? (process.env['HOME'] || '.')
			: entry)
	)

	const storeContent = config.get('storeContents')

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "operation-track" is now active!');

	const logStream = (async () => {
		// Its easier to just try and create the directory no matter what.
		try { await fs.mkdir(outputDir, {recursive: true}) }
		catch (e) {
			// Ignore if the directory already exists
			if (e.code !== 'EEXIST') throw e
		}
		
		// eg 10_09_2020
		const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '_')
		// Using crypto randombytes because its easier. Using filesafe base64.
		const suffix = randomBytes(6).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
		const filename = path.join(outputDir, `actions_${date}_${suffix}.json`)
		
		const stream = createWriteStream(filename, {flags: 'a'}) // Default options are fine.
		vscode.window.showInformationMessage('tracking loaded to ' + filename);
		return stream
	})()

	logStream.catch(e => vscode.window.showErrorMessage('Error opening log file', e.stack))

	const writeAction = (type: string, details: any) => {
		if (!storeContent) delete details.content
		
		logStream.then(s => s.write(JSON.stringify({
			type,
			time: new Date().toISOString(),
			...details
		}) + '\n'))
	}

	vscode.workspace.textDocuments.forEach(doc => {
		// console.log('has document open', doc.fileName)
		writeAction('open', {fileName: doc.fileName, content: doc.getText()})
	})

	writeAction('initialized', {})

	vscode.workspace.onDidOpenTextDocument(doc => {
		// console.log('opened document', doc.fileName)
		writeAction('open', {fileName: doc.fileName, content: doc.getText()})
	})
	
	vscode.workspace.onDidCloseTextDocument(doc => {
		writeAction('closed', {fileName: doc.fileName, content: doc.getText()})
	})

	vscode.workspace.onDidCreateFiles(e => {
		writeAction('create files', {
			files: e.files.map(f => f.fsPath)
		})
	})

	vscode.workspace.onDidDeleteFiles(e => {
		writeAction('delete files', {
			files: e.files.map(f => f.fsPath)
		})
	})

	vscode.workspace.onDidChangeTextDocument(e => {
		// console.log('change event', e)
		// console.log('save', e.document.fileName, JSON.stringify(e.contentChanges))

		writeAction('change', {
			fileName: e.document.fileName,
			change: e.contentChanges
		})

		// console.log(e.contentChanges.map(change => {
		// 	// return {
		// 	// 	start: e.document.offsetAt(change.range.start),
		// 	// 	end: e.document.offsetAt(change.range.end)
		// 	// }
		// }))

		
	})

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('operation-track.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showErrorMessage('Yooo');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
