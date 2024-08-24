import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
import type {
	DocumentInitParameters,
	RefProxy,
	TypedArray,
} from "pdfjs-dist/types/src/display/api"
import type { ComponentProps, RefObject } from "react"

import type { STATUS } from "@/constants"

// return props
export interface ViewerContextProps
	extends Pick<
		DocumentProps,
		"externalLinkTarget" | "externalLinkRel" | "messages"
	> {
	status: Status
	pdf?: PDFDocumentProxy
	setStatus: (status: Status) => void
}

// param props
export interface ViewerProviderProps
	extends Pick<
		DocumentProps,
		| "src"
		| "onDocumentError"
		| "onDocumentLoad"
		| "externalLinkTarget"
		| "externalLinkRel"
		| "messages"
	> {
	children: React.ReactNode
}

type Messages = {
	nextButton?: string
	previousButton?: string
	numPagesSeparator?: string
	loading?: string
	error?: string
}

export interface DocumentProps {
	children: React.ReactNode
	src: DocumentSrc
	locale?: string
	className?: string
	documentRef?: RefObject<HTMLDivElement>
	externalLinkTarget?: ComponentProps<"a">["href"]
	externalLinkRel?: ComponentProps<"a">["rel"]
	onDocumentError?: (error: unknown) => void
	onDocumentLoad?: (document: PDFDocumentProxy | undefined) => void
	messages?: Messages
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

export type ResolvedDest = (RefProxy | number)[]
export type Dest = Promise<ResolvedDest> | ResolvedDest | string | null
