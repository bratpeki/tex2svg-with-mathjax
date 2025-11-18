
all: pythagorean integral sum

pythagorean:
	node ./tex2svg.js "a^2 + b^2 = c^2" > pythagorean.svg

integral:
	node ./tex2svg.js "\\int_0^\\pi \\sin x \\, dx" > integral.svg

sum:
	node ./tex2svg.js "\\frac{1}{n} \\sum_{k=1}^{n} k^2" > sum.svg

clean:
	rm -f *.svg
