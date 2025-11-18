import MathJax from "@mathjax/src";

import assert from "node:assert";

const args = process.argv;
assert(args[0].toLowerCase().includes("node"));
assert(args[1].toLowerCase().includes("tex2svg"));

if ( args.length < 3 ) {
	console.error("No math string passed.\nExiting...");
	process.exit(1);
}

if ( args.length > 3 ) {
	console.error("Too many math strings passed. We only accept one at a time.\nExiting...");
	process.exit(1);
}

await MathJax.init({
	loader: {
		load: [
			'input/tex',
			'output/svg'
		]
	}
});

MathJax.startup.output.clearFontCache();

const svgCss = [
	'svg a{fill:blue;stroke:blue}',
	'[data-mml-node="merror"]>g{fill:red;stroke:red}',
	'[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}',
	'[data-frame],[data-line]{stroke-width:70px;fill:none}',
	'.mjx-dashed{stroke-dasharray:140}',
	'.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}',
	'use[data-c]{stroke-width:3px}'
].join('');

const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';

async function getSvgImage(math, options = {}) {

	const adaptor = MathJax.startup.adaptor;
	const result = await MathJax.tex2svgPromise(math, options);

	let svgNode = adaptor.tags(result, 'svg')[0];
	let svg = adaptor.outerHTML(svgNode);

	svg = svg.includes('<defs>')
		? svg.replace(/<defs>/, `<defs><style>${svgCss}</style>`)
		: svg.replace(/^(<svg.*?>)/, `$1<defs><style>${svgCss}</style></defs>`);

	svg = svg.replace(/ (?:role|focusable|aria-hidden)=".*?"/g, '')
		.replace(/"currentColor"/g, '"black"');

	return xmlDeclaration + '\n' + svg;

}

console.log(await getSvgImage(args[2]));
