import { type PDFDocumentProxy, type PDFPageProxy } from "pdfjs-dist"
import {
	type DocumentInitParameters,
	type TypedArray,
} from "pdfjs-dist/types/src/display/api"
import { RefObject } from "react"

import { STATUS } from "@/constants"

// return props
export interface ViewerContextProps {
	status: Status
	pdf?: PDFDocumentProxy
	setStatus: (status: Status) => void
}

// param props
export interface ViewerProviderProps
	extends Pick<DocumentProps, "src" | "onDocumentError" | "onDocumentLoad"> {
	children: React.ReactNode
}

export interface DocumentProps {
	children: React.ReactNode
	src: DocumentSrc
	className?: string
	documentRef?: RefObject<HTMLDivElement>
	onDocumentError?: (error: unknown) => void
	onDocumentLoad?: (document: PDFDocumentProxy | undefined) => void
}

export interface PageCommonProps {
	canvasRef?: React.RefObject<HTMLCanvasElement>
	className?: string
	pageRef?: React.RefObject<HTMLDivElement>
	viewPortScale?: number
	onPageError?: (error: unknown, document: PDFDocumentProxy) => void
}

export interface InfinityPageProps extends PageCommonProps {
	onPageLoad?: (pages: PDFPageProxy[], document: PDFDocumentProxy) => void
}

export interface PageProps extends PageCommonProps {
	controls?: boolean
	infinity?: boolean
	initialPage?: Page
	onPageChange?: (
		page: PDFPageProxy | undefined,
		document: PDFDocumentProxy
	) => void
	onPageLoad?: (page: PDFPageProxy, document: PDFDocumentProxy) => void
}

export interface ControlsProps extends Pick<PageProps, "onPageChange"> {
	pageNumber: Page
	setPage: React.Dispatch<React.SetStateAction<Page>>
}

export type DocumentSrc =
	| string
	| URL
	| TypedArray
	| ArrayBuffer
	| DocumentInitParameters

export type Status = (typeof STATUS)[keyof typeof STATUS]

export type Page = PDFDocumentProxy["numPages"]
