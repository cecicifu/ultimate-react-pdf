import { useViewerContext } from "@/hooks/useViewerContext"
import type { ControlsProps } from "@/types"

export const Controls = ({
	pageNumber,
	setPage,
	onPageChange,
}: ControlsProps) => {
	const { pdf, messages } = useViewerContext()

	const handlePrev = async () => {
		if (!pdf) return

		const prevPage = pageNumber - 1

		const page = await pdf?.getPage(prevPage)

		onPageChange && onPageChange(page, pdf)
		setPage(prevPage)
	}

	const handleNext = async () => {
		if (!pdf) return

		const nextPage = pageNumber + 1

		const page = await pdf?.getPage(nextPage)

		onPageChange && onPageChange(page, pdf)
		setPage(nextPage)
	}

	return (
		<div className="pdf-viewer__controls">
			<div className="pdf-viewer__controls__buttons">
				<button onClick={handlePrev} disabled={pageNumber === 1}>
					{messages?.previousButton}
				</button>
				<button onClick={handleNext} disabled={pdf?.numPages === pageNumber}>
					{messages?.nextButton}
				</button>
			</div>

			<div className="pdf-viewer_controls_num-pages">
				<span>
					{pageNumber} {messages?.numPagesSeparator} {pdf?.numPages}
				</span>
			</div>
		</div>
	)
}
