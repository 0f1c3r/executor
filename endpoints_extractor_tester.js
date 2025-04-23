javascript:(function(){
    const container = document.createElement('div');
    container.style = 'position:fixed;top:0;right:0;width:500px;height:100%;background:#1e1e1e;color:#f0f0f0;z-index:999999;overflow:auto;padding:10px;font-family:monospace;border-left:1px solid #444;';
    document.body.appendChild(container);
    
    const styles = `
      .ep-btn { 
        background:#2a2a2a; 
        border:1px solid #444; 
        color:#f0f0f0; 
        padding:4px 8px; 
        border-radius:3px; 
        cursor:pointer; 
        margin-right:5px; 
      }
      .ep-btn:hover { background:#3a3a3a; }
      .ep-input { 
        background:#2a2a2a; 
        border:1px solid #444; 
        color:#f0f0f0; 
        padding:4px; 
        width:100%; 
        box-sizing:border-box; 
      }
      .ep-item {
        margin-bottom:8px;
        padding:8px;
        background:#2a2a2a;
        border-radius:3px;
        border-left:3px solid #4af;
      }
      .ep-tab {
        display:inline-block;
        padding:5px 10px;
        cursor:pointer;
        border-bottom:2px solid transparent;
      }
      .ep-tab.active {
        border-bottom:2px solid #4af;
        font-weight:bold;
      }
      .ep-panel {
        display:none;
        padding:10px 0;
      }
      .ep-panel.active {
        display:block;
      }
      .ep-pill {
        display:inline-block;
        background:#444;
        color:#ccc;
        font-size:11px;
        padding:1px 6px;
        border-radius:10px;
        margin-left:5px;
      }
      .ep-pill.get {
        background:#28a745;
        color:#fff;
      }
      .ep-pill.post {
        background:#007bff;
        color:#fff;
      }
      .post-params {
        margin-top:5px;
        padding:5px;
        background:#333;
        border-radius:3px;
        font-size:12px;
      }
      .post-param-item {
        display:flex;
        padding:2px 0;
      }
      .post-param-name {
        color:#a6e22e;
        margin-right:8px;
      }
    `;

    const additionalStyle = `
    #ep-response-body pre {
        color: #fff !important;
        font-family: monospace;
        line-height: 1.4;
    }
    #ep-response-body {
        border: 1px solid #444;
        background: #222;
        border-radius: 3px;
    }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.textContent = styles + additionalStyle;
    document.head.appendChild(styleEl);
    
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3 style="margin:0 0 5px 0;color:#aaa;">Endpoints Extractor & Tester</h3>
          <div style="font-size:11px;color:#777;">Made by <a href="https://www.linkedin.com/in/senad-cavkusic/" target="_blank" style="color:#4af;text-decoration:none;">0f1cer</a></div>
        </div>
        <button id="ep-close" class="ep-btn">✕</button>
      </div>
      
      <div class="ep-tabs">
        <div id="tab-endpoints" class="ep-tab active">Endpoints</div>
        <div id="tab-request" class="ep-tab">Request Builder</div>
        <div id="tab-response" class="ep-tab">Response</div>
      </div>
      
      <div id="panel-endpoints" class="ep-panel active">
        <div style="margin:10px 0;display:flex;gap:5px;">
          <input id="ep-filter" placeholder="Filter endpoints..." class="ep-input" style="flex:1;">
          <button id="ep-copy" class="ep-btn">Copy</button>
          <button id="ep-download" class="ep-btn">Export</button>
        </div>
        <div id="ep-status" style="margin:5px 0;font-size:12px;color:#aaa;">Scanning page...</div>
        <div id="ep-results"></div>
      </div>
      
      <div id="panel-request" class="ep-panel">
        <div style="margin:10px 0;">
          <label>URL:</label>
          <input id="ep-url" class="ep-input" style="margin:5px 0;">
        </div>
        
        <div style="margin:10px 0;display:flex;gap:5px;">
          <select id="ep-method" class="ep-input" style="width:auto;">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
          <button id="ep-send" class="ep-btn">Send Request</button>
          <button id="ep-params" class="ep-btn">Parse Parameters</button>
        </div>
        
        <div style="margin:10px 0;">
          <label>Headers:</label>
          <textarea id="ep-headers" class="ep-input" style="height:100px;margin:5px 0;" placeholder="Content-Type: application/json
  Authorization: Bearer token"></textarea>
        </div>
        
        <div style="margin:10px 0;">
          <label>Request Body:</label>
          <textarea id="ep-body" class="ep-input" style="height:150px;margin:5px 0;" placeholder="{
    &quot;key&quot;: &quot;value&quot;
  }"></textarea>
        </div>
        
        <div style="margin:10px 0;">
          <label>Parameters:</label>
          <div id="ep-params-list" style="margin:5px 0;"></div>
          <div style="display:flex;gap:5px;margin-top:5px;">
            <input id="ep-param-name" placeholder="Name" class="ep-input" style="flex:1;">
            <input id="ep-param-value" placeholder="Value" class="ep-input" style="flex:1;">
            <button id="ep-add-param" class="ep-btn">Add</button>
          </div>
        </div>
      </div>
      
      <div id="panel-response" class="ep-panel">
        <div id="ep-response-status" style="margin:10px 0;"></div>
        <div style="margin:10px 0;">
          <label>Response Headers:</label>
          <div id="ep-response-headers" style="margin:5px 0;"></div>
        </div>
        <div style="margin:10px 0;">
          <label>Response Body:</label>
          <div id="ep-response-body" style="margin:5px 0;max-height:400px;overflow:auto;"></div>
        </div>
      </div>
    `;
    
    const tabs = container.querySelectorAll('.ep-tab');
    const panels = container.querySelectorAll('.ep-panel');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const panelId = tab.id.replace('tab-', 'panel-');
        document.getElementById(panelId).classList.add('active');
      });
    });
    
    document.getElementById('ep-close').addEventListener('click', () => {
      container.remove();
      styleEl.remove();
    });
    document.getElementById('ep-copy').addEventListener('click', copyResults);
    document.getElementById('ep-download').addEventListener('click', downloadResults);
    document.getElementById('ep-filter').addEventListener('input', filterResults);
    document.getElementById('ep-send').addEventListener('click', sendRequest);
    document.getElementById('ep-params').addEventListener('click', parseUrlParameters);
    document.getElementById('ep-add-param').addEventListener('click', addParameter);
    
    const regexPatterns = [
      /(?<=(["'`]|=|\s+))\/[a-zA-Z0-9_?&=.\/\-#%+~:@\[\]\{\}\|^]*(?=(["'`]|\s|>|\)|}))/g,
      /(?<=["'`])(https?:\/\/[a-zA-Z0-9_?&=.\/\-#%+~:@\[\]\{\}\|^]*)(?=["'`])/g,  
      /(?<=(api|v[0-9]+|api\/v[0-9]+)\/)[a-zA-Z0-9_?&=.\/\-#%+~:@\[\]\{\}\|^]+/g  
    ];
    
    const endpointInfo = new Map();
    const results = new Set();
    const statusEl = document.getElementById('ep-status');
    const resultsEl = document.getElementById('ep-results');
    const paramsList = document.getElementById('ep-params-list');
    const responseStatusEl = document.getElementById('ep-response-status');
    const responseHeadersEl = document.getElementById('ep-response-headers');
    const responseBodyEl = document.getElementById('ep-response-body');
    
    const urlParameters = new Map();
    
    function updateStatus(msg) {
      statusEl.textContent = msg;
    }
    
    function addParameter() {
      const name = document.getElementById('ep-param-name').value.trim();
      const value = document.getElementById('ep-param-value').value.trim();
      
      if (name) {
        const url = document.getElementById('ep-url').value.trim();
        let params = urlParameters.get(url) || [];
        params = params.filter(p => p.name !== name);
        params.push({ name, value });
        urlParameters.set(url, params);
        
        document.getElementById('ep-param-name').value = '';
        document.getElementById('ep-param-value').value = '';
        
        updateParametersList(url);
        updateUrlWithParameters(url);
      }
    }
    
    function updateParametersList(url) {
      const params = urlParameters.get(url) || [];
      
      paramsList.innerHTML = params.length === 0 ? 
        '<div style="color:#aaa;font-size:12px;">No parameters yet</div>' : 
        params.map((param, index) => `
          <div style="display:flex;gap:5px;margin-bottom:5px;align-items:center;">
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;">${param.name}=${param.value}</span>
            <button class="ep-btn ep-remove-param" data-index="${index}">✕</button>
          </div>
        `).join('');
      
      document.querySelectorAll('.ep-remove-param').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          params.splice(index, 1);
          urlParameters.set(url, params);
          updateParametersList(url);
          updateUrlWithParameters(url);
        });
      });
    }
    
    function updateUrlWithParameters(url) {
      const params = urlParameters.get(url) || [];
      
      if (params.length === 0) {
        document.getElementById('ep-url').value = url.split('?')[0];
        return;
      }
      
      const baseUrl = url.split('?')[0];
      const queryString = params
        .map(p => `${encodeURIComponent(p.name)}=${encodeURIComponent(p.value)}`)
        .join('&');
      
      document.getElementById('ep-url').value = `${baseUrl}?${queryString}`;
    }
    
    function parseUrlParameters() {
      const url = document.getElementById('ep-url').value.trim();
      
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://example.com${url}`);
        const params = [];
        
        urlObj.searchParams.forEach((value, name) => {
          params.push({ name, value });
        });
        
        urlParameters.set(url.split('?')[0], params);
        updateParametersList(url.split('?')[0]);
        
        if (params.length > 0) {
          updateStatus(`Found ${params.length} parameters`);
        } else {
          updateStatus('No parameters found in URL');
        }
      } catch (e) {
        updateStatus('Error parsing URL parameters');
      }
    }
    
    function syntaxHighlight(json) {
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
        function (match) {
          let cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
              match = match.replace(':', '');
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          
          const colors = {
            'key': '#a6e22e',
            'string': '#e6db74',
            'number': '#ae81ff',
            'boolean': '#66d9ef',
            'null': '#fd971f'
          };
          
          const color = colors[cls] || '#fff';
          
          if (cls === 'key') {
            return `<span style="color:${color}">${match}</span>: `;
          } else {
            return `<span style="color:${color}">${match}</span>`;
          }
        }
      );
    }
    
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    function sendRequest() {
      const url = document.getElementById('ep-url').value.trim();
      const method = document.getElementById('ep-method').value;
      const headersText = document.getElementById('ep-headers').value.trim();
      const body = document.getElementById('ep-body').value.trim();
      
      const headers = {};
      if (headersText) {
        headersText.split('\n').forEach(line => {
          const [name, value] = line.split(':');
          if (name && value) {
            headers[name.trim()] = value.trim();
          }
        });
      }
      
      if (body && method !== 'GET' && method !== 'HEAD' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      
      const fullUrl = url.startsWith('http') ? url : new URL(url, window.location.origin).href;
      
      const options = {
        method,
        headers,
        credentials: 'include'
      };
      
      if (method !== 'GET' && method !== 'HEAD' && body) {
        options.body = body;
      }
      
      updateStatus(`Sending ${method} request to ${url}...`);
      
      document.getElementById('tab-response').click();
      
      responseStatusEl.innerHTML = '<div style="padding:5px;background:#333;border-radius:3px;">Loading...</div>';
      responseHeadersEl.innerHTML = '';
      responseBodyEl.innerHTML = '';

      function handleHtmlResponse(text) {
        const container = document.createElement('div');
        container.style = 'padding:10px;background:#333;border-radius:3px;';
        
        const sourceLabel = document.createElement('div');
        sourceLabel.style = 'margin-bottom:5px;font-size:12px;color:#aaa;';
        sourceLabel.textContent = 'HTML source:';
        container.appendChild(sourceLabel);
        
        const sourcePre = document.createElement('pre');
        sourcePre.style = 'margin:0;background:#222;padding:8px;overflow:auto;max-height:400px;color:#fff;white-space:pre-wrap;font-family:monospace;line-height:1.4;';
        
        sourcePre.textContent = text;
        container.appendChild(sourcePre);
        
        responseBodyEl.innerHTML = '';
        responseBodyEl.appendChild(container);
      }
      
      fetch(fullUrl, options)
        .then(response => {
          const statusCode = response.status;
          const statusColor = statusCode >= 200 && statusCode < 300 ? '#6f6' : 
                             (statusCode >= 400 ? '#f66' : '#ff9');
          
          responseStatusEl.innerHTML = `<div style="padding:5px;background:#333;border-radius:3px;">
            Status: <span style="color:${statusColor};font-weight:bold;">${statusCode} ${response.statusText}</span>
          </div>`;
          
          let headerText = '<div style="padding:5px;background:#333;border-radius:3px;">';
          response.headers.forEach((value, name) => {
            headerText += `<div><span style="color:#aaa;">${name}:</span> ${value}</div>`;
          });
          headerText += '</div>';
          responseHeadersEl.innerHTML = headerText || '<div style="color:#aaa;">No headers returned</div>';
          
          return response.text().then(text => {
            try {
              const json = JSON.parse(text);
              responseBodyEl.innerHTML = `<pre style="margin:0;padding:10px;background:#333;border-radius:3px;overflow:auto;max-height:350px;color:#fff;">${syntaxHighlight(JSON.stringify(json, null, 2))}</pre>`;
            } catch (e) {
              if (text.trim() === '') {
                responseBodyEl.innerHTML = '<div style="color:#aaa;padding:10px;background:#333;border-radius:3px;">Empty response body</div>';
              } else {
                if (text.trim().startsWith('<') && text.includes('</')) {
                  handleHtmlResponse(text);
                } else {
                  responseBodyEl.innerHTML = `<pre style="margin:0;padding:10px;background:#333;border-radius:3px;overflow:auto;max-height:350px;color:#fff;white-space:pre-wrap;">${escapeHtml(text)}</pre>`;
                }
              }
            }
          });
        })
        .catch(error => {
          responseStatusEl.innerHTML = `<div style="padding:5px;background:#333;border-radius:3px;color:#f66;">
            Error: ${error.message}
          </div>`;
          responseHeadersEl.innerHTML = '';
          responseBodyEl.innerHTML = '';
        })
        .finally(() => {
          updateStatus(`Request completed`);
        });
    }
    
    function prepareEndpointForTesting(url) {
      document.getElementById('tab-request').click();
      
      document.getElementById('ep-url').value = url;
      
      const info = endpointInfo.get(url);
      if (info && info.method) {
        document.getElementById('ep-method').value = info.method;
        
        if (info.method === 'POST' && info.postParams && info.postParams.length > 0) {
          const requestBody = {};
          info.postParams.forEach(param => {
            requestBody[param.name] = param.value || '';
          });
          document.getElementById('ep-body').value = JSON.stringify(requestBody, null, 2);
        }
      }
      
      if (url.includes('?')) {
        parseUrlParameters();
      } else {
        urlParameters.set(url, []);
        updateParametersList(url);
      }
      
      if (info && info.method === 'POST') {
        document.getElementById('ep-headers').value = 'Content-Type: application/json\nAccept: application/json';
      } else {
        document.getElementById('ep-headers').value = 'Accept: application/json';
      }
    }
    
    function updateResults() {
      const sorted = Array.from(results).sort();
      
      resultsEl.innerHTML = sorted.length === 0 ? 
        '<div style="color:#aaa;padding:10px 0;">No endpoints found yet...</div>' : 
        sorted.map(url => {
          const info = endpointInfo.get(url) || {};
          const method = info.method || 'GET';
          const hasPostParams = info.postParams && info.postParams.length > 0;
          
          let paramDisplay = '';
          if (hasPostParams) {
            paramDisplay = `
              <div class="post-params">
                <div style="color:#ccc;margin-bottom:3px;">POST Parameters:</div>
                ${info.postParams.map(param => `
                  <div class="post-param-item">
                    <span class="post-param-name">${param.name}</span>
                    <span class="post-param-value">${param.value || ''}</span>
                  </div>
                `).join('')}
              </div>
            `;
          }
          
          return `
            <div class="ep-item">
              <div style="display:flex;align-items:center;">
                <div style="word-break:break-all;">${url}</div>
                <span class="ep-pill ${method.toLowerCase()}">${method}</span>
              </div>
              ${paramDisplay}
              <div style="display:flex;gap:5px;margin-top:5px;">
                <button class="ep-btn ep-test-btn" data-url="${url}">Test</button>
                ${url.includes('?') ? 
                  `<button class="ep-btn ep-extract-btn" data-url="${url}">Extract Params</button>` : ''}
              </div>
            </div>
          `;
        }).join('');
      
      document.querySelectorAll('.ep-test-btn').forEach(btn => {
        btn.addEventListener('click', () => prepareEndpointForTesting(btn.dataset.url));
      });
      
      document.querySelectorAll('.ep-extract-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          prepareEndpointForTesting(btn.dataset.url);
          parseUrlParameters();
        });
      });
      
      updateStatus(`Found ${sorted.length} endpoints`);
    }
    
    function copyResults() {
      let exportText = '';
      Array.from(results).sort().forEach(url => {
        const info = endpointInfo.get(url) || {};
        const method = info.method || 'GET';
        exportText += `${method} ${url}\n`;
        
        if (info.postParams && info.postParams.length > 0) {
          exportText += '  Parameters:\n';
          info.postParams.forEach(param => {
            exportText += `    ${param.name}: ${param.value || ''}\n`;
          });
        }
        exportText += '\n';
      });
      
      navigator.clipboard.writeText(exportText)
        .then(() => updateStatus('Copied to clipboard!'))
        .catch(err => updateStatus('Failed to copy: ' + err));
    }
    
    function downloadResults() {
      let exportText = '';
      Array.from(results).sort().forEach(url => {
        const info = endpointInfo.get(url) || {};
        const method = info.method || 'GET';
        exportText += `${method} ${url}\n`;
        
        if (info.postParams && info.postParams.length > 0) {
          exportText += '  Parameters:\n';
          info.postParams.forEach(param => {
            exportText += `    ${param.name}: ${param.value || ''}\n`;
          });
        }
        exportText += '\n';
      });
      
      const blob = new Blob([exportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'endpoints.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    
    function filterResults(e) {
      const filter = e.target.value.toLowerCase();
      document.querySelectorAll('.ep-item').forEach(item => {
        const visible = item.textContent.toLowerCase().includes(filter);
        item.style.display = visible ? 'block' : 'none';
      });
    }
    
    function addResult(url, method = 'GET', postParams = []) {
      if (!url) return;
      
      url = url.replace(/["'`]$/, '');
      
      results.add(url);
      
      const info = endpointInfo.get(url) || { method: 'GET', postParams: [] };
      
      if (method === 'POST' || info.method === 'GET') {
        info.method = method;
      }
      
      if (postParams.length > 0) {
        const existingParamNames = new Set(info.postParams.map(p => p.name));
        const newParams = postParams.filter(p => !existingParamNames.has(p.name));
        info.postParams = [...info.postParams, ...newParams];
      }
      
      endpointInfo.set(url, info);
      
      updateResults();
    }
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function extractParamsFromObject(text, params) {
      const keyValueRegex = /['"]?([a-zA-Z0-9_-]+)['"]?\s*:\s*['"]?([^'",}]*)['"]?/g;
      let match;
      while ((match = keyValueRegex.exec(text)) !== null) {
        params.push({ name: match[1], value: match[2] });
      }
    }
    
    function findEndpoints(content) {
      regexPatterns.forEach(regex => {
        let match;
        regex.lastIndex = 0;
        
        while ((match = regex.exec(content)) !== null) {
          let endpoint = match[0];
          
          if (endpoint.startsWith('http')) {
            try {
              const urlObj = new URL(endpoint);
              addResult(urlObj.pathname + urlObj.search);
              addResult(endpoint);
            } catch (e) {}
          } else {
            addResult(endpoint);
          }
        }
      });
      
      const postPatterns = [
        /\.post\(['"]([^'"]+)['"]/g,
        /fetch\(['"]([^'"]+)['"][^)]*\)\s*\.then/g,
        /axios\s*\.\s*post\(['"]([^'"]+)['"]/g,
        /\$\.ajax\(\s*{\s*url\s*:\s*['"]([^'"]+)['"]\s*,\s*type\s*:\s*['"]POST['"]/g,
        /\.ajax\(\s*{\s*url\s*:\s*['"]([^'"]+)['"]\s*,\s*method\s*:\s*['"]POST['"]/g,
        /fetch\(['"]([^'"]+)['"],\s*{\s*method:\s*['"]POST['"]/g
      ];
      
      postPatterns.forEach(regex => {
        let match;
        regex.lastIndex = 0;
        
        while ((match = regex.exec(content)) !== null) {
          const endpoint = match[1];
          
          if (endpoint) {
            if (endpoint.startsWith('http')) {
              try {
                const urlObj = new URL(endpoint);
                const postParams = findPostParams(content, endpoint);
                addResult(urlObj.pathname + urlObj.search, 'POST', postParams);
                addResult(endpoint, 'POST', postParams);
              } catch (e) {}
            } else {
              const postParams = findPostParams(content, endpoint);
              addResult(endpoint, 'POST', postParams);
            }
          }
        }
      });
      
      if (content.includes('<form') && content.includes('method="post"')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        const forms = tempDiv.querySelectorAll('form[method="post"]');
        forms.forEach(form => {
          const action = form.getAttribute('action');
          if (action) {
            const postParams = [];
            
            const inputs = form.querySelectorAll('input[name], select[name], textarea[name]');
            inputs.forEach(input => {
              const name = input.getAttribute('name');
              const value = input.getAttribute('value') || '';
              if (name) {
                postParams.push({ name, value });
              }
            });
            
            addResult(action, 'POST', postParams);
          }
        });
      }
    }
    
    function findPostParams(content, endpoint) {
      const postParams = [];
      const safeEndpoint = escapeRegExp(endpoint);
      
      const dataPatterns = [
        new RegExp(`['"]${safeEndpoint}['"][^{]*{[^}]*data\\s*:\\s*{([^}]*)}`, 'g'),
        new RegExp(`\\.post\\(['"]${safeEndpoint}['"][^{]*{([^}]*)}`, 'g'),
        new RegExp(`fetch\\(['"]${safeEndpoint}['"][^{]*{[^}]*body\\s*:[^{]*{([^}]*)}`, 'g'),
        new RegExp(`body\\s*:\\s*JSON\\.stringify\\(\\s*{([^}]*)}`, 'g'),
        new RegExp(`data\\s*:\\s*{([^}]*)}`, 'g')
      ];
      
      dataPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1]) {
            extractParamsFromObject(match[1], postParams);
          }
        }
      });
      
      const formDataSection = content.match(new RegExp(`(new\\s+FormData[\\s\\S]*?)${safeEndpoint}`, 'g'));
      if (formDataSection) {
        const formDataParams = formDataSection[0].match(/\.append\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\)/g);
        if (formDataParams) {
          formDataParams.forEach(param => {
            const nameMatch = param.match(/['"]([^'"]+)['"]/);
            if (nameMatch && nameMatch[1]) {
              postParams.push({ name: nameMatch[1], value: '' });
            }
          });
        }
      }
      
      const endpointContext = content.match(new RegExp(`[\\s\\S]{0,500}${safeEndpoint}[\\s\\S]{0,500}`, 'g'));
      if (endpointContext) {
        const nameAttrs = endpointContext[0].match(/name\s*=\s*['"]([^'"]+)['"]/g);
        if (nameAttrs) {
          nameAttrs.forEach(attr => {
            const nameMatch = attr.match(/['"]([^'"]+)['"]/);
            if (nameMatch && nameMatch[1] && !postParams.some(p => p.name === nameMatch[1])) {
              postParams.push({ name: nameMatch[1], value: '' });
            }
          });
        }
      }
      
      return postParams;
    }
    
    updateStatus('Scanning inline scripts...');
    const inlineScripts = document.querySelectorAll('script:not([src])');
    inlineScripts.forEach(script => {
      findEndpoints(script.textContent);
    });
    
    updateStatus('Scanning HTML forms...');
    document.querySelectorAll('form[method="post"]').forEach(form => {
      const action = form.getAttribute('action');
      if (action) {
        const postParams = [];
        
        form.querySelectorAll('input[name], select[name], textarea[name]').forEach(input => {
          const name = input.getAttribute('name');
          const value = input.getAttribute('value') || '';
          if (name) {
            postParams.push({ name, value });
          }
        });
        
        addResult(action, 'POST', postParams);
      }
    });
    
    updateStatus('Scanning external scripts...');
    const externalScripts = Array.from(document.getElementsByTagName('script'))
      .filter(s => s.src && s.src.trim() !== '');
    
    let completedScripts = 0;
    const processExternalScripts = () => {
      if (externalScripts.length === 0) {
        scanPage();
        return;
      }
      
      externalScripts.forEach(script => {
        fetch(script.src)
          .then(response => response.text())
          .then(content => {
            findEndpoints(content);
          })
          .catch(error => console.error('Error fetching script:', script.src, error))
          .finally(() => {
            completedScripts++;
            updateStatus(`Scanning external scripts (${completedScripts}/${externalScripts.length})...`);
            if (completedScripts === externalScripts.length) {
              scanPage();
            }
          });
      });
    };
    
    processExternalScripts();
    
    function scanPage() {
      updateStatus('Scanning page content...');
      
      findEndpoints(document.documentElement.outerHTML);
      
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('/') || href.startsWith('#') || href.startsWith('http'))) {
          addResult(href);
        }
      });
      
      addResult(window.location.pathname + window.location.search);
      
      setupNetworkMonitoring();
      
      updateStatus('Scan complete. Monitoring for new requests...');
    }
    
    function setupNetworkMonitoring() {
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        if (url) {
          try {
            const urlObj = new URL(url, window.location.origin);
            addResult(urlObj.pathname + urlObj.search, method);
            
            if (method.toUpperCase() === 'POST') {
              const originalSend = this.send;
              this.send = function(data) {
                if (data) {
                  try {
                    let postParams = [];
                    
                    if (typeof data === 'string' && data.trim().startsWith('{')) {
                      try {
                        const jsonData = JSON.parse(data);
                        Object.entries(jsonData).forEach(([key, value]) => {
                          postParams.push({ name: key, value: String(value) });
                        });
                      } catch (e) {}
                    }
                    
                    if (data instanceof FormData) {
                      data.forEach((value, key) => {
                        postParams.push({ name: key, value: String(value) });
                      });
                    }
                    
                    if (postParams.length > 0) {
                      const info = endpointInfo.get(urlObj.pathname + urlObj.search) || { 
                        method: 'POST', 
                        postParams: [] 
                      };
                      
                      const existingParamNames = new Set(info.postParams.map(p => p.name));
                      const newParams = postParams.filter(p => !existingParamNames.has(p.name));
                      info.postParams = [...info.postParams, ...newParams];
                      
                      endpointInfo.set(urlObj.pathname + urlObj.search, info);
                      updateResults();
                    }
                  } catch (e) {}
                }
                return originalSend.apply(this, arguments);
              };
            }
          } catch(e) {}
        }
        return originalXhrOpen.apply(this, arguments);
      };
      
      const originalFetch = window.fetch;
      window.fetch = function(resource, options = {}) {
        if (resource) {
          try {
            const url = resource instanceof Request ? resource.url : resource;
            const urlObj = new URL(url, window.location.origin);
            const method = options.method || (resource instanceof Request ? resource.method : 'GET');
            
            addResult(urlObj.pathname + urlObj.search, method);
            
            if (method === 'POST' && options.body) {
              let postParams = [];
              
              if (typeof options.body === 'string' && options.body.trim().startsWith('{')) {
                try {
                  const jsonData = JSON.parse(options.body);
                  Object.entries(jsonData).forEach(([key, value]) => {
                    postParams.push({ name: key, value: String(value) });
                  });
                } catch (e) {}
              }
              
              if (options.body instanceof FormData) {
                options.body.forEach((value, key) => {
                  postParams.push({ name: key, value: String(value) });
                });
              }
              
              if (postParams.length > 0) {
                const info = endpointInfo.get(urlObj.pathname + urlObj.search) || { 
                  method: 'POST', 
                  postParams: [] 
                };
                
                const existingParamNames = new Set(info.postParams.map(p => p.name));
                const newParams = postParams.filter(p => !existingParamNames.has(p.name));
                info.postParams = [...info.postParams, ...newParams];
                
                endpointInfo.set(urlObj.pathname + urlObj.search, info);
                updateResults();
              }
            }
          } catch(e) {}
        }
        return originalFetch.apply(this, arguments);
      };
    }
})();