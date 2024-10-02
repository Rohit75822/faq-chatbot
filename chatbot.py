import json
import spacy
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# Load FAQs from a JSON file
def load_faqs(file_path):
    with open(file_path, 'r') as f:
        faqs = json.load(f)
    return faqs

# Preprocess the questions using SpaCy
def preprocess_text(text, nlp):
    doc = nlp(text.lower())
    return " ".join([token.lemma_ for token in doc if not token.is_stop])

# Find the most similar FAQ
def find_best_match(user_query, faqs, nlp):
    questions = [faq['question'] for faq in faqs]
    processed_questions = [preprocess_text(question, nlp) for question in questions]
    
    # Preprocess user query
    processed_query = preprocess_text(user_query, nlp)
    
    # Convert questions and query to vectors
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(processed_questions + [processed_query])
    
    # Compute cosine similarity
    similarity_scores = cosine_similarity(vectors[-1], vectors[:-1])
    
    # Find the index of the best match
    best_match_idx = similarity_scores.argmax()
    
    return faqs[best_match_idx]['answer']

def main():
    # Load the NLP model
    nlp = spacy.load('en_core_web_sm')
    
    # Load the FAQs
    faqs = load_faqs('faqs.json')
    
    # Run the chatbot loop
    print("Hello! Ask me any question.")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            print("Goodbye!")
            break
        
        answer = find_best_match(user_input, faqs, nlp)
        print(f"Chatbot: {answer}")

if __name__ == '__main__':
    main()
