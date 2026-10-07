// Decode gzip as a stream to avoid holding a second complete compressed copy.
(() => {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, options) => {
    const requested = typeof input === 'string' ? input : input.url;
    const url = new URL(requested, document.baseURI);
    if (url.origin !== location.origin || !/\/index\.(wasm|pck)$/.test(url.pathname)) return nativeFetch(input, options);
    const filename = url.pathname.split('/').pop();
    url.pathname += '.gz';
    const response = await nativeFetch(url.href, options);
    if (!response.ok || !response.body) return response;
    const reader = response.body.getReader();
    let first = await reader.read();
    if (!first.done && first.value.byteLength < 2) {
      const next = await reader.read(), joined = new Uint8Array(first.value.byteLength + (next.done ? 0 : next.value.byteLength));
      joined.set(first.value); if (!next.done) joined.set(next.value, first.value.byteLength);
      first = {done: false, value: joined};
    }
    const compressed = !first.done && first.value[0] === 0x1f && first.value[1] === 0x8b;
    const body = new ReadableStream({
      start(controller) { if (first.done) controller.close(); else controller.enqueue(first.value); },
      async pull(controller) { const chunk = await reader.read(); if (chunk.done) controller.close(); else controller.enqueue(chunk.value); },
      cancel(reason) { return reader.cancel(reason); }
    });
    const decoded = compressed ? body.pipeThrough(new DecompressionStream('gzip')) : body;
    return new Response(decoded, { status: 200, headers: {
      'Content-Type': filename.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream',
      'Content-Length': String({"index.wasm":37685705,"index.pck":21217812}[filename])
    } });
  };
})();
