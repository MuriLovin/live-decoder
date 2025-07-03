<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

	let { value = $bindable(), language = 'properties', theme, readonly = false } = $props();

    let monaco: typeof Monaco;
	let editorContainer: HTMLDivElement;
	let editor: Monaco.editor.IStandaloneCodeEditor;

	onMount(async () => {
		try {
            monaco = (await import('$lib/monaco')).default;

			editor = monaco.editor.create(editorContainer, {
				value: value,
				language: language,
				theme: theme,
				readOnly: readonly,
				automaticLayout: true,
				fontSize: 14,
				fontFamily: '"Fira Code", "Courier New", monospace',
				lineNumbers: 'on',
				roundedSelection: false,
				scrollBeyondLastLine: false,
				minimap: { enabled: true },
				folding: true,
				links: true,
				selectOnLineNumbers: true,
				mouseWheelZoom: true
			});

			editor.onDidChangeModelContent(() => {
				value = editor.getValue();
			});
		} catch (error) {
			console.error('Erro ao carregar Monaco Editor:', error);
		}
	});

	onDestroy(() => {
		if (editor) {
			editor.dispose();
		}
	});

	$effect(() => {
		const model = editor?.getModel();
		if (model) {
			monaco.editor.setModelLanguage(model, language);
		}
	});

	$effect(() => {
		if (editor) {
			monaco.editor.setTheme(theme);
		}
	});

	$effect(() => {
		if (editor) {
			editor.updateOptions({ readOnly: readonly });
		}
	});

	$effect(() => {
		if (editor?.getValue() !== value) {
			const position = editor?.getPosition();
			editor?.setValue(value);
			if (position) {
				editor?.setPosition(position);
			}
		}
	});
</script>

<div bind:this={editorContainer} class="h-full min-h-[400px] w-full"></div>

<style>
	:global(.monaco-editor) {
		border-radius: 6px;
	}
</style>
