import React from 'react';

export function scopeVectorIds(ast, scope) {
  function child(value) {
    if (!React.isValidElement(value)) return value;
    const props = {};
    for (const [key, item] of Object.entries(value.props)) {
      if (key === 'children') continue;
      props[key] = key === 'id' ? `${item}_${scope}` : typeof item === 'string' ? item.replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${id}_${scope})`) : item;
    }
    const children = React.Children.toArray(value.props.children).map(child);
    return children.length ? React.cloneElement(value, props, children) : React.cloneElement(value, props);
  }
  return { ...ast, children: ast.children.map(child) };
}
