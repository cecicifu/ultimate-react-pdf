export const isWindowDefined = typeof window !== "undefined"

export const isValidUrl = (url: string) => {
	if (URL.canParse !== undefined) {
		return URL.canParse(url)
	}

	// Fallback for older browsers versions
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}
