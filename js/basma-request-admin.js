
/* Visible request controls are installed automatically by main.js.
   This helper can also be used by custom request renderers. */
window.renderBasmaRequestActions = function(container, request) {
  if (!container || !request || !request.id) return;
  container.setAttribute('data-request-id', request.id);
  if (request.status) container.dataset.status = request.status;
  if (window.BasmaVisibleRequestControls) {
    window.BasmaVisibleRequestControls.addControls(container);
  }
};
