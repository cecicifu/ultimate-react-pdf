import { useViewerContext } from "@/hooks/useViewerContext"
import type { ControlsProps } from "@/types"

export const Controls = ({
	pageNumber,
	setPage,
	onPageChange,
}: ControlsProps) => {
	const { pdf, messages } = useViewerContext()

	const handlePrevious = async () => {
		if (!pdf || pageNumber <= 1) return

		const prevPage = pageNumber - 1

		const page = await pdf.getPage(prevPage)

		onPageChange?.(page, pdf)
		setPage(prevPage)
	}

	const handleNext = async () => {
		if (!pdf || pageNumber >= pdf.numPages) return

		const nextPage = pageNumber + 1

		const page = await pdf.getPage(nextPage)

		onPageChange?.(page, pdf)
		setPage(nextPage)
	}

	return (
		<div className="pdf-viewer__controls">
			<div className="pdf-viewer__controls__buttons">
				<button
					onClick={handlePrevious}
					disabled={pageNumber === 1}
					aria-label={messages?.previousButton || "Previous page"}
				>
					{messages?.previousButton}
				</button>
				<button
					onClick={handleNext}
					disabled={pageNumber >= (pdf?.numPages ?? 1)}
					aria-label={messages?.nextButton || "Next page"}
				>
					{messages?.nextButton}
				</button>
			</div>

			<div className="pdf-viewer__controls__num-pages">
				<span>
					{pageNumber} {messages?.numPagesSeparator} {pdf?.numPages ?? 0}
				</span>
			</div>
		</div>
	)
}
