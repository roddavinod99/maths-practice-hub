/** SAFE Katex Rendering */
const renderMath = (expr, container) => {
    try {
        katex.render(expr, container, { displayMode: true });
    } catch (err) {
        container.textContent = expr;
        console.warn("Rendering fallback:", err.message);
    }
};

/** SANITIZATION: canonical algebraic comparison */
const sanitize = str => String(str).toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\\sqrt/g, "sqrt")
    .replace(/[{}]/g, "")
    .replace(/\\text/g, "")
    .replace(/\\cdot/g, "")
    .replace(/\\,/g, "")
    .replace(/\(/g, "")
    .replace(/\)/g, "");

/** CURRICULUM STRUCTURE */
const Curriculum = {
    primary: [
        "Basic Addition", "Basic Subtraction"
    ],
    middle: [
        "Fractions", "Decimals"
    ],
    secondary: [
        "Algebra", "Trigonometry", "Circle Geometry", "Geometry Visualizations", "Advanced Arithmetic", "Advanced Algebra"
    ],
    higher: [
        "Calculus", "Linear Algebra"
    ],
    undergrad: [
        "Multivariable Calculus", "Abstract Algebra"
    ]
};

/** UTILITY CLASSES FOR VISUALIZATIONS */
function RightTriangle(a, b, angle) {
    this.a = a;
    if (!angle) {
        this.b = b;
    } else {
        this.b = a * Math.tan(angle * Math.PI / 180);
    }
    this.c = Math.sqrt(this.a * this.a + this.b * this.b);
    this.area = this.a * this.b / 2;
    this.perimeter = this.a + this.b + this.c;
}

function Circle(radius) {
    this.radius = radius;
    this.diameter = 2 * radius;
    this.area = Math.PI * radius * radius;
    this.circumference = 2 * Math.PI * radius;
}

function Cuboid(l, w, h) {
    this.l = l;
    this.w = w;
    this.h = h;
    this.volume = l * w * h;
    this.surfaceArea = 2 * (l * w + l * h + w * h);
}

class NumberLine {
    constructor(start, end, steps) {
        if (start >= end || steps <= 0 || !Number.isInteger(steps)) {
            throw new Error("Invalid parameters");
        }
        this.start = start;
        this.end = end;
        this.steps = steps;
        this.range = end - start;
        this.VIEWBOX_WIDTH = 400;
        this.VIEWBOX_HEIGHT = 100;
        this.LINE_Y = 50;
        this.PADDING_X = 15;
        this.TICK_HEIGHT_MAJOR = 10;
    }

    display() {
        const lineLength = this.VIEWBOX_WIDTH - 2 * this.PADDING_X;
        const stepSize = this.range / this.steps;
        const tickIntervalPx = lineLength / this.steps;

        let svgContent = '';
        svgContent += `<line x1="${this.PADDING_X}" y1="${this.LINE_Y}" x2="${this.VIEWBOX_WIDTH - this.PADDING_X}" y2="${this.LINE_Y}" stroke="black" stroke-width="1"/>`;

        for (let i = 0; i <= this.steps; i++) {
            const x = this.PADDING_X + i * tickIntervalPx;
            const value = (this.start + i * stepSize);
            svgContent += `<line x1="${x}" y1="${this.LINE_Y - this.TICK_HEIGHT_MAJOR / 2}" x2="${x}" y2="${this.LINE_Y + this.TICK_HEIGHT_MAJOR / 2}" stroke="black" stroke-width="1"/>`;
            svgContent += `<text x="${x}" y="${this.LINE_Y + this.TICK_HEIGHT_MAJOR / 2 + 15}" text-anchor="middle" font-size="12" fill="black">${value}</text>`;
        }

        const svg = `<svg viewBox="0 0 ${this.VIEWBOX_WIDTH} ${this.VIEWBOX_HEIGHT}" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: auto;">
                    ${svgContent}
                </svg>`;
        return svg;
    }
}

