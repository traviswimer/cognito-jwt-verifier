export default async function fetch(url: string) {
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
}
