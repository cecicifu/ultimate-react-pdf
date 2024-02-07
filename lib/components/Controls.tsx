import { useViewerContext } from "@/hooks/useViewerContext"
import { ControlsProps } from "@/types"

export function Controls({ pageNumber, setPage, onPageChange }: ControlsProps) {
	const { pdf } = useViewerContext()

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
		<>
			<button onClick={handlePrev} disabled={pageNumber === 1}>
				Anterior
			</button>
			<button onClick={handleNext} disabled={pdf?.numPages === pageNumber}>
				Siguiente
			</button>

			<span>
				{pageNumber}/{pdf?.numPages}
			</span>
		</>
	)
}