/** MATH ENGINE - Question Generators */
const MathEngine = {
    "Basic Addition": () => {
        const a = Math.floor(Math.random() * 50) + 1;
        const b = Math.floor(Math.random() * 50) + 1;
        return {
            q: `${a} + ${b} = ?`,
            a: `${a + b}`,
            s: [`${a} + ${b} = ${a + b}`]
        };
    },

    "Basic Subtraction": () => {
        const a = Math.floor(Math.random() * 100) + 50;
        const b = Math.floor(Math.random() * 50) + 1;
        return {
            q: `${a} - ${b} = ?`,
            a: `${a - b}`,
            s: [`${a} - ${b} = ${a - b}`]
        };
    },

    "Fractions": () => {
        const fractions = [
            { q: `\\dfrac{1}{2} + \\dfrac{1}{3}`, a: `\\dfrac{5}{6}`, s: [`\\dfrac{1}{2} + \\dfrac{1}{3} = \\dfrac{5}{6}`] },
            { q: `\\dfrac{2}{3} - \\dfrac{1}{4}`, a: `\\dfrac{5}{12}`, s: [`\\dfrac{2}{3} - \\dfrac{1}{4} = \\dfrac{5}{12}`] },
            { q: `\\dfrac{3}{4} \\times \\dfrac{2}{5}`, a: `\\dfrac{3}{10}`, s: [`\\dfrac{3}{4} \\times \\dfrac{2}{5} = \\dfrac{3}{10}`] }
        ];
        return fractions[Math.floor(Math.random() * fractions.length)];
    },

    "Decimals": () => {
        const a = (Math.floor(Math.random() * 10) + 1) / 10;
        const b = (Math.floor(Math.random() * 10) + 1) / 10;
        const sum = (a + b).toFixed(2);
        return {
            q: `${a} + ${b} = ?`,
            a: `${sum}`,
            s: [`${a} + ${b} = ${sum}`]
        };
    },

    "Algebra": () => {
        const problems = [
            {
                q: `\\text{Solve: } 2x + 3 = 7`,
                a: `x = 2`,
                s: [`2x + 3 = 7`, `2x = 4`, `x = 2`]
            },
            {
                q: `\\text{Solve: } 3x - 5 = 10`,
                a: `x = 5`,
                s: [`3x - 5 = 10`, `3x = 15`, `x = 5`]
            },
            {
                q: `\\text{Simplify: } 2(x + 3)`,
                a: `2x + 6`,
                s: [`2(x + 3) = 2 \\cdot x + 2 \\cdot 3`, `2x + 6`]
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)];
    },

    "Trigonometry": () => {
        const problems = [
            {
                q: `\\sin 90^\\circ = ?`,
                a: `1`,
                s: [`\\sin 90^\\circ = 1`]
            },
            {
                q: `\\cos 0^\\circ = ?`,
                a: `1`,
                s: [`\\cos 0^\\circ = 1`]
            },
            {
                q: `\\tan 45^\\circ = ?`,
                a: `1`,
                s: [`\\tan 45^\\circ = 1`]
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)];
    },

    "Circle Geometry": () => {
        const problems = [
            // 1. Semicircle perimeter to diameter
            () => {
                const perimeter = (Math.floor(Math.random() * 200) + 50) / 2; // Random perimeter/2 between 25-125
                // For semicircle: perimeter = πr + 2r = r(π + 2)
                // So r = perimeter / (π + 2), diameter = 2r
                const r = perimeter / (Math.PI + 2);
                const diameter = (r * 2).toFixed(1);
                return {
                    q: `A semicircle has a perimeter of ${perimeter} mm to 3 s.f.. Find its diameter.`,
                    a: `${diameter}`,
                    s: [
                        `\\text{For a semicircle: perimeter} = \\pi r + 2r = r(\\pi + 2)`,
                        `r = \\dfrac{${perimeter}}{\\pi + 2} \\approx \\dfrac{${perimeter}}{${(Math.PI + 2).toFixed(2)}} \\approx ${(r).toFixed(2)}`,
                        `\\text{Diameter} = 2r = 2 \\times ${(r).toFixed(2)} = ${diameter}`
                    ]
                };
            },
            // 2. Circle circumference to diameter
            () => {
                const circumference = Math.floor(Math.random() * 200) + 50; // 50-250
                const diameter = (circumference / Math.PI).toFixed(1);
                return {
                    q: `A circle has a circumference of ${circumference} m to 3 s.f.. Find its diameter.`,
                    a: `${diameter}`,
                    s: [
                        `\\text{Circumference} = \\pi \\times \\text{diameter}`,
                        `\\text{Diameter} = \\dfrac{\\text{circumference}}{\\pi} = \\dfrac{${circumference}}{\\pi} \\approx ${diameter}`
                    ]
                };
            },
            // 3. Circle area to radius
            () => {
                const area = (Math.floor(Math.random() * 100) + 10) / 10; // 1.0-11.0
                const radius = Math.sqrt(area / Math.PI).toFixed(1);
                return {
                    q: `Find the missing length, given the area of the circle is ${area} mm² to 1 d.p..`,
                    a: `${radius}`,
                    s: [
                        `\\text{Area} = \\pi r^2`,
                        `\\pi r^2 = ${area}`,
                        `r^2 = \\dfrac{${area}}{\\pi} \\approx ${(area / Math.PI).toFixed(3)}`,
                        `r = \\sqrt{${(area / Math.PI).toFixed(3)}} \\approx ${radius}`
                    ]
                };
            },
            // 4. Quarter circle area from radius
            () => {
                const radius = Math.floor(Math.random() * 20) + 5; // 5-25
                const area = `\\dfrac{${radius}^2 \\pi}{4}`;
                return {
                    q: `A quarter circle has radius of length ${radius} mm. Find its area. Give your answer in terms of π.`,
                    a: `\\dfrac{${radius}^2 \\pi}{4}`,
                    s: [
                        `\\text{Area of quarter circle} = \\dfrac{1}{4} \\times \\pi r^2`,
                        `= \\dfrac{1}{4} \\times \\pi \\times ${radius}^2 = \\dfrac{${radius}^2 \\pi}{4}`
                    ]
                };
            },
            // 5. Quarter circle area (generic)
            () => {
                const radius = Math.floor(Math.random() * 15) + 8; // 8-23
                const area = `\\dfrac{${radius}^2 \\pi}{4}`;
                return {
                    q: `Find the area of the quarter circle. Give your answer in terms of π.`,
                    a: `\\dfrac{${radius}^2 \\pi}{4}`,
                    s: [
                        `\\text{Area of quarter circle} = \\dfrac{1}{4} \\times \\pi r^2`,
                        `\\text{(Assuming radius r)} = \\dfrac{r^2 \\pi}{4}`
                    ]
                };
            },
            // 6. Semicircle area from diameter
            () => {
                const diameter = Math.floor(Math.random() * 30) + 10; // 10-40
                const radius = diameter / 2;
                const area = `\\dfrac{${diameter}^2 \\pi}{8}`;
                return {
                    q: `A semicircle has diameter of length ${diameter} cm. Find its area. Give your answer in terms of π.`,
                    a: `\\dfrac{${diameter}^2 \\pi}{8}`,
                    s: [
                        `\\text{Area of semicircle} = \\dfrac{1}{2} \\times \\pi r^2`,
                        `r = \\dfrac{${diameter}}{2} = ${radius}`,
                        `\\text{Area} = \\dfrac{1}{2} \\times \\pi \\times ${radius}^2 = \\dfrac{${diameter}^2 \\pi}{8}`
                    ]
                };
            },
            // 7. Circle area from diameter
            () => {
                const diameter = (Math.floor(Math.random() * 50) + 10) / 10; // 1.0-6.0
                const area = `\\dfrac{(${diameter})^2 \\pi}{4}`;
                return {
                    q: `A circle has diameter of length ${diameter} km. Find its area. Give your answer in terms of π.`,
                    a: `\\dfrac{${diameter}^2 \\pi}{4}`,
                    s: [
                        `\\text{Area} = \\pi r^2 = \\pi \\left(\\dfrac{d}{2}\\right)^2 = \\pi \\times \\dfrac{d^2}{4}`,
                        `= \\dfrac{${diameter}^2 \\pi}{4}`
                    ]
                };
            },
            // 8. Quarter circle perimeter to radius
            () => {
                const perimeter = (Math.floor(Math.random() * 20) + 5) / 10; // 0.5-2.5
                // Quarter circle perimeter = (πr/2) + 2r = r(π/2 + 2)
                const radius = (perimeter / (Math.PI/2 + 2)).toFixed(2);
                return {
                    q: `A quarter circle has a perimeter of ${perimeter} m to 3 s.f.. Find its radius.`,
                    a: `${radius}`,
                    s: [
                        `\\text{Quarter circle perimeter} = \\dfrac{\\pi r}{2} + 2r = r\\left(\\dfrac{\\pi}{2} + 2\\right)`,
                        `r = \\dfrac{${perimeter}}{\\dfrac{\\pi}{2} + 2} \\approx \\dfrac{${perimeter}}{${(Math.PI/2 + 2).toFixed(2)}} \\approx ${radius}`
                    ]
                };
            },
            // 9. Circle area (generic)
            () => {
                const radius = Math.floor(Math.random() * 10) + 3; // 3-13
                const area = (Math.PI * radius * radius).toFixed(3);
                return {
                    q: `Find the area of the circle. Give your answer to 3 s.f..`,
                    a: `${area}`,
                    s: [
                        `\\text{Area} = \\pi r^2`,
                        `\\text{(Assuming radius r)} = \\pi \\times ${radius}^2 \\approx ${area}`
                    ]
                };
            },
            // 10. Semicircle perimeter to diameter
            () => {
                const perimeter = (Math.floor(Math.random() * 20) + 8) / 10; // 0.8-2.8
                // Semicircle perimeter = πr + 2r = r(π + 2)
                const radius = perimeter / (Math.PI + 2);
                const diameter = (radius * 2).toFixed(2);
                return {
                    q: `A semicircle has a perimeter of ${perimeter} km to 3 s.f.. Find its diameter.`,
                    a: `${diameter}`,
                    s: [
                        `\\text{Semicircle perimeter} = \\pi r + 2r = r(\\pi + 2)`,
                        `r = \\dfrac{${perimeter}}{\\pi + 2} \\approx \\dfrac{${perimeter}}{${(Math.PI + 2).toFixed(2)}} \\approx ${(radius).toFixed(3)}`,
                        `\\text{Diameter} = 2r \\approx 2 \\times ${(radius).toFixed(3)} = ${diameter}`
                    ]
                };
            }
        ];

        // Randomly select one of the problem generators and execute it
        const selectedGenerator = problems[Math.floor(Math.random() * problems.length)];
        return selectedGenerator();
    },

    "Calculus": () => {
        const problems = [
            {
                q: `\\dfrac{d}{dx}(x^2) = ?`,
                a: `2x`,
                s: [`\\dfrac{d}{dx}(x^2) = 2x`]
            },
            {
                q: `\\dfrac{d}{dx}(x^3) = ?`,
                a: `3x^2`,
                s: [`\\dfrac{d}{dx}(x^3) = 3x^2`]
            },
            {
                q: `\\dfrac{d}{dx}(2x + 5) = ?`,
                a: `2`,
                s: [`\\dfrac{d}{dx}(2x + 5) = 2`]
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)];
    },

    "Linear Algebra": () => {
        const problems = [
            {
                q: `\\text{Determinant of } \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}`,
                a: `-2`,
                s: [`(1×4) - (2×3) = 4 - 6 = -2`]
            },
            {
                q: `\\text{Determinant of } \\begin{pmatrix} 2 & 1 \\\\ 4 & 3 \\end{pmatrix}`,
                a: `2`,
                s: [`(2×3) - (1×4) = 6 - 4 = 2`]
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)];
    },

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
        return problems[Math.floor(Math.random() * problems.length)];
    },

    "Abstract Algebra": () => {
        const problems = [
            {
                q: `\\text{What is the identity element in } (\\mathbb{Z}, +)?`,
                a: `0`,
                s: [`\\text{The identity element is } 0`]
            },
            {
                q: `\\text{What is the inverse of 5 in } (\\mathbb{Z}, +)?`,
                a: `-5`,
                s: [`\\text{The inverse of 5 is } -5`]
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)];
    },

    "Geometry Visualizations": () => {
        const problems = [
            // Right triangle area
            () => {
                const a = Math.floor(Math.random() * 10) + 5;
                const b = Math.floor(Math.random() * 10) + 5;
                const triangle = new RightTriangle(a, b);
                return {
                    q: `Calculate the area of a right-angled triangle with legs ${a} cm and ${b} cm.`,
                    a: `${triangle.area}`,
                    s: [
                        `\\text{Area of right triangle} = \\dfrac{1}{2} \\times \\text{base} \\times \\text{height}`,
                        `= \\dfrac{1}{2} \\times ${a} \\times ${b} = ${triangle.area}`
                    ]
                };
            },
            // Circle area from radius
            () => {
                const radius = Math.floor(Math.random() * 10) + 3;
                const circle = new Circle(radius);
                return {
                    q: `Find the area of a circle with radius ${radius} cm. Give your answer in terms of π.`,
                    a: `${radius}^2 \\pi`,
                    s: [
                        `\\text{Area of circle} = \\pi r^2`,
                        `= \\pi \\times ${radius}^2 = ${radius}^2 \\pi`
                    ]
                };
            },
            // Circle circumference
            () => {
                const radius = Math.floor(Math.random() * 8) + 4;
                const circle = new Circle(radius);
                return {
                    q: `Find the circumference of a circle with radius ${radius} cm. Give your answer in terms of π.`,
                    a: `${radius * 2} \\pi`,
                    s: [
                        `\\text{Circumference} = 2 \\pi r`,
                        `= 2 \\pi \\times ${radius} = ${radius * 2} \\pi`
                    ]
                };
            },
            // Cuboid volume
            () => {
                const l = Math.floor(Math.random() * 5) + 3;
                const w = Math.floor(Math.random() * 5) + 2;
                const h = Math.floor(Math.random() * 5) + 2;
                const cuboid = new Cuboid(l, w, h);
                return {
                    q: `Find the volume of a cuboid with dimensions ${l} cm × ${w} cm × ${h} cm.`,
                    a: `${cuboid.volume}`,
                    s: [
                        `\\text{Volume} = \\text{length} \\times \\text{width} \\times \\text{height}`,
                        `= ${l} \\times ${w} \\times ${h} = ${cuboid.volume}`
                    ]
                };
            },
            // Cuboid surface area
            () => {
                const l = Math.floor(Math.random() * 4) + 2;
                const w = Math.floor(Math.random() * 4) + 2;
                const h = Math.floor(Math.random() * 4) + 2;
                const cuboid = new Cuboid(l, w, h);
                return {
                    q: `Find the surface area of a cuboid with dimensions ${l} cm × ${w} cm × ${h} cm.`,
                    a: `${cuboid.surfaceArea}`,
                    s: [
                        `\\text{Surface area} = 2(lw + lh + wh)`,
                        `= 2(${l}\\times${w} + ${l}\\times${h} + ${w}\\times${h})`,
                        `= 2(${l*w} + ${l*h} + ${w*h}) = ${cuboid.surfaceArea}`
                    ]
                };
            },
            // Number line questions
            () => {
                const start = Math.floor(Math.random() * 10);
                const end = start + Math.floor(Math.random() * 10) + 5;
                const steps = Math.floor(Math.random() * 5) + 3;
                const numberLine = new NumberLine(start, end, steps);
                const svg = numberLine.display();
                return {
                    q: `What numbers are shown on this number line from ${start} to ${end}?`,
                    a: `Numbers from ${start} to ${end} in steps of ${Math.round((end-start)/steps)}`,
                    s: [
                        `\\text{The number line shows integers from } ${start} \\text{ to } ${end}`,
                        `\\text{with equal spacing between each number}`
                    ]
                };
            }
        ];

        // Randomly select one of the problem generators and execute it
        const selectedGenerator = problems[Math.floor(Math.random() * problems.length)];
        return selectedGenerator();
    },

    "Advanced Arithmetic": () => {
        const problems = [
            () => {
                const a = Math.floor(Math.random() * 20) + 1;
                const b = Math.floor(Math.random() * 20) + 1;
                const ops = ['+', '-', '*', '/'];
                const op = ops[Math.floor(Math.random() * 4)];
                const question = `${a} ${op} ${b}`;
                const answer = eval(question);
                return {
                    q: question,
                    a: answer.toString(),
                    s: [`${a} ${op} ${b} = ${answer}`]
                };
            },
            () => {
                const num = Math.floor(Math.random() * 10) + 1;
                const den = Math.floor(Math.random() * 10) + 2;
                const amount = Math.floor(Math.random() * 100) + 10;
                const question = `What is ${num}/${den} of ${amount}?`;
                const answer = (num / den) * amount;
                return {
                    q: question,
                    a: answer.toString(),
                    s: [`${num}/${den} of ${amount} = ${(num / den) * amount}`]
                };
            },
            () => {
                const percent = Math.floor(Math.random() * 100) + 1;
                const amount = Math.floor(Math.random() * 1000) + 10;
                const question = `What is ${percent}% of ${amount}?`;
                const answer = (percent / 100) * amount;
                return {
                    q: question,
                    a: answer.toString(),
                    s: [`${percent}% of ${amount} = ${(percent / 100) * amount}`]
                };
            },
            () => {
                const nums = [];
                for (let i = 0; i < 5; i++) nums.push(Math.floor(Math.random() * 20) + 1);
                const question = `Find the mean of ${nums.join(', ')}`;
                const answer = nums.reduce((a, b) => a + b, 0) / nums.length;
                return {
                    q: question,
                    a: answer.toFixed(2),
                    s: [`Mean = (sum of numbers) / count = ${nums.reduce((a, b) => a + b, 0)} / ${nums.length} = ${answer.toFixed(2)}`]
                };
            }
        ];

        return problems[Math.floor(Math.random() * problems.length)]();
    },

    "Advanced Algebra": () => {
        const problems = [
            () => {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                const c = Math.floor(Math.random() * 10) + 1;
                const question = `${a}x + ${b}x + ${c} = ?`;
                const answer = `${a + b}x + ${c}`;
                return {
                    q: question,
                    a: answer,
                    s: [`${a}x + ${b}x + ${c} = ${(a + b)}x + ${c}`]
                };
            },
            () => {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                const question = `${a}x * ${b}x = ?`;
                const answer = `${a * b}x²`;
                return {
                    q: question,
                    a: answer,
                    s: [`${a}x * ${b}x = ${a * b}x²`]
                };
            },
            () => {
                const a = Math.floor(Math.random() * 5) + 2;
                const b = Math.floor(Math.random() * 20) + 1;
                const question = `${a}x + ${b} = 0`;
                const answer = -b / a;
                return {
                    q: `Solve: ${question}`,
                    a: `x = ${answer}`,
                    s: [`${a}x + ${b} = 0`, `${a}x = ${-b}`, `x = ${-b}/${a} = ${answer}`]
                };
            },
            () => {
                const a = Math.floor(Math.random() * 5) + 2;
                const b = Math.floor(Math.random() * 20) + 1;
                const c = Math.floor(Math.random() * 20) + 1;
                const question = `${a}x + ${b} = ${c}`;
                const answer = (c - b) / a;
                return {
                    q: `Solve: ${question}`,
                    a: `x = ${answer}`,
                    s: [`${a}x + ${b} = ${c}`, `${a}x = ${c - b}`, `x = ${(c - b)}/${a} = ${answer}`]
                };
            }
        ];

        return problems[Math.floor(Math.random() * problems.length)]();
    }
};

