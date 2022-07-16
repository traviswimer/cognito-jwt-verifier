module.exports.default = async function fetch(url) {
	return {
		json: async () => {
			return {
				keys: [
					{
						kid: "aKeyIdThatExists",
					},
					{
						kid: "anotherKeyIdThatExists",
					},
				],
			};
		},
	};
};
