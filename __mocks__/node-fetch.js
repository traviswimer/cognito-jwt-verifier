module.exports = async function fetch(url) {
	return {
		json: () => {
			return {
				keys: [
					{
						kid: 'aKeyIdThatExists'
					}, {
						kid: 'anotherKeyIdThatExists'
					}
				]
			}
		}
	}
}
