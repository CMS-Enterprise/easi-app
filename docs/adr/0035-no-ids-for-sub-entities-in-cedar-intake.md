# Don't need to send unique IDs for sub-entities to the CEDAR Intake API

When discussing [EASI-1538](https://jiraent.cms.gov/browse/EASI-1538) with the CEDAR team, the question arose of whether we needed to have unique IDs for sub-entities (non-top-level entities) when submitting data to the CEDAR Intake API. Examples of such sub-entities are the business solutions and lifecycle cost lines included in business cases. Sometimes, these sub-entities don't have IDs at all in our database, or the IDs are not constant over time due to the entities being deleted and regenerated (this happens with lifecycle cost lines). On October 10, 2022, Clay Benson, Dylan Sprague, and John Shoup from the CMS CEDAR team met to discuss whether the EASi team needed to guarantee unique, stable IDs for sub-entities.

## Considered Alternatives

* Ensure that every entity submitted to CEDAR, even sub-entities, has a unique, stable ID.
* Don't need to always create and send IDs for sub-entities; CEDAR and Alfabet can delete and regenerate the sub-entities when a top-level entity is updated.

## Decision Outcome

* Chosen Alternative: Don't use IDs for sub-entities. It's probably easier for CEDAR and Alfabet to delete and regenerate all sub-entities, rather than figuring out which ones need to be updated/created/deleted from our JSON payload. Additionally, we don't have to worry about the redundancy and possible code duplication/inconsistency in generating unique IDs for each sub-entity, or the work involved in reworking our database/internal models to have unique, stable IDs for sub-entities.

## Pros and Cons of the Alternatives

### Create unique, stable ID for all entities submitted to CEDAR Intake, even sub-entities.

* `+` Would always allow CEDAR and Alfabet to tie sub-entities they store to unique entities in EASi's database.
* `-` CEDAR would need more complicated logic in their mapping code to check for which sub-entities to update when a top-level entity was updated.
* `-` Would require greater engineering work for us (both in generating unique IDs and possibly in reworking our data model(s)) without a clear benefit.
