# Motivation

There was no off-the-shelf plugin for creating ASCII file structure trees inside obsidian notes

# Credits

This is an obsidian repackage of **[Nathan Friend](https://gitlab.com/nfriend)** [tree.nathanfriend.io](tree.nathanfriend.io).

# Functionality

The plugin automatically changes

````md
```tree
I
  want
    to
    generate
  a
    nice
    tree
      diagram
```
````

into

```
.
└── I
    ├── want
    │   ├── to
    │   └── generate
    └── a
        ├── nice
        └── tree
            └── diagram
```
