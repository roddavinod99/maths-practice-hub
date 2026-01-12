
# Mathematics Question Generator (Static)

A fully static mathematics practice website that generates random math questions on demand and reveals step-by-step solutions.
All logic runs client-side using JavaScript—no backend, database, or server is required.

---

## Features

* Randomly generated mathematics questions
* “Next” button for instant problem generation
* Hidden answers with step-by-step explanations
* Proper mathematical rendering using KaTeX
* Works on any static hosting platform (GitHub Pages, Netlify, Vercel)
* Fast, lightweight, and offline-friendly

---

## Technology Stack

* **HTML** – structure
* **CSS** – layout and styling
* **JavaScript** – question generation and logic
* **KaTeX** – professional math rendering

---

## How It Works

1. JavaScript generates a problem object containing:

   * Question
   * Variables
   * Final answer
   * Step-by-step solution
2. The question is rendered using KaTeX.
3. The solution remains hidden until the user clicks “Show Answer”.
4. Clicking “Next” resets the state and generates a new problem.

All computation happens inside the user’s browser.

---

## Deployment

This project is designed for static hosting.

Recommended platforms:

* GitHub Pages
* Netlify
* Vercel

No configuration or server setup is required.

---

## Limitations

* As a static site, the source code is visible to users.
* This project prioritizes learning and usability over code secrecy.
* For full logic protection, a backend architecture would be required.

---

## License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this project, provided proper attribution is given.

---

## Author

Developed with ❤️ for educational and self-learning purposes.

---
