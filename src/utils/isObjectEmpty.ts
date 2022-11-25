const isObjectEmpty = (obj: Record<string, unknown>) => {
	const isEmpty = Object.keys(obj).length === 0

	return isEmpty
}

export { isObjectEmpty }
