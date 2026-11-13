import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';

/**
 * In-place editable text component.
 * Allows clicking anywhere to edit directly on the resume page.
 * Displays field label in tooltip and hover tag when editing.
 *
 * IMPORTANT: Content is managed entirely through refs, NOT React children.
 * Passing {value} as a child to a contentEditable element causes React's
 * reconciler to overwrite DOM text on every parent re-render, which resets
 * or locks the field mid-typing.
 */
export default function EditableText({
  value = '',
  onChange,
  isEditing = false,
  className = '',
  label = '',
  placeholder = 'Click to edit...',
  multiline = false,
  as: Component = 'span',
  title = '',
  style = {}
}) {
  const ref = useRef(null);
  // Track empty state locally so placeholder styling updates during typing,
  // not just on blur when `value` prop finally updates.
  const [localEmpty, setLocalEmpty] = useState(!value || value.trim() === '');

  // Sync content via ref — runs before browser paint to avoid flash.
  // Skips update when the element is focused (user is actively typing).
  useLayoutEffect(() => {
    if (ref.current && isEditing) {
      if (document.activeElement !== ref.current) {
        const current = ref.current.innerText || '';
        const target = value || '';
        if (current !== target) {
          ref.current.innerText = target;
        }
        setLocalEmpty(!target || target.trim() === '');
      }
    }
  }, [value, isEditing]);

  if (!isEditing) {
    if (!value) return null;
    return (
      <Component className={className} style={style} title={title}>
        {value}
      </Component>
    );
  }

  const handleInput = (e) => {
    const text = (e.currentTarget.innerText || '').trim();
    setLocalEmpty(!text);
  };

  const handleBlur = (e) => {
    const text = (e.currentTarget.innerText || '').trim();
    setLocalEmpty(!text);
    if (text !== (value || '') && onChange) {
      onChange(text);
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const tooltipText = label || title || placeholder || 'Click to edit';

  // No children — content is set exclusively via ref in useLayoutEffect.
  // This prevents React from reconciling text nodes and overwriting user input.
  return (
    <Component
      ref={ref}
      contentEditable={true}
      suppressContentEditableWarning={true}
      className={`editable-field ${multiline ? 'is-multiline' : ''} ${localEmpty ? 'is-empty' : ''} ${className}`}
      data-placeholder={placeholder}
      data-label={label || undefined}
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      title={tooltipText}
      style={style}
    />
  );
}
