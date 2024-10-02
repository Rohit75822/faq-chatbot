const faqContainer = document.getElementById('faq-container');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');

let faqsData = []; // To store fetched FAQs

// Fetch the FAQs from the JSON file
fetch('faqs.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(faqs => {
        faqsData = faqs; // Store FAQs for searching
        displayFAQs(faqsData);
    })
    .catch(error => {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Failed to load FAQs. Please try again later.';
        console.error('There was a problem with the fetch operation:', error);
    });

// Function to display FAQs
function displayFAQs(faqs) {
    faqContainer.innerHTML = ''; // Clear existing FAQs

    faqs.forEach((faq) => {
        const faqDiv = document.createElement('div');
        faqDiv.classList.add('faq');

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = faq.question;

        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answer');
        answerDiv.textContent = faq.answer;

        questionDiv.addEventListener('click', () => {
            const isVisible = answerDiv.classList.contains('show');
            document.querySelectorAll('.answer').forEach(answer => answer.classList.remove('show'));
            document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
            
            if (!isVisible) {
                answerDiv.classList.add('show');
                questionDiv.classList.add('active');
            }
        });

        faqDiv.appendChild(questionDiv);
        faqDiv.appendChild(answerDiv);
        faqContainer.appendChild(faqDiv);
    });

    // If no FAQs match the search
    if (faqs.length === 0) {
        faqContainer.innerHTML = '<p>No FAQs match your search.</p>';
    }
}

// Function to handle search input
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length > 0) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }

    const filteredFAQs = faqsData.filter(faq => faq.question.toLowerCase().includes(query));
    displayFAQs(filteredFAQs);
}

// Event listeners for search input and clear button
searchInput.addEventListener('input', handleSearch);

clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none';
    displayFAQs(faqsData);
});
