![version](https://img.shields.io/npm/v/ultimate-react-pdf/latest) ![downloads](https://img.shields.io/npm/dt/ultimate-react-pdf) ![minzipsize](https://img.shields.io/bundlephobia/minzip/ultimate-react-pdf/latest) ![license](https://img.shields.io/github/license/cecicifu/ultimate-react-pdf)

# Ultimate React PDF

The most complete React PDF viewer for everyone, without dependencies and fully typed.

<div align="center">
  <img src="https://github.com/cecicifu/ultimate-react-pdf/assets/15237067/825ff5a4-388a-4c90-b3d9-4acd5d75468b">
</div>
![demo](https://github.com/user-attachments/assets/dd014a65-ce25-490b-bace-8bd2cf37bde4)

---

## Requirements

**React 16** or later.

## Installation

NPM:

```bash
npm install ultimate-react-pdf
```

YARN:

```bash
yarn add ultimate-react-pdf
```

## Usage

```jsx
import { Document, Page } from "ultimate-react-pdf"

<>
  <Document src={{ data: atob("JVBERi0xLjcKJeLjz9MKOSAwIG...") }}>
    <Page controls />
  </Document>
</>
```

Or for infinity page:

```jsx
import { Document, InfinityPage } from "ultimate-react-pdf"

<>
  <Document src={{ data: atob("JVBERi0xLjcKJeLjz9MKOSAwIG...") }}>
    <InfinityPage />
  </Document>
</>
```

## Props

### Document

| Prop name           | Description                                                                                                                   | Default value                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| src                 | The PDF file (could be in base64 format, a URL, etc.).                                                                        |                                            |
| documentRef         | Reference to the inner HTML element of the document.                                                                          |                                            |
| externalLinkTarget  | Link rel for links rendered in annotations.                                                                                   |                                            |
| externalLinkRel     | Link target for external links rendered in annotations.                                                                       |                                            |
| onDocumentError     | Function called when the document load fails.                                                                                 |                                            |
| onDocumentLoad      | Function called when the document loads successfully.                                                                         |                                            |
| messages            | List of messages used.                                                                                                        | Default english messages.                  |
| className           | Custom classname for the document container.                                                                                  |                                            |

### Page

| Prop name           | Description                                                                                                                   | Default value                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| canvasRef           | Reference to the inner HTML element of the canvas.                                                                            |                                            |
| controls            | Show or hide the control buttons.                                                                                             | `false`                                    | 
| initialPage         | Initial page number.                                                                                                          | `1`                                        |
| pageRef             | Reference to the inner HTML element of the page.                                                                              |                                            |
| viewPortScale       | Custom viewport scale.                                                                                                        | `window.devicePixelRatio`                  |
| onPageChange        | Function called when the page changes.                                                                                        |                                            |
| onPageError         | Function called when the page loads fails.                                                                                    |                                            |
| onPageLoad          | Function called when the page loads successfully.                                                                             |                                            |
| className           | Custom classname for the page container.                                                                                      |                                            |

### Infinity page

| Prop name           | Description                                                                                                                   | Default value                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| canvasRef           | Reference to the inner HTML element of the canvas.                                                                            |                                            |
| pageRef             | Reference to the inner HTML element of the page.                                                                              |                                            |
| viewPortScale       | Function called when the document load fails.                                                                                 | `window.devicePixelRatio`                  |
| onPageError         | Function called when the page loads fails.                                                                                    |                                            |
| onPageLoad          | Function called when the page loads successfully.                                                                             |                                            |
| className           | Custom classname for the page container.                                                                                      |                                            |

## License

Under [MIT](https://github.com/cecicifu/ultimate-react-pdf/blob/main/LICENSE) License.
