<script lang="ts">
	import { onDestroy } from 'svelte';
	import EditorContainer from '$lib/components/editor-container.svelte';
	import { encodeBase64, decodeBase64 } from '$lib/utils/base64-api';

	let leftContent = $state(``);
	let leftTheme = $state('vs-dark');

	let rightContent = $state(``);
	let rightTheme = $state('vs-dark');

	let syncThemes = $state(true);
	let isProcessing = $state(false);
	let lastModified = $state<'left' | 'right' | null>(null);
	let updateTimeoutId: ReturnType<typeof setTimeout> | null = null;
	
	onDestroy(() => {
		if (updateTimeoutId) {
			clearTimeout(updateTimeoutId);
		}
	});

	$effect(() => {
		if (syncThemes) {
			rightTheme = leftTheme;
		}
	});

	function processChange(content: string, direction: 'encode' | 'decode') {
		if (updateTimeoutId) {
			clearTimeout(updateTimeoutId);
		}

		updateTimeoutId = setTimeout(async () => {
			if (typeof window !== 'undefined') {
				console.log(`Processing ${direction}:`, content.substring(0, 50) + '...');
			}
			if (!content.trim()) {
				if (direction === 'decode') {
					rightContent = '';
					prevRight = '';
				} else {
					leftContent = '';
					prevLeft = '';
				}
				return;
			}

			if (content.startsWith('Erro:')) {
				return;
			}

			isProcessing = true;
			lastModified = direction === 'decode' ? 'left' : 'right';

			try {
				if (direction === 'decode') {
					const decoded = await decodeBase64(content);
					rightContent = decoded;
					prevRight = decoded;
				} else {
					const encoded = await encodeBase64(content);
					leftContent = encoded;
					prevLeft = encoded;
				}
			} catch (error) {
				if (direction === 'decode') {
					rightContent = 'Erro: Base64 inválido';
					prevRight = rightContent;
				}
				console.error('Erro ao processar:', error);
			} finally {
				isProcessing = false;
				setTimeout(() => {
					lastModified = null;
				}, 1000);
			}
		}, 300);
	}

	let prevLeft = '';
	$effect(() => {
		if (leftContent !== prevLeft && lastModified !== 'right') {
			prevLeft = leftContent;
			processChange(leftContent, 'decode');
		}
	});

	let prevRight = '';
	$effect(() => {
		if (rightContent !== prevRight && lastModified !== 'left') {
			prevRight = rightContent;
			processChange(rightContent, 'encode');
		}
	});

    let e = $state(``)
</script>

<div class="flex h-screen w-full flex-col bg-gray-900">
	<div class="border-b border-gray-700 bg-gray-800 p-4">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-xl font-bold text-white">Live Base64 Encoder/Decoder</h1>
				<p class="mt-1 text-sm text-gray-300">
					Edite em qualquer lado - Base64 ↔ Texto em tempo real
					{#if isProcessing}
						<span class="ml-2 text-yellow-400">• Processando...</span>
					{/if}
				</p>
			</div>
			<div class="flex items-center gap-3">
				<label class="flex items-center gap-2 text-sm text-gray-300">
					<input type="checkbox" bind:checked={syncThemes} class="rounded" />
					Sincronizar temas
				</label>
			</div>
		</div>
	</div>

	<div class="flex flex-1 flex-row bg-gray-900">
		<EditorContainer
			bind:content={leftContent}
			theme={leftTheme}
			title="Base64 {lastModified === 'left'
				? '→'
				: lastModified === 'right'
					? '←'
					: '↔'} Encode/Decode"
			readonly={false}
		/>
		<EditorContainer
			bind:content={rightContent}
			theme={rightTheme}
			title="Texto {lastModified === 'right' ? '→' : lastModified === 'left' ? '←' : '↔'} UTF-8"
			readonly={false}
		/>
	</div>
</div>
