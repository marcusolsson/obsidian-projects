# File system

Writing unit tests for Obsidian can be tricky, since a lot of the functionality isn't available outside of the Obsidian app.

The `filesystem` module abstracts the Obsidian vault so that unit tests can use an in-memory representation of notes.
