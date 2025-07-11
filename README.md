![version](https://img.shields.io/npm/v/ultimate-react-pdf/latest) ![downloads](https://img.shields.io/npm/dt/ultimate-react-pdf) ![minzipsize](https://img.shields.io/bundlephobia/minzip/ultimate-react-pdf/latest) ![license](https://img.shields.io/github/license/cecicifu/ultimate-react-pdf)

# Ultimate React PDF

The most complete React PDF viewer for everyone, without dependencies and fully typed.

[Demo](https://codesandbox.io/p/sandbox/ultimate-react-pdf-g72ycj){:target="_blank"}

![demo](https://github.com/user-attachments/assets/d1b0442a-f75f-4e72-8d70-b1719ff16e42)

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
  <Document src="https://pdfobject.com/pdf/sample.pdf">
    <Page controls />
  </Document>
</>
```

Or for infinite scrolling:

```jsx
import { Document, InfinityPage } from "ultimate-react-pdf"

<>
  <Document src="https://pdfobject.com/pdf/sample.pdf">
    <InfinityPage />
  </Document>
</>
```

## Props

### Document

| Prop name           | Description                                                                                                                   | Default value                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| src                 | The PDF itself. Can be a URL string where a PDF file is located or a base64 string. </br></br>**NOTE**: If a URL is used to fetch the PDF data a standard Fetch API call (or XHR as fallback) is used, which means it must follow same origin rules. e.g. no cross-domain requests without CORS.                                                                                                                                                 |                                            |
| options             | Some extra options such as password, headers..                                                                                | `{}`                                       |
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
| controls            | Show or hide the control buttons.                                                                                             | `false`                                    | 
| initialPage         | Initial page number.                                                                                                          | `1`                                        |
| pageRef             | Reference to the inner HTML element of the page.                                                                              |                                            |
| viewPortScale       | Custom viewport scale.                                                                                                        | `window.devicePixelRatio`                  |
| annotations         | Enable or disable the annotations.                                                                                            | `true`                                     |
| onPageChange        | Function called when the page changes.                                                                                        |                                            |
| onPageError         | Function called when the page loads fails.                                                                                    |                                            |
| onPageLoad          | Function called when the page loads successfully.                                                                             |                                            |
| className           | Custom classname for the page container.                                                                                      |                                            |

### Infinity page

| Prop name           | Description                                                                                                                   | Default value                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| pageRef             | Reference to the inner HTML element of the page.                                                                              |                                            |
| viewPortScale       | Function called when the document load fails.                                                                                 | `window.devicePixelRatio`                  |
| annotations         | Enable or disable the annotations.                                                                                            | `true`                                     |
| onPageError         | Function called when the page loads fails.                                                                                    |                                            |
| onPageLoad          | Function called when the page loads successfully.                                                                             |                                            |
| className           | Custom classname for the page container.                                                                                      |                                            |

## License

Under [MIT](https://github.com/cecicifu/ultimate-react-pdf/blob/main/LICENSE){:target="_blank"} License.
