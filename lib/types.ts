import type { getDocument, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
import type {
	DocumentInitParameters,
	RefProxy,
} from "pdfjs-dist/types/src/display/api"
import type { ComponentProps, RefObject } from "react"

import type { STATUS } from "@/constants"

export interface ViewerContextProps
	extends Pick<
		DocumentProps,
		"externalLinkTarget" | "externalLinkRel" | "messages"
	> {
	status: Status
	pdf?: PDFDocumentProxy
	setStatus: (status: Status) => void
}

export interface ViewerProviderProps
	extends Pick<
		DocumentProps,
		| "src"
		| "onDocumentError"
		| "onDocumentLoad"
		| "externalLinkTarget"
		| "externalLinkRel"
		| "messages"
		| "options"
	> {
	children: React.ReactNode
}

export type Messages = {
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
	options?: Omit<DocumentInitParameters, "url" | "data" | "verbosity">
}

export interface PageCommonProps {
	annotations?: boolean
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
	setPage: (page: Page) => void
}

export type DocumentSrc = NonNullable<Parameters<typeof getDocument>[0]>

export type Status = (typeof STATUS)[keyof typeof STATUS]

export type Page = PDFDocumentProxy["numPages"]

export interface AnnotationLayerProps {
	currentPage: Page
	setPage?: (page: number) => void
	infinity?: boolean
}

export type ResolvedDest = (RefProxy | number)[]
export type Dest = Promise<ResolvedDest> | ResolvedDest | string | null
