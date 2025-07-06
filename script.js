document.getElementById('resume-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('resume-input');
    const resultsSection = document.getElementById('results');

    if (!fileInput.files.length) {
        resultsSection.innerHTML = '<p style="color:red;">Please select a resume file to analyze.</p>';
        return;
    }

    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);

    resultsSection.innerHTML = '<p>Analyzing your resume with AI...</p>';

    fetch('http://localhost:3000/analyze', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resultsSection.innerHTML = `
                <h3>Analysis Results</h3>
                <ul>
                    <li><strong>Resume Length:</strong> ${data.analysis.resumeLength}</li>
                    <li><strong>Skills Match:</strong> ${data.analysis.skillsMatch}</li>
                    <li><strong>Keywords Found:</strong> ${data.analysis.keywordsFound.join(', ')}</li>
                    <li><strong>Suggestions:</strong> ${data.analysis.suggestions}</li>
                </ul>
            `;
            } else {
                resultsSection.innerHTML = `<p style='color:red;'>${data.error || 'Analysis failed.'}</p>`;
            }
        })
        .catch(err => {
            resultsSection.innerHTML = `<p style='color:red;'>Error: ${err.message}</p>`;
        });
});