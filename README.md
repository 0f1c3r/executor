# Endpoint Scanner & Tester

A powerful browser-based tool for discovering, analyzing, and testing web application endpoints.

> **Important**: This tool is intended for ethical security research, penetration testing with proper authorization, and development purposes only. Always obtain permission before testing applications you don't own.

## Overview

Endpoint Scanner & Tester is a JavaScript bookmarklet that helps security researchers, penetration testers, and developers discover and interact with endpoints on any website. The tool automatically scans the page for potential API endpoints, extracts parameters, and provides an interface for testing requests.

## Features

- **Endpoint Discovery**:
  - Automatically detects endpoints from HTML, JavaScript, and network requests
  - Identifies both GET and POST endpoints
  - Extracts parameters from URLs and forms
  - Monitors live network requests to capture new endpoints

- **Parameter Discovery**:
  - Extracts URL query parameters
  - Discovers POST parameters from forms and JavaScript code
  - Captures form field names and values
  - Identifies JSON parameters in API calls

- **Request Builder**:
  - Supports multiple HTTP methods (GET, POST, PUT, DELETE, etc.)
  - Custom header configuration
  - JSON request body editor
  - Parameter management interface

- **Response Analysis**:
  - View response status and headers
  - Automatic formatting for JSON responses
  - Raw display for HTML and text responses
  - Error handling for failed requests

## Installation

### As a Bookmarklet

1. Create a new bookmark in your browser
2. Name it "Endpoint Scanner"
3. Paste the entire JavaScript code into the URL/location field
4. Save the bookmark

### Usage

1. Navigate to the target website
2. Click the "Endpoint Scanner" bookmarklet
3. The tool will appear on the right side of the page and begin scanning

## How It Works

The tool uses several techniques to discover endpoints:

1. **Static Analysis**:
   - Scans HTML for links, forms, and script tags
   - Parses JavaScript files to find API endpoints
   - Extracts URL patterns from the page

2. **Dynamic Monitoring**:
   - Intercepts XMLHttpRequest and fetch calls
   - Captures network requests as they happen
   - Records parameters and request data

3. **Parameter Analysis**:
   - Extracts parameters from URLs
   - Identifies POST parameters in forms
   - Discovers JSON parameters in API calls

## Security Testing Tips

- Use the tool to discover hidden or undocumented endpoints
- Test endpoints with different HTTP methods
- Manipulate parameters to test for vulnerabilities
- Check for insufficient authorization on endpoints
- Test for parameter pollution and injection attacks

**Ethics and Legality**: 
- Only use this tool on applications where you have explicit permission to test
- Do not use to exploit vulnerabilities or extract sensitive data
- Follow responsible disclosure practices if you discover security issues
- Respect the privacy and functionality of the applications you test

## Privacy and Security

- This tool runs entirely in your browser
- No data is sent to external servers
- All scanning happens locally
- The tool respects same-origin policy for requests

## Contributing

Feel free to submit issues or pull requests with improvements or bug fixes.

## License

MIT License - See LICENSE file for details