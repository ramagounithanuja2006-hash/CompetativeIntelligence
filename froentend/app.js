const API_URL = "http://127.0.0.1:8000";


// ===============================
// SCROLL TO COLLECT SECTION
// ===============================

function scrollToCollect() {
    document.getElementById("collect").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// COLLECT + ANALYZE COMPETITOR
// ===============================

async function collectData() {

    const company = document.getElementById("company").value.trim();
    const source = document.getElementById("source").value.trim();
    const content = document.getElementById("content").value.trim();

    const resultBox = document.getElementById("analysisResult");
    const status = document.getElementById("status");

    // Check inputs
    if (!company || !source || !content) {

        alert("Broo, please fill Company, Source and Information.");

        return;
    }

    // Loading state
    status.textContent = "Analyzing...";
    status.classList.add("active");

    resultBox.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">◌</div>
            <h4>AI is analyzing...</h4>
            <p>
                Processing competitor information and generating
                competitive intelligence.
            </p>
        </div>
    `;

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


        // Check server response
        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                `Server returned ${response.status}: ${errorText}`
            );
        }


        const data = await response.json();

        console.log("Collect response:", data);


        // Display result
        const analysis =
            data?.result?.analysis ||
            "No analysis was returned.";


        resultBox.innerHTML = `
            <div class="analysis">
                <strong>Company:</strong> ${escapeHTML(company)}

                <br><br>

                <strong>Source:</strong> ${escapeHTML(source)}

                <br><br>

                <strong>AI Intelligence:</strong>

                <br><br>

                ${formatText(analysis)}
            </div>
        `;


        status.textContent = "Analysis Complete";

        // Clear inputs after success
        document.getElementById("content").value = "";


    } catch (error) {

        console.error("Collect error:", error);

        status.textContent = "Error";
        status.classList.remove("active");

        resultBox.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">!</div>

                <h4>Something went wrong</h4>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <br>

                <small>
                    Make sure your FastAPI server is running
                    at http://127.0.0.1:8000
                </small>

            </div>
        `;
    }
}


// ===============================
// ASK AI
// ===============================

async function askAgent() {

    const questionInput =
        document.getElementById("question");

    const answerBox =
        document.getElementById("answerResult");

    const question =
        questionInput.value.trim();


    if (!question) {

        alert("Broo, enter a question first.");

        return;
    }


    // Show loading
    answerBox.style.display = "block";

    answerBox.innerHTML = `
        <strong>AI is thinking...</strong>

        <br><br>

        Retrieving competitive intelligence from memory.
    `;


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


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                `Server returned ${response.status}: ${errorText}`
            );
        }


        const data = await response.json();

        console.log("Ask response:", data);


        const answer =
            data?.result?.answer ||
            "No answer was returned.";


        answerBox.innerHTML = `
            <strong>CompIntel AI</strong>

            <br><br>

            ${formatText(answer)}
        `;


    } catch (error) {

        console.error("Ask error:", error);

        answerBox.innerHTML = `
            <strong>Unable to get intelligence.</strong>

            <br><br>

            ${escapeHTML(error.message)}

            <br><br>

            <small>
                Make sure your FastAPI backend is running.
            </small>
        `;
    }
}


// ===============================
// DEMO QUESTION
// ===============================

function askDemoQuestion() {

    document
        .getElementById("intelligence")
        .scrollIntoView({
            behavior: "smooth"
        });


    setTimeout(() => {

        const question =
            document.getElementById("question");

        question.value =
            "What did Tesla change recently, and what competitive signals should we watch?";

        question.focus();

    }, 600);
}


// ===============================
// TEXT FORMATTING
// ===============================

function formatText(text) {

    if (!text) {
        return "";
    }

    return escapeHTML(text)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
}


// ===============================
// HTML SAFETY
// ===============================

function escapeHTML(text) {

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