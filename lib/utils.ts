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
	// Check if URL.canParse is available (modern browsers)
	if (typeof URL.canParse === "function") {
		return URL.canParse(url)
	}

	// Fallback for older browser versions
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

/**
 * Checks if a string is a valid Base64 encoded string.
 * @param str - The base64 string to check.
 * @returns true if the string is Base64 encoded, false otherwise.
 */
export const isBase64 = (str: string) => {
	try {
		if (isWindowDefined) {
			// Browser environment
			const decoded = window.atob(str)
			const reencoded = window.btoa(decoded)
			return reencoded === str
		}

		if (!isWindowDefined) {
			// Node.js environment
			const reencoded = Buffer.from(str, "base64").toString("base64")
			return reencoded === str
		}

		return false
	} catch {
		return false
	}
}
