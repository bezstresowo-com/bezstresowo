import { mergeAttributes, Node } from '@tiptap/core';

export const Video = Node.create({
	name: 'video', // unique name for the Node
	group: 'block', // belongs to the 'block' group of extensions
	selectable: true, // so we can select the video
	draggable: true, // so we can drag the video
	atom: true, // is a single unit
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
