import { mergeAttributes, Node } from '@tiptap/core';

export const Video = Node.create({
	name: 'video',
	group: 'block',
	selectable: true,
	draggable: true,
	atom: true,
	parseHTML() {
		return [
			{
				tag: 'video'
			}
		];
	},
	addAttributes() {
		return {
			id: {
				default: null
			},
			src: {
				default: null
			},
			controls: {
				default: true
			},
			preload: {
				default: 'metadata'
			}
		};
	},
	renderHTML({ HTMLAttributes }) {
		return ['video', mergeAttributes(HTMLAttributes)];
	},
	addNodeView() {
		return ({ node }) => {
			const div = document.createElement('div');
			div.classList = 'w-full flex items-center justify-center';

			const video = document.createElement('video');
			video.id = node.attrs.id;
			video.src = node.attrs.src;
			video.controls = node.attrs.controls;
			video.preload = node.attrs.preload;
			video.classList = 'object-contain w-fit aspect-keep max-h-80 mx-auto';

			div.append(video);
			return {
				dom: div
			};
		};
	}
});
