export function renderResult(container, data) {
  container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
}
