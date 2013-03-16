# Hoppyhumle Blog Engine

A minimal blog engine based on neo4j and express.

## Configuration options

```
{
  "port": 1234, // Port that the server will run on
  "logger": "dev", // Log level to use (can be unset/null),
  "pubdir": __dirname + "/public" // Statically served pub dir
}
```

* Format of styling is `stylus` and should be supplied from the `css`
  dir under `pubdir`. 
