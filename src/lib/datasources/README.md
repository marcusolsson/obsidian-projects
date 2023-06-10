# Data sources

This module contains _data sources_ for Projects. Data sources abstracts the logic for extracting data from your notes.

A data source is responsible for converting a query to a _data frame_, the primary data format for Projects.

- [dataview](./dataview)
- [folder](./folder)
- [tag](./tag)

The `frontmatter` data source is an intermediate abstraction for notes that uses frontmatter to define data fields, such as `folder` and `tag`.
