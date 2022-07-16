import { defineConfig } from "tsup";

export default defineConfig({
	format: ["esm", "cjs"],
	entry: ["src/CognitoJwtVerifier.ts"],
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: true,
});
