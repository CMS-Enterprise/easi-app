# Frontend Documentation


## File Structure

All of the frontend React code lives in the `src` directory.

```javascript
├── src
│   ├── actions                   # Redux action creators
│   ├── components                # Common "EASi specific" React components used throughout the application
│   │   └── shared                # Common utility components (e.g. buttons, tables, loading spinner, etc.)
│   ├── constants                 # Application constants (e.g. Redux action types)
│   ├── reducers                  # Redux reducers
│   ├── sagas                     # Redux sagas
│   ├── services                  # Async actions or API calls
│   ├── types                     # Typescript interfaces and alias types
│   └── views                     # Page or layout components
│   ├── index.scss                # Entry point for all SCSS files
│   ├── index.tsx                 # Entry point to inject React into HTML
│   ├── store.ts                  # Initialization for Redux store
```
