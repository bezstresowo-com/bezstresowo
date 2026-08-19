/// <reference types="vite/client" />

declare module '*.woff?inline' {
	const dataUrl: string;
	export default dataUrl;
}

declare module '*.woff2?inline' {
	const dataUrl: string;
	export default dataUrl;
}