/** TRACKING */
let timer, seconds = 0, score = 0, totalQuestions = 0, streak = 0;
const correctlyAnswered = new Set();
let questionData = [];
let totalSolved = 0, bestStreak = 0;

/** TIMER */
const updateTimerDisplay = () => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer-display").textContent = `TIME: ${m}:${s}`;
};

/** TOPICS */
function updateTopics() {
    const level = document.getElementById("level").value;
    const topicSelect = document.getElementById("topic");
    topicSelect.innerHTML = "";
    Curriculum[level].forEach(topic => {
        const opt = document.createElement("option");
        opt.value = topic;
        opt.innerText = topic;
        topicSelect.appendChild(opt);
    });
}

/** GENERATE QUESTIONS */
function generateBatch() {
    clearInterval(timer);
    seconds = 0; score = 0; streak = 0;
    correctlyAnswered.clear();
    questionData = [];

    totalQuestions = parseInt(document.getElementById("quantity").value);
    document.getElementById("display-area").innerHTML = "";
    document.getElementById("status-bar").classList.remove("d-none");
    document.getElementById("starter-screen").classList.add("d-none");
    document.getElementById("summary-screen").style.display = "none";

    document.getElementById("score-display").textContent = `SCORE: 0/${totalQuestions}`;
    document.getElementById("streak-display").textContent = "STREAK: 0";
    document.getElementById("timer-display").textContent = "TIME: 00:00";
    document.getElementById("progress-bar").style.width = "0%";

    timer = setInterval(updateTimerDisplay, 1000);

    const topic = document.getElementById("topic").value;
    const area = document.getElementById("display-area");

    // Track used questions to ensure variety
    const usedQuestions = new Set();

    for (let i = 0; i < totalQuestions; i++) {
        const generator = MathEngine[topic] || (() => ({
            q: `\\text{No generator for } "${topic}"`,
            a: "N/A", s: ["\\text{No logic}"]
        }));

        let data;
        let attempts = 0;
        do {
            data = generator();
            attempts++;
            // Prevent infinite loop - allow up to 10 attempts to get unique question
            if (attempts > 10) break;
        } while (usedQuestions.has(data.q) && topic !== "Basic Addition" && topic !== "Basic Subtraction" && topic !== "Circle Geometry" && topic !== "Geometry Visualizations");

        // For random topics, try to avoid duplicates
        if (topic !== "Basic Addition" && topic !== "Basic Subtraction" && topic !== "Circle Geometry" && topic !== "Geometry Visualizations") {
            usedQuestions.add(data.q);
        }

        questionData.push({ correct: data.a, topic });

        const card = document.createElement("div");
        card.className = "card mb-4 border-0 shadow-sm";
        card.innerHTML = `
            <div class="card-header bg-white border-0">
                <ul class="nav nav-tabs card-header-tabs">
                    <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#q-${i}">Question</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#s-${i}">Steps</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#a-${i}">Answer</button></li>
                </ul>
            </div>
            <div class="card-body tab-content p-4">
                <div class="tab-pane fade show active" id="q-${i}">
                    <div id="render-q-${i}" class="math-display"></div>
                    <div class="mt-3 p-3 bg-light rounded">
                        <label for="ans-${i}" class="visually-hidden">Answer input</label>
                        <div class="input-group">
                            <input type="text" id="ans-${i}" class="form-control" placeholder="Your answer...">
                            <button class="btn btn-primary" data-index="${i}" data-topic="${topic}" onclick="checkAnswer(${i}, '${topic}')">Check</button>
                        </div>
                        <div id="msg-${i}" class="mt-2 fw-bold small"></div>
                    </div>
                </div>
                <div class="tab-pane fade" id="s-${i}"><div id="step-area-${i}"></div></div>
                <div class="tab-pane fade" id="a-${i}">
                    <div id="render-a-${i}" class="math-display text-primary"></div>
                </div>
            </div>
        `;
        area.appendChild(card);

        renderMath(data.q, document.getElementById(`render-q-${i}`));
        renderMath(`\\text{Answer: } ${data.a}`, document.getElementById(`render-a-${i}`));

        const stepsContainer = document.getElementById(`step-area-${i}`);
        data.s.forEach((step, stepIndex) => {
            const div = document.createElement("div");
            div.className = "step-card";
            div.innerHTML = `<small class="fw-bold text-primary">STEP ${stepIndex + 1}</small><div id="st-${i}-${stepIndex}"></div>`;
            stepsContainer.appendChild(div);
            renderMath(step, document.getElementById(`st-${i}-${stepIndex}`));
        });
    }
}

