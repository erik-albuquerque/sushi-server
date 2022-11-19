const isObjectEmpty = (obj: any) => {
	const isEmpty = Object.keys(obj).length === 0

	return isEmpty
}

export { isObjectEmpty }
