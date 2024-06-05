if (window.require !== undefined) {
    window.require.config({
        baseUrl: 'public/',
        "map": {
            "*": {
                "vega": "jupyter-vega/vega@5.26.1.js",
                "vega-lite": "jupyter-vega/vega-lite@5.16.3.js",
                "vega-embed": "jupyter-vega/vega-embed@6.23.0.js",
            },
        },
    });
}

define('jupyter-vega', ['vega', 'vega-lite', 'vega-embed'], function(vega, vegaLite, vegaEmbed) {    
    function javascriptIndex(selector, outputs) {
      // Return the index in the output array of the JS repr of this viz
      for (let i = 0; i < outputs.length; i++) {
        const item = outputs[i];
        if (
          item.metadata &&
          item.metadata["jupyter-vega"] === selector &&
          item.data["application/javascript"] !== undefined
        ) {
          return i;
        }
      }
      return -1;
    }
    
    function imageIndex(selector, outputs) {
      // Return the index in the output array of the PNG repr of this viz
      for (let i = 0; i < outputs.length; i++) {
        const item = outputs[i];
        if (
          item.metadata &&
          item.metadata["jupyter-vega"] === selector &&
          item.data["image/png"] !== undefined
        ) {
          return i;
        }
      }
      return -1;
    }
    
    function showError(el, error) {
      el.innerHTML = `<div class="error">
        <p>Javascript Error: ${error.message}</p>
        <p>This usually means there's a typo in your chart specification.
        See the JavaScript console for the full traceback.</p>
      </div>`;
    
      throw error;
    }
    
    function render(
      selector,
      spec,
      type,
      opt,
      output_area
    ) {
      // Never been rendered, so render JS and append the PNG to the
      // outputs for the cell
      const el = document.getElementById(selector.substring(1));
      vegaEmbed(el, spec, {
        loader: { http: { credentials: "same-origin" } },
        ...opt,
        mode: type,
      })
        .then((result) => {
          result.view
            .toImageURL("png")
            .then((imageData) => {
              if (output_area !== undefined) {
                const output = {
                  data: {
                    "image/png": imageData.split(",")[1],
                  },
                  metadata: { "jupyter-vega": selector },
                  output_type: "display_data",
                };
                // This appends the PNG output, but doesn't render it this time
                // as the JS version will be rendered already.
                output_area.outputs.push(output);
              }
            })
            .catch((error) => showError(el, error));
        })
        .catch((error) => showError(el, error));
    }
    
    // Add the function to Vega embed to render them
    vegaEmbed.render = render;
    vegaEmbed.showError = showError;
    vegaEmbed.imageIndex = imageIndex;
    vegaEmbed.javascriptIndex = javascriptIndex;

    return vegaEmbed;
});
