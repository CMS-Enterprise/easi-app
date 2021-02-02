# Use `deleted_at` column for handling soft-delete of data

**User Story:** [ES 311](https://jiraent.cms.gov/browse/ES-311)

As our database grows in size and complexity, it is beneficial to have a
predetermined and unified pattern for handling soft-delete,
i.e. the functional deletion
of data from the user's perspective while maintaining that data in the database.

## Considered Alternatives

* Hard delete data
* Use a `is_deleted` or `deleted_at` column in each table
* Move deleted records to alternate tables called `deleted_$TABLE_NAME`
* Use one table for all deleted data, with each entry storing the
table whence the record was deleted along with a JSON blob of the deleted record.

## Decision Outcome

* Chosen Alternative: Use a `deleted_at` column

## Pros and Cons of the Alternatives <!-- optional -->

### Hard delete

* `+` No work involved
* `-` Extremely challenging to retrieve deleted data (if not impossible)
* `-` Does not record who deleted the data or when

### Use a `is_deleted` or `deleted_at` column in each table

* `+` Records when data is deleted
* `+` Easy to retrieve deleted data
* `-` Requires adding a `WHERE !is_deleted` clause to most fetch queries
* `-` Deleting a record with associations requires, in some cases,
a manual propagation of the deletion of the associations

### Move deleted records to alternate tables called `deleted_$TABLE_NAME`

* `+` No need for `WHERE` clause
* `+` Fairly easy to delete a record, though propagation of associations can
pose challenges
* `+` Easy retrieval of deleted records
* `-` Deleted tables must be updated when their original tables are changed
* `-` Somewhat involved to set up for existing tables

### Use one table for all deleted data

As described in [this article](https://transang.me/database-design-practice-soft-deletion-to/)

* `+` Deleted records don't clutter tables
* `-` Difficult to restore record if its table has been modified