/** CHECK ANSWER */
function checkAnswer(idx, topic) {
    const user = document.getElementById(`ans-${idx}`).value.trim();
    const correct = questionData[idx].correct;

    let isCorrect = false;

    if (topic === "Polynomials & Quadratics") {
        const sortRoots = str => str.split(",").map(r => sanitize(r)).sort().join(",");
        isCorrect = sortRoots(user) === sortRoots(correct);
    } else {
        isCorrect = sanitize(user) === sanitize(correct);
    }

    const msg = document.getElementById(`msg-${idx}`);
    if (isCorrect) {
        if (!correctlyAnswered.has(idx)) {
            score++;
            streak++;
            correctlyAnswered.add(idx);
            document.getElementById("score-display").textContent = `SCORE: ${score}/${totalQuestions}`;
            document.getElementById("streak-display").textContent = `STREAK: ${streak}`;
            document.getElementById("progress-bar").style.width = `${(score / totalQuestions) * 100}%`;
        }
        msg.textContent = "Correct!";
        msg.className = "mt-2 fw-bold small text-success";
    } else {
        streak = 0;
        document.getElementById("streak-display").textContent = `STREAK: ${streak}`;
        msg.textContent = "Incorrect.";
        msg.className = "mt-2 fw-bold small text-danger";
    }

    if (score === totalQuestions) {
        clearInterval(timer);
        showSummary();
    }
}

