import UltimateReactPdfError from "./components/UltimateReactPdfError"

export const isWindowDefined = typeof window !== "undefined"

/**
 * Decodes a BASE64 string into a Uint8Array (TypedArray) for binary data handling.
 * Supports browser (window.atob) and Node.js (Buffer) environments.
 * Throws UltimateReactPdfError if no decoder is available.
 * @param base64 - The BASE64 encoded string to decode.
 * @return Uint8Array - The decoded binary data as a Uint8Array.
 * @throws UltimateReactPdfError - If no base64 decoder is available in the current environment
 */
export const decodeBase64ToUint8Array = (base64: string): Uint8Array => {
	if (isWindowDefined && typeof window.atob === "function") {
		// Browser environment
		const binaryString = window.atob(base64)
		const bytes = new Uint8Array(binaryString.length)
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i)
		}
		return bytes
	}

	if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
		// Node.js environment
		return new Uint8Array(Buffer.from(base64, "base64"))
	}

	throw new UltimateReactPdfError(
		"No base64 decoder available in this environment."
	)
}

/**
 * Validates if a given string is a valid URL.
 * @param url - The URL to validate.
 * @returns true if the URL is valid, false otherwise.
 */
export const isValidUrl = (url: string) => {
	if (URL.canParse !== undefined) {
		return URL.canParse(url)
	}

	// fallback for older browsers versions
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}
