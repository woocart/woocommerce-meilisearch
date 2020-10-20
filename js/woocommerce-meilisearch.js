function initWooCommerceMeiliSearch() {
  const el = document.getElementById('wcms__search-terms')
  el.addEventListener('keyup', (event) => {
    const terms = event.target.value
    searchWooCommerceMeiliSearch(terms)
  })
}

function searchWooCommerceMeiliSearch(terms) {
  (async () => {
    const client = new MeiliSearch({
      host: `${wcms.hostname}:${wcms.port}`,
      apiKey: wcms.public_key,
    })

    const index = client.getIndex(wcms.index)
    const result = await index.search(terms)

    const el = document.getElementById('wcms__search-hits')
    
    let html = '<ul>'
    result.hits.forEach(hit => {
      html += `<li>${hit.name} - ${hit.price_html} - ${hit.stock_quantity || 0} units</li>`
    })
    html += '</ul>'
    el.innerHTML = html
  })()
}

document.addEventListener('DOMContentLoaded', initWooCommerceMeiliSearch)