/** SUMMARY */
function showSummary() {
    clearInterval(timer);
    totalSolved += score;
    if (streak > bestStreak) bestStreak = streak;
    localStorage.setItem('totalSolved', totalSolved);
    localStorage.setItem('bestStreak', bestStreak);
    updateStatsDisplay();

    const summary = `
        <p class="fw-bold">Your Score: ${score}/${totalQuestions}</p>
        <p>Total Time: ${Math.floor(seconds/60)}m ${seconds%60}s</p>
    `;
    document.getElementById("summary-content").innerHTML = summary;
    document.getElementById("summary-screen").style.display = "block";
}

/** STATS */
function updateStatsDisplay() {
    const accuracy = totalSolved > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    document.getElementById("stats-accuracy").textContent = `${accuracy}%`;
    document.getElementById("stats-best-streak").textContent = bestStreak;
    document.getElementById("stats-total-solved").textContent = totalSolved;
}

/** INIT */
window.addEventListener("load", () => {
    // Load stats
    totalSolved = parseInt(localStorage.getItem('totalSolved') || 0);
    bestStreak = parseInt(localStorage.getItem('bestStreak') || 0);
    updateStatsDisplay();

    updateTopics();
    document.getElementById("loading-overlay").style.display = "none";
    document.body.classList.add("loaded");
    document.getElementById("start-btn").addEventListener("click", generateBatch);
    document.getElementById("level").addEventListener("change", updateTopics);

    // Theme toggle
    document.getElementById("theme-toggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        document.getElementById("theme-toggle").innerHTML = isDark ? "☀️" : "🌙";
        localStorage.setItem('darkMode', isDark);
    });

    // Load theme
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add("dark-mode");
        document.getElementById("theme-toggle").innerHTML = "☀️";
    }

    // Sound toggle (just store preference, no actual sound yet)
    document.getElementById("sound-enabled").addEventListener("change", (e) => {
        localStorage.setItem('soundEnabled', e.target.checked);
    });

    // Load sound preference
    document.getElementById("sound-enabled").checked = localStorage.getItem('soundEnabled') !== 'false';

    // Pause/Resume
    document.getElementById("pause-btn").addEventListener("click", () => {
        clearInterval(timer);
        document.getElementById("pause-btn").classList.add("d-none");
        document.getElementById("resume-btn").classList.remove("d-none");
    });

    document.getElementById("resume-btn").addEventListener("click", () => {
        timer = setInterval(updateTimerDisplay, 1000);
        document.getElementById("resume-btn").classList.add("d-none");
        document.getElementById("pause-btn").classList.remove("d-none");
    });
});

document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("starter-screen").classList.remove("d-none");
    document.getElementById("status-bar").classList.add("d-none");
    document.getElementById("display-area").innerHTML = "";
});