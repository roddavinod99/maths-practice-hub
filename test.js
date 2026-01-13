// Test Multivariable Calculus random question generation
const MathEngine = {
    "Multivariable Calculus": () => {
        const problems = [
            {
                q: `\\dfrac{\\partial f}{\\partial x} \\text{ where } f(x,y) = x^2 + y^2`,
                a: `2x`,
                s: [`\\dfrac{\\partial f}{\\partial x} = 2x`]
            },
            {
                q: `\\dfrac{\\partial f}{\\partial y} \\text{ where } f(x,y) = x^2 + y^2`,
                a: `2y`,
                s: [`\\dfrac{\\partial f}{\\partial y} = 2y`]
            },
            {
                q: `\\dfrac{\\partial f}{\\partial x} \\text{ where } f(x,y) = xy + x`,
                a: `y + 1`,
                s: [`\\dfrac{\\partial f}{\\partial x} = y + 1`]
            }
        ];
        const selected = problems[Math.floor(Math.random() * problems.length)];
        console.log(`Selected problem with answer: ${selected.a}`);
        return selected;
    }
};

console.log('Testing Multivariable Calculus random generation:');
for(let i = 0; i < 10; i++) {
    const q = MathEngine['Multivariable Calculus']();
    console.log(`Question ${i+1}: Answer = ${q.a}`);
}