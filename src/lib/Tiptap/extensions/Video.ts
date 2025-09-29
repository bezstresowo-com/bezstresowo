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
			src: {
				default: null
			},
			controls: {
				default: true
			},
			width: {
				default: '100%'
			},
			height: {
				default: 'auto'
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
			div.className = 'aspect-video';

			const video = document.createElement('video');
			video.src = node.attrs.src;
			video.controls = node.attrs.controls;
			video.style.width = node.attrs.width;
			video.style.height = node.attrs.height;
			video.preload = node.attrs.preload;
			video.style.maxWidth = '100%';

			div.append(video);
			return {
				dom: div
			};
		};
	}
});
