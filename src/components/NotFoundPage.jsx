import React from 'react';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-page__card">
        <span className="not-found-page__code">404</span>
        <h1>Page not found</h1>
        <p>The page you’re looking for doesn’t exist or may have moved.</p>
        <button type="button" className="btn btn--primary" onClick={() => { window.location.href = '/'; }}>
          Back to elCVate
        </button>
      </div>
    </main>
  );
}
