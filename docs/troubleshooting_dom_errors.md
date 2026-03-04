# Troubleshooting DOM error: `removeChild` on `Node`

A common browser runtime error is:

> `Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`

This means code attempted to remove a DOM element from the wrong parent, or remove it after it was already removed.

## Typical causes

- The target element was already removed by another render/update cycle.
- The code is calling `parent.removeChild(child)` where `child.parentNode !== parent`.
- UI framework lifecycle race conditions (for example, manual DOM cleanup inside React/Vue-managed regions).
- Asynchronous callbacks acting on stale references.

## Safe patterns

### 1) Guard before removal (vanilla JavaScript)

```js
if (child && child.parentNode === parent) {
  parent.removeChild(child);
}
```

### 2) Prefer framework-owned cleanup

If you use React/Vue/Svelte, avoid direct manual DOM removal for nodes controlled by the framework. Let state changes drive unmounting.

### 3) Ignore if already detached

```js
child?.remove(); // no-op when child is detached in modern browsers
```

### 4) Prevent stale async cleanup

Store and check lifecycle flags in async handlers so cleanup only runs when the component/view is still mounted.

## Debug checklist

- Confirm the exact parent before calling `removeChild`.
- Add a log of `child.parentNode` and expected parent.
- Ensure cleanup runs only once.
- Avoid mixing direct DOM manipulation with framework-controlled render trees.

## Notes for this repository

This project is primarily Python-based. If this DOM error appears while viewing generated notebook output or external dashboards, it likely originates from frontend runtime code in the browser (not from backend parsing/scoring modules).
