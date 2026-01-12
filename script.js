/**
 * Problem Object Structure:
 * {
 * question: "LaTeX string",
 * steps: ["Step 1 LaTeX", "Step 2 LaTeX"],
 * answer: "Final LaTeX string"
 * }
 */

// 1. Generator Function for Linear Equations: ax + b = c
function generateLinearEquation() {
    const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const x = Math.floor(Math.random() * 10) + 1; // 1 to 10 (Target Answer)
    const b = Math.floor(Math.random() * 20) + 1; // 1 to 20
    const c = a * x + b;

    return {
        question: `Solve\\ for\\ x: ${a}x + ${b} = ${c}`,
        steps: [
            `Subtract\\ ${b}\\ from\\ both\\ sides: ${a}x = ${c} - ${b}`,
            `Simplify: ${a}x = ${c - b}`,
            `Divide\\ both\\ sides\\ by\\ ${a}: x = \\frac{${c - b}}{${a}}`
        ],
        answer: `x = ${x}`
    };
}

let currentProblem = null;

function renderMath(elementId, latex) {
    const el = document.getElementById(elementId);
    katex.render(latex, el, { throwOnError: false });
}

function generateNewProblem() {
    // Hide solution UI
    document.getElementById('solution-area').style.display = 'none';
    
    // Generate data
    currentProblem = generateLinearEquation();

    // Render Question
    renderMath('question-area', currentProblem.question);
    
    // Prepare Solution (but keep hidden)
    const stepsList = document.getElementById('steps-list');
    stepsList.innerHTML = '';
    currentProblem.steps.forEach(step => {
        const div = document.createElement('div');
        div.className = 'step';
        stepsList.appendChild(div);
        katex.render(step, div);
    });
    
    renderMath('final-answer-display', `Result: ${currentProblem.answer}`);
}

function toggleSolution() {
    const area = document.getElementById('solution-area');
    area.style.display = (area.style.display === 'none' || area.style.display === '') ? 'block' : 'none';
}

// Initialize on load
window.onload = () => {
    setTimeout(generateNewProblem, 100); // Small delay to ensure KaTeX is ready
};