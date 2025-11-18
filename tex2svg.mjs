import MathJax from "@mathjax/src";

await MathJax.init({loader: {load: ['input/tex', 'output/svg']}});

// https://docs.mathjax.org/en/latest/web/convert.html
// const mml = (await MathJax.tex2mmlPromise('x+y'));
const svg = (await MathJax.tex2svgPromise('x+y'));
console.log(svg);
