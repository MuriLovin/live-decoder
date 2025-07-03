<script lang="ts">
	import MonacoEditor from './monaco-editor.svelte';

	let { theme, content = $bindable(), title = 'Editor', readonly = false } = $props();
</script>

<div class="flex flex-1 flex-col border-r border-gray-700">
	<div class="border-b border-gray-700 bg-gray-800 p-3">
		<div class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				<h3 class="text-sm font-medium text-white">{title}</h3>
				{#if readonly}
					<span class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-400">Somente leitura</span>
				{/if}
			</div>
			<div class="flex items-center gap-2">
				<label class="text-sm text-gray-300">Tema:</label>
				<select
					bind:value={theme}
					class="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
				>
					<option value="vs-dark">VS Dark</option>
					<option value="vs">VS Light</option>
					<option value="hc-black">High Contrast</option>
				</select>
			</div>
		</div>
	</div>

	<div class="flex-1">
		<MonacoEditor bind:value={content} {theme} {readonly} />
	</div>

	<div class="border-t border-gray-700 bg-gray-800 p-2">
		<div class="flex gap-4 text-xs text-gray-300">
			<span>Caracteres: {content.length}</span>
			<span>Linhas: {content.split('\n').length}</span>
		</div>
	</div>
</div>
