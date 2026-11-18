const API_URL = "http://127.0.0.1:8000";


// ================================
// COLLECT COMPETITOR DATA
// ================================

async function collectData() {

    const company = document.getElementById("company").value.trim();
    const source = document.getElementById("source").value.trim();
    const content = document.getElementById("content").value.trim();

    const resultBox = document.getElementById("collectResult");
    const button = document.getElementById("collectBtn");

    if (!company || !source || !content) {
        showResult(
            resultBox,
            "⚠️ Please fill Company, Source and Competitive Data.",
            false
        );
        return;
    }

    button.disabled = true;
    button.innerHTML = "Analyzing... <span>⏳</span>";

    resultBox.classList.add("show");
    resultBox.textContent = "AI is analyzing the competitor data...";


    try {

        const response = await fetch(`${API_URL}/api/collect`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify({
                company: company,
                source: source,
                content: content
            })
        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.detail
                    ? JSON.stringify(data.detail)
                    : "Backend request failed."
            );
        }


        if (data.success) {

            resultBox.classList.add("show");

            resultBox.innerHTML = `
                <strong>✓ Intelligence collected successfully</strong>

                <br><br>

                <strong>Company:</strong>
                ${escapeHtml(data.result.company)}

                <br>

                <strong>Source:</strong>
                ${escapeHtml(data.result.source)}

                <br><br>

                <strong>AI Analysis:</strong>

                <br><br>

                ${formatText(data.result.analysis)}
            `;

        } else {

            throw new Error("The backend returned an unsuccessful response.");

        }


    } catch (error) {

        resultBox.classList.add("show");

        resultBox.innerHTML = `
            <strong>⚠️ Error</strong>
            <br><br>
            ${escapeHtml(error.message)}
            <br><br>
            Make sure your FastAPI backend is running on port 8000.
        `;

        console.error("Collect error:", error);

    } finally {

        button.disabled = false;

        button.innerHTML = `
            Analyze & Store
            <span>→</span>
        `;
    }
}



// ================================
// ASK COMPINTEL AI
// ================================

async function askAI() {

    const question = document.getElementById("question").value.trim();

    const resultBox = document.getElementById("askResult");
    const button = document.getElementById("askBtn");


    if (!question) {

        showResult(
            resultBox,
            "⚠️ Please enter a question.",
            false
        );

        return;
    }


    button.disabled = true;

    button.innerHTML = `
        Thinking...
        <span>⏳</span>
    `;


    resultBox.classList.add("show");

    resultBox.textContent =
        "Searching Hindsight memory and generating intelligence...";


    try {

        const response = await fetch(`${API_URL}/api/ask`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail
                    ? JSON.stringify(data.detail)
                    : "Backend request failed."
            );
        }


        if (data.success) {

            resultBox.classList.add("show");

            resultBox.innerHTML = `
                <strong>✦ CompIntel AI Answer</strong>

                <br><br>

                ${formatText(data.result.answer)}
            `;

        } else {

            throw new Error(
                "The backend returned an unsuccessful response."
            );

        }


    } catch (error) {

        resultBox.classList.add("show");

        resultBox.innerHTML = `
            <strong>⚠️ Error</strong>

            <br><br>

            ${escapeHtml(error.message)}

            <br><br>

            Make sure your FastAPI backend is running.
        `;

        console.error("Ask error:", error);

    } finally {

        button.disabled = false;

        button.innerHTML = `
            Ask Intelligence
            <span>→</span>
        `;
    }
}



// ================================
// HELPERS
// ================================

function showResult(box, message) {

    box.classList.add("show");

    box.textContent = message;
}


function escapeHtml(text) {

    if (text === null || text === undefined) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatText(text) {

    if (!text) {
        return "";
    }

    return escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
}