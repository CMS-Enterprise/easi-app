# *Dates and Time*

Dates and times are tricky things, and even trickier when developing a
web-based application. We need to come to standards about how we store
and represent dates/times to our users. This ADR seeks to do that.

The main drivers of this ADR are:

* Consistent parsing of dates/times in the front end application
* Standardization on a date/time format for the API
* Agreement on how we store dates/times in our database

## Dates

### Considered Alternatives - Dates

* Always use a full timestamp to represent dates
* Use only a datestamp to represent dates

### Decision Outcome - Dates

* Chosen Alternative: Use only a datestamp to represent dates
* Justification:
  * If we don't care about the time something is occurring at (ie we're
  only storing a date), then storing a full timestamp adds unnecessary complexity
* Consequences:
  * If we decide to convert dates to times in the future, some weird backfill
  data might occur. This is likely to happen even with our current use of
  timestamps for dates because we're storing the date with a time of midnight

### Pros and Cons of the Alternatives  - Dates

#### Always use a full timestamp to represent dates

* `+` Add consistency to our app (no need to figure out if it's a date or a timestamp)
* `-` We're storing additional, incorrect/invalid information

## Times

### Considered Alternatives - Times

* Ignore timezones and store absolute times (using utc as a default)
* Always take user's timezone into account when displaying times

### Decision Outcome - Times

* Chosen Alternative: Ignore timezones and store absolute times
* Justification:
  * The users of our application are all co-located in one timezone and assume
  their work is done in that timezone
  * Changing the time to the user's local time could potentially, improperly,
  display time to users
* Consequences:
  * Could make time zones more complicated if we decide we need them

### Pros and Cons of the Alternatives - Times

#### Always take user's timezone into account when displaying times

* `+` Most accurate way to display times
* `-` Complex to parse times in and out of the API
