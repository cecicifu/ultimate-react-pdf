import { useEffect, useRef, useState } from "react"

export const useContainerResize = () => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [containerWidth, setContainerWidth] = useState(0)

	useEffect(() => {
		if (!containerRef.current) return

		const handleResize = () => {
			if (containerRef.current) {
				setContainerWidth(containerRef.current.offsetWidth)
			}
		}

		handleResize() // Initial measurement
		const observer = new ResizeObserver(handleResize)
		observer.observe(containerRef.current)

		return () => observer.disconnect()
	}, [])

	return { containerRef, containerWidth }
}
