<section>
	<div>
		<slot />
	</div>
</section>

<style>
	div {
		display: flex;
		justify-content: center;
		gap: var(--size-4-1);
		min-width: min-content;
	}

	section {
		flex: 1;
		overflow-x: auto;
	}

	/* Hide scrollbar but keep functionality. */
	section::-webkit-scrollbar {
		display: none;
	}
</style>
