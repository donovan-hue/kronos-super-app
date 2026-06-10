import React from 'react';
import { useNavigate } from 'react-router-dom';

const HASHTAG_RE = /(#[\w\u00C0-\u017F]+)/g;

export default function HashtagText({ text, style = {} }) {
  const navigate = useNavigate();
  if (!text) return null;

  const parts = text.split(HASHTAG_RE);

  return (
    <span style={style}>
      {parts.map((part, i) =>
        HASHTAG_RE.test(part) ? (
          <span
            key={i}
            onClick={e => { e.stopPropagation(); navigate(`/search?q=${encodeURIComponent(part.slice(1))}`); }}
            style={{ color: '#c9ced4', cursor: 'pointer', fontWeight: 600 }}
          >
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}
