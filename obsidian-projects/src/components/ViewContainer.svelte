<section>
	<div>
		<slot />
	</div>
</section>

<style>
	div {
		display: flex;
		gap: 4px;
		justify-content: center;
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
