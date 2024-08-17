class UltimateReactPdfError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "UltimateReactPdfError"
	}
}

export default UltimateReactPdfError
