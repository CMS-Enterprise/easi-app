# CEDAR Intake API Client

## Tools / Helpers

### Swagger Generation

```terminal
swagger generate client -f cedar_intake.yml -c ./gen/client -m ./gen/models
```

### Convert JSON to YAML

```terminal
 yq eval --prettyPrint ./intake.json > intake.yml
```

## Wire Representation

There are several layers through which we need to to push data, and these
layers seem to have some contradictory behaviors, especially when trying to
represent zero values or undefined data. The main wrinkles seem to be
somewhere between `encoding/json` marshaling and `go-swagger` generated code.
The focusing question that ends up dictating what we actually do within the
OpenAPI/Swagger spec and the Go code is this: "What should the information look
like on the wire in its JSON representation?"

### Pertinent Negatives

Frequently in written communication it can be beneficial to state a "pertinent
negative", as in "yes, this field is empty". This can be a more explicit
approach than letting the _absence_ of a value mean something, e.g. using
`omitempty` from Go's `encoding/json` tags.

In speaking with the CEDAR team, our downstream consumers, they *do* prefer the
pertinent negative approach for data in the JSON bodies.

### Boolean

Booleans are a trap! One would like to think that you can get data down to a
very small world of two possibilities, but humans are frequently more complex
than that.

Frequently booleans expand in scope over time, the first of which represents a
third intention: "neither true nor false has been declared". Because of this,
it may be useful to avoid `type: boolean` in the Swagger spec, and opt for
using a `type: string` with enums for the three values of `"true"; "false"; ""`
in the trinary case.

### Dates / Date-Times

In a Swagger spec, if you define an (optional, i.e. not listed as required)
property as `type: string; format: date`, the `go-swagger` generated code uses
a `strfmt.Date` type. If you define a date it works fine, but if you don't
assign a date it uses the `time.Time` zero value and spits out a value of
`1970-01-01`, which gives an incorrect impression that the value has been
assigned.

To alleviate this challenge, it is possible to define the field only as a
`type: string` with no `format` directive. Then, a set field will travel across
the wire as defined, or an unset value will result in an empty string. Note
however, that the formatting of the date in this case is left to the code that
populates the field.
