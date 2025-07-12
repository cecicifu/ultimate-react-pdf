import { useMemo } from "react"

import { isWindowDefined } from "@/utils"

export const useDevicePixelRatio = () => {
	return useMemo(() => {
		return isWindowDefined ? window.devicePixelRatio : 1
	}, [])
}
