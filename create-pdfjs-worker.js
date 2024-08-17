import fs from "fs"

fs.mkdir("./lib/contexts/build", { recursive: true }, (err) => {
	if (err) throw err

	fs.writeFileSync(
		"./lib/contexts/build/pdf.worker.min.mjs.json",
		JSON.stringify(
			fs.readFileSync(
				"./node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
				"utf-8"
			)
		)
	)
})